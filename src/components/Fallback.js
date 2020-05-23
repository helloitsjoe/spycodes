import React from 'react';
import PropTypes from 'prop-types';

function Fallback({ loading, error, cards }) {
  const style = error ? { color: 'red' } : {};
  let fallbackText;

  if (error) {
    fallbackText = `Error! ${error.message}`;
  } else if (loading) {
    fallbackText = `Loading...`;
  } else if (!cards.length) {
    fallbackText = 'No cards!';
  } else {
    fallbackText = 'Something weird happened.';
  }

  return <div style={style}>{fallbackText}</div>;
}

Fallback.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

Fallback.defaultProps = {
  cards: [],
  loading: true,
  error: null,
};

export default Fallback;
