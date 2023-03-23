import React, { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  children?: ReactNode | ReactNode[];
}
export const Section: React.FC<Props> = ({ title, description, children }) => {
  return (
    <div className="hero min-h-screen ">
      <div className="hero-content flex-col lg:flex-row-reverse ">
        <div className="flex-col lg:flex-row-reverse">
          {title && <h1 className="text-5xl font-bold">{title}</h1>}
          {description && <p className="py-6">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};
