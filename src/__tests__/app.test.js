/* eslint-disable indent */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import Fallback from '../components/Fallback';
import Card from '../components/Card';
import { colors, makeCards } from '../cardData';
import { makeApi } from '../api';

jest.mock('firebase/firestore');
jest.mock('../firebase');

const { RED, BLUE, DEFAULT, BLACK, YELLOW } = colors;

describe('App', () => {
  describe('player', () => {
    it('loads cards', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { container, findByTestId } = render(
        <App api={makeApi(singleCard, null)} />
      );
      expect(container.textContent).toBe('Loading...');
      return findByTestId('card').then(card => {
        expect(card.textContent).toBe('POO');
      });
    });

    it('displays "No cards!" if no cards are fetched', () => {
      const { container, queryByTestId } = render(<App api={makeApi([])} />);
      return waitFor(() => {
        expect(container.textContent).toBe('No cards!');
        expect(queryByTestId('card')).toBe(null);
      });
    });

    it('displays "Error" if error while fetching', () => {
      const mockApi = {
        init() {},
        close() {},
        onCardUpdates: fn => fn(new Error('No!')),
        clickCard: () => {},
      };
      const { container, queryByTestId } = render(<App api={mockApi} />);
      return waitFor(() => {
        expect(container.textContent).toBe('Error! No!');
        expect(queryByTestId('card')).toBe(null);
      });
    });

    it('all cards have default colors', () => {
      const { findAllByTestId } = render(<App api={makeApi(makeCards())} />);
      return findAllByTestId('card').then(cards => {
        expect(cards.every(card => card.className.match('back default')));
      });
    });

    it('click reveals card color', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { findByText } = render(<App api={makeApi(singleCard)} />);
      return findByText('POO').then(card => {
        expect(card.className).toBe('card back default');
        fireEvent.click(card);
        expect(card.className).toBe('card front red');
        expect(card.textContent).toBe('POO');
      });
    });

    it('click plays flip animation', () => {
      const mockCards = [
        { color: RED, hidden: true, word: 'poo' },
        { color: BLUE, hidden: true, word: 'bloo' },
      ];
      const { findAllByTestId } = render(<App api={makeApi(mockCards)} />);
      return findAllByTestId('card').then(cards => {
        fireEvent.click(cards[0]);
        expect(cards[0].className).toMatch('front');
        expect(cards[1].className).not.toMatch('front');
      });
    });

    it('api.close is called on unmount', () => {
      const mockApi = {
        init: jest.fn(),
        close: jest.fn(),
        onCardUpdates: fn => fn(null, []),
        clickCard: () => {},
      };
      const { unmount } = render(<App api={mockApi} />);
      return waitFor(() => {
        expect(mockApi.close).toBeCalledTimes(0);
      }).then(() => {
        unmount();
        expect(mockApi.close).toBeCalledTimes(1);
      });
    });

    // TODO: Check that click updates other players if multiple devices
    it.todo('clicking New Game button initializes a new game');
    it.todo('shows remaining red and blue');
    it.todo('shows red wins message if no remaining red');
    it.todo('shows blue wins message if no remaining blue');
    it.todo('shows dead message if black card is revealed');
  });

  describe('spymaster', () => {
    it('cards have colors', () => {
      const { findAllByTestId } = render(
        <App api={makeApi(makeCards())} isSpymaster />
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
        <App api={makeApi(makeCards())} isSpymaster />
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
    description                               | props                              | text
    ${'loading is true by default'}           | ${{}}                              | ${'Loading...'}
    ${'loading state displays "Loading..."'}  | ${{ loading: true }}               | ${'Loading...'}
    ${'error state displays "Error! <Text>"'} | ${{ error: new Error('Blah') }}    | ${'Error! Blah'}
    ${'no cards displays "No cards!"'}        | ${{ loading: false, cards: [] }}   | ${'No cards!'}
    ${'unknown state displays message'}       | ${{ loading: false, cards: [{}] }} | ${'Something weird happened.'}
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

  it('renders color from prop if not hidden', () => {
    const { getByTestId } = render(<Card color={RED} hidden={false} />);
    expect(getByTestId('card').className).toMatch(RED);
    expect(getByTestId('card').textContent).toBe('');
  });

  it.todo('renders color for spymaster even if hidden');
  it.todo('renders border for spymaster if not hidden');
  it.todo('does not render border for non-spymaster if not hidden');
  it.todo('renders default color if hidden');

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
