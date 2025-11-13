-- Update registrations table to handle name fields correctly
USE my_camp;

-- Update NULL last_names first
UPDATE registrations SET last_name = '' WHERE last_name IS NULL;

-- Modify first_name and last_name
ALTER TABLE registrations
MODIFY COLUMN first_name VARCHAR(100) NOT NULL COMMENT 'Required field',
MODIFY COLUMN last_name VARCHAR(100) NOT NULL COMMENT 'Required field';

-- Drop the view first
DROP VIEW IF EXISTS registration_list_view;

-- Try to drop surname column (will fail silently if it doesn't exist)
ALTER TABLE registrations DROP COLUMN IF EXISTS surname;

-- Recreate the view
CREATE VIEW registration_list_view AS
SELECT 
    r.registration_id,
    r.opd_number,
    r.first_name,
    r.middle_name,
    r.last_name,
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