INSERT INTO project (project_name)
VALUES
    ('Palm Residence'),
    ('Alexandria Gardens'),
    ('New Capital Heights'),
    ('North Coast Village'),
    ('Green Valley');

INSERT INTO building (building_number, project_id)
VALUES
    ('A1', (SELECT project_id FROM project WHERE project_name = 'Palm Residence')),
    ('A2', (SELECT project_id FROM project WHERE project_name = 'Palm Residence')),
    ('A3', (SELECT project_id FROM project WHERE project_name = 'Palm Residence')),
    ('B1', (SELECT project_id FROM project WHERE project_name = 'Alexandria Gardens')),
    ('B2', (SELECT project_id FROM project WHERE project_name = 'Alexandria Gardens')),
    ('B3', (SELECT project_id FROM project WHERE project_name = 'Alexandria Gardens')),
    ('C1', (SELECT project_id FROM project WHERE project_name = 'New Capital Heights')),
    ('C2', (SELECT project_id FROM project WHERE project_name = 'New Capital Heights')),
    ('C3', (SELECT project_id FROM project WHERE project_name = 'New Capital Heights')),
    ('C4', (SELECT project_id FROM project WHERE project_name = 'New Capital Heights')),
    ('N1', (SELECT project_id FROM project WHERE project_name = 'North Coast Village')),
    ('N2', (SELECT project_id FROM project WHERE project_name = 'North Coast Village')),
    ('N3', (SELECT project_id FROM project WHERE project_name = 'North Coast Village')),
    ('G1', (SELECT project_id FROM project WHERE project_name = 'Green Valley')),
    ('G2', (SELECT project_id FROM project WHERE project_name = 'Green Valley'));

