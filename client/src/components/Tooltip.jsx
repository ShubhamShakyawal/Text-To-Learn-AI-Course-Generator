import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Tooltip — renders via a React portal at document.body level so it's
 * never clipped by overflow:hidden / overflow:auto parent containers.
 *
 * @param {string}          label    - Text shown in the tooltip
 * @param {React.ReactNode} children - Element to wrap
 * @param {boolean}         disabled - When true, renders children only (no popup)
 */
const Tooltip = ({ label, children, disabled = false, className = 'relative w-full' }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  // When disabled just passthrough
  if (disabled) return <>{children}</>;

  const show = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({
      // Position to the right, vertically centred
      top:  rect.top + rect.height / 2,
      left: rect.right + 10,   // 10px gap from the element
    });
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}

      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, x: -6, y: '-50%' }}
              animate={{ opacity: 1, x: 0,  y: '-50%' }}
              exit={{ opacity: 0, x: -6,    y: '-50%' }}
              transition={{ duration: 0.14 }}
              style={{
                position: 'fixed',
                top:  coords.top,
                left: coords.left,
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            >
              {/* Arrow */}
              <div
                style={{
                  position: 'absolute',
                  right: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop:    '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderRight:  '6px solid #334155',  // slate-700
                }}
              />
              {/* Bubble */}
              <div className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-xl shadow-black/50">
                <span className="text-xs font-semibold text-slate-100 whitespace-nowrap">
                  {label}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;
