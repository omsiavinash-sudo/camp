const express = require('express');
const router = express.Router();
const { verifyToken, isDoctor } = require('../middleware/auth.middleware');
const db = require('../config/database');

// Get all registrations
router.get('/', verifyToken, async (req, res) => {
  try {
    const [registrations] = await db.query(
      'SELECT * FROM registration_list_view ORDER BY opd_number DESC'
    );
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get registrations for a specific camp
router.get('/camp/:camp_id', verifyToken, async (req, res) => {
  try {
    const campId = req.params.camp_id;
    console.log(`GET /api/registrations/camp/${campId} requested by user=${req.user ? req.user.username : 'unknown'}`);
    const [campRegistrations] = await db.query(
      `SELECT r.*, gt.type_name AS guardian_type, ms.status_name AS marital_status,
        GROUP_CONCAT(cr.reason_name) AS consultation_reasons
       FROM registrations r
       JOIN guardian_types gt ON r.guardian_type_id = gt.type_id
       LEFT JOIN marital_status ms ON r.marital_status_id = ms.status_id
       LEFT JOIN registration_reasons rr ON r.registration_id = rr.registration_id
       LEFT JOIN consultation_reasons cr ON rr.reason_id = cr.reason_id
       WHERE r.camp_id = ?
       GROUP BY r.registration_id
       ORDER BY r.registration_id DESC`,
      [campId]
    );
    campRegistrations.forEach(reg => {
      if (reg.consultation_reasons) {
        reg.consultation_reasons = reg.consultation_reasons.split(',');
      } else {
        reg.consultation_reasons = [];
      }
    });
    console.log(`Found ${campRegistrations.length} registrations for camp ${campId}`);
    res.json(campRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new registration
router.post('/', verifyToken, async (req, res) => {
  console.log('Registration request body:', req.body);
  console.log('Registration number received:', req.body.registration_number);
  
  const {
    registration_number,
    camp_id,
    first_name,
    last_name,
    middle_name,
    guardian_type_id,
    guardian_name,
    age,
    mobile,
    aadhar,
    email,
  last_period_date,
    marital_status_id,
    marriage_date,
    children_count,
    abortion_count,
    highest_education,
    employment,
    address,
    remarks,
    vaccination_awareness,
    previously_screened,
    consultation_reasons
  } = req.body || {};

  let conn;
  try {
    conn = await db.getConnection();
    // ...existing code...
    // Basic validation: required fields and type checking
    const validations = {
      camp_id: camp_id && camp_id !== '',
      first_name: first_name && first_name.trim() !== '',
      last_name: last_name && last_name.trim() !== '',
      guardian_name: guardian_name && guardian_name.trim() !== '',
      guardian_type_id: guardian_type_id && Number.isInteger(Number(guardian_type_id)),
      age: age && !isNaN(age) && parseInt(age) > 0,
      mobile: mobile && mobile.toString().length === 10,
      aadhar: aadhar && aadhar.toString().length === 12
    };

    const missingFields = Object.entries(validations)
      .filter(([_, isValid]) => !isValid)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      console.log('Validation failed:', validations);
      return res.status(400).json({ 
        message: 'Missing or invalid required fields',
        details: validations,
        missingFields: missingFields
      });
    }
    await conn.beginTransaction();

    // Helper: convert incoming date-like values to 'YYYY-MM-DD' or null
    const toSqlDate = (val) => {
      if (!val) return null;
      const d = new Date(val);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 10);
    };

    const lastPeriodSql = toSqlDate(last_period_date);
    const marriageDateSql = toSqlDate(marriage_date);

    // Coerce numeric fields where appropriate
    const guardianTypeId = guardian_type_id ? parseInt(guardian_type_id, 10) : null;
    const ageInt = age ? parseInt(age, 10) : null;
    const maritalStatusId = marital_status_id ? parseInt(marital_status_id, 10) : null;
    const childrenCountInt = children_count ? parseInt(children_count, 10) : 0;
    const abortionCountInt = abortion_count ? parseInt(abortion_count, 10) : 0;
    const vaccAware = vaccination_awareness ? !!vaccination_awareness : false;
    const prevScreened = previously_screened ? !!previously_screened : false;

    // Debug log the incoming data
    console.log('Incoming registration data:', {
      first_name, middle_name, last_name, address, remarks
    });

    // Insert registration (include optional registration_number)
    const insertQuery = `INSERT INTO registrations (
        camp_id, registration_number, first_name, middle_name, last_name, guardian_name, guardian_type_id,
        age, mobile, aadhar, email, last_period_date,
        marital_status_id, marriage_date, children_count,
        abortion_count, highest_education, employment,
        address, remarks, vaccination_awareness, previously_screened
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // Log the values being inserted
    console.log('Inserting registration with values:', {
        camp_id, first_name, middle_name, last_name, guardian_name, guardian_type_id: guardianTypeId,
        age: ageInt, mobile, aadhar, email
    });
    
  // Debug log all values
  console.log('All values being inserted:', {
    camp_id, registration_number, first_name, middle_name, last_name, guardian_name, guardianTypeId,
    ageInt, mobile, aadhar, email, lastPeriodSql,
    maritalStatusId, marriageDateSql, childrenCountInt,
    abortionCountInt, highest_education, employment,
    address, remarks, vaccAware, prevScreened
  });

  const insertValues = [
    camp_id, 
    registration_number || null, 
    first_name, 
    middle_name || null, 
    last_name, 
    guardian_name, 
    guardianTypeId,
    ageInt, 
    mobile, 
    aadhar, 
    email || null, 
    lastPeriodSql,
    maritalStatusId, 
    marriageDateSql, 
    childrenCountInt,
    abortionCountInt, 
    highest_education || null, 
    employment || null,
    address || null, 
    remarks || null, 
    vaccAware ? 1 : 0, 
    prevScreened ? 1 : 0
  ];

    console.log('SQL Query:', insertQuery);
    console.log('SQL Values:', insertValues);
    console.log('Registration number being inserted:', insertValues[1]); // registration_number is the second value

    const [result] = await conn.query(insertQuery, insertValues);

    // Insert consultation reasons
    if (consultation_reasons && consultation_reasons.length > 0) {
      const values = consultation_reasons.map(reason_id => 
        [result.insertId, reason_id]
      );
      
      await conn.query(
        'INSERT INTO registration_reasons (registration_id, reason_id) VALUES ?',
        [values]
      );
    }

    await conn.commit();

    // Get the generated OPD number and saved registration_number
    const [registration] = await conn.query(
      'SELECT opd_number, registration_number FROM registrations WHERE registration_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: "Registration successful",
      registrationId: result.insertId,
      opdNumber: registration[0].opd_number,
      registrationNumber: registration[0].registration_number || null
    });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Registration error:', error);
    console.error('SQL Error:', error.sqlMessage);
    console.error('Full error:', error);
    const resp = { message: "Server error" };
    if (process.env.NODE_ENV !== 'production') {
      resp.error = error.message;
      resp.sqlMessage = error.sqlMessage;
    }
    res.status(500).json(resp);
  } finally {
    if (conn) conn.release();
  }
});

// Get registration by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [registrations] = await db.query(
      `SELECT r.*, 
        GROUP_CONCAT(cr.reason_id) as consultation_reasons
      FROM registrations r
      LEFT JOIN registration_reasons rr ON r.registration_id = rr.registration_id
      LEFT JOIN consultation_reasons cr ON rr.reason_id = cr.reason_id
      WHERE r.registration_id = ?
      GROUP BY r.registration_id`,
      [req.params.id]
    );

    if (registrations.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const registration = registrations[0];
    if (registration.consultation_reasons) {
      registration.consultation_reasons = registration.consultation_reasons
        .split(',')
        .map(Number);
    } else {
      registration.consultation_reasons = [];
    }

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update registration (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
  const registrationId = req.params.id;
  let conn;
  
  try {
    const {
      registration_number,
      first_name,
      last_name,
      middle_name,
      guardian_type_id,
      guardian_name,
      age,
      mobile,
      email,
      last_period_date,
      marital_status_id,
      marriage_date,
      children_count,
      abortion_count,
      highest_education,
      employment,
      address,
      remarks
    } = req.body;

    conn = await db.getConnection();
    await conn.beginTransaction();

    // Helper: convert incoming date-like values to 'YYYY-MM-DD' or null
    const toSqlDate = (val) => {
      if (!val) return null;
      const d = new Date(val);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 10);
    };

    const updateQuery = `
      UPDATE registrations 
      SET 
        registration_number = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        guardian_type_id = ?,
        guardian_name = ?,
        age = ?,
        mobile = ?,
        email = ?,
        last_period_date = ?,
        marital_status_id = ?,
        marriage_date = ?,
        children_count = ?,
        abortion_count = ?,
        highest_education = ?,
        employment = ?,
        address = ?,
        remarks = ?
      WHERE registration_id = ?
    `;

    const updateValues = [
      registration_number || null,
      first_name,
      middle_name || null,
      last_name,
      guardian_type_id || null,
      guardian_name,
      age,
      mobile,
      email || null,
      toSqlDate(last_period_date),
      marital_status_id || null,
      toSqlDate(marriage_date),
      children_count || 0,
      abortion_count || 0,
      highest_education || null,
      employment || null,
      address || null,
      remarks || null,
      registrationId
    ];

    console.log('Updating registration with values:', { registrationId, ...req.body });
    
    const [result] = await conn.query(updateQuery, updateValues);
    
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Registration not found' });
    }

    await conn.commit();
    
    res.json({
      message: 'Registration updated successfully',
      registrationId
    });

  } catch (error) {
    console.error('Update registration error:', error);
    if (conn) await conn.rollback();
    res.status(500).json({ 
      message: 'Failed to update registration',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;