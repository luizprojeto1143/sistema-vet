const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { getPatients, createPatient } = require('../controllers/patientController');

// Auth Routes
router.post('/auth/login', loginUser);
router.post('/auth/register', registerUser);

// Patient Routes
router.route('/patients').get(getPatients).post(createPatient);

module.exports = router;
