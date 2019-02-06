import React, { Component } from 'react';
import Grid from './components/grid';
import Card from './components/card';
import { getBoxes, colors } from './boxes';

class App extends Component {
  state = { isSpymaster: false };

  componentDidMount() {
    this.setState({ isSpymaster: window && window.__isSpymaster });
  }

  render() {
    const { isSpymaster } = this.state;
    return (
      <Grid>
        {getBoxes().map(({ word, color }) => (
          <Card key={word} color={isSpymaster ? color : colors.DEFAULT}>
            {word.toUpperCase()}
          </Card>
        ))}
      </Grid>
    );
  }
}

export default App;
