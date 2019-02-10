import React, { Component } from 'react';
import Grid from './components/grid';
import CardContainer from './components/cardContainer';
import { getBoxes, colors } from './boxes';

class App extends Component {
  render() {
    return (
      <Grid>
        {getBoxes().map(({ word, color }) => (
          <CardContainer key={word} id={word} color={color}>
            {word.toUpperCase()}
          </CardContainer>
        ))}
      </Grid>
    );
  }
}

export default App;
