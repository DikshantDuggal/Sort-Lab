import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexProps {
  math: string;
  display?: boolean;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({ math, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return math;
    }
  }, [math, display]);

  if (display) {
    return (
      <div
        className={`my-2 overflow-x-auto text-center ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
