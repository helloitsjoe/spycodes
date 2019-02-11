import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../server/cardData';

const HEIGHT = 80;

const Card = ({ color, word, onClick }) => (
  // eslint-disable-next-line
  <div
    onClick={onClick}
    style={{
      fontFamily: 'Roboto Slab',
      fontWeight: '700',
      fontSize: window && window.innerWidth < 800 ? '0.5rem' : '1rem',
      color: '#fff',
      backgroundColor: color,
      borderRadius: '3px',
      textAlign: 'center',
      height: `${HEIGHT}px`,
      lineHeight: `${HEIGHT}px`,
    }}
  >
    {word && word.toUpperCase()}
  </div>
);

Card.propTypes = {
  color: PropTypes.string,
  word: PropTypes.string,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  color: colors.DEFAULT,
  onClick: () => {},
  word: '',
};

export default Card;
