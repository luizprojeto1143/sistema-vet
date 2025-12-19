const { Patient } = require('../models');

// @desc    Get all patients
// @route   GET /api/patients
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({});
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create new patient
// @route   POST /api/patients
const createPatient = async (req, res) => {
    const { name, species, breed, gender, tutorName, tutorCpf, tutorPhone, tutorEmail } = req.body;

    try {
        const patient = new Patient({
            name,
            species,
            breed,
            gender,
            tutor: {
                name: tutorName,
                cpf: tutorCpf,
                phone: tutorPhone,
                email: tutorEmail
            }
        });

        const createdPatient = await patient.save();
        res.status(201).json(createdPatient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getPatients, createPatient };
