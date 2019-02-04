import importedWords from '../resources/words';

// const copiedWords = importedWords.slice();
const compose = (...args) => data => args.reduce((acc, fn) => fn(acc), data);

export const colors = {
  RED: '#f55',
  BLUE: '#69d',
  BLACK: '#000',
  WHITE: '#fff',
  DEFAULT: '#888',
};

const LENGTH = 25;

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const withColors = ({ boxes }, chance = Math.random()) => {
  const colorDistribution = {
    red: chance < 0.5 ? 8 : 9,
    blue: chance >= 0.5 ? 8 : 9,
    black: 1,
  };

  const colored = boxes.map((box, i) => {
    const { red, blue, black } = colorDistribution;
    const color =
      i < red
        ? colors.RED
        : i < red + blue
        ? colors.BLUE
        : i === boxes.length - 1
        ? colors.BLACK
        : colors.DEFAULT;

    return { ...box, color };
  });
  return { boxes: shuffle(colored) };
};

export const withWords = ({ boxes }) => {
  const words = shuffle([...importedWords]);
  const worded = boxes.map((box, i) => {
    return { ...box, word: words.pop() };
  });
  return { boxes: shuffle(worded) };
};

export const getBoxes = (length = LENGTH) => {
  const composed = compose(
    withColors,
    withWords
  )({ boxes: Array(length).fill({}) });

  return composed.boxes;
};
