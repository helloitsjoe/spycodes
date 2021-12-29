import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from './components/Grid';
import Card from './components/Card';
import Fallback from './components/Fallback';
import { colors } from './cardData';
import { makeApi } from './api';

const getIsFreakmaster = () =>
  window && window.location.pathname.includes('freakmaster');

const getRemaining = cards =>
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

function App({ api, isSpymaster }) {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { redRemaining, blueRemaining } = getRemaining(cards);

  const getBorder = ({ hidden }) => (isSpymaster && !hidden ? 'seen' : '');
  const getColor = ({ hidden, color }) =>
    isSpymaster || !hidden ? color : colors.DEFAULT;

  const getAnimation = ({ hidden }) => isSpymaster || !hidden;
  const toggleHidden = ({ word }) => {
    setCards(c =>
      c.map(card => {
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

  const handleClick = card => {
    const hidden = !card.hidden;
    toggleHidden(card);
    api.clickCard({ ...card, hidden });
  };

  return loading || error || !cards.length ? (
    <Fallback loading={loading} error={error} cards={cards} />
  ) : (
    <>
      {(!redRemaining || !blueRemaining) && (
        <div className={`winner ${redRemaining ? 'blue' : 'red'}-text`}>
          {redRemaining ? 'Blue' : 'Red'} Wins!
        </div>
      )}
      <Grid>
        {cards.map(({ word, color, hidden }) => (
          <Card
            key={word}
            word={word}
            color={getColor({ color, hidden })}
            border={getBorder({ hidden })}
            animation={getAnimation({ hidden })}
            onClick={() => handleClick({ word, color, hidden })}
          />
        ))}
      </Grid>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          margin: '1em',
        }}
      >
        <span className={`chip ${colors.RED}`}>{redRemaining} left</span>
        <button className="btn" type="button" onClick={api.init}>
          New game
        </button>
        <span className={`chip ${colors.BLUE}`}>{blueRemaining} left</span>
      </div>
    </>
  );
}

App.propTypes = {
  api: PropTypes.shape({
    init: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    clickCard: PropTypes.func.isRequired,
    onCardUpdates: PropTypes.func.isRequired,
  }),
  isSpymaster: PropTypes.bool,
};

App.defaultProps = {
  api: makeApi(),
  isSpymaster: getIsFreakmaster(),
};

export default App;
