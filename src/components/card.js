import React from 'react';

const HEIGHT = 80;

const Card = ({ children, color }) => (
  <div
    style={{
      fontFamily: 'Roboto Slab',
      fontWeight: '700',
      fontSize: window.innerWidth < 800 ? '0.5rem' : '1rem',
      color: '#fff',
      backgroundColor: color,
      borderRadius: '3px',
      textAlign: 'center',
      height: `${HEIGHT}px`,
      lineHeight: `${HEIGHT}px`,
    }}
  >
    {children}
  </div>
);

export default Card;
