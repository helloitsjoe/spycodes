import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from './components/Grid';
import Card from './components/Card';
import Fallback from './components/Fallback';
import { colors } from './cardData';
import { makeApi } from './db';

function App({ api }) {
  const isSpymaster = window && window.__isSpymaster;

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getColor = ({ hidden, color }) =>
    isSpymaster || !hidden ? color : colors.DEFAULT;

  const getAnimation = ({ hidden }) => isSpymaster || !hidden;
  // const hideCard = card => ({ ...card, hidden: true });

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
    api
      // TODO: "Start game" button
      // .init()
      .getCards()
      .then(fetchedCards => {
        // TODO: onSnapshotUpdate
        setLoading(false);
        console.log(`fetchedCards:`, fetchedCards);
        setCards(Object.values(fetchedCards));
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });

    return () => api.close();
  }, [api]);

  const handleClick = card => {
    console.log(`card:`, card);
    const hidden = !card.hidden;
    toggleHidden(card);
    api.clickCard({ ...card, hidden });
  };

  return loading || error || !cards.length ? (
    <Fallback loading={loading} error={error} cards={cards} />
  ) : (
    <Grid>
      {cards.map(({ word, color, hidden }) => (
        <Card
          key={word}
          word={word}
          color={getColor({ color, hidden })}
          animation={getAnimation({ hidden })}
          onClick={() => handleClick({ word, color, hidden })}
        />
      ))}
    </Grid>
  );
}

App.propTypes = {
  api: PropTypes.shape({
    close: PropTypes.func.isRequired,
    getCards: PropTypes.func.isRequired,
    clickCard: PropTypes.func.isRequired,
  }),
};

App.defaultProps = {
  api: makeApi(),
};

export default App;
