/* eslint-disable import/prefer-default-export */
import {
  getFirestore,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import firebaseApp from './firebase';
import { makeCards } from './cardData';

export const makeApi = (app = firebaseApp) => {
  const db = getFirestore(app);
  let unsub = null;

  const init = (cards = makeCards()) => {
    return new Promise((resolve, reject) => {
      // TODO: Handle more than one game
      // Generate cards, set in db
      console.log(`setting cards:`, cards);
      setDoc(doc(db, `cards/current`), cards);
      unsub = onSnapshot(
        doc(db, 'cards/current'),
        newCards => {
          console.log(`new cards:`, newCards);
        },
        err => {
          console.error(err);
          reject(err);
        }
      );
      resolve(cards);
    });
  };

  const getCards = () => {
    // Fetch dirty bit, if changed fetch cards
    // Or looks like onSnapshot handles realtime updates? Might not need this function
    // return getDocs(doc(db, 'cards/current')).then(snapshot => {
    //   console.log(`snapshot:`, snapshot);
    //   const cards = snapshot.docs;
    //   console.log('fetched', cards);
    //   return cards;
    // });

    return new Promise((resolve, reject) => {
      unsub = onSnapshot(
        doc(db, 'cards/current'),
        newCards => {
          console.log(`new cards:`, newCards.data());
          resolve(newCards.data());
        },
        err => {
          console.error(err);
          reject(err);
        }
      );
    });
  };

  const close = () => {
    unsub();
  };

  const clickCard = card => {
    console.log(`clicked:`, card);
    setDoc(doc(db, `cards/current`), { [card.word]: card }, { merge: true });
  };

  return {
    init,
    close,
    getCards,
    clickCard,
  };
};
