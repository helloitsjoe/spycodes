import { mount } from 'enzyme';
import React from 'react';
import App from '../app';
import Grid from '../components/grid';
import { colors } from '../boxes';

const { RED, BLUE, DEFAULT, BLACK } = colors;

describe('App', () => {
  it('spyMaster cards have colors', () => {
    window.__isSpymaster = true;
    const wrapper = mount(<App />);
    const cards = wrapper.find(Grid).props().children;
    expect(cards.some(card => card.props.color === RED)).toBe(true);
    expect(cards.some(card => card.props.color === BLUE)).toBe(true);
    expect(cards.some(card => card.props.color === DEFAULT)).toBe(true);
    expect(cards.filter(card => card.props.color === BLACK).length).toBe(1);
  });

  it('non-spyMaster cards have default colors', () => {
    window.__isSpymaster = null;
    const wrapper = mount(<App />);
    const cards = wrapper.find(Grid).props().children;
    cards.forEach(card => {
      expect(card.props.color).toBe(colors.DEFAULT);
    });
  });
});
