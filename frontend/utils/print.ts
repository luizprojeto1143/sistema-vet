export const printDocument = (title: string, content: string, logoUrl?: string) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
       <html>
          <head>
             <title>${title}</title>
             <style>
                body { font-family: 'Arial', sans-serif; padding: 40px; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                .logo { max-height: 80px; margin-bottom: 10px; }
                .clinic-name { font-size: 24px; font-weight: bold; color: #333; }
                .content { font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
                .footer { margin-top: 50px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                @media print {
                   body { padding: 0; }
                }
             </style>
          </head>
          <body>
             <div class="header">
                ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
                <div class="clinic-name">Clínica Veterinária</div>
                <div>Rua Exemplo, 123 - Cidade/UF</div>
             </div>
             <div class="content">
                <h3>${title}</h3>
                <br/>
                ${content.replace(/\n/g, '<br/>')}
             </div>
             <div class="footer">
                Documento gerado eletronicamente em ${new Date().toLocaleString()}
             </div>
          </body>
       </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
};
