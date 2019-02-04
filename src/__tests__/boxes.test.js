import { withColors, withWords, getBoxes, colors } from '../boxes';
const { RED, BLUE, BLACK, DEFAULT } = colors;

const base = Array(25).fill({});

describe('withColors', () => {
  it('adds colors', () => {
    const { boxes } = withColors({ boxes: base });
    expect(boxes).toMatchObject(base);
    expect(boxes.every(box => box.hasOwnProperty('color')));
  });

  it.each`
    description               | red  | blue | chance
    ${'< 0.5 blue gets more'} | ${8} | ${9} | ${0.49}
    ${'> 0.5 red gets more'}  | ${9} | ${8} | ${0.51}
    ${'0.5 red gets more'}    | ${9} | ${8} | ${0.5}
  `('$description', ({ red, blue, chance }) => {
    const { boxes } = withColors({ boxes: base }, chance);
    expect(boxes.filter(({ color }) => color === RED).length).toBe(red);
    expect(boxes.filter(({ color }) => color === BLUE).length).toBe(blue);
    expect(boxes.filter(({ color }) => color === BLACK).length).toBe(1);
    expect(boxes.filter(({ color }) => color === DEFAULT).length).toBe(7);
  });

  it('shuffles boxes', () => {
    const { boxes } = withColors({ boxes: base });
    const { boxes: boxesTwo } = withColors({ boxes: boxes });
    expect(boxes).not.toEqual(boxesTwo);
    boxes.every(box => boxesTwo.includes(box));
  });
});

describe('withWords', () => {
  it('adds words', () => {
    const { boxes } = withWords({ boxes: base });
    expect(boxes).toMatchObject(base);
    expect(boxes.every(box => box.hasOwnProperty('word'))).toBe(true);
    expect(boxes.some(box => box.word == null)).toBe(false);
  });
});

describe('withBoxes', () => {
  it('adds words and colors', () => {
    const boxes = getBoxes();
    expect(boxes).toMatchObject(base);
    expect(boxes.every(box => box.hasOwnProperty('color')));
    expect(boxes.every(box => box.hasOwnProperty('word')));
  });
});
