import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { X, Download, Award, ShieldCheck } from 'lucide-react';

// Fixed design dimensions (landscape A4 ratio)
const CERT_W = 700;
const CERT_H = 480;

const CertificateModal = ({ course, userName, onClose }) => {
  const [name, setName] = useState(userName || 'Guest Learner');
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);

  const wrapperRef = useRef();
  const certRef = useRef();

  // Recalculate scale whenever the modal/wrapper resizes
  useEffect(() => {
    const calcScale = () => {
      if (!wrapperRef.current) return;
      const available = wrapperRef.current.clientWidth - 2; // 1px breathing room each side
      setScale(Math.min(1, available / CERT_W));
    };
    calcScale();
    const ro = new ResizeObserver(calcScale);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setIsExporting(true);
    try {
      const el = certRef.current;

      // ── 1. Reset CSS transform so html2canvas captures the element at
      //        full resolution (transforms break canvas rendering).
      const prevTransform = el.style.transform;
      const prevTransformOrigin = el.style.transformOrigin;
      el.style.transform = 'scale(1)';
      el.style.transformOrigin = 'top left';

      // ── 2. Swap gradient-text styles → solid colours so html2canvas
      //        (which cannot render -webkit-background-clip) captures them.
      const gradients = el.querySelectorAll('[data-pdf-color]');
      const origStyles = [];
      gradients.forEach((node) => {
        origStyles.push({
          node,
          color: node.style.color,
          background: node.style.background,
          backgroundImage: node.style.backgroundImage,
          webkitBackgroundClip: node.style.webkitBackgroundClip,
          webkitTextFillColor: node.style.webkitTextFillColor,
        });
        node.style.backgroundImage = 'none';
        node.style.background = 'none';
        node.style.webkitBackgroundClip = 'unset';
        node.style.webkitTextFillColor = 'unset';
        node.style.color = node.dataset.pdfColor;
      });

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false,
        // Capture the element at its natural (un-transformed) size
        width: CERT_W,
        height: CERT_H,
      });

      // ── 3. Restore gradient styles
      origStyles.forEach(({ node, color, background, backgroundImage, webkitBackgroundClip, webkitTextFillColor }) => {
        node.style.color = color;
        node.style.background = background;
        node.style.backgroundImage = backgroundImage;
        node.style.webkitBackgroundClip = webkitBackgroundClip;
        node.style.webkitTextFillColor = webkitTextFillColor;
      });

      // ── 4. Restore transform
      el.style.transform = prevTransform;
      el.style.transformOrigin = prevTransformOrigin;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${(course.title || 'course').replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (err) {
      console.error('Failed to export certificate PDF:', err);
      // Attempt to restore transform even on error
      if (certRef.current) {
        certRef.current.style.transform = `scale(${scale})`;
        certRef.current.style.transformOrigin = 'top left';
      }
    } finally {
      setIsExporting(false);
    }
  };


  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4"
    >
      <div className="min-h-full flex items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center"
        >

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
          <Award size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Congratulations!</h3>
        <p className="text-slate-400 text-xs md:text-sm text-center mb-6 max-w-md">
          You've completed 100% of this course. Customize your name below to download your official Certificate of Completion.
        </p>

        {/* Name Input */}
        <div className="w-full max-w-xs mb-6">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left mb-1.5 pl-1">
            Certificate Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500/50 rounded-xl py-2 px-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors text-center font-semibold"
            placeholder="Enter your name"
          />
        </div>

        {/* ── Certificate Canvas — scales to fit container width ── */}
        <div ref={wrapperRef} className="w-full flex justify-center">
          {/* Outer box reserves the scaled height so the modal doesn't collapse */}
          <div
            style={{
              width: CERT_W * scale,
              height: CERT_H * scale,
              flexShrink: 0,
            }}
          >
            {/* The actual cert, rendered at full size then scaled down */}
            <div
              ref={certRef}
              style={{
                width: CERT_W,
                height: CERT_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                fontFamily: 'Georgia, serif',
              }}
              className="relative bg-slate-950 border-8 border-double border-emerald-500/40 rounded-2xl p-10 flex flex-col justify-between items-center text-center shadow-inner overflow-hidden select-none"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-emerald-500/50 m-4 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-emerald-500/50 m-4 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-emerald-500/50 m-4 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-emerald-500/50 m-4 rounded-br-lg" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Top */}
              <div className="space-y-1 mt-4">
                <h2 className="text-[10px] tracking-[0.3em] text-emerald-500 font-bold uppercase" style={{ fontFamily: 'sans-serif' }}>
                  Certificate of Completion
                </h2>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mx-auto mt-2" />
              </div>

              {/* Middle */}
              <div className="space-y-4 my-2">
                <p className="text-slate-400 text-xs italic">This is proudly presented to</p>

                {/* Recipient name — data-pdf-color used by export to swap gradient → solid */}
                <h1
                  data-pdf-color="#34d399"
                  className="text-3xl font-extrabold text-transparent bg-clip-text py-1 drop-shadow-md"
                  style={{ backgroundImage: 'linear-gradient(to right, #34d399, #5eead4, #34d399)' }}
                >
                  {name || 'Learner'}
                </h1>

                <p className="text-slate-400 text-xs leading-relaxed max-w-lg mx-auto">
                  for successfully meeting all academic requirements and completing the AI-curated course:
                </p>
                <h2 className="text-lg font-bold text-slate-100 italic font-sans max-w-xl mx-auto px-4">
                  "{course.title}"
                </h2>
              </div>

              {/* Bottom row */}
              <div className="w-full flex justify-between items-end px-8 mb-4" style={{ fontFamily: 'sans-serif' }}>
                {/* Date */}
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Date of Issue</p>
                  <div className="h-[1px] w-24 bg-slate-800 my-1" />
                  <p className="text-xs font-semibold text-slate-300">{currentDate}</p>
                </div>

                {/* Badge */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shadow-md">
                    <ShieldCheck size={28} />
                  </div>
                  <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-1.5">Verified</p>
                </div>

                {/* Issuer — data-pdf-color for export */}
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Issued By</p>
                  <div className="h-[1px] w-24 bg-slate-800 my-1" />
                  <p
                    data-pdf-color="#60a5fa"
                    className="text-xs font-semibold text-transparent bg-clip-text italic"
                    style={{ backgroundImage: 'linear-gradient(to right, #60a5fa, #34d399)' }}
                  >
                    Text-to-Learn AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="mt-6 flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <span>Generating PDF…</span>
          ) : (
            <>
              <Download size={18} />
              <span>Download PDF Certificate</span>
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};

export default CertificateModal;
