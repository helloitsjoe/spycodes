/* eslint-disable import/prefer-default-export */
import { getFirestore, onSnapshot, setDoc, doc } from 'firebase/firestore';
import firebaseApp from './firebase';
import { makeCards, toArray } from './cardData';

export const makeApi = (gameId, cards, db = getFirestore(firebaseApp)) => {
  let unsub = () => {};

  const init = () => {
    if (cards) {
      return Promise.resolve();
    }
    // TODO: Handle more than one game
    const cardsToSet = makeCards();
    console.log(`setting cards:`, cardsToSet);
    return setDoc(doc(db, `cards/${gameId}`), cardsToSet);
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
    clickCard,
  };
};
