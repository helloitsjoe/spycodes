import { onSnapshot, setDoc, doc } from 'firebase/firestore';
import { makeApi } from '../api';
import { colors } from '../cardData';

jest.mock('firebase/firestore');

const GAME_ID = 'ABCD';

beforeEach(() => {
  doc.mockReturnValue('some-doc');
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
    const cards = setDoc.mock.calls[0][1];
    Object.entries(cards).forEach(([word, card]) => {
      expect(word).toBe(card.word);
      expect(card).toEqual({
        word: expect.any(String),
        color: expect.any(String),
        hidden: true,
      });
    });
  });

  // it('if no game ID in API, init creates new game ID and sets in DB', () => {
  //   const api = makeApi();
  //   api.init();
  //   expect(getDoc).toBeCalledWith('some-doc', expect.any(Object));
  //   expect(setDoc).toBeCalledWith('some-doc', expect.any(Object));
  //   expect(doc).toBeCalledWith(undefined, 'cards/ABCD');
  // });

  it('clickCard sets card info on current game', () => {
    const singleCard = { color: colors.RED, hidden: true, word: 'poo' };
    const api = makeApi(GAME_ID, [singleCard]);
    api.clickCard(singleCard);
    expect(setDoc).toBeCalledWith(
      'some-doc',
      { poo: singleCard },
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
