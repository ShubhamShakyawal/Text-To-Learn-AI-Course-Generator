import React from 'react';

const HeadingBlock = ({ text }) => {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-10 mb-6 border-b border-slate-800 pb-2">
      {text}
    </h2>
  );
};

export default HeadingBlock;
