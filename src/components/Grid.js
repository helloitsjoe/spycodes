import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({ children }) => (
  <div className="grid-container">
    <div data-testid="grid" className="grid">
      {children}
    </div>
  </div>
);

Grid.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Grid;
