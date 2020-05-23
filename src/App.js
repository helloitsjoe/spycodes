import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from './components/Grid';
import Card from './components/Card';
import Fallback from './components/Fallback';
import { colors } from '../server/cardData';
import SocketAPI from './socket';

function App({ socketAPI }) {
  const isSpymaster = window && window.__isSpymaster;

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getColor = ({ hidden, color }) => (isSpymaster || !hidden ? color : colors.DEFAULT);
  const getWord = ({ hidden, word }) => (isSpymaster || hidden ? word : '');
  const getAnimation = ({ hidden }) => isSpymaster || !hidden;
  const hideCard = card => ({ ...card, hidden: true });

  const toggleHidden = word => {
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
    socketAPI
      .getCards()
      .then(fetchedCards => {
        setLoading(false);
        setCards(fetchedCards.map(hideCard));
        socketAPI.onCardClicked(toggleHidden);
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });

    return () => socketAPI.close();
  }, [socketAPI]);

  const handleClick = word => {
    toggleHidden(word);
    socketAPI.clickCard(word);
  };

  return loading || error || !cards.length ? (
    <Fallback loading={loading} error={error} cards={cards} />
  ) : (
    <Grid>
      {cards.map(({ word, color, hidden }) => (
        <Card
          key={word}
          word={getWord({ word, hidden })}
          color={getColor({ color, hidden })}
          animation={getAnimation({ hidden })}
          onClick={() => handleClick(word)}
        />
      ))}
    </Grid>
  );
}

App.propTypes = {
  socketAPI: PropTypes.shape(SocketAPI),
};

App.defaultProps = {
  socketAPI: new SocketAPI(),
};

export default App;
