import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MCQBlock = ({ question, options, answer, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx) => {
    if (!submitted) setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
  };

  const isCorrect = selected === answer;

  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <span className="text-blue-400 font-bold">?</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100">{question}</h3>
      </div>

      <div className="space-y-3 mb-8">
        {options.map((option, idx) => {
          let stateStyles = "border-slate-800 hover:border-slate-700 bg-slate-900/50";
          
          if (submitted) {
            if (idx === answer) {
              stateStyles = "border-green-500/50 bg-green-500/10 text-green-400";
            } else if (idx === selected) {
              stateStyles = "border-red-500/50 bg-red-500/10 text-red-400";
            } else {
              stateStyles = "border-slate-800 opacity-50";
            }
          } else if (selected === idx) {
            stateStyles = "border-blue-500 bg-blue-500/10 text-blue-400";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${stateStyles}`}
            >
              <span className="font-medium">{option}</span>
              {submitted && idx === answer && <CheckCircle size={18} />}
              {submitted && idx === selected && idx !== answer && <XCircle size={18} />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
        >
          Submit Answer
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <span className="text-green-400 font-bold">Correct!</span>
            ) : (
              <span className="text-red-400 font-bold">Incorrect</span>
            )}
          </div>
          <p className="text-slate-400 italic">
            <span className="font-bold not-italic text-slate-300">Explanation: </span>
            {explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MCQBlock;
