import React from 'react';
import PropTypes from 'prop-types';
import { apiShape } from '../api';

function GameForm({ api }) {
  const [inputGameId, setInputGameId] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`maybeId:`, inputGameId);
    const promise = inputGameId ? () => Promise.resolve(inputGameId) : api.init;

    return promise().then((id) => {
      const url = new URL(window.location.href);
      url.searchParams.set('game', id);
      window.location.assign(url);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="stack">
      <div>
        <label>
          Enter a game ID to join:
          <input
            value={inputGameId}
            onChange={(e) => setInputGameId(e.target.value.toUpperCase())}
          />
        </label>
      </div>
      <button className="btn" type="submit">
        Join game
      </button>
      <div>or!</div>
      <button className="btn" type="submit">
        Start new game
      </button>
    </form>
  );
}

GameForm.propTypes = {
  api: PropTypes.shape(apiShape).isRequired,
};

export default GameForm;
