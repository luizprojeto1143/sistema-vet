import jsPDF from 'jspdf';

interface ConsultationData {
    petName: string;
    tutorName: string;
    vetName: string;
    date: string;
    diagnosis: string;
    prescriptions: Array<{
        drugName: string;
        dosage: string;
        frequency: string;
        duration: string;
        route: string;
        details?: string;
    }>;
    recommendations: string;
    clinicName?: string;
}

export const generateConsultationPDF = (data: ConsultationData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text(data.clinicName || "Clínica Veterinária", 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Resumo de Atendimento & Receituário", 20, yPos);
    doc.text(`Data: ${data.date}`, pageWidth - 50, yPos);

    yPos += 15;
    doc.setDrawColor(200);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    // -- Patient Info --
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Paciente: ${data.petName}`, 20, yPos);
    doc.text(`Tutor: ${data.tutorName}`, pageWidth / 2, yPos);
    yPos += 8;
    doc.text(`Veterinário(a): ${data.vetName}`, 20, yPos);

    yPos += 15;

    // -- Diagnosis --
    if (data.diagnosis) {
        doc.setFillColor(243, 244, 246);
        doc.rect(20, yPos - 5, pageWidth - 40, 14, 'F');
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Diagnóstico / Suspeita Clínica", 25, yPos + 3);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(data.diagnosis, pageWidth / 2, yPos + 3);
        yPos += 20;
    }

    // -- Prescriptions --
    if (data.prescriptions && data.prescriptions.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(79, 70, 229);
        doc.text("💊 Prescrição Médica", 20, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.setFont("helvetica", "normal");

        data.prescriptions.forEach((rx, index) => {
            // Check page break
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFont("helvetica", "bold");
            doc.text(`${index + 1}. ${rx.drugName} (${rx.dosage})`, 25, yPos);
            yPos += 6;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const inst = `${rx.route} | ${rx.frequency} | Durante ${rx.duration}`;
            doc.text(inst, 30, yPos);
            yPos += 5;

            if (rx.details) {
                doc.setTextColor(100);
                doc.text(`Obs: ${rx.details}`, 30, yPos);
                doc.setTextColor(0);
                yPos += 8;
            } else {
                yPos += 5;
            }
        });
        yPos += 10;
    }

    // -- Recommendations / Notes --
    if (data.recommendations) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(79, 70, 229);
        doc.text("ℹ️ Orientações Gerais", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.setFont("helvetica", "normal");

        const splitText = doc.splitTextToSize(data.recommendations, pageWidth - 40);
        doc.text(splitText, 25, yPos);
        yPos += (splitText.length * 5) + 20;
    }

    // -- Footer --
    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    doc.text("Documento gerado digitalmente pelo VetSystem.", 20, footerY);
    doc.text("Não vale como atestado oficial sem assinatura.", pageWidth - 100, footerY);

    // Save
    doc.save(`Receita_${data.petName}_${data.date.replace(/\//g, '-')}.pdf`);
};
