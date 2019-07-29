/* eslint-disable */
const importedWords = require('../resources/words');

const compose = (...args) => data => args.reduce((acc, fn) => fn(acc), data);

const colors = {
  RED: 'red',
  BLUE: 'blue',
  BLACK: 'black',
  WHITE: 'white',
  YELLOW: 'yellow',
  DEFAULT: 'default',
};

const LENGTH = 25;

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const withColors = ({ cards, chance = Math.random() }) => {
  const colorDistribution = {
    red: chance < 0.5 ? 8 : 9,
    blue: chance >= 0.5 ? 8 : 9,
    black: 1,
  };

  const colored = cards.map((box, i) => {
    const { red, blue } = colorDistribution;
    const color =
      i < red
        ? colors.RED
        : i < red + blue
        ? colors.BLUE
        : i === cards.length - 1
        ? colors.BLACK
        : colors.YELLOW;

    return { ...box, color };
  });
  return { cards: shuffle(colored) };
};

const withWords = ({ cards }) => {
  const words = shuffle([...importedWords]);
  const worded = cards.map((box, i) => ({ ...box, word: words.pop() }));
  return { cards: shuffle(worded) };
};

const makeCards = (length = LENGTH) => {
  const composed = compose(
    withColors,
    withWords
  )({ cards: Array(length).fill({}) });

  return composed.cards;
};

module.exports = {
  colors,
  withWords,
  withColors,
  makeCards,
};
