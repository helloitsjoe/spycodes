import { mount, shallow } from 'enzyme';
import React from 'react';
import waitForExpect from 'wait-for-expect';
import App, { Fallback } from '../app';
import Grid from '../components/grid';
import Card from '../components/card';
import { colors, makeCards } from '../../server/cardData';
import SocketAPI from '../socket';

const { RED, BLUE, DEFAULT, BLACK, YELLOW } = colors;

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

describe('App', () => {
  describe('player', () => {
    it('loads cards', () => {
      const wrapper = mount(<App socketAPI={new SocketAPI(makeCards())} />);
      expect(wrapper.text()).toBe('Loading...');
      expect(wrapper.find(Card).exists()).toBe(false);
      return waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find(Card).exists()).toBe(true);
      });
    });

    it('displays "No cards!" if no cards are fetched', () => {
      const wrapper = mount(<App socketAPI={new SocketAPI([])} />);
      expect(wrapper.text()).toBe('Loading...');
      expect(wrapper.find(Card).exists()).toBe(false);
      return waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find(Card).exists()).toBe(false);
        expect(wrapper.text()).toBe('No cards!');
      });
    });

    it('displays "Error" if error while fetching', () => {
      const mockSocket = { getCards: () => Promise.reject(new Error('No!')) };
      const wrapper = mount(<App socketAPI={mockSocket} />);
      expect(wrapper.text()).toBe('Loading...');
      expect(wrapper.find(Card).exists()).toBe(false);
      return waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find(Card).exists()).toBe(false);
        expect(wrapper.text()).toBe('Error! No!');
      });
    });

    it('all cards have default colors', () => {
      const wrapper = shallow(<App socketAPI={new SocketAPI(makeCards())} />);
      const cards = wrapper.update().find(Card);
      cards.forEach(card => {
        expect(card.props().color).toBe(colors.DEFAULT);
      });
    });

    it('click reveals card color, hides word', () => {
      const singleCard = [{ color: RED, hidden: true, word: 'poo' }];
      const wrapper = mount(<App socketAPI={new SocketAPI(singleCard)} />);
      return waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find(Card).exists()).toBe(true);
      }).then(() => {
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
      const wrapper = mount(<App socketAPI={new SocketAPI(cards)} />);
      return waitForExpect(() => {
        wrapper.update();
        expect(wrapper.find(Card).exists()).toBe(true);
      }).then(() => {
        wrapper
          .find(Card)
          .at(0)
          .simulate('click');
        const cardsAfterClick = wrapper.find(Card);
        expect(cardsAfterClick.at(0).html()).toMatch('front');
        expect(cardsAfterClick.at(1).html()).not.toMatch('front');
      });
    });

    it('socket is closed on unmount', () => {
      const mockSocket = { close: jest.fn(), getCards: jest.fn(() => Promise.resolve()) };
      const wrapper = mount(<App socketAPI={mockSocket} />);
      expect(mockSocket.close).toBeCalledTimes(0);
      wrapper.unmount();
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

describe('Fallback', () => {
  it('loading is true by default', () => {
    const wrapper = shallow(<Fallback />);
    expect(wrapper.text()).toBe('Loading...');
  });

  it('loading state displays "Loading..."', () => {
    const wrapper = shallow(<Fallback loading />);
    expect(wrapper.text()).toBe('Loading...');
  });

  it('error state displays "Error! <Text>"', () => {
    const error = new Error('Blah');
    const wrapper = shallow(<Fallback loading={false} error={error} />);
    expect(wrapper.text()).toBe('Error! Blah');
  });

  it('no cards displays "No cards!"', () => {
    const wrapper = shallow(<Fallback loading={false} cards={[]} />);
    expect(wrapper.text()).toBe('No cards!');
  });

  it('no cards displays "No cards!"', () => {
    const wrapper = shallow(<Fallback loading={false} cards={[1]} />);
    expect(wrapper.text()).toBe('Something weird happened.');
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
