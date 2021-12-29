import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../cardData';

function Card({ color, word, isSpymaster, hidden, onClick }) {
  const seen = isSpymaster && !hidden ? 'seen' : '';
  const theme = isSpymaster || !hidden ? color : colors.DEFAULT;
  const side = isSpymaster || !hidden ? 'front' : 'back';

  return (
    <button
      type="button"
      data-testid="card"
      data-color={theme}
      className={['card', side, seen].filter(Boolean).join(' ')}
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
