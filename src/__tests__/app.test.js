import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('firebase/firestore');
jest.mock('../firebase');

describe('App', () => {
  it.todo('shows game if ID is in URL');
  it.todo('shows form if ID is NOT in URL');
  it.todo('fetches existing game if ID is in URL');
  it.todo('fetches existing game if ID is submitted in form');
  it.todo('creates new game if no ID');
});
