import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../server/cardData';
import card from './Card.css';

function Card({ color, word, animation, onClick }) {
  return (
    // eslint-disable-next-line
    <div
      // className={[card.card, animation && card.flip, card[color]].join(' ')}
      data-testid="card"
      className={[card.card, animation ? card.front : card.back, card[color]].join(' ')}
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
