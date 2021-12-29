import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../cardData';

function Card({ color, word, isSpymaster, hidden, onClick }) {
  const border = isSpymaster && !hidden ? 'seen' : '';
  const bg = isSpymaster || !hidden ? color : colors.DEFAULT;
  const animation = isSpymaster || !hidden;

  return (
    // eslint-disable-next-line
    <button
      data-testid="card"
      className={['card', animation ? 'front' : 'back', bg, border]
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
  isSpymaster: PropTypes.bool,
  word: PropTypes.string,
  onClick: PropTypes.func,
  hidden: PropTypes.bool,
};

Card.defaultProps = {
  color: colors.DEFAULT,
  isSpymaster: false,
  onClick: null,
  hidden: true,
  word: '',
};

export default Card;
