import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../server/cardData';
import card from './card.css';

// const HEIGHT = 80;

const Card = ({ color, word, animation, onClick }) => (
  // eslint-disable-next-line
  <div
    className={[card.card, animation && card.flip].join(' ')}
    onClick={onClick}
    style={{ backgroundColor: color }}
  >
    {word && word.toUpperCase()}
  </div>
);

Card.propTypes = {
  color: PropTypes.string,
  word: PropTypes.string,
  onClick: PropTypes.func,
  animation: PropTypes.bool,
};

Card.defaultProps = {
  color: colors.DEFAULT,
  onClick: null,
  animation: false,
  word: '',
};

export default Card;
