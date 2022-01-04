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

const generateGameId = () => {
  const getRandomCap = () =>
    String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
  return `${getRandomCap()}${getRandomCap()}${getRandomCap()}${getRandomCap()}`;
};

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
  // This could get a bit tricky setting initialGameId here but
  // checking for existence separately. TODO: Revisit this.
  let gameId = initialGameId?.toUpperCase();

  const init = () => {
    if (cards) {
      return Promise.resolve();
    }

    const cardsToSet = makeCards();

    if (!gameId) {
      const generateAndSetGameId = (retries = 5) => {
        const newId = generateGameId();
        return getDoc(doc(db, `cards/${newId}`)).then(existingGame => {
          console.log(`existingGameId:`, existingGame.data());
          if (!retries) {
            return Promise.reject(
              new Error('Too many retries generating game')
            );
          }
          if (!existingGame.data()) {
            gameId = newId;
            // TODO: Add dateCreated for cleanup
            return setDoc(doc(db, `cards/${gameId}`), cardsToSet).then(
              () => gameId
            );
          }
          return generateAndSetGameId(retries - 1);
        });
      };

      return generateAndSetGameId();
    }

    console.log(`setting cards:`, cardsToSet);
    return setDoc(doc(db, `cards/${gameId}`), cardsToSet);
    // Create ID, check for it
  };

  const gameExists = id => {
    return getDoc(doc(db, `cards/${id}`));
  };

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
      newCards => {
        if (!newCards.data()) {
          fn(new Error(`Game ${gameId} does not exist`));
        }
        const ordered = toArray(newCards.data());
        console.log(`new cards:`, ordered);
        fn(null, ordered);
      },
      err => {
        console.error(err);
        fn(err, null);
      }
    );
  };

  const close = () => {
    unsub();
  };

  const clickCard = card => {
    setDoc(doc(db, `cards/${gameId}`), { [card.word]: card }, { merge: true });
  };

  return {
    init,
    close,
    onCardUpdates,
    gameExists,
    clickCard,
  };
};
