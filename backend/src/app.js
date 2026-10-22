import express from 'express';
import pool from './config/db.js';

const app = express();

app.use(express.json());

// ----------------------------------------------------
// 1. Health check endpoint (Stage 1 & 2)
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Sales API is running',
  });
});

// ----------------------------------------------------
// 2. GET /api/projects (Stage 2 Verification)
// ----------------------------------------------------
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT project_id, project_name FROM project ORDER BY project_id ASC;'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------------
// 3. POST /api/projects (Stage 3 - Task A)
// ----------------------------------------------------
app.post('/api/projects', async (req, res) => {
  const { project_name } = req.body;

  if (typeof project_name !== 'string') {
    return res.status(400).json({
      error: 'Invalid request body: project_name must be a string.',
    });
  }

  const trimmedName = project_name.trim();

  if (trimmedName.length === 0 || trimmedName.length > 150) {
    return res.status(400).json({
      error: 'Validation error: project_name must be between 1 and 150 characters.',
    });
  }

  try {
    const query = `
      INSERT INTO project (project_name)
      VALUES ($1)
      RETURNING project_id, project_name;
    `;
    const result = await pool.query(query, [trimmedName]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Conflict: A project with this name already exists.',
      });
    }
    console.error('Error creating project:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------------
// 4. POST /api/buildings (Stage 3 - Task B)
// ----------------------------------------------------
app.post('/api/buildings', async (req, res) => {
  const { building_number, project_id } = req.body;

  if (typeof building_number !== 'string') {
    return res.status(400).json({
      error: 'Invalid request body: building_number must be a string.',
    });
  }

  const trimmedBuildingNumber = building_number.trim();
  if (trimmedBuildingNumber.length === 0 || trimmedBuildingNumber.length > 10) {
    return res.status(400).json({
      error: 'Validation error: building_number must be between 1 and 10 characters.',
    });
  }

  if (
    project_id === undefined ||
    project_id === null ||
    typeof project_id !== 'number' ||
    !Number.isInteger(project_id) ||
    project_id <= 0
  ) {
    return res.status(400).json({
      error: 'Validation error: project_id must be a positive integer.',
    });
  }

  try {
    const insertQuery = `
      INSERT INTO building (building_number, project_id)
      VALUES ($1, $2)
      RETURNING building_id, building_number, project_id;
    `;
    const result = await pool.query(insertQuery, [trimmedBuildingNumber, project_id]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({
        error: `Not Found: Project with ID ${project_id} does not exist.`,
      });
    }
    if (error.code === '23505') {
      return res.status(409).json({
        error: `Conflict: Building '${trimmedBuildingNumber}' already exists in project ${project_id}.`,
      });
    }
    console.error('Error creating building:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------------
// 5. POST /api/units (Stage 3 - Task C)
// ----------------------------------------------------
app.post('/api/units', async (req, res) => {
  const { unit_number, floor, area, building_id } = req.body;

  if (typeof unit_number !== 'string') {
    return res.status(400).json({
      error: 'Invalid request body: unit_number must be a string.',
    });
  }

  const trimmedUnitNumber = unit_number.trim();
  if (trimmedUnitNumber.length === 0 || trimmedUnitNumber.length > 10) {
    return res.status(400).json({
      error: 'Validation error: unit_number must be between 1 and 10 characters.',
    });
  }

  if (
    floor === undefined ||
    floor === null ||
    typeof floor !== 'number' ||
    !Number.isInteger(floor)
  ) {
    return res.status(400).json({
      error: 'Validation error: floor must be an integer.',
    });
  }

  if (
    area === undefined ||
    area === null ||
    typeof area !== 'number' ||
    isNaN(area) ||
    area <= 0
  ) {
    return res.status(400).json({
      error: 'Validation error: area must be a positive numeric value greater than 0.',
    });
  }

  if (
    building_id === undefined ||
    building_id === null ||
    typeof building_id !== 'number' ||
    !Number.isInteger(building_id) ||
    building_id <= 0
  ) {
    return res.status(400).json({
      error: 'Validation error: building_id must be a positive integer.',
    });
  }

  try {
    const insertQuery = `
      INSERT INTO unit (unit_number, floor, area, building_id)
      VALUES ($1, $2, $3, $4)
      RETURNING unit_id, unit_number, floor, area, unit_status, building_id;
    `;
    const result = await pool.query(insertQuery, [
      trimmedUnitNumber,
      floor,
      area,
      building_id,
    ]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({
        error: `Not Found: Building with ID ${building_id} does not exist.`,
      });
    }
    if (error.code === '23505') {
      return res.status(409).json({
        error: `Conflict: Unit '${trimmedUnitNumber}' already exists in building ${building_id}.`,
      });
    }
    if (error.code === '23514') {
      return res.status(400).json({
        error: 'Validation error: area must be strictly positive.',
      });
    }
    console.error('Error creating unit:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------------
// 6. POST /api/sales (Stage 3 - Atomic Sale API)
// ----------------------------------------------------
app.post('/api/sales', async (req, res) => {
  const {
    unit_id,
    price,
    reservation_date,
    reservation_amount,
    contract_date = null,
    contract_amount = null,
    handover_date = null,
    handover_amount = null,
    maintenance_deposit = null,
    services_deposit = null,
    customers,
    installment_plans,
  } = req.body;

  if (!unit_id || typeof unit_id !== 'number' || !Number.isInteger(unit_id)) {
    return res.status(400).json({ error: 'Validation error: unit_id must be an integer.' });
  }

  if (typeof price !== 'number' || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Validation error: price must be a positive number.' });
  }

  if (!reservation_date || typeof reservation_date !== 'string' || isNaN(Date.parse(reservation_date))) {
    return res.status(400).json({ error: 'Validation error: reservation_date must be a valid date string.' });
  }

  if (typeof reservation_amount !== 'number' || isNaN(reservation_amount) || reservation_amount < 0) {
    return res.status(400).json({ error: 'Validation error: reservation_amount must be >= 0.' });
  }

  const nonNegativeFields = [
    { name: 'contract_amount', val: contract_amount },
    { name: 'handover_amount', val: handover_amount },
    { name: 'maintenance_deposit', val: maintenance_deposit },
    { name: 'services_deposit', val: services_deposit },
  ];
  for (const item of nonNegativeFields) {
    if (item.val !== null && item.val !== undefined) {
      if (typeof item.val !== 'number' || isNaN(item.val) || item.val < 0) {
        return res.status(400).json({ error: `Validation error: ${item.name} must be non-negative.` });
      }
    }
  }

  if (!Array.isArray(customers) || customers.length === 0) {
    return res.status(400).json({ error: 'Validation error: customers must be a non-empty array.' });
  }

  if (!Array.isArray(installment_plans) || installment_plans.length === 0) {
    return res.status(400).json({ error: 'Validation error: installment_plans must be a non-empty array.' });
  }

  const contractVal = typeof contract_amount === 'number' ? contract_amount : 0;
  const handoverVal = typeof handover_amount === 'number' ? handover_amount : 0;
  let totalInstallments = 0;

  for (const plan of installment_plans) {
    if (
      typeof plan.amount !== 'number' ||
      plan.amount <= 0 ||
      typeof plan.installment_count !== 'number' ||
      !Number.isInteger(plan.installment_count) ||
      plan.installment_count <= 0
    ) {
      return res.status(400).json({
        error: 'Validation error: Each installment plan must have amount > 0 and integer installment_count > 0.',
      });
    }

    if (![3, 6, 12].includes(plan.frequency_months)) {
      return res.status(400).json({
        error: 'Validation error: frequency_months must be exactly 3, 6, or 12.',
      });
    }

    if (!plan.first_installment_date || isNaN(Date.parse(plan.first_installment_date))) {
      return res.status(400).json({
        error: 'Validation error: Each installment plan must contain a valid first_installment_date.',
      });
    }

    totalInstallments += plan.amount * plan.installment_count;
  }

  const calculatedTotal = reservation_amount + contractVal + handoverVal + totalInstallments;
  if (Math.abs(calculatedTotal - price) > 0.01) {
    return res.status(400).json({
      error: `Financial imbalance: Sum of components (${calculatedTotal}) does not match sale price (${price}).`,
    });
  }

  const seenCustomerIds = new Set();
  const seenNationalIds = new Set();

  for (const cust of customers) {
    if (cust.customer_id) {
      if (typeof cust.customer_id !== 'number' || !Number.isInteger(cust.customer_id)) {
        return res.status(400).json({ error: 'Validation error: customer_id must be an integer.' });
      }
      if (seenCustomerIds.has(cust.customer_id)) {
        return res.status(400).json({ error: `Validation error: Duplicate customer_id ${cust.customer_id} in request.` });
      }
      seenCustomerIds.add(cust.customer_id);
    } else {
      if (!cust.national_id || typeof cust.national_id !== 'string' || !cust.national_id.trim()) {
        return res.status(400).json({ error: 'Validation error: New customer must have a non-empty national_id.' });
      }
      const trimmedNatId = cust.national_id.trim();
      if (seenNationalIds.has(trimmedNatId)) {
        return res.status(400).json({ error: `Validation error: Duplicate national_id ${trimmedNatId} in request.` });
      }
      seenNationalIds.add(trimmedNatId);

      if (!cust.full_name || typeof cust.full_name !== 'string' || !cust.full_name.trim()) {
        return res.status(400).json({ error: 'Validation error: New customer must have a non-empty full_name.' });
      }

      if (!Array.isArray(cust.phone_numbers) || cust.phone_numbers.length === 0) {
        return res.status(400).json({ error: 'Validation error: Each new customer must have at least one phone number.' });
      }

      const phoneSet = new Set();
      for (const ph of cust.phone_numbers) {
        if (typeof ph !== 'string' || !ph.trim()) {
          return res.status(400).json({ error: 'Validation error: Phone number must be a non-empty string.' });
        }
        if (phoneSet.has(ph.trim())) {
          return res.status(400).json({ error: `Validation error: Duplicate phone number ${ph} for customer.` });
        }
        phoneSet.add(ph.trim());
      }
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const unitCheck = await client.query(
      'SELECT unit_id, unit_status FROM unit WHERE unit_id = $1 FOR UPDATE;',
      [unit_id]
    );

    if (unitCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: `Not Found: Unit with ID ${unit_id} does not exist.` });
    }

    if (unitCheck.rows[0].unit_status !== 'AVAILABLE') {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: `Conflict: Unit ${unit_id} is not AVAILABLE (Current status: ${unitCheck.rows[0].unit_status}).`,
      });
    }

    const saleInsertQuery = `
      INSERT INTO sale (
        price, reservation_date, reservation_amount, contract_date, contract_amount,
        handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'RESERVED')
      RETURNING sale_id;
    `;
    const saleResult = await client.query(saleInsertQuery, [
      price,
      reservation_date,
      reservation_amount,
      contract_date,
      contract_amount,
      handover_date,
      handover_amount,
      maintenance_deposit,
      services_deposit,
      unit_id,
    ]);
    const saleId = saleResult.rows[0].sale_id;

    const linkedCustomerIds = [];

    for (const cust of customers) {
      let finalCustomerId = cust.customer_id;

      if (finalCustomerId) {
        const existCheck = await client.query('SELECT customer_id FROM customer WHERE customer_id = $1;', [finalCustomerId]);
        if (existCheck.rows.length === 0) {
          throw { status: 404, message: `Customer with ID ${finalCustomerId} does not exist.` };
        }
      } else {
        const checkNatId = await client.query('SELECT customer_id FROM customer WHERE national_id = $1;', [cust.national_id.trim()]);
        if (checkNatId.rows.length > 0) {
          throw { status: 409, message: `Conflict: Customer with national_id '${cust.national_id.trim()}' already exists.` };
        }

        const custInsert = await client.query(
          `INSERT INTO customer (national_id, full_name, address)
           VALUES ($1, $2, $3)
           RETURNING customer_id;`,
          [cust.national_id.trim(), cust.full_name.trim(), cust.address ? cust.address.trim() : null]
        );
        finalCustomerId = custInsert.rows[0].customer_id;

        for (const phone of cust.phone_numbers) {
          await client.query(
            `INSERT INTO phonenumbers (customer_id, phone_number) VALUES ($1, $2);`,
            [finalCustomerId, phone.trim()]
          );
        }
      }

      await client.query(
        `INSERT INTO customer_sale (customer_id, sale_id) VALUES ($1, $2);`,
        [finalCustomerId, saleId]
      );
      linkedCustomerIds.push(finalCustomerId);
    }

    const createdPlanIds = [];
    for (const plan of installment_plans) {
      const planInsert = await client.query(
        `INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING installment_plan_id;`,
        [plan.amount, plan.installment_count, plan.frequency_months, plan.first_installment_date, saleId]
      );
      createdPlanIds.push(planInsert.rows[0].installment_plan_id);
    }

    await client.query(
      `UPDATE unit SET unit_status = 'RESERVED' WHERE unit_id = $1;`,
      [unit_id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Sale created successfully',
      data: {
        sale_id: saleId,
        unit_id: unit_id,
        status: 'RESERVED',
        customer_ids: linkedCustomerIds,
        installment_plan_ids: createdPlanIds,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Conflict: Unique constraint violation.' });
    }
    if (error.code === '23503') {
      return res.status(404).json({ error: 'Not Found: Foreign key referenced record does not exist.' });
    }
    if (error.code === '23514') {
      return res.status(400).json({ error: 'Bad Request: Database check constraint failed.' });
    }

    console.error('Sale transaction error:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
});

export default app;
