import React, { forwardRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';

const LessonPDFExporter = forwardRef(({ lesson, content }, ref) => {
  const exportPDF = async () => {
    if (!ref.current) return;

    try {
      // Make the hidden element temporarily visible for capture
      ref.current.style.display = 'block';
      
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${lesson.title.replace(/\s+/g, '_')}_Lesson.pdf`);
      
      ref.current.style.display = 'none';
    } catch (error) {
      console.error('PDF Export failed:', error);
      ref.current.style.display = 'none';
    }
  };

  return (
    <>
      <button
        onClick={exportPDF}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
      >
        <Download size={18} />
        <span>Download PDF</span>
      </button>

      {/* Hidden container for PDF generation - forced light mode */}
      <div 
        ref={ref}
        style={{ 
          display: 'none', 
          width: '800px', 
          padding: '40px', 
          backgroundColor: '#ffffff',
          color: '#1e293b'
        }}
        className="pdf-content"
      >
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>
          {lesson.title}
        </h1>
        <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
          {content.map((block, idx) => {
            if (block.type === 'heading') return <h2 key={idx} style={{ fontSize: '24px', marginTop: '30px', color: '#1e40af' }}>{block.text}</h2>;
            if (block.type === 'paragraph') return <p key={idx} style={{ marginBottom: '15px' }}>{block.text}</p>;
            if (block.type === 'code') return <pre key={idx} style={{ padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflowX: 'auto', fontSize: '14px' }}>{block.text}</pre>;
            if (block.type === 'mcq') return (
              <div key={idx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', margin: '20px 0' }}>
                <p style={{ fontWeight: 'bold' }}>Question: {block.question}</p>
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                  {block.options.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
                <p style={{ color: '#16a34a', marginTop: '10px' }}>Correct Answer Index: {block.answer}</p>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </>
  );
});

export default LessonPDFExporter;
