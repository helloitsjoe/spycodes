import React from 'react';
import { render, cleanup, findAllByTestId, findByTestId, fireEvent } from '@testing-library/react';
import waitForExpect from 'wait-for-expect';
import App, { Fallback } from '../app';
import Grid from '../components/grid';
import Card from '../components/card';
import { colors, makeCards } from '../../server/cardData';
import SocketAPI from '../socket';

const { RED, BLUE, DEFAULT, BLACK, YELLOW } = colors;

afterEach(cleanup);

describe('App', () => {
  describe('player', () => {
    it('loads cards', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { container, getByTestId } = render(<App socketAPI={new SocketAPI(singleCard)} />);
      expect(container.textContent).toBe('Loading...');
      return waitForExpect(() => {
        expect(getByTestId('card').textContent).toBe('POO');
      });
    });

    it('displays "No cards!" if no cards are fetched', () => {
      const { container, queryByTestId } = render(<App socketAPI={new SocketAPI([])} />);
      return waitForExpect(() => {
        expect(container.textContent).toBe('No cards!');
        expect(queryByTestId('card')).toBe(null);
      });
    });

    it('displays "Error" if error while fetching', () => {
      const mockSocket = { close() {}, getCards: () => Promise.reject(new Error('No!')) };
      const { container, queryByTestId } = render(<App socketAPI={mockSocket} />);
      return waitForExpect(() => {
        expect(queryByTestId('card')).toBe(null);
        expect(container.textContent).toBe('Error! No!');
      });
    });

    it('all cards have default colors', () => {
      const { container } = render(<App socketAPI={new SocketAPI(makeCards())} />);
      return findAllByTestId(container, 'card').then(cards => {
        cards.forEach(card => {
          expect(card.className).toBe('card back default');
        });
      });
    });

    it('click reveals card color, hides word', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { container } = render(<App socketAPI={new SocketAPI(singleCard)} />);
      return findByTestId(container, 'card').then(card => {
        expect(card.className).toBe('card back default');
        expect(card.textContent).toBe('POO');
        fireEvent.click(card);
        expect(card.className).toBe('card front red');
        expect(card.textContent).toBe('');
      });
    });

    it('click plays flip animation', () => {
      const mockCards = [
        { color: RED, hidden: true, word: 'poo' },
        { color: BLUE, hidden: true, word: 'bloo' },
      ];
      const { container } = render(<App socketAPI={new SocketAPI(mockCards)} />);
      return findAllByTestId(container, 'card').then(cards => {
        fireEvent.click(cards[0]);
        expect(cards[0].className).toMatch('front');
        expect(cards[1].className).not.toMatch('front');
      });
    });

    it('socket is closed on unmount', () => {
      const mockSocket = { close: jest.fn(), getCards: jest.fn(() => Promise.resolve()) };
      const { unmount } = render(<App socketAPI={mockSocket} />);
      expect(mockSocket.close).toBeCalledTimes(0);
      unmount();
      expect(mockSocket.close).toBeCalledTimes(1);
    });

    // TODO: Check that click updates other players if multiple devices
  });

  describe('spymaster', () => {
    beforeEach(() => {
      window.__isSpymaster = true;
    });

    afterEach(() => {
      window.__isSpymaster = false;
    });

    it('cards have colors', () => {
      const { container, queryAllByTestId } = render(
        <App socketAPI={new SocketAPI(makeCards())} />
      );
      return findByTestId(container, 'grid').then(() => {
        const cards = queryAllByTestId('card');
        expect(cards.some(card => card.className.match(RED))).toBe(true);
        expect(cards.some(card => card.className.match(BLUE))).toBe(true);
        expect(cards.some(card => card.className.match(YELLOW))).toBe(true);
        expect(cards.some(card => card.className.match(DEFAULT))).toBe(false);
        expect(cards.filter(card => card.className.match(BLACK)).length).toBe(1);
      });
    });

    it('clicking card does NOT hide it', () => {
      const { container, queryAllByTestId } = render(
        <App socketAPI={new SocketAPI(makeCards())} />
      );
      return findByTestId(container, 'grid').then(() => {
        const [firstCard] = queryAllByTestId('card');
        expect(firstCard.className).not.toMatch(DEFAULT);
        expect(firstCard.textContent).not.toBe('');
        fireEvent.click(firstCard);
        expect(firstCard.className).not.toMatch(DEFAULT);
        expect(firstCard.textContent).not.toBe('');
      });
    });
  });
});

describe('Fallback', () => {
  it('loading is true by default', () => {
    const { container } = render(<Fallback />);
    expect(container.textContent).toBe('Loading...');
  });

  it('loading state displays "Loading..."', () => {
    const { container } = render(<Fallback loading />);
    expect(container.textContent).toBe('Loading...');
  });

  it('error state displays "Error! <Text>"', () => {
    const error = new Error('Blah');
    const { container } = render(<Fallback loading={false} error={error} />);
    expect(container.textContent).toBe('Error! Blah');
  });

  it('no cards displays "No cards!"', () => {
    const { container } = render(<Fallback loading={false} cards={[]} />);
    expect(container.textContent).toBe('No cards!');
  });

  it('no cards displays "No cards!"', () => {
    const { container } = render(<Fallback loading={false} cards={[1]} />);
    expect(container.textContent).toBe('Something weird happened.');
  });
});

describe('Card', () => {
  it('handles click', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<Card onClick={onClick} />);
    expect(onClick).toBeCalledTimes(0);
    fireEvent.click(getByTestId('card'));
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders color from prop', () => {
    const { getByTestId } = render(<Card color={RED} />);
    expect(getByTestId('card').className).toMatch(RED);
    expect(getByTestId('card').textContent).toBe('');
  });

  it('renders uppercase word from prop', () => {
    const { getByTestId } = render(<Card word="poo" />);
    expect(getByTestId('card').textContent).toMatch('POO');
  });

  // it('renders text full size at width >= 400px', () => {
  //   window.innerWidth = 400;
  //   const {container} = render(<Card word="poo" />);
  //   expect(wrapper.html()).toMatch('font-size:1rem');
  // });

  // it('renders text half size at width < 400px', () => {
  //   window.innerWidth = 399;
  //   const {container} = render(<Card word="poo" />);
  //   expect(wrapper.html()).toMatch('font-size:0.5rem');
  // });
});
