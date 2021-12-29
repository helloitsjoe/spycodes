import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from './components/Grid';
import Card from './components/Card';
import Fallback from './components/Fallback';
import { colors } from './cardData';
import { makeApi } from './api';

const getIsFreakmaster = () =>
  window && window.location.pathname.includes('freakmaster');

function App({ api, isSpymaster }) {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    // <div className="grid-container">
    <>
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
      <div style={{ textAlign: 'center' }}>
        <button className="btn" type="button" onClick={api.init}>
          New game
        </button>
      </div>
      {/* </div> */}
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
