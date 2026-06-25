import React from 'react';

const ParagraphBlock = ({ text }) => {
  return (
    <p className="text-lg text-slate-300 leading-relaxed mb-6">
      {text}
    </p>
  );
};

export default ParagraphBlock;
