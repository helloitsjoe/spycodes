import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../server/cardData';
import card from './card.css';

// const HEIGHT = 80;

function Card({ color, word, animation, onClick }) {
  return (
    // eslint-disable-next-line
    <div
      // className={[card.card, animation && card.flip].join(' ')}
      data-testid="card"
      className={[card.card, animation ? card.front : card.back, color].join(' ')}
      onClick={onClick}
    >
      {word && word.toUpperCase()}
    </div>
  );
}

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
