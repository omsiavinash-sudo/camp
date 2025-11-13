-- Add registration_number column to registrations table
ALTER TABLE registrations
ADD COLUMN registration_number VARCHAR(50) AFTER opd_number;

-- Update the registration_list_view to include registration_number
DROP VIEW IF EXISTS registration_list_view;
CREATE VIEW registration_list_view AS
SELECT 
    r.registration_id,
    r.opd_number,
    r.registration_number,
    r.first_name,
    r.guardian_name,
    gt.type_name as guardian_type,
    r.age,
    r.mobile,
    r.aadhar,
    c.camp_name,
    c.camp_date,
    ms.status_name as marital_status
FROM registrations r
JOIN camps c ON r.camp_id = c.camp_id
JOIN guardian_types gt ON r.guardian_type_id = gt.type_id
LEFT JOIN marital_status ms ON r.marital_status_id = ms.status_id;