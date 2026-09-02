CREATE TABLE project (
    project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_name VARCHAR(150) NOT NULL,

    CONSTRAINT uq_project_name
        UNIQUE (project_name)
);


CREATE TABLE building (
    building_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    building_number VARCHAR(10) NOT NULL,

    project_id INTEGER NOT NULL,

    CONSTRAINT fk_building_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    CONSTRAINT uq_building_project
        UNIQUE (project_id, building_number)
);

CREATE TABLE unit (
    unit_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    unit_number VARCHAR(10) NOT NULL,

    floor INTEGER NOT NULL,

    area NUMERIC(10,2) NOT NULL,

    unit_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',

    building_id INTEGER NOT NULL,

    CONSTRAINT fk_unit_building
        FOREIGN KEY (building_id)
        REFERENCES building(building_id),

    CONSTRAINT uq_unit_building
        UNIQUE (building_id, unit_number),

    CONSTRAINT chk_unit_area
        CHECK (area > 0),

    CONSTRAINT chk_unit_status
        CHECK (
            unit_status IN (
                'AVAILABLE',
                'RESERVED',
                'SOLD',
                'BLOCKED'
            )
        )
);


CREATE TABLE customer (
    customer_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    national_id VARCHAR(20) NOT NULL,

    full_name VARCHAR(200) NOT NULL,

    address TEXT,

    CONSTRAINT uq_customer_national_id
        UNIQUE (national_id)
);


CREATE TABLE phonenumbers (
    customer_id INTEGER NOT NULL,

    phone_number VARCHAR(30) NOT NULL,

    CONSTRAINT pk_phonenumbers
        PRIMARY KEY (customer_id, phone_number),

    CONSTRAINT fk_phonenumbers_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON DELETE CASCADE
);



CREATE TABLE sale (
    sale_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    price NUMERIC(15,2) NOT NULL,

    reservation_date DATE NOT NULL,

    reservation_amount NUMERIC(15,2) NOT NULL,

    contract_date DATE,

    contract_amount NUMERIC(15,2),

    handover_date DATE,

    unit_id INTEGER NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'RESERVED',

    handover_amount NUMERIC(15,2),

    maintenance_deposit NUMERIC(15,2),

    services_deposit NUMERIC(15,2),

    CONSTRAINT fk_sale_unit
        FOREIGN KEY (unit_id)
        REFERENCES unit(unit_id),

    CONSTRAINT chk_sale_price
        CHECK (price > 0),

    CONSTRAINT chk_reservation_amount
        CHECK (reservation_amount >= 0),

    CONSTRAINT chk_contract_amount
        CHECK (
            contract_amount IS NULL
            OR contract_amount >= 0
        ),

    CONSTRAINT chk_handover_amount
        CHECK (
            handover_amount IS NULL
            OR handover_amount >= 0
        ),

    CONSTRAINT chk_maintenance_deposit
        CHECK (
            maintenance_deposit IS NULL
            OR maintenance_deposit >= 0
        ),

    CONSTRAINT chk_services_deposit
        CHECK (
            services_deposit IS NULL
            OR services_deposit >= 0
        ),

    CONSTRAINT chk_sale_status
        CHECK (
            status IN (
                'RESERVED',
                'CONTRACTED',
                'CANCELLED'
            )
        )
);


CREATE TABLE customer_sale (
    customer_id INTEGER NOT NULL,

    sale_id INTEGER NOT NULL,

    CONSTRAINT pk_customer_sale
        PRIMARY KEY (customer_id, sale_id),

    CONSTRAINT fk_customer_sale_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_customer_sale_sale
        FOREIGN KEY (sale_id)
        REFERENCES sale(sale_id)
        ON DELETE CASCADE
);



CREATE TABLE installment_plan (
    installment_plan_id INTEGER
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    amount NUMERIC(15,2) NOT NULL,

    installment_count INTEGER NOT NULL,

    frequency_months SMALLINT NOT NULL,

    first_installment_date DATE NOT NULL,

    sale_id INTEGER NOT NULL,

    CONSTRAINT fk_installment_plan_sale
        FOREIGN KEY (sale_id)
        REFERENCES sale(sale_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_installment_amount
        CHECK (amount > 0),

    CONSTRAINT chk_installment_count
        CHECK (installment_count > 0),

    CONSTRAINT chk_frequency_months
        CHECK (frequency_months IN (3, 6, 12))
);