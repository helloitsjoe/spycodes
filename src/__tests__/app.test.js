import { mount, shallow } from 'enzyme';
import React from 'react';
import App from '../app';
import Grid from '../components/grid';
import Card from '../components/card';
import { colors, makeCards } from '../../server/cardData';
import SocketAPI from '../socket';

const { RED, BLUE, DEFAULT, BLACK, YELLOW } = colors;

const wait = () => new Promise(resolve => setTimeout(resolve, 0));

describe('App', () => {
  describe('player', () => {
    it('all cards have default colors', () => {
      const wrapper = shallow(<App initialCards={makeCards()} />);
      const cards = wrapper.update().find(Card);
      cards.forEach(card => {
        expect(card.props().color).toBe(colors.DEFAULT);
      });
    });

    it('click reveals card color, hides word', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const wrapper = shallow(<App socketAPI={new SocketAPI(singleCard)} />);
      return wait().then(() => {
        const card = wrapper.find(Card);
        expect(card.props().color).toBe(colors.DEFAULT);
        expect(card.props().word).toBe('poo');
        wrapper.find(Card).simulate('click');
        expect(wrapper.find(Card).props().color).toBe(colors.RED);
        expect(wrapper.find(Card).props().word).toBe('');
      });
    });

    it('click plays flip animation', () => {
      const cards = [
        { color: RED, hidden: true, word: 'poo' },
        { color: BLUE, hidden: true, word: 'bloo' },
      ];
      const wrapper = shallow(<App socketAPI={new SocketAPI(cards)} />);
      return wait().then(() => {
        wrapper
          .find(Card)
          .at(0)
          .simulate('click');
        const cardsAfterClick = wrapper.find(Card);
        expect(cardsAfterClick.at(0).html()).toMatch('front');
        expect(cardsAfterClick.at(1).html()).not.toMatch('front');
      });
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
      const wrapper = mount(<App socketAPI={new SocketAPI(makeCards())} />);
      return wait().then(() => {
        const grid = wrapper.update().find(Grid);
        const cards = grid.props().children;
        expect(cards.some(card => card.props.color === RED)).toBe(true);
        expect(cards.some(card => card.props.color === BLUE)).toBe(true);
        expect(cards.some(card => card.props.color === YELLOW)).toBe(true);
        expect(cards.some(card => card.props.color === DEFAULT)).toBe(false);
        expect(cards.filter(card => card.props.color === BLACK).length).toBe(1);
      });
    });

    it('clicking card does NOT hide it', () => {
      const wrapper = mount(<App socketAPI={new SocketAPI(makeCards())} />);
      return wait().then(() => {
        wrapper.update();
        const firstCard = wrapper.find(Card).at(0);
        const { color, word } = firstCard.props();
        expect(color).not.toBe(DEFAULT);
        expect(word).not.toBe('');
        firstCard.simulate('click');
        const firstCardClicked = wrapper.find(Card).at(0);
        expect(firstCardClicked.props().color).toBe(color);
        expect(firstCardClicked.props().word).toBe(word);
      });
    });
  });
});

describe('Card', () => {
  it('handles click', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Card onClick={onClick} />);
    expect(onClick).toBeCalledTimes(0);
    wrapper.simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders color from prop', () => {
    const wrapper = shallow(<Card color={RED} />);
    expect(wrapper.html()).toMatch(RED);
    expect(wrapper.text()).toBe('');
  });

  it('renders uppercase word from prop', () => {
    const wrapper = shallow(<Card word="poo" />);
    expect(wrapper.text()).toMatch('POO');
  });

  // it('renders text full size at width >= 400px', () => {
  //   window.innerWidth = 400;
  //   const wrapper = shallow(<Card word="poo" />);
  //   expect(wrapper.html()).toMatch('font-size:1rem');
  // });

  // it('renders text half size at width < 400px', () => {
  //   window.innerWidth = 399;
  //   const wrapper = shallow(<Card word="poo" />);
  //   expect(wrapper.html()).toMatch('font-size:0.5rem');
  // });
});
