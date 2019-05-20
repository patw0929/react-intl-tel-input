import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class RootModal extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.modalTarget = document.createElement('div');
    this.modalTarget.className = 'intl-tel-input iti-container';
  }

  componentDidMount() {
    document.body.appendChild(this.modalTarget);
  }

  componentWillUnmount() {
    document.body.removeChild(this.modalTarget);
  }

  render() {
    return ReactDOM.createPortal(
      <Fragment>{this.props.children}</Fragment>,
      this.modalTarget
    );
  }
}
