import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class RootModal extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

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

export default RootModal;
