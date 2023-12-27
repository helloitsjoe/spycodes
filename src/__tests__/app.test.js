import React from 'react';
import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { makeCards, toArray } from '../cardData';
import App from '../App';

jest.mock('firebase/firestore');
jest.mock('../firebase');

describe('App', () => {
  let originalLocation;
  let mockApi;

  beforeEach(() => {
    originalLocation = window.location;
    delete window.location;

    mockApi = {
      init() {},
      clickCard() {},
      close: jest.fn(),
      gameExists: jest.fn().mockResolvedValue(true),
      onCardUpdates: (fn) => fn(null, toArray(makeCards())),
    };
  });

  afterEach(() => {
    window.location = originalLocation;
    jest.clearAllMocks();
  });

  it('shows game if ID is in URL', async () => {
    window.location = new URL('http://localhost?game=123');
    render(<App api={mockApi} />);
    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));
    expect(screen.getByText(/game id: 123/i)).toBeTruthy();
  });

  it('shows form if ID is NOT in URL', async () => {
    window.location = new URL('http://localhost');
    render(<App api={mockApi} />);
    expect(screen.getByLabelText(/enter a game id to join/i)).toBeTruthy();
  });

  it('fetches existing game if ID is in URL', async () => {
    window.location = new URL('http://localhost?game=123');
    render(<App api={mockApi} />);
    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));
    expect(screen.getByText(/game id: 123/i)).toBeTruthy();
  });

  it.todo('fetches existing game if ID is submitted in form');
  it.todo('creates new game if no ID');
});
