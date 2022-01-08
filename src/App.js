import React from 'react';
import PropTypes from 'prop-types';
import { makeApi } from './api';
import { getIsSpyMaster, getGameId } from './window-utils';
import Game from './components/Game';
import GameForm from './components/GameForm';

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

  return <Game isSpymaster={getIsSpyMaster()} api={api} gameId={gameId} />;
}

App.propTypes = {
  gameId: PropTypes.string,
};

App.defaultProps = {
  gameId: getGameId(),
};

export default App;
