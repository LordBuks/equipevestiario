import React from 'react';
import logoInternacional from '../assets/internacional_logo.png';

export const InterLogo = ({ 
  className = "", 
  width = 64, 
  height = 64 
}) => {
  return (
    <img
      src={logoInternacional}
      alt="Logo Sport Club Internacional"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

