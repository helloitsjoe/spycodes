import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../cardData';

function Card({ color, word, border, animation, onClick }) {
  return (
    // eslint-disable-next-line
    <button
      // className={[card.card, animation && card.flip, card[color]].join(' ')}
      data-testid="card"
      className={['card', animation ? 'front' : 'back', color, border]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {word && word.toUpperCase()}
    </button>
  );
}

Card.propTypes = {
  color: PropTypes.string,
  border: PropTypes.string,
  word: PropTypes.string,
  onClick: PropTypes.func,
  animation: PropTypes.bool,
};

Card.defaultProps = {
  color: colors.DEFAULT,
  onClick: null,
  animation: false,
  border: '',
  word: '',
};

export default Card;
