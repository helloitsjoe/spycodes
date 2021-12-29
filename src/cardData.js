const { many } = require('../resources/words.json');

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
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const toArray = data => {
  return Object.values(data).sort((a, b) => (a.word > b.word ? 1 : -1));
};

const toObject = data => {
  return data.reduce((acc, curr) => {
    acc[curr.word] = curr;
    return acc;
  }, {});
};

const withColors = ({ cards, chance = Math.random() }) => {
  const colorDistribution = {
    red: chance < 0.5 ? 8 : 9,
    blue: chance >= 0.5 ? 8 : 9,
    black: 1,
  };

  const colored = cards.map((box, i) => {
    const { red, blue } = colorDistribution;
    const color = (() => {
      if (i < red) return colors.RED;
      if (i < red + blue) return colors.BLUE;
      if (i === cards.length - 1) return colors.BLACK;
      return colors.YELLOW;
    })();

    return { ...box, color };
  });
  return { cards: shuffle(colored) };
};

const withWords = ({ cards }) => {
  const words = shuffle([...many]);
  const worded = cards.map(box => ({ ...box, word: words.pop() }));
  return { cards: shuffle(worded) };
};

const makeCards = (length = LENGTH) => {
  const composed = compose(
    withColors,
    withWords
  )({ cards: Array(length).fill({ hidden: true }) });

  return toObject(composed.cards);
};

module.exports = {
  colors,
  toArray,
  toObject,
  withWords,
  withColors,
  makeCards,
};
