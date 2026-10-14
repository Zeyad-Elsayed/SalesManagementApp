-- 1. إضافة المشروع
INSERT INTO project (project_name) 
VALUES ('Vida');

-- 2. إضافة المباني وربطها بالمشروع
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
    -- وحدات المبنى a (الدور الأول)
    ('1', 1, 120.00, (SELECT building_id FROM building WHERE building_number = 'a')),
    ('2', 1, 100.50, (SELECT building_id FROM building WHERE building_number = 'a')),
    ('3', 1, 95.00,  (SELECT building_id FROM building WHERE building_number = 'a')),

    -- وحدات المبنى b (الدور الثاني)
    ('2', 2, 150.00, (SELECT building_id FROM building WHERE building_number = 'b')),

    -- وحدات المبنى g (الدور الرابع والسادس)
    ('9', 6, 110.00, (SELECT building_id FROM building WHERE building_number = 'g')),
    ('5', 6, 135.00, (SELECT building_id FROM building WHERE building_number = 'g')),
    ('4', 4, 125.00, (SELECT building_id FROM building WHERE building_number = 'g'));

