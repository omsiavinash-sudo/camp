-- Create doctor_exams table
USE my_camp;

CREATE TABLE IF NOT EXISTS doctor_exams (
  doctor_exam_id INT PRIMARY KEY AUTO_INCREMENT,
  registration_id INT NULL,
  user_id INT NULL,
  visual_findings JSON,
  via_result VARCHAR(50) NOT NULL,
  via_extends_endocervical VARCHAR(10),
  via_quadrant_count VARCHAR(20),
  via_quadrants JSON,
  biopsy_taken TINYINT(1) DEFAULT 0,
  biopsy_site_notes TEXT,
  actions_taken JSON,
  actions_other_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(registration_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
