import React, { Component } from 'react';
import Grid from './components/grid';
import Card from './components/card';
import { getBoxes, colors } from './boxes';

class App extends Component {
  state = {};

  render() {
    const { spymaster } = this.props;
    return (
      <Grid>
        {getBoxes().map(({ word, color }) => (
          <Card key={word} color={spymaster ? color : colors.DEFAULT}>
            {word.toUpperCase()}
          </Card>
        ))}
      </Grid>
    );
  }
}

export default App;
