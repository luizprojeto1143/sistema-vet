const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Wards and Boxes...');

    const clinicId = 'clinic-1';

    // Ensure Clinic Exists
    await prisma.clinic.upsert({
        where: { id: clinicId },
        update: {},
        create: {
            id: clinicId,
            name: 'Clínica Veterinária Exemplo',
            phone: '11999999999',
            address: 'Rua Exemplo, 123'
        }
    });
    console.log('Ensured Clinic exists');

    // 1. Create General Ward
    const wardGeneral = await prisma.ward.create({
        data: {
            name: 'Internação Geral',
            type: 'GENERAL',
            description: 'Ala principal para cães e gatos não infecciosos',
            clinicId: clinicId
        }
    });
    console.log(`Created Ward: ${wardGeneral.name}`);

    // Create Boxes for General Ward
    // Create Boxes for General Ward
    await Promise.all([
        { name: 'Box 01', wardId: wardGeneral.id, status: 'AVAILABLE' },
        { name: 'Box 02', wardId: wardGeneral.id, status: 'OCCUPIED' },
        { name: 'Box 03', wardId: wardGeneral.id, status: 'CLEANING' },
        { name: 'Box 04', wardId: wardGeneral.id, status: 'AVAILABLE' },
    ].map(box => prisma.box.create({ data: box })));
    console.log('Created Boxes for General Ward');

    // 2. Create Infectious Ward
    const wardIso = await prisma.ward.create({
        data: {
            name: 'Isolamento (Infecto)',
            type: 'INFECTIOUS',
            description: 'Ala restrita para doenças infectocontagiosas',
            clinicId: clinicId
        }
    });
    console.log(`Created Ward: ${wardIso.name}`);

    // Create Boxes for Infectious Ward
    // Create Boxes for Infectious Ward
    await Promise.all([
        { name: 'Iso 01', wardId: wardIso.id, status: 'AVAILABLE' },
        { name: 'Iso 02', wardId: wardIso.id, status: 'OCCUPIED' },
    ].map(box => prisma.box.create({ data: box })));
    console.log('Created Boxes for Infectious Ward');

    // 3. Create Feline Ward
    const wardCat = await prisma.ward.create({
        data: {
            name: 'Gatil (Cat Friendly)',
            type: 'FELINE',
            description: 'Ambiente silencioso exclusivo para felinos',
            clinicId: clinicId
        }
    });
    console.log(`Created Ward: ${wardCat.name}`);

    // Create Boxes for Feline Ward
    // Create Boxes for Feline Ward
    await Promise.all([
        { name: 'Gaiola 01', wardId: wardCat.id, status: 'AVAILABLE' },
        { name: 'Gaiola 02', wardId: wardCat.id, status: 'AVAILABLE' },
        { name: 'Gaiola 03', wardId: wardCat.id, status: 'AVAILABLE' },
    ].map(box => prisma.box.create({ data: box })));
    console.log('Created Boxes for Feline Ward');

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
