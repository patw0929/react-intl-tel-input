import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class RootModal extends Component {
  componentDidMount() {
    this.modalTarget = document.createElement('div');
    this.modalTarget.className = 'intl-tel-input iti-container';
    document.body.appendChild(this.modalTarget);
    this._render();
  }

  componentWillUpdate() {
    this._render();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.modalTarget);
    document.body.removeChild(this.modalTarget);
  }

  _render() {
    ReactDOM.render(
      <div>{this.props.children}</div>,
      this.modalTarget
    );
  }

  render() {
    return <noscript />;
  }
}

RootModal.propTypes = {
  children: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default RootModal;
