import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from './components/grid';
import Card from './components/card';
import { colors } from '../server/cardData';
import Socket from './socket';

class App extends Component {
  isSpymaster = window && window.__isSpymaster;

  state = {
    cards: [],
  };

  static propTypes = {
    socket: PropTypes.shape(Socket),
    initialCards: PropTypes.arrayOf(
      PropTypes.shape({ color: PropTypes.string, word: PropTypes.string })
    ),
  };

  static defaultProps = {
    socket: null,
    initialCards: [],
  };

  componentDidMount() {
    const { socket, initialCards } = this.props;
    if (socket) {
      socket.getCards().then(cards => this.setState({ cards: cards.map(this.hideAll) }));
      socket.onCardClicked(this.toggleHidden);
    } else {
      this.setState({ cards: initialCards.map(this.hideAll) });
    }
  }

  componentWillUnmount() {
    const { socket } = this.props;
    if (socket) {
      socket.close();
    }
  }

  hideAll = card => ({ ...card, hidden: true });

  toggleHidden = word => {
    this.setState(prevState => ({
      cards: prevState.cards.map(card => {
        if (card.word === word) {
          return { ...card, hidden: !card.hidden };
        }
        return card;
      }),
    }));
  };

  handleClick = word => {
    this.toggleHidden(word);
    const { socket } = this.props;
    if (socket) {
      socket.clickCard(word);
    }
  };

  getColor = ({ hidden, color }) => (this.isSpymaster || !hidden ? color : colors.DEFAULT);

  getWord = ({ hidden, word }) => (this.isSpymaster || hidden ? word : '');

  render() {
    if (!this.state.cards.length) {
      return <div>Loading...</div>;
    }
    return (
      <Grid>
        {this.state.cards.map(({ word, color, hidden }) => (
          <Card
            key={word}
            word={this.getWord({ word, hidden })}
            color={this.getColor({ color, hidden })}
            onClick={() => this.handleClick(word)}
          />
        ))}
      </Grid>
    );
  }
}

export default App;
