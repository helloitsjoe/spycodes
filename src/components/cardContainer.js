import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './card';
import { colors } from '../boxes';

class CardContainer extends Component {
  state = { color: colors.DEFAULT };

  static propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
  };

  static defaultProps = {
    color: colors.DEFAULT,
  };

  handleClick = () => {
    this.setState({ color: this.props.color });
  };

  componentDidMount() {
    if (window && window.__isSpymaster) {
      this.setState({ color: this.props.color });
    }
  }

  render() {
    return (
      <Card color={this.state.color} onClick={this.handleClick}>
        {this.props.children}
      </Card>
    );
  }
}
export default CardContainer;
