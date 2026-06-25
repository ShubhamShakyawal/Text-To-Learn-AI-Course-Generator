import React from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import VideoBlock from './blocks/VideoBlock';
import MCQBlock from './blocks/MCQBlock';

const LessonRenderer = ({ content }) => {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className="lesson-content">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={index} text={block.text} />;
          case 'paragraph':
            return <ParagraphBlock key={index} text={block.text} />;
          case 'code':
            return <CodeBlock key={index} language={block.language} text={block.text} />;
          case 'video':
            return <VideoBlock key={index} query={block.query} />;
          case 'mcq':
            return (
              <MCQBlock
                key={index}
                question={block.question}
                options={block.options}
                answer={block.answer}
                explanation={block.explanation}
              />
            );
          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </div>
  );
};

export default LessonRenderer;
