import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import Socket from './socket';

ReactDOM.render(<App socket={new Socket()} />, document.getElementById('container'));
