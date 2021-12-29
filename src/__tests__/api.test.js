import { onSnapshot, setDoc, doc } from 'firebase/firestore';
import { makeApi } from '../api';

jest.mock('firebase/firestore');

beforeEach(() => {
  doc.mockReturnValue('some-doc');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('makeApi', () => {
  it('sets up click listener', () => {
    const cb = jest.fn();
    const api = makeApi();
    api.onCardUpdates(cb);
    expect(onSnapshot).toBeCalledWith(
      'some-doc',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('init calls setDoc with new card info', () => {
    const api = makeApi();
    api.init();
    expect(setDoc).toBeCalledWith('some-doc', expect.any(Object));
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
