-- Camp Management System Database Initialization
-- Created: 2025-10-16

-- Drop existing database if it exists and create new one
DROP DATABASE IF EXISTS my_camp;
CREATE DATABASE my_camp;
USE my_camp;

-- Create roles table
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table with role-based access
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    mobile VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Create camps table
CREATE TABLE camps (
    camp_id INT PRIMARY KEY AUTO_INCREMENT,
    camp_name VARCHAR(100) NOT NULL,
    camp_date DATE NOT NULL,
    area VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    coordinator VARCHAR(100) NOT NULL,
    sponsor VARCHAR(100) NOT NULL,
    agenda TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Create consultation_reasons table
CREATE TABLE consultation_reasons (
    reason_id INT PRIMARY KEY AUTO_INCREMENT,
    reason_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create marital_status table
CREATE TABLE marital_status (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create guardian_types table
CREATE TABLE guardian_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Create registrations table
CREATE TABLE registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    opd_number VARCHAR(25) NOT NULL UNIQUE,
    camp_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(100) NOT NULL,
    guardian_name VARCHAR(100) NOT NULL,
    guardian_type_id INT NOT NULL,
    age INT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    aadhar VARCHAR(12) NOT NULL UNIQUE,
    email VARCHAR(100),
    last_period_date DATE,
    marital_status_id INT,
    marriage_date DATE,
    children_count INT DEFAULT 0,
    abortion_count INT DEFAULT 0,
    highest_education VARCHAR(100),
    employment VARCHAR(100),
    vaccination_awareness BOOLEAN DEFAULT FALSE,
    previously_screened BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camp_id) REFERENCES camps(camp_id),
    FOREIGN KEY (guardian_type_id) REFERENCES guardian_types(type_id),
    FOREIGN KEY (marital_status_id) REFERENCES marital_status(status_id)
);

-- Create registration_reasons mapping table
CREATE TABLE registration_reasons (
    registration_id INT,
    reason_id INT,
    PRIMARY KEY (registration_id, reason_id),
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
    FOREIGN KEY (reason_id) REFERENCES consultation_reasons(reason_id)
);

-- Create trigger for OPD number generation (safe numeric extraction)
DELIMITER //
CREATE TRIGGER before_registration_insert
BEFORE INSERT ON registrations
FOR EACH ROW
BEGIN
    DECLARE max_seq INT DEFAULT 0;
    SELECT IFNULL(MAX(CAST(SUBSTRING_INDEX(opd_number, '-', -1) AS UNSIGNED)), 0) INTO max_seq
    FROM registrations
    WHERE opd_number LIKE CONCAT('OPD-', DATE_FORMAT(CURRENT_DATE, '%Y%m%d'), '-%');
    SET NEW.opd_number = CONCAT('OPD-', DATE_FORMAT(CURRENT_DATE, '%Y%m%d'), '-', LPAD(max_seq + 1, 4, '0'));
END //
DELIMITER ;

-- Insert initial data

-- Roles
INSERT INTO roles (role_name) VALUES
('admin'),
('doctor'),
('user');

-- Guardian Types
INSERT INTO guardian_types (type_name) VALUES
('Father'),
('Husband'),
('Other');

-- Marital Status
INSERT INTO marital_status (status_name) VALUES
('Single'),
('Married'),
('Widowed'),
('Divorced');

-- Consultation Reasons (fixed typos)
INSERT INTO consultation_reasons (reason_name) VALUES
('Vaginal Discharge'),
('Bleeding While Periods'),
('Vagina Thrush'),
('Ulcer on Vagina'),
('Abdominal Pain'),
('Bleeding After Sex'),
('Pain During Intercourse');

-- Create admin user (password: admin123)
INSERT INTO users (username, mobile, password_hash, role_id, email) VALUES
('admin', '+919876543210', '$2b$10$xLRz0oBH9Z5/Q0F9QUfP8eR5YXbZ0U1W1qzT1K5f5X5X5X5X5X5X5', 1, 'admin@camp.com');

-- Create indexes for better query performance
CREATE INDEX idx_camps_date ON camps(camp_date);
CREATE INDEX idx_registrations_camp ON registrations(camp_id);
CREATE INDEX idx_registrations_aadhar ON registrations(aadhar);
CREATE INDEX idx_registrations_mobile ON registrations(mobile);

-- Create a view for registration list with camp details
CREATE VIEW registration_list_view AS
SELECT 
    r.registration_id,
    r.opd_number,
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

-- Grant appropriate permissions (customize based on your needs)
GRANT SELECT, INSERT, UPDATE ON my_camp.* TO 'my_camp'@'%';
GRANT ALL PRIVILEGES ON my_camp.* TO 'my_camp'@'%';