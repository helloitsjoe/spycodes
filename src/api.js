/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';
import {
  getFirestore,
  onSnapshot,
  setDoc,
  getDoc,
  doc,
} from 'firebase/firestore';
import firebaseApp from './firebase';
import { makeCards, toArray } from './cardData';
import { generateGameId } from './utils';

export const apiShape = {
  init: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  clickCard: PropTypes.func.isRequired,
  onCardUpdates: PropTypes.func.isRequired,
};

export const makeApi = (
  initialGameId,
  cards,
  db = getFirestore(firebaseApp)
) => {
  let unsub = () => {};
  let gameId = initialGameId?.toUpperCase();

  const init = () => {
    if (cards) {
      return Promise.resolve();
    }

    const cardsToSet = makeCards();

    if (gameId) {
      // console.log(`setting cards:`, cardsToSet);
      return setDoc(doc(db, `cards/${gameId}`), {
        cards: cardsToSet,
        createdAt: new Date().toISOString(),
      }).then(() => gameId);
    }

    const generateAndSetGameId = (retries = 5) => {
      const newId = generateGameId();
      return getDoc(doc(db, `cards/${newId}`)).then(existingGame => {
        if (!retries) {
          return Promise.reject(new Error('Too many retries generating game'));
        }
        if (!existingGame.data()) {
          gameId = newId;
          return setDoc(doc(db, `cards/${gameId}`), {
            cards: cardsToSet,
            createdAt: new Date().toISOString(),
          }).then(() => gameId);
        }
        return generateAndSetGameId(retries - 1);
      });
    };

    return generateAndSetGameId();
  };

  const gameExists = () =>
    getDoc(doc(db, `cards/${gameId}`))
      .then(snapshot => !!snapshot.data())
      .catch(err => {
        console.error(err);
        return false;
      });

  const onCardUpdates = fn => {
    if (cards) {
      // TODO: This is kinda wonky. Probably easier to remove `cards`
      // as an arg and just mock the whole API in tests
      Promise.resolve().then(() => {
        fn(null, toArray(cards));
      });
      return;
    }

    unsub = onSnapshot(
      doc(db, `cards/${gameId}`),
      snapshot => {
        if (!snapshot.data()) {
          fn(new Error(`Game ${gameId} does not exist`));
        }
        const { cards: newCards } = snapshot.data();
        const ordered = toArray(newCards);
        console.log(`new cards:`, ordered);
        fn(null, ordered);
      },
      err => {
        console.error(err);
        fn(err, null);
      }
    );
  };

  const close = () => unsub();

  const clickCard = card => {
    setDoc(
      doc(db, `cards/${gameId}`),
      { cards: { [card.word]: card } },
      { merge: true }
    );
  };

  return {
    init,
    close,
    onCardUpdates,
    gameExists,
    clickCard,
  };
};
