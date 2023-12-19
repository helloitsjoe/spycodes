import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';
import Card from './Card';
import Fallback from './Fallback';
import { colors } from '../cardData';
import { getIsSpyMaster } from '../utils';
import { makeApi, apiShape } from '../api';

const getRemaining = (cards) =>
  cards.reduce(
    (acc, { color, hidden }) => {
      if (!hidden) {
        return acc;
      }
      if (color === colors.RED) {
        acc.redRemaining++;
      } else if (color === colors.BLUE) {
        acc.blueRemaining++;
      }
      return acc;
    },
    { redRemaining: 0, blueRemaining: 0 }
  );

function Game({ api, isSpymaster, gameId }) {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { redRemaining, blueRemaining } = getRemaining(cards);
  const dead = cards.find(
    ({ color, hidden }) => color === colors.BLACK && !hidden
  );

  const toggleHidden = ({ word }) => {
    setCards((c) =>
      c.map((card) => {
        if (card.word === word) {
          return { ...card, hidden: !card.hidden };
        }
        return card;
      })
    );
  };

  useLayoutEffect(() => {
    setLoading(true);
    api.onCardUpdates((err, newCards) => {
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      setCards(newCards);
    });

    return () => api.close();
  }, [api]);

  const handleClick = (card) => {
    const hidden = !card.hidden;
    toggleHidden(card);
    api.clickCard({ ...card, hidden });
  };

  return loading || error || !cards.length ? (
    <Fallback loading={loading} error={error} cards={cards} />
  ) : (
    <>
      {dead && <div className="banner">DEAD</div>}
      {(!redRemaining || !blueRemaining) && !dead && (
        <div
          data-color={redRemaining ? colors.BLUE : colors.RED}
          className="banner"
        >
          {redRemaining ? 'Blue' : 'Red'} Wins!
        </div>
      )}
      <Grid>
        {cards.map(({ word, color, hidden }) => (
          <Card
            key={word}
            word={word}
            color={color}
            hidden={hidden}
            isSpymaster={isSpymaster}
            onClick={() => handleClick({ word, color, hidden })}
          />
        ))}
      </Grid>
      <div className="stack">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            margin: '1em',
            width: '100%',
          }}
        >
          <span data-color={colors.RED} className="chip">
            {redRemaining} left
          </span>
          <span data-color={colors.DEFAULT} className="chip">
            Game ID: {gameId}
          </span>
          <span data-color={colors.BLUE} className="chip">
            {blueRemaining} left
          </span>
        </div>
        <button className="btn" type="button" onClick={api.init}>
          Start new game
        </button>
      </div>
    </>
  );
}

Game.propTypes = {
  api: PropTypes.shape(apiShape),
  gameId: PropTypes.string.isRequired,
  isSpymaster: PropTypes.bool,
};

Game.defaultProps = {
  api: makeApi(),
  isSpymaster: getIsSpyMaster(),
};

export default Game;
