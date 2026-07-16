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

    let clone = null;
    let container = null;
    try {
      // ── 1. Create an off-screen container and clone the cert into it ──────
      //   We use position:absolute; left:-9999px; top:0 (not position:fixed)
      //   so html2canvas can locate the element via getBoundingClientRect().
      //   Fixed positioning at a large negative offset gives html2canvas
      //   out-of-viewport bounds → blank canvas. Absolute at left:-9999px
      //   keeps top:0 so the element is in the real document flow and
      //   html2canvas clips its output to the element's actual bounds.
      container = document.createElement('div');
      Object.assign(container.style, {
        position: 'absolute',
        top: '0px',
        left: '-9999px',
        width: `${CERT_W}px`,
        height: `${CERT_H}px`,
        overflow: 'visible',    // do NOT clip the clone
        pointerEvents: 'none',
      });
      document.body.appendChild(container);

      clone = certRef.current.cloneNode(true);
      Object.assign(clone.style, {
        position: 'static',    // let the container position it
        transform: 'none',      // no scaling — capture at native size
        transformOrigin: 'top left',
        width: `${CERT_W}px`,
        height: `${CERT_H}px`,
        fontFamily: 'Georgia, serif',
      });
      container.appendChild(clone);

      // ── 2. In the clone: swap gradient text → solid colours ───────────────
      //   html2canvas cannot render -webkit-background-clip:text.
      //   We set BOTH webkitTextFillColor AND color because -webkit-text-fill-color
      //   takes precedence in WebKit/Blink and overrides the `color` property.
      clone.querySelectorAll('[data-pdf-color]').forEach((node) => {
        node.style.backgroundImage = 'none';
        node.style.background = 'none';
        node.style.webkitBackgroundClip = 'unset';
        node.style.webkitTextFillColor = node.dataset.pdfColor;
        node.style.color = node.dataset.pdfColor;
      });

      // ── 3. Capture the clone ──────────────────────────────────────────────
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false,
        width: CERT_W,
        height: CERT_H,
        // Do NOT set x/y/scrollX/scrollY — let html2canvas compute the element's
        // bounds from getBoundingClientRect() at its absolute(left:-9999, top:0) position.
      });

      // ── 4. Build and save the PDF ─────────────────────────────────────────
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${(course.title || 'course').replace(/\s+/g, '_')}_Certificate.pdf`);

    } catch (err) {
      console.error('Failed to export certificate PDF:', err);
    } finally {
      // Always clean up — even if an exception was thrown
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
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
                      Text-to-Learn
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
