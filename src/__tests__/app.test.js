/* eslint-disable indent */
import React from 'react';
import { render, cleanup, fireEvent, wait } from '@testing-library/react';
import App, { Fallback } from '../app';
import Card from '../components/card';
import { colors, makeCards } from '../../server/cardData';
import SocketAPI from '../socket';

const { RED, BLUE, DEFAULT, BLACK, YELLOW } = colors;

afterEach(cleanup);

describe('App', () => {
  describe('player', () => {
    it('loads cards', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { container, findByTestId } = render(
        <App socketAPI={new SocketAPI(singleCard)} />
      );
      expect(container.textContent).toBe('Loading...');
      return findByTestId('card').then(card => {
        expect(card.textContent).toBe('POO');
      });
    });

    it('displays "No cards!" if no cards are fetched', () => {
      const { container, queryByTestId } = render(
        <App socketAPI={new SocketAPI([])} />
      );
      return wait(() => {
        expect(container.textContent).toBe('No cards!');
        expect(queryByTestId('card')).toBe(null);
      });
    });

    it('displays "Error" if error while fetching', () => {
      const mockSocket = {
        close() {},
        getCards: () => Promise.reject(new Error('No!')),
      };
      const { container, queryByTestId } = render(
        <App socketAPI={mockSocket} />
      );
      return wait(() => {
        expect(container.textContent).toBe('Error! No!');
        expect(queryByTestId('card')).toBe(null);
      });
    });

    it('all cards have default colors', () => {
      const socket = new SocketAPI(makeCards());
      const { findAllByTestId } = render(<App socketAPI={socket} />);
      return findAllByTestId('card').then(cards => {
        expect(cards.every(card => card.className.match('back default')));
      });
    });

    it('click reveals card color, hides word', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const socket = new SocketAPI(singleCard);
      const { findByText } = render(<App socketAPI={socket} />);
      return findByText('POO').then(card => {
        expect(card.className).toBe('card back default');
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
      const socket = new SocketAPI(mockCards);
      const { findAllByTestId } = render(<App socketAPI={socket} />);
      return findAllByTestId('card').then(cards => {
        fireEvent.click(cards[0]);
        expect(cards[0].className).toMatch('front');
        expect(cards[1].className).not.toMatch('front');
      });
    });

    it('socket is closed on unmount', () => {
      const mockSocket = {
        close: jest.fn(),
        getCards: jest.fn(() => Promise.resolve()),
      };
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
      const { findAllByTestId } = render(
        <App socketAPI={new SocketAPI(makeCards())} />
      );
      return findAllByTestId('card').then(cards => {
        const matchesColor = color => card => card.className.match(color);
        expect(cards.some(matchesColor(RED))).toBe(true);
        expect(cards.some(matchesColor(BLUE))).toBe(true);
        expect(cards.some(matchesColor(YELLOW))).toBe(true);
        expect(cards.some(matchesColor(DEFAULT))).toBe(false);
        expect(cards.filter(matchesColor(BLACK)).length).toBe(1);
      });
    });

    it('clicking card does NOT hide it', () => {
      const { findAllByTestId } = render(
        <App socketAPI={new SocketAPI(makeCards())} />
      );
      return findAllByTestId('card').then(([firstCard]) => {
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
  it.each`
    description                               | props                             | text
    ${'loading is true by default'}           | ${{}}                             | ${'Loading...'}
    ${'loading state displays "Loading..."'}  | ${{ loading: true }}              | ${'Loading...'}
    ${'error state displays "Error! <Text>"'} | ${{ error: new Error('Blah') }}   | ${'Error! Blah'}
    ${'no cards displays "No cards!"'}        | ${{ loading: false, cards: [] }}  | ${'No cards!'}
    ${'unknown state displays message'}       | ${{ loading: false, cards: [1] }} | ${'Something weird happened.'}
  `('$description', ({ props, text }) => {
    const { container } = render(<Fallback {...props} />);
    expect(container.textContent).toBe(text);
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
