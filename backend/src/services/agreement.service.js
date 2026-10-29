import pool from '../config/db.js';

function formatDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function assembleSaleAgreement(saleId) {
  const saleQuery = `
    SELECT 
      s.sale_id, s.price, s.status, s.reservation_date, s.reservation_amount,
      s.contract_date, s.contract_amount, s.handover_date, s.handover_amount,
      s.maintenance_deposit, s.services_deposit,
      u.unit_id, u.unit_number, u.floor, u.area, u.unit_status,
      b.building_id, b.building_number,
      p.project_id, p.project_name
    FROM sale s
    JOIN unit u ON s.unit_id = u.unit_id
    JOIN building b ON u.building_id = b.building_id
    JOIN project p ON b.project_id = p.project_id
    WHERE s.sale_id = $1;
  `;
  const saleRes = await pool.query(saleQuery, [saleId]);
  if (saleRes.rows.length === 0) return null;

  const row = saleRes.rows[0];

  const custQuery = `
    SELECT c.customer_id, c.full_name, c.national_id, c.address,
           COALESCE(json_agg(pn.phone_number) FILTER (WHERE pn.phone_number IS NOT NULL), '[]') as phone_numbers
    FROM customer_sale cs
    JOIN customer c ON cs.customer_id = c.customer_id
    LEFT JOIN phonenumbers pn ON c.customer_id = pn.customer_id
    WHERE cs.sale_id = $1
    GROUP BY c.customer_id;
  `;
  const custRes = await pool.query(custQuery, [saleId]);

  const plansQuery = `
    SELECT installment_plan_id, amount, installment_count, frequency_months, first_installment_date
    FROM installment_plan
    WHERE sale_id = $1
    ORDER BY installment_plan_id ASC;
  `;
  const plansRes = await pool.query(plansQuery, [saleId]);

  const formattedPlans = plansRes.rows.map((plan) => {
    const amt = Number(plan.amount);
    const count = Number(plan.installment_count);
    return {
      installment_plan_id: plan.installment_plan_id,
      amount: amt.toFixed(2),
      installment_count: count,
      frequency_months: plan.frequency_months,
      first_installment_date: formatDate(plan.first_installment_date),
      plan_total: (amt * count).toFixed(2),
    };
  });

  const priceNum = Number(row.price);
  const handoverDateObj = row.handover_date ? new Date(row.handover_date) : null;
  const contractAmt = row.contract_amount !== null ? Number(row.contract_amount) : 0;

  let calculation_status = 'OK';
  let percentage_due_by_handover = null;
  let scheduled_due_by_handover = null;

  if (!handoverDateObj) {
    calculation_status = 'MISSING_HANDOVER_DATE';
  } else if (contractAmt > 0 && !row.contract_date) {
    calculation_status = 'INCOMPLETE_TERMS';
  } else {
    let scheduledTotal = 0;

    if (row.reservation_date && new Date(row.reservation_date) <= handoverDateObj) {
      scheduledTotal += Number(row.reservation_amount || 0);
    }
    if (row.contract_date && new Date(row.contract_date) <= handoverDateObj) {
      scheduledTotal += contractAmt;
    }
    scheduledTotal += Number(row.handover_amount || 0);

    for (const plan of plansRes.rows) {
      const amt = Number(plan.amount);
      const count = Number(plan.installment_count);
      const freq = Number(plan.frequency_months);
      let currDate = new Date(plan.first_installment_date);

      for (let i = 0; i < count; i++) {
        if (currDate <= handoverDateObj) {
          scheduledTotal += amt;
        }
        currDate.setMonth(currDate.getMonth() + freq);
      }
    }

    scheduled_due_by_handover = scheduledTotal.toFixed(2);
    percentage_due_by_handover = ((scheduledTotal / priceNum) * 100).toFixed(2);
  }

  return {
    sale_id: row.sale_id,
    customers: custRes.rows,
    project: { project_id: row.project_id, project_name: row.project_name },
    building: { building_id: row.building_id, building_number: row.building_number },
    unit: {
      unit_id: row.unit_id,
      unit_number: row.unit_number,
      floor: row.floor,
      area: Number(row.area).toFixed(2),
      unit_status: row.unit_status,
    },
    sale: {
      price: priceNum.toFixed(2),
      status: row.status,
      reservation_date: formatDate(row.reservation_date),
      reservation_amount: Number(row.reservation_amount || 0).toFixed(2),
      contract_date: formatDate(row.contract_date),
      contract_amount: row.contract_amount !== null ? Number(row.contract_amount).toFixed(2) : null,
      handover_date: formatDate(row.handover_date),
      handover_amount: Number(row.handover_amount || 0).toFixed(2),
      maintenance_deposit: row.maintenance_deposit !== null ? Number(row.maintenance_deposit).toFixed(2) : null,
      services_deposit: row.services_deposit !== null ? Number(row.services_deposit).toFixed(2) : null,
    },
    installment_plans: formattedPlans,
    handover_summary: {
      scheduled_due_by_handover,
      percentage_due_by_handover,
      calculation_status,
    },
  };
}
