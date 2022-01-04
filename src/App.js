import React from 'react';
import PropTypes from 'prop-types';
import { makeApi } from './api';
import Game from './components/Game';
import GameForm from './components/GameForm';

const getIsFreakmaster = () =>
  window && window.location.pathname.includes('freakmaster');

const getGameId = () => {
  console.log(`window.location.query:`, window.location.search);
  const params = new URLSearchParams(window.location.search);
  const game = params.get('game');
  console.log(`params, game:`, params, game);
  return game;
};

function App({ gameId }) {
  const api = makeApi(gameId);

  // TODO: Check game ID async
  // React.useEffect(() => {
  //   if (!api.gameExists(gameId)) {

  //   }
  // })

  if (!gameId) {
    return <GameForm api={api} />;
  }

  return <Game isSpymaster={getIsFreakmaster()} api={api} />;
}

App.propTypes = {
  gameId: PropTypes.string,
};

App.defaultProps = {
  gameId: getGameId(),
};

export default App;
