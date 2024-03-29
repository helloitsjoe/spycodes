import React from 'react';
import {
  screen,
  render,
  fireEvent,
  waitFor,
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
      clickCard() {},
      close: jest.fn(),
      init: jest.fn().mockResolvedValue(),
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

  it('fetches existing game if ID is submitted in form', async () => {
    window.location = new URL('http://localhost');
    window.location.assign = jest.fn();
    render(<App api={mockApi} />);
    fireEvent.change(screen.getByLabelText(/enter a game id to join/i), {
      target: { value: '123' },
    });
    fireEvent.submit(screen.getByText(/join game/i));

    const url = new URL('http://localhost/');
    url.searchParams.set('game', '123');

    await waitFor(() => {
      expect(window.location.assign).toBeCalledWith(url);
    });
    expect(mockApi.init).not.toBeCalled();
  });

  it('creates new game if no ID', async () => {
    window.location = new URL('http://localhost');
    window.location.assign = jest.fn();
    mockApi.init.mockResolvedValue('XYZ');
    render(<App api={mockApi} />);
    fireEvent.submit(screen.getByText(/start new game/i));

    const url = new URL('http://localhost/');
    url.searchParams.set('game', 'XYZ');

    await waitFor(() => {
      expect(window.location.assign).toBeCalledWith(url);
    });
    expect(mockApi.init).toBeCalled();
  });
});
