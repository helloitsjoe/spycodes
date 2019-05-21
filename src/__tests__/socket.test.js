import Socket from '../socket';

describe('Socket', () => {
  const cardData = [{ color: 'blue', word: 'yes' }];
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    removeAllListeners: jest.fn(),
    disconnect: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets up click listener', () => {
    const socket = new Socket(cardData, mockSocket);
    expect(typeof socket.onCardClicked).toBe('function');
    expect(mockSocket.on.mock.calls[0]).toContain('card-clicked');
  });

  describe('#getCards', () => {
    it('returns a promise', () => {
      const socket = new Socket(cardData, mockSocket);
      expect(typeof socket.getCards().then).toBe('function');
    });

    it('Loads card data if provided', async () => {
      const socket = new Socket(cardData, mockSocket);
      const cards = await socket.getCards();
      expect(cards).toBe(cardData);
    });

    it('if not available, requests card data, sets up listener', () => {
      const socket = new Socket(null, mockSocket);
      socket.getCards();
      expect(mockSocket.emit).toBeCalledWith('request-cards');
      expect(mockSocket.on.mock.calls[1]).toContain('card-data');
    });

    xit('sets card data on socket', async () => {
      // mockSocket.on.mockRestore();
      // socket = new Socket(null);
      // const cards = await socket.getCards();
      // expect(cards).toEqual(cardData);
    });
  });

  describe('#clickCard', () => {
    it('emits card-clicked with card id', () => {
      const socket = new Socket(cardData, mockSocket);
      socket.clickCard(42);
      expect(mockSocket.emit.mock.calls[0][0]).toBe('card-clicked');
      expect(mockSocket.emit.mock.calls[0][1]).toBe(42);
    });
  });

  describe('#close', () => {
    it('calls disconnect and removes listeners', () => {
      const socket = new Socket(cardData, mockSocket);
      expect(mockSocket.removeAllListeners).toBeCalledTimes(0);
      expect(mockSocket.disconnect).toBeCalledTimes(0);
      socket.close();
      expect(mockSocket.removeAllListeners).toBeCalledTimes(1);
      expect(mockSocket.disconnect).toBeCalledTimes(1);
    });
  });
});
