import React, { Component, PropTypes } from 'react';

class TelInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    fieldName: PropTypes.string,
    fieldId: PropTypes.string,
    value: PropTypes.string,
    handleInputChange: PropTypes.func,
    handleKeyPress: PropTypes.func,
    handleKeyUp: PropTypes.func,
  };

  render() {
    return (
      <input type="tel" autoComplete="off"
        className={this.props.className}
        disabled={this.props.disabled ? 'disabled' : false}
        readOnly={this.props.readonly ? 'readonly' : false}
        name={this.props.fieldName}
        name={this.props.fieldId}
        value={this.props.value}
        onChange={this.props.handleInputChange}
        onKeyPress={this.props.handleKeyPress}
        onKeyUp={this.props.handleKeyUp}
      />
    );
  }
}

export default TelInput;
