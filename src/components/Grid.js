import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div
      data-testid="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 18%)',
        justifyContent: 'center',
        gridGap: '10px',
      }}
    >
      {children}
    </div>
  </div>
);

Grid.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Grid;
