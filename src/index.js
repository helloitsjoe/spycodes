import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import SocketAPI from './socket';

ReactDOM.render(<App socketAPI={new SocketAPI()} />, document.getElementById('container'));
