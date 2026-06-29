import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';

/**
 * Generates a lesson PDF using jsPDF text methods directly —
 * no html2canvas / DOM screenshot needed, so it works reliably
 * regardless of CSS, dark mode or display:none tricks.
 */
const LessonPDFExporter = ({ lesson, content }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    if (!lesson) return;
    setIsExporting(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();   // 210
      const pageH = pdf.internal.pageSize.getHeight();  // 297
      const margin = 20;
      const maxW = pageW - margin * 2;
      let y = margin;

      // ── Helper: add text with automatic page breaks ──────────────────
      const addText = (text, size, style = 'normal', color = [30, 41, 59]) => {
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(String(text || ''), maxW);
        lines.forEach((line) => {
          if (y + size * 0.4 > pageH - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin, y);
          y += size * 0.5;
        });
      };

      const addSpacing = (mm = 5) => { y += mm; };

      // ── Header bar ───────────────────────────────────────────────────
      pdf.setFillColor(37, 99, 235); // blue-600
      pdf.rect(0, 0, pageW, 12, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Text-to-Learn AI — Lesson Notes', margin, 8);
      y = 20;

      // ── Title ────────────────────────────────────────────────────────
      addText(lesson.title, 22, 'bold', [15, 23, 42]);
      addSpacing(4);

      // ── Divider line ─────────────────────────────────────────────────
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageW - margin, y);
      addSpacing(6);

      // ── Content blocks ───────────────────────────────────────────────
      if (Array.isArray(content) && content.length > 0) {
        content.forEach((block) => {
          if (!block) return;

          switch (block.type) {
            case 'heading':
              addSpacing(4);
              addText(block.text, 14, 'bold', [30, 64, 175]);
              addSpacing(2);
              break;

            case 'paragraph':
              addText(block.text, 11, 'normal', [51, 65, 85]);
              addSpacing(3);
              break;

            case 'code': {
              addSpacing(3);
              // Code box background
              const codeLines = pdf.splitTextToSize(String(block.text || ''), maxW - 8);
              const boxH = codeLines.length * 5 + 8;
              if (y + boxH > pageH - margin) { pdf.addPage(); y = margin; }
              pdf.setFillColor(241, 245, 249); // slate-100
              pdf.rect(margin, y, maxW, boxH, 'F');
              pdf.setFontSize(9);
              pdf.setFont('courier', 'normal');
              pdf.setTextColor(30, 41, 59);
              codeLines.forEach((line) => {
                y += 5;
                pdf.text(line, margin + 4, y);
              });
              y += 8;
              addSpacing(3);
              break;
            }

            case 'mcq':
              addSpacing(3);
              addText(`Q: ${block.question}`, 11, 'bold', [79, 70, 229]);
              if (Array.isArray(block.options)) {
                block.options.forEach((opt, i) => {
                  addText(`  ${String.fromCharCode(65 + i)}) ${opt}`, 10, 'normal', [51, 65, 85]);
                });
              }
              addText(`✓ Answer: ${block.options?.[block.answer] || block.answer}`, 10, 'bold', [22, 163, 74]);
              addSpacing(4);
              break;

            default:
              if (block.text) {
                addText(block.text, 11, 'normal', [51, 65, 85]);
                addSpacing(3);
              }
          }
        });
      } else if (typeof content === 'string' && content) {
        // Plain text fallback
        addText(content, 11, 'normal', [51, 65, 85]);
      } else if (lesson.description) {
        addText(lesson.description, 11, 'normal', [51, 65, 85]);
      }

      // ── Footer on every page ─────────────────────────────────────────
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageW - margin,
          pageH - 8,
          { align: 'right' }
        );
        pdf.text('Text-to-Learn AI', margin, pageH - 8);
      }

      pdf.save(`${(lesson.title || 'lesson').replace(/\s+/g, '_')}_Lesson.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportPDF}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={18} />
      <span>{isExporting ? 'Exporting…' : 'Download PDF'}</span>
    </button>
  );
};

export default LessonPDFExporter;
