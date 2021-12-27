// eslint-disable-next-line
// import io from 'socket.io-client';

const io = () => ({
  on() {},
  emit() {},
  removeAllListeners() {},
  disconnect() {},
});

export default class SocketAPI {
  constructor(cardData, socket = io()) {
    // Thought I had to include host/port in io() but apparently not?
    // constructor({ host = 'localhost', port = 3000 } = {}) {
    // const url = port && `http://${host}:${port}`;
    // this.socket = io(url);
    this.socket = socket;

    this.socket.on('card-clicked', word =>
      console.log('someone clicked', word)
    );
    this.onCardClicked = this.socket.on.bind(this.socket, 'card-clicked');
    this.cardData = cardData;
  }

  getCards() {
    return new Promise(resolve => {
      if (this.cardData) {
        resolve(this.cardData);
        return;
      }
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
    this.socket.disconnect(true);
  }
}
