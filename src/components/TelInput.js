import React, { Component, PropTypes } from 'react';

class TelInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    fieldName: PropTypes.string,
    value: PropTypes.string,
    handleInputChange: PropTypes.func,
    handleKeyPress: PropTypes.func,
    handleKeyUp: PropTypes.func,
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.props.handleInputChange.call(this);
  }

  render() {
    return (
      <input type="tel" autoComplete="off"
        className={this.props.className}
        disabled={this.props.disabled ? 'disabled' : false}
        readOnly={this.props.readonly ? 'readonly' : false}
        name={this.props.fieldName}
        value={this.props.value}
        onChange={this.onChange}
        onKeyPress={this.props.handleKeyPress}
        onKeyUp={this.props.handleKeyUp}
      />
    );
  }
}

export default TelInput;
