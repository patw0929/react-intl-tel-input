import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class RootModal extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  componentDidMount() {
    this.modalTarget = document.createElement('div');
    this.modalTarget.className = 'intl-tel-input iti-container';
    document.body.appendChild(this.modalTarget);
    this._render();
  }

  shouldComponentUpdate() {
    this._render();

    return false;
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.modalTarget);
    document.body.removeChild(this.modalTarget);
  }

  _render() {
    ReactDOM.render(<div>{this.props.children}</div>, this.modalTarget);
  }

  render() {
    return <noscript />;
  }
}
