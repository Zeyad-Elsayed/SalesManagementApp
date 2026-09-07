WITH new_customer AS (
    -- إدخال جميع الأعمدة في جدول العميل (باستثناء ID المولد تلقائياً)
    INSERT INTO customer (national_id, full_name, address)
    VALUES ('29505121234567', 'عمر خالد حسن', 'التجمع الخامس، القاهرة الجديدة')
    RETURNING customer_id
),
new_sale AS (
    -- إدخال جميع الأعمدة في جدول المبيعات لمحاكاة عملية بيع وصلت لمرحلة التعاقد
    INSERT INTO sale (
        price, 
        reservation_date, 
        reservation_amount, 
        contract_date, 
        contract_amount, 
        handover_date, 
        unit_id, 
        status, 
        handover_amount, 
        maintenance_deposit, 
        services_deposit
    )
    VALUES (
        3500000.00,          -- إجمالي السعر (price)
        '2026-08-01',        -- تاريخ الحجز (reservation_date)
        350000.00,           -- مبلغ الحجز (reservation_amount)
        '2026-08-15',        -- تاريخ توقيع العقد (contract_date)
        650000.00,           -- دفعة التعاقد (contract_amount)
        '2028-01-01',        -- تاريخ الاستلام المتوقع (handover_date)
        (SELECT unit_id FROM unit 
         WHERE unit_number = '2' And floor = '2'
         AND building_id = (SELECT building_id FROM building WHERE building_number = 'b') 
         LIMIT 1),           -- ربط الحجز بالوحدة رقم 2 في المبنى a
        'CONTRACTED',        -- حالة البيع (status) تم تغييرها لأن العميل دفع التعاقد
        2500000.00,          -- دفعة الاستلام (handover_amount)
        350000.00,           -- وديعة الصيانة (maintenance_deposit)
        100000.00            -- وديعة الخدمات (services_deposit)
    )
    RETURNING sale_id
)
-- ربط العميل الجديد بعملية البيع الشاملة
INSERT INTO customer_sale (customer_id, sale_id)
SELECT new_customer.customer_id, new_sale.sale_id
FROM new_customer, new_sale;