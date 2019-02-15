// eslint-disable-next-line
import io from 'socket.io-client';

export default class SocketAPI {
  constructor({ host = 'localhost', port = 3000 } = {}) {
    const url = port && `http://${host}:${port}`;
    this.socket = io(url);

    this.socket.on('card-clicked', word => console.log('someone clicked', word));
    this.onCardClicked = this.socket.on.bind(this.socket, 'card-clicked');
  }

  getCards() {
    if (this.cardData) {
      return this.cardData;
    }
    return new Promise(resolve => {
      this.socket.emit('request-cards');
      this.socket.on('card-data', data => {
        this.cardData = data;
        resolve(data);
      });
    });
  }

  clickCard(id) {
    console.log(`clicked ${id}!`);
    this.socket.emit('card-clicked', id);
  }

  close() {
    this.socket.removeAllListeners();
  }
}
