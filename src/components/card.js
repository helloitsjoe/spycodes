import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../boxes';

const HEIGHT = 80;

const Card = ({ children, color, onClick }) => {
  return (
    <div
      onClick={onClick}
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
};

export default Card;
