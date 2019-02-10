import { mount, shallow } from 'enzyme';
import React from 'react';
import App from '../app';
import Grid from '../components/grid';
import Card from '../components/card';
import { colors } from '../boxes';
import CardContainer from '../components/cardContainer';

const { RED, BLUE, DEFAULT, BLACK } = colors;

describe('App', () => {
  describe('player', () => {
    beforeEach(() => {
      window.__isSpymaster = null;
    });

    it('all cards have default colors', () => {
      const wrapper = shallow(<App />);
      const cards = wrapper.find(Card);
      cards.forEach(card => {
        expect(card.props().color).toBe(colors.DEFAULT);
      });
    });

    it('click reveals card color', () => {
      const wrapper = shallow(
        <CardContainer color={colors.RED}>test</CardContainer>
      );
      expect(wrapper.find(Card).props().color).toBe(colors.DEFAULT);
      wrapper.simulate('click');
      expect(wrapper.find(Card).props().color).toBe(colors.RED);
    });

    // TODO: Check that click updates other players if multiple devices
  });

  describe('spymaster', () => {
    it('cards have colors', () => {
      window.__isSpymaster = true;
      const wrapper = mount(<App />);
      const cards = wrapper.find(Grid).props().children;
      expect(cards.some(card => card.props.color === RED)).toBe(true);
      expect(cards.some(card => card.props.color === BLUE)).toBe(true);
      expect(cards.some(card => card.props.color === DEFAULT)).toBe(true);
      expect(cards.filter(card => card.props.color === BLACK).length).toBe(1);
    });
  });
});

describe('Card', () => {
  it('handles click', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Card onClick={onClick}>test</Card>);
    expect(onClick).toBeCalledTimes(0);
    wrapper.simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders color from prop', () => {
    const wrapper = shallow(<Card color={RED}>test</Card>);
    expect(wrapper.html()).toMatch(RED);
  });
});
