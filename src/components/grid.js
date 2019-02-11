import React from 'react';
import PropTypes from 'prop-types';

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

Grid.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Grid;