INSERT INTO unit (unit_number, floor, area, unit_status, building_id)
VALUES
    ('101', 1, 120.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1')),
    ('102', 1, 135.00, 'RESERVED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1')),
    ('201', 2, 150.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1')),
    ('101', 1, 125.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A2')),
    ('202', 2, 165.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A2')),
    ('301', 3, 185.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A2')),
    ('GF-1', 0, 110.00, 'BLOCKED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A3')),
    ('101', 1, 140.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A3')),
    ('101', 1, 105.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B1')),
    ('102', 1, 115.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B1')),
    ('201', 2, 145.00, 'RESERVED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B1')),
    ('101', 1, 130.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B2')),
    ('202', 2, 155.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B2')),
    ('301', 3, 175.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B3')),
    ('302', 3, 180.00, 'RESERVED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B3')),
    ('101', 1, 150.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C1')),
    ('102', 1, 160.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C1')),
    ('201', 2, 180.00, 'RESERVED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C2')),
    ('202', 2, 190.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C2')),
    ('301', 3, 210.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C3')),
    ('PH-1', 10, 260.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C3')),
    ('401', 4, 220.00, 'BLOCKED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C4')),
    ('402', 4, 230.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C4')),
    ('C-01', 0, 95.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N1')),
    ('C-02', 0, 100.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N1')),
    ('101', 1, 120.00, 'RESERVED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N2')),
    ('102', 1, 125.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N2')),
    ('V-01', 0, 240.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N3')),
    ('V-02', 0, 275.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N3')),
    ('101', 1, 115.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Green Valley' AND b.building_number = 'G1')),
    ('201', 2, 145.00, 'SOLD', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Green Valley' AND b.building_number = 'G1')),
    ('101', 1, 130.00, 'RESERVED', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Green Valley' AND b.building_number = 'G2')),
    ('201', 2, 160.00, 'AVAILABLE', (SELECT b.building_id FROM building b JOIN project p ON p.project_id = b.project_id WHERE p.project_name = 'Green Valley' AND b.building_number = 'G2'));

INSERT INTO customer (national_id, full_name, address)
VALUES
    ('30101010100011', 'Ahmed Mohamed Ali', 'Smouha, Alexandria'),
    ('29805251200022', 'Mohamed Hassan Ibrahim', 'Miami, Alexandria'),
    ('30211151200033', 'Omar Ahmed Mahmoud', 'Nasr City, Cairo'),
    ('30007181200044', 'Sara Ahmed Hassan', 'Stanley, Alexandria'),
    ('29909091200055', 'Mariam Mohamed Adel', 'Heliopolis, Cairo'),
    ('29604051200066', 'Youssef Khaled Hassan', 'Gleem, Alexandria'),
    ('30302121200077', 'Karim Ahmed Samir', 'Maadi, Cairo'),
    ('29708171200088', 'Mostafa Adel Fathy', 'Sidi Gaber, Alexandria'),
    ('30112031200099', 'Nour Mohamed Sameh', 'New Cairo, Cairo'),
    ('29506141200110', 'Mahmoud Tarek Ali', 'Agami, Alexandria');

INSERT INTO phonenumbers (customer_id, phone_number)
VALUES
    ((SELECT customer_id FROM customer WHERE national_id = '30101010100011'), '01010000011'),
    ((SELECT customer_id FROM customer WHERE national_id = '30101010100011'), '01220000011'),
    ((SELECT customer_id FROM customer WHERE national_id = '29805251200022'), '01110000022'),
    ((SELECT customer_id FROM customer WHERE national_id = '30211151200033'), '01010000033'),
    ((SELECT customer_id FROM customer WHERE national_id = '30007181200044'), '01220000044'),
    ((SELECT customer_id FROM customer WHERE national_id = '29909091200055'), '01010000055'),
    ((SELECT customer_id FROM customer WHERE national_id = '29604051200066'), '01110000066'),
    ((SELECT customer_id FROM customer WHERE national_id = '30302121200077'), '01010000077'),
    ((SELECT customer_id FROM customer WHERE national_id = '29708171200088'), '01220000088'),
    ((SELECT customer_id FROM customer WHERE national_id = '30112031200099'), '01010000099'),
    ((SELECT customer_id FROM customer WHERE national_id = '29506141200110'), '01110000110');

BEGIN;

WITH new_sale AS (
    INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
    SELECT 3000000, DATE '2026-01-10', 100000, DATE '2026-02-01', 400000, DATE '2029-01-01', 300000, 150000, 150000, u.unit_id, 'CONTRACTED'
    FROM unit u JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
    WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1' AND u.unit_number = '101'
    RETURNING sale_id
)
INSERT INTO customer_sale (customer_id, sale_id)
SELECT c.customer_id, ns.sale_id FROM customer c CROSS JOIN new_sale ns WHERE c.national_id = '30101010100011';

WITH new_sale AS (
    INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
    SELECT 3500000, DATE '2026-03-15', 150000, NULL, NULL, DATE '2029-06-01', 350000, 175000, 175000, u.unit_id, 'RESERVED'
    FROM unit u JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
    WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1' AND u.unit_number = '102'
    RETURNING sale_id
)
INSERT INTO customer_sale (customer_id, sale_id)
SELECT c.customer_id, ns.sale_id FROM customer c CROSS JOIN new_sale ns WHERE c.national_id = '29805251200022';

WITH new_sale AS (
    INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
    SELECT 5000000, DATE '2026-02-20', 200000, DATE '2026-03-10', 800000, DATE '2030-01-01', 500000, 250000, 250000, u.unit_id, 'CONTRACTED'
    FROM unit u JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
    WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C1' AND u.unit_number = '101'
    RETURNING sale_id
)
INSERT INTO customer_sale (customer_id, sale_id)
SELECT c.customer_id, ns.sale_id FROM customer c CROSS JOIN new_sale ns WHERE c.national_id = '30211151200033';

WITH new_sale AS (
    INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
    SELECT 2800000, DATE '2026-04-05', 100000, DATE '2026-04-25', 400000, DATE '2028-12-01', 300000, 140000, 140000, u.unit_id, 'CONTRACTED'
    FROM unit u JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
    WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B1' AND u.unit_number = '101'
    RETURNING sale_id
)
INSERT INTO customer_sale (customer_id, sale_id)
SELECT c.customer_id, ns.sale_id FROM customer c CROSS JOIN new_sale ns WHERE c.national_id IN ('30007181200044', '29909091200055');

WITH new_sale AS (
    INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
    SELECT 3200000, DATE '2026-07-12', 120000, NULL, NULL, DATE '2029-08-01', 300000, 160000, 160000, u.unit_id, 'RESERVED'
    FROM unit u JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
    WHERE p.project_name = 'Green Valley' AND b.building_number = 'G2' AND u.unit_number = '101'
    RETURNING sale_id
)
INSERT INTO customer_sale (customer_id, sale_id)
SELECT c.customer_id, ns.sale_id FROM customer c CROSS JOIN new_sale ns WHERE c.national_id = '30302121200077';

WITH new_sale AS (
    INSERT INTO sale (price, reservation_date, reservation_amount, contract_date, contract_amount, handover_date, handover_amount, maintenance_deposit, services_deposit, unit_id, status)
    SELECT 4200000, DATE '2026-05-18', 200000, DATE '2026-06-10', 600000, DATE '2029-05-01', 400000, 210000, 210000, u.unit_id, 'CONTRACTED'
    FROM unit u JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
    WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N1' AND u.unit_number = 'C-02'
    RETURNING sale_id
)
INSERT INTO customer_sale (customer_id, sale_id)
SELECT c.customer_id, ns.sale_id FROM customer c CROSS JOIN new_sale ns WHERE c.national_id = '29604051200066';

COMMIT;

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 100000, 22, 3, DATE '2026-05-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1' AND u.unit_number = '101' AND s.status = 'CONTRACTED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 100000, 20, 3, DATE '2026-06-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C1' AND u.unit_number = '101' AND s.status = 'CONTRACTED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 500000, 3, 12, DATE '2027-01-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'New Capital Heights' AND b.building_number = 'C1' AND u.unit_number = '101' AND s.status = 'CONTRACTED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 100000, 20, 3, DATE '2026-07-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'Alexandria Gardens' AND b.building_number = 'B1' AND u.unit_number = '101' AND s.status = 'CONTRACTED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 125000, 24, 3, DATE '2026-09-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'North Coast Village' AND b.building_number = 'N1' AND u.unit_number = 'C-02' AND s.status = 'CONTRACTED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 100000, 18, 3, DATE '2026-08-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1' AND u.unit_number = '102' AND s.status = 'RESERVED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 200000, 6, 6, DATE '2026-12-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'Palm Residence' AND b.building_number = 'A1' AND u.unit_number = '102' AND s.status = 'RESERVED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 70000, 24, 3, DATE '2026-10-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'Green Valley' AND b.building_number = 'G2' AND u.unit_number = '101' AND s.status = 'RESERVED';

INSERT INTO installment_plan (amount, installment_count, frequency_months, first_installment_date, sale_id)
SELECT 275000, 4, 6, DATE '2027-01-01', s.sale_id
FROM sale s JOIN unit u ON u.unit_id = s.unit_id JOIN building b ON b.building_id = u.building_id JOIN project p ON p.project_id = b.project_id
WHERE p.project_name = 'Green Valley' AND b.building_number = 'G2' AND u.unit_number = '101' AND s.status = 'RESERVED';

INSERT INTO project (project_name) VALUES ('Vida');

INSERT INTO building (building_number, project_id)
VALUES 
    ('a', (SELECT project_id FROM project WHERE project_name = 'Vida')),
    ('b', (SELECT project_id FROM project WHERE project_name = 'Vida')),
    ('c', (SELECT project_id FROM project WHERE project_name = 'Vida')),
    ('d', (SELECT project_id FROM project WHERE project_name = 'Vida')),
    ('e', (SELECT project_id FROM project WHERE project_name = 'Vida')),
    ('f', (SELECT project_id FROM project WHERE project_name = 'Vida')),
    ('g', (SELECT project_id FROM project WHERE project_name = 'Vida'));

INSERT INTO unit (unit_number, floor, area, building_id)
VALUES 
    ('1', 1, 120.00, (SELECT building_id FROM building WHERE building_number = 'a')),
    ('2', 1, 100.50, (SELECT building_id FROM building WHERE building_number = 'a')),
    ('3', 1, 95.00,  (SELECT building_id FROM building WHERE building_number = 'a')),
    ('2', 2, 150.00, (SELECT building_id FROM building WHERE building_number = 'b')),
    ('9', 6, 110.00, (SELECT building_id FROM building WHERE building_number = 'g')),
    ('5', 6, 135.00, (SELECT building_id FROM building WHERE building_number = 'g')),
    ('4', 4, 125.00, (SELECT building_id FROM building WHERE building_number = 'g'));

WITH new_customer AS (
    INSERT INTO customer (national_id, full_name, address)
    VALUES ('29505121234567', 'عمر خالد حسن', 'التجمع الخامس، القاهرة الجديدة')
    RETURNING customer_id
),
new_sale AS (
    INSERT INTO sale (
        price, reservation_date, reservation_amount, contract_date, 
        contract_amount, handover_date, unit_id, status, 
        handover_amount, maintenance_deposit, services_deposit
    )
    VALUES (
        3500000.00,
        '2026-08-01',
        350000.00,
        '2026-08-15',
        650000.00,
        '2028-01-01',
        (SELECT unit_id FROM unit 
         WHERE unit_number = '2' AND floor = 2
         AND building_id = (SELECT building_id FROM building WHERE building_number = 'b') 
         LIMIT 1),
        'CONTRACTED',
        2500000.00,
        350000.00,
        100000.00
    )
    RETURNING sale_id
),
linked_customer_sale AS (
    INSERT INTO customer_sale (customer_id, sale_id)
    SELECT new_customer.customer_id, new_sale.sale_id
    FROM new_customer, new_sale
)
INSERT INTO installment_plan (
    amount, installment_count, frequency_months, first_installment_date, sale_id
)
SELECT 
    100000.00, 25, 3, '2026-11-15', new_sale.sale_id
FROM new_sale;
