select *
from project p 
order by p.project_name asc

select *
from building b 
inner join project p on b.project_id = p.project_id 
where p.project_name = 'Alexandria Gardens'

select *
from unit u 
inner join building b  on u.building_id = b.building_id  
where b.building_number  = 'A1'

select *
from unit u 
where u.unit_status = 'AVAILABLE'

select *
from unit u 
inner join building b on u.building_id = b.building_id 
where b.building_number ='A1'
and u.floor =2

select *
from unit u 
inner join building b on u.building_id = b.building_id
inner join project p on b.project_id = p.project_id
where p.project_name = 'Alexandria Gardens'
and u.unit_status = 'SOLD'

select p.project_name, COUNT(u.unit_id) AS count_units
FROM project p
inner JOIN building b ON p.project_id = b.project_id
inner JOIN unit u ON b.building_id = u.building_id
GROUP BY p.project_id, p.project_name;

select u.unit_status , COUNT(u.unit_id) AS count_units
FROM unit u
inner join building b on u.building_id = b.building_id
inner join project p on b.project_id = p.project_id
group by u.unit_status 

select *
from customer c 

select *
from phonenumbers p 
inner join customer c on c.customer_id = p.customer_id
where c.national_id = '30101010100011'

select *
from sale s 

select *
from sale s 
where s.status = 'RESERVED'

select *
from sale s 
where s.status = 'CONTRACTED'
order by s.price  desc 

select *
from sale s 
where s.price > 2000000


SELECT 
    c.full_name, 
    p.project_name, 
    b.building_number, 
    u.unit_number, 
    u.floor, 
    u.area, 
    s.price, 
    s.reservation_amount, s.reservation_date, 
    s.contract_amount, s.contract_date, 
    s.handover_amount, s.handover_date, 
    s.maintenance_deposit, 
    s.services_deposit, 
    s.status
FROM unit u
JOIN building b ON u.building_id = b.building_id
JOIN project p ON b.project_id = p.project_id
JOIN sale s ON u.unit_id = s.unit_id
JOIN customer_sale cs ON s.sale_id = cs.sale_id
JOIN customer c ON cs.customer_id = c.customer_id
WHERE p.project_name = 'Palm Residence' 
  AND b.building_number = 'A1' 
  AND u.unit_number = '101';
