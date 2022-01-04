import React from 'react';
import PropTypes from 'prop-types';
import { apiShape } from '../api';

function GameForm({ api }) {
  const [inputGameId, setInputGameId] = React.useState('');

  const handleSubmit = () => {
    console.log(`maybeId:`, inputGameId);
    const promise = inputGameId ? () => Promise.resolve(inputGameId) : api.init;

    return promise().then(id => {
      console.log(`id:`, id);
      const url = new URL(window.location.href);
      url.searchParams.set('game', id);
      console.log(`url.search:`, url.search);
      console.log(`url.href:`, JSON.stringify(url));
      // TODO: Why isn't this assigning params to URL?
      window.location.assign(JSON.stringify(url));
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={inputGameId}
          onChange={e => setInputGameId(e.target.value)}
        />
        <button className="btn" type="submit">
          Join game
        </button>
        <button className="btn" type="submit">
          Start new game
        </button>
      </form>
    </>
  );
}

GameForm.propTypes = {
  api: PropTypes.shape(apiShape).isRequired,
};

export default GameForm;
