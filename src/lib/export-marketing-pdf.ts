import jsPDF from 'jspdf';
import { MarketingOutput } from './marketing-types';

export function exportMarketingPDF(data: MarketingOutput, attribution: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const primaryColor: [number, number, number] = [62, 175, 224]; // #3eafe0
  const dark: [number, number, number] = [30, 30, 40];
  const muted: [number, number, number] = [120, 120, 140];

  function checkPage(needed: number) {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  }

  function addSection(title: string, emoji: string) {
    checkPage(20);
    y += 6;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...primaryColor);
    doc.text(`${emoji}  ${title}`, margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...dark);
  }

  function addText(text: string, fontSize = 10) {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      checkPage(6);
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 2;
  }

  function addLabeledBlock(label: string, text: string, emoji: string) {
    checkPage(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(`${emoji} ${label}`, margin + 2, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...dark);
    addText(text);
    y += 1;
  }

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 36, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Conteúdo de Marketing', margin, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(attribution || data.formattedAttribution, margin, 26);
  y = 46;

  // 1. Headline
  addSection('Headline de Impacto', '✨');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  addText(data.headline, 14);

  // Best quote
  checkPage(14);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  addText(`"${data.bestQuote}"`, 11);
  doc.setTextColor(...dark);

  // Suggested page title
  checkPage(10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text('Título sugerido para landing page:', margin, y);
  y += 5;
  doc.setTextColor(...dark);
  doc.setFontSize(10);
  addText(data.suggestedPageTitle);

  // 2. Full testimonial
  addSection('Depoimento Completo — Página de Vendas', '📝');
  addText(data.fullTestimonial);

  // 3. Short version
  addSection('Versão Curta — Redes Sociais', '💬');
  addText(data.shortVersion);

  // 4. Quotes
  addSection('Frases Destacáveis', '💎');
  data.quotes.forEach((q, i) => {
    checkPage(14);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(`${i + 1}.`, margin, y);
    doc.setTextColor(...dark);
    const lines = doc.splitTextToSize(`"${q}"`, contentWidth - 8);
    for (const line of lines) {
      checkPage(6);
      doc.text(line, margin + 6, y);
      y += 5.5;
    }
    y += 3;
  });
  doc.setFont('helvetica', 'normal');

  // 5. Classification
  addSection('Classificação Automática', '📊');
  addLabeledBlock('Antes', data.classification.before, '📍');
  addLabeledBlock('Durante', data.classification.during, '🔄');
  addLabeledBlock('Depois', data.classification.after, '✨');
  addLabeledBlock('Resultado', data.classification.result, '🎯');
  addLabeledBlock('Prova Social', data.classification.socialProof, '👥');
  addLabeledBlock('Diferencial', data.classification.differentiator, '💎');

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      `Gerado automaticamente · ${new Date().toLocaleDateString('pt-BR')} · Página ${i}/${totalPages}`,
      pageWidth / 2,
      287,
      { align: 'center' }
    );
  }

  const safeName = (attribution || 'marketing').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
  doc.save(`marketing_${safeName}.pdf`);
}
