const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'vet', 'aux', 'recepcao', 'tutor'], default: 'vet' },
    crmv: { type: String }, // Apenas para vets
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- PATIENT & TUTOR MODEL ---
// Simplificação: Tutor e Pet juntos ou separados? Vamos separar logicamente mas referenciar.
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true }, // Cão, Gato
    breed: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ['M', 'F'] },
    tutor: {
        name: { type: String, required: true },
        cpf: { type: String },
        phone: { type: String, required: true },
        email: { type: String }
    },
    weightHistory: [{ date: Date, weight: Number }],
}, { timestamps: true });

// --- APPOINTMENT MODEL ---
const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    vet: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['consulta', 'vacina', 'cirurgia', 'retorno', 'analisavet'], required: true },
    date: { type: Date, required: true }, // Data e Hora
    status: { type: String, enum: ['agendado', 'confirmado', 'concluido', 'cancelado'], default: 'agendado' },
    notes: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { User, Patient, Appointment };
