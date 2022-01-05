import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Game from '../components/Game';
import Fallback from '../components/Fallback';
import Card from '../components/Card';
import { colors, makeCards } from '../cardData';
import { makeApi } from '../api';

jest.mock('firebase/firestore');
jest.mock('../firebase');

const { RED, BLUE, DEFAULT, BLACK, YELLOW } = colors;
const GAME_ID = 'ABCD';

describe('Game', () => {
  describe('player', () => {
    it('loads cards', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { container, findByTestId } = render(
        <Game api={makeApi(GAME_ID, singleCard, null)} gameId={GAME_ID} />
      );
      expect(container.textContent).toBe('Loading...');
      return findByTestId('card').then(card => {
        expect(card.textContent).toBe('POO');
      });
    });

    it('displays "No cards!" if no cards are fetched', () => {
      const { container, queryByTestId } = render(
        <Game api={makeApi(GAME_ID, [])} gameId={GAME_ID} />
      );
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
      const { container, queryByTestId } = render(
        <Game api={mockApi} gameId={GAME_ID} />
      );
      return waitFor(() => {
        expect(container.textContent).toBe('Error! No!');
        expect(queryByTestId('card')).toBe(null);
      });
    });

    it('all cards have default colors', () => {
      const { findAllByTestId } = render(
        <Game api={makeApi(GAME_ID, makeCards())} gameId={GAME_ID} />
      );
      return findAllByTestId('card').then(cards => {
        expect(cards.every(card => card.className.match('back default')));
      });
    });

    it('click reveals card color', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const { findByText } = render(
        <Game api={makeApi(GAME_ID, singleCard)} gameId={GAME_ID} />
      );
      return findByText('POO').then(card => {
        expect(card.className).toBe('card back');
        expect(card.dataset.color).toBe(DEFAULT);
        fireEvent.click(card);
        expect(card.className).toBe('card front');
        expect(card.dataset.color).toBe(RED);
        expect(card.textContent).toBe('POO');
      });
    });

    it('click plays flip animation', () => {
      const mockCards = [
        { color: RED, hidden: true, word: 'poo' },
        { color: BLUE, hidden: true, word: 'bloo' },
      ];
      const { findAllByTestId } = render(
        <Game api={makeApi(GAME_ID, mockCards)} gameId={GAME_ID} />
      );
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
      const { unmount } = render(<Game api={mockApi} gameId={GAME_ID} />);
      return waitFor(() => {
        expect(mockApi.close).toBeCalledTimes(0);
      }).then(() => {
        unmount();
        expect(mockApi.close).toBeCalledTimes(1);
      });
    });

    it('shows remaining red and blue', () => {
      const mockCards = [
        { color: RED, hidden: true, word: 'poo' },
        { color: BLUE, hidden: true, word: 'bloo' },
        { color: BLUE, hidden: true, word: 'froo' },
      ];
      render(<Game api={makeApi(GAME_ID, mockCards)} gameId={GAME_ID} />);
      return waitFor(() => {
        expect(screen.queryByText(/loading/i)).toBe(null);
      }).then(() => {
        expect(screen.getByText(/1 left/).dataset.color).toBe(RED);
        expect(screen.getByText(/2 left/).dataset.color).toBe(BLUE);
      });
    });

    it('shows red wins message if no remaining red', () => {
      const mockCards = [
        { color: RED, hidden: true, word: 'poo' },
        { color: BLUE, hidden: true, word: 'bloo' },
        { color: BLUE, hidden: true, word: 'froo' },
      ];
      render(<Game api={makeApi(GAME_ID, mockCards)} gameId={GAME_ID} />);
      return waitForElementToBeRemoved(() =>
        screen.queryByText(/loading/i)
      ).then(() => {
        expect(screen.queryByText(/red wins/i)).toBe(null);
        expect(screen.queryByText(/blue wins/i)).toBe(null);
        fireEvent.click(screen.getByText(/poo/i));
        expect(screen.queryByText(/red wins/i)).toBeTruthy();
        expect(screen.queryByText(/blue wins/i)).toBe(null);
      });
    });

    it('shows blue wins message if no remaining blue', () => {
      const mockCards = [
        { color: BLUE, hidden: true, word: 'poo' },
        { color: RED, hidden: true, word: 'bloo' },
        { color: RED, hidden: true, word: 'froo' },
      ];
      render(<Game api={makeApi(GAME_ID, mockCards)} gameId={GAME_ID} />);
      return waitForElementToBeRemoved(() =>
        screen.queryByText(/loading/i)
      ).then(() => {
        expect(screen.queryByText(/red wins/i)).toBe(null);
        expect(screen.queryByText(/blue wins/i)).toBe(null);
        fireEvent.click(screen.getByText(/poo/i));
        expect(screen.queryByText(/red wins/i)).toBe(null);
        expect(screen.queryByText(/blue wins/i)).toBeTruthy();
      });
    });

    it('shows dead message if black card is revealed', () => {
      const mockCards = [
        { color: BLUE, hidden: true, word: 'poo' },
        { color: RED, hidden: true, word: 'bloo' },
        { color: BLACK, hidden: true, word: 'ded' },
      ];
      render(<Game api={makeApi(GAME_ID, mockCards)} gameId={GAME_ID} />);
      return waitForElementToBeRemoved(() =>
        screen.queryByText(/loading/i)
      ).then(() => {
        expect(screen.queryByText(/dead/i)).toBe(null);
        fireEvent.click(screen.getByText(/ded/i));
        expect(screen.queryByText(/red wins/i)).toBe(null);
        expect(screen.queryByText(/blue wins/i)).toBe(null);
        expect(screen.queryByText(/dead/i)).toBeTruthy();
      });
    });

    // TODO: Check that click updates other players if multiple devices

    it('clicking New Game button initializes a new game', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const mockApi = {
        init: jest.fn(),
        close() {},
        onCardUpdates: fn => fn(null, singleCard),
        clickCard: () => {},
      };
      render(<Game api={mockApi} gameId={GAME_ID} />);
      expect(mockApi.init).not.toBeCalled();
      return screen.findByRole('button', { name: /new game/i }, button => {
        fireEvent.click(button);
        expect(mockApi.init).toBeCalled();
      });
    });
  });

  describe('spymaster', () => {
    it('cards have colors', () => {
      const { findAllByTestId } = render(
        <Game
          api={makeApi(GAME_ID, makeCards())}
          gameId={GAME_ID}
          isSpymaster
        />
      );
      return findAllByTestId('card').then(cards => {
        const matchesColor = color => card => card.dataset.color === color;
        expect(cards.some(matchesColor(RED))).toBe(true);
        expect(cards.some(matchesColor(BLUE))).toBe(true);
        expect(cards.some(matchesColor(YELLOW))).toBe(true);
        expect(cards.some(matchesColor(DEFAULT))).toBe(false);
        expect(cards.filter(matchesColor(BLACK)).length).toBe(1);
      });
    });

    it('clicking card does NOT hide it', () => {
      const { findAllByTestId } = render(
        <Game
          api={makeApi(GAME_ID, makeCards())}
          gameId={GAME_ID}
          isSpymaster
        />
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
  const baseProps = {
    color: RED,
    hidden: true,
    isSpymaster: false,
    word: 'apple',
  };

  it('handles click', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick} />);
    expect(onClick).toBeCalledTimes(0);
    fireEvent.click(screen.getByTestId('card'));
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders uppercase word from prop', () => {
    render(<Card {...baseProps} />);
    expect(screen.getByTestId('card').textContent).toMatch('APPLE');
  });

  it('renders default color if hidden', () => {
    render(<Card {...baseProps} />);
    expect(screen.getByTestId('card').dataset.color).toBe(colors.DEFAULT);
  });

  it('renders color from prop if not hidden', () => {
    render(<Card {...baseProps} hidden={false} />);
    expect(screen.getByTestId('card').dataset.color).toBe(colors.RED);
  });

  it('renders color for spymaster even if hidden', () => {
    render(<Card {...baseProps} hidden isSpymaster />);
    expect(screen.getByTestId('card').dataset.color).toBe(colors.RED);
  });

  it('renders as "seen" for spymaster if not hidden', () => {
    render(<Card {...baseProps} hidden={false} isSpymaster />);
    expect(screen.getByTestId('card').className).toMatch('seen');
  });

  it('does not render as "seen" for spymaster if hidden', () => {
    render(<Card {...baseProps} hidden isSpymaster />);
    expect(screen.getByTestId('card').className).not.toMatch('seen');
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
