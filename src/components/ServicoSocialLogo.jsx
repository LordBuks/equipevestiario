import React from 'react';
import logoSTK from '../assets/stk_logo.jpg';

export const ServicoSocialLogo = ({
  className = "",
  width = 64,
  height = 64
}) => {
  return (
    <img
      src={logoSTK}
      alt="Logo STK"
      width={width}
      height={height}
      className={className}
      style={{
        objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    />
  );
};


