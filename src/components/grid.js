import React from 'react';
import Card from './card.js';

const Grid = ({ children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 18%)',
      justifyContent: 'center',
      gridGap: '10px',
    }}
  >
    {children}
  </div>
);

export default Grid;
