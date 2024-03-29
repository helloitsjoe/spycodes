import React from 'react';
import { makeApi } from './api';
import { getIsSpyMaster, getGameId } from './utils';
import Game from './components/Game';
import GameForm from './components/GameForm';
import { colors } from './cardData';

// eslint-disable-next-line react/prop-types
function App({ gameId = getGameId(), api = makeApi(gameId) }) {
  const [loading, setLoading] = React.useState(!!gameId);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (gameId) {
      api.gameExists(gameId).then((exists) => {
        if (!exists) {
          setErrorMessage(`Game ${gameId} does not exist!`);
        }
        setLoading(false);
      });
    }
  }, [gameId, api]);
  console.log(`loading, errorMessage:`, loading, errorMessage);

  if (errorMessage) {
    return (
      <>
        <div className="banner" data-color={colors.RED}>
          {errorMessage}
        </div>
        <GameForm api={api} />;
      </>
    );
  }

  if (loading) {
    return <div className="banner">Loading...</div>;
  }

  if (!gameId) {
    return <GameForm api={api} />;
  }

  return <Game isSpymaster={getIsSpyMaster()} api={api} gameId={gameId} />;
}

export default App;
