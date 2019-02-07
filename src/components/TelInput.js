import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TelInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    fieldName: PropTypes.string,
    fieldId: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    handleInputChange: PropTypes.func,
    handlePaste: PropTypes.func,
    handleOnBlur: PropTypes.func,
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.string,
    inputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    refCallback: PropTypes.func.isRequired,
    cursorPosition: PropTypes.number,
  };

  state = {
    hasFocus: false,
  };

  componentDidUpdate() {
    if (this.state.hasFocus) {
      this.tel.setSelectionRange(
        this.props.cursorPosition,
        this.props.cursorPosition
      );
    }
  }

  refHandler = element => {
    this.tel = element;
    this.props.refCallback(element);
  };

  handleBlur = e => {
    this.setState({ hasFocus: false });

    if (typeof this.props.handleOnBlur === 'function') {
      this.props.handleOnBlur(e);
    }
  };

  handleFocus = () => {
    this.setState({ hasFocus: true });
  };

  handlePaste = e => {
    if (typeof this.props.handlePaste === 'function') {
      this.props.handlePaste(e);
    }
  };

  render() {
    return (
      <input
        {...this.props.inputProps}
        ref={this.refHandler}
        type="tel"
        autoComplete={this.props.autoComplete}
        className={this.props.className}
        disabled={this.props.disabled ? 'disabled' : false}
        readOnly={this.props.readonly ? 'readonly' : false}
        name={this.props.fieldName}
        id={this.props.fieldId}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.handleInputChange}
        onPaste={this.handlePaste}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        autoFocus={this.props.autoFocus}
      />
    );
  }
}
