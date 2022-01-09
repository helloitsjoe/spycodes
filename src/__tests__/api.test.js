import { onSnapshot, setDoc, getDoc, doc } from 'firebase/firestore';
import { makeApi } from '../api';
import { colors } from '../cardData';
import { generateGameId } from '../utils';

jest.mock('firebase/firestore');
jest.mock('../utils');

const GAME_ID = 'ABCD';

beforeEach(() => {
  doc.mockReturnValue('some-doc');
  getDoc.mockResolvedValue({ data: () => null });
  setDoc.mockResolvedValue();
  generateGameId.mockReturnValue(GAME_ID);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('makeApi', () => {
  it('sets up click listener', () => {
    const cb = jest.fn();
    const api = makeApi(GAME_ID);
    api.onCardUpdates(cb);
    expect(doc).toBeCalledWith(undefined, `cards/${GAME_ID}`);
    expect(onSnapshot).toBeCalledWith(
      'some-doc',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('init calls setDoc with new card info', () => {
    const api = makeApi(GAME_ID);
    api.init();
    expect(setDoc).toBeCalledWith('some-doc', expect.any(Object));
    expect(doc).toBeCalledWith(undefined, 'cards/ABCD');
    const data = setDoc.mock.calls[0][1];
    expect(data.createdAt).toEqual(expect.any(String));
    Object.entries(data.cards).forEach(([word, card]) => {
      expect(word).toBe(card.word);
      expect(card).toEqual({
        word: expect.any(String),
        color: expect.any(String),
        hidden: true,
      });
    });
  });

  it('if no game ID in API, init creates new game ID and sets in DB', async () => {
    const api = makeApi();
    const gameId = await api.init();
    expect(getDoc).toBeCalledWith('some-doc');
    expect(setDoc).toBeCalledWith('some-doc', expect.any(Object));
    expect(doc.mock.calls[0][1]).toMatch(`cards/${GAME_ID}`);
    expect(gameId).toBe(GAME_ID);
  });

  it('if initial game ID is used, init sets new cards using that ID', async () => {
    const api = makeApi('1234');
    const gameId = await api.init();
    expect(getDoc).not.toBeCalled();
    expect(setDoc).toBeCalledWith('some-doc', expect.any(Object));
    expect(doc.mock.calls[0][1]).toMatch(`cards/1234`);
    expect(gameId).toBe('1234');
  });

  it('init gives up generating ID after retries', async () => {
    getDoc.mockResolvedValue({ data: () => 'some-game' });
    const api = makeApi();
    await expect(api.init).rejects.toEqual(
      new Error('Too many retries generating game')
    );
    expect(getDoc).toBeCalledWith('some-doc');
    expect(setDoc).not.toBeCalled();
    expect(doc).toBeCalledWith(undefined, 'cards/ABCD');
    expect(doc).toBeCalledTimes(6);
  });

  it('clickCard sets card info on current game', () => {
    const singleCard = { color: colors.RED, hidden: true, word: 'poo' };
    const api = makeApi(GAME_ID, [singleCard]);
    api.clickCard(singleCard);
    expect(setDoc).toBeCalledWith(
      'some-doc',
      { cards: { poo: singleCard } },
      { merge: true }
    );
    expect(doc).toBeCalledWith(undefined, 'cards/ABCD');
  });

  it('close calls unsubscribe', () => {
    const unsub = jest.fn();
    onSnapshot.mockReturnValue(unsub);
    const api = makeApi();
    api.onCardUpdates(jest.fn());
    expect(unsub).not.toBeCalled();
    api.close();
    expect(unsub).toBeCalledTimes(1);
  });
});
