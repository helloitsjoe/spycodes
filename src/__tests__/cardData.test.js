const { withColors, withWords, makeCards, colors } = require('../cardData');

const { RED, BLUE, BLACK, DEFAULT, YELLOW } = colors;

const base = Array(25).fill({});

describe('withColors', () => {
  it('adds colors', () => {
    const { cards } = withColors({ cards: base });
    expect(cards).toMatchObject(base);
    expect(cards.every((card) => card.hasOwnProperty('color')));
  });

  it.each`
    description               | red  | blue | chance
    ${'< 0.5 blue gets more'} | ${8} | ${9} | ${0.49}
    ${'> 0.5 red gets more'}  | ${9} | ${8} | ${0.51}
    ${'0.5 red gets more'}    | ${9} | ${8} | ${0.5}
  `('$description', ({ red, blue, chance }) => {
    const { cards } = withColors({ cards: base, chance });
    expect(cards.filter(({ color }) => color === RED).length).toBe(red);
    expect(cards.filter(({ color }) => color === BLUE).length).toBe(blue);
    expect(cards.filter(({ color }) => color === BLACK).length).toBe(1);
    expect(cards.filter(({ color }) => color === YELLOW).length).toBe(7);
    expect(cards.filter(({ color }) => color === DEFAULT).length).toBe(0);
  });

  it('shuffles cards', () => {
    const { cards } = withColors({ cards: base });
    const { cards: cardsTwo } = withColors({ cards });
    expect(cards).not.toEqual(cardsTwo);
    cards.every((card) => cardsTwo.includes(card));
  });
});

describe('withWords', () => {
  it('adds words', () => {
    const { cards } = withWords({ cards: base });
    expect(cards).toMatchObject(base);
    expect(cards.every((card) => card.hasOwnProperty('word'))).toBe(true);
    expect(cards.some((card) => card.word == null)).toBe(false);
  });
});

describe('withCards', () => {
  it('adds words and colors', () => {
    const cardsEntries = Object.entries(makeCards());
    cardsEntries.forEach(([key, value]) => {
      expect(key).toBe(value.word);
      expect(value.word).toEqual(expect.any(String));
      expect(value.color).toEqual(expect.any(String));
      expect(value.hidden).toBe(true);
    });
  });
});
