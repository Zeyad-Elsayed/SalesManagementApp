import pool from '../config/db.js';
import { assembleSaleAgreement } from '../services/agreement.service.js';

export async function getSaleAgreement(req, res) {
  const parsedId = Number(req.params.saleId);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: 'Invalid request: saleId must be a positive integer.' });
  }

  try {
    const agreement = await assembleSaleAgreement(parsedId);
    if (!agreement) {
      return res.status(404).json({ error: `Not Found: Sale with ID ${parsedId} does not exist.` });
    }
    return res.status(200).json(agreement);
  } catch (error) {
    console.error('Error fetching sale agreement:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function createSale(req, res) {
  const {
    unit_id, price, reservation_date, reservation_amount,
    contract_date = null, contract_amount = null,
    handover_date = null, handover_amount = null,
    maintenance_deposit = null, services_deposit = null,
    customers, installment_plans,
  } = req.body;

  if (!Number.isInteger(unit_id) || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Validation error: invalid unit_id or price.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const unitCheck = await client.query('SELECT unit_status FROM unit WHERE unit_id = $1 FOR UPDATE;', [unit_id]);
    if (unitCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Not Found: Unit does not exist.' });
    }
    if (unitCheck.rows[0].unit_status !== 'AVAILABLE') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Conflict: Unit is not AVAILABLE.' });
    }

    const saleInsertQuery = `
      INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'RESERVED')
      RETURNING sale_id;
    `;
    const saleResult = await client.query(saleInsertQuery, [
      price, reservation_date, reservation_amount, contract_date, contract_amount,
      handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id
    ]);
    const saleId = saleResult.rows[0].sale_id;

    for (const cust of customers) {
      let finalCustomerId = cust.customer_id;
      if (!finalCustomerId) {
        const custInsert = await client.query(
          'INSERT INTO customer (national_id, full_name, address) VALUES ($1, $2, $3) RETURNING customer_id;',
          [cust.national_id.trim(), cust.full_name.trim(), cust.address || null]
        );
        finalCustomerId = custInsert.rows[0].customer_id;
        for (const phone of cust.phone_numbers) {
          await client.query('INSERT INTO phonenumbers (customer_id, phone_number) VALUES ($1, $2);', [finalCustomerId, phone]);
        }
      }
      await client.query('INSERT INTO customer_sale (customer_id, sale_id) VALUES ($1, $2);', [finalCustomerId, saleId]);
    }

    for (const plan of installment_plans) {
      await client.query(
        'INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id) VALUES ($1, $2, $3, $4, $5);',
        [plan.amount, plan.installment_count, plan.frequency_months, plan.first_installment_date, saleId]
      );
    }

    await client.query("UPDATE unit SET unit_status = 'RESERVED' WHERE unit_id = $1;", [unit_id]);
    await client.query('COMMIT');

    return res.status(201).json({ message: 'Sale created successfully', data: { sale_id: saleId, unit_id, status: 'RESERVED' } });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Sale error:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
}
