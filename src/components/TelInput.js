import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TelInput extends Component {
  constructor(props) {
    super(props);

    this.refHandler = this.refHandler.bind(this);
  }

  componentDidUpdate() {
    this.tel.setSelectionRange(this.props.cursorPosition, this.props.cursorPosition);
  }

  refHandler(element) {
    this.tel = element;
    this.props.refCallback(element);
  }

  render() {
    return (
      <input
        { ...this.props.inputProps }
        ref={ this.refHandler }
        type="tel"
        autoComplete={ this.props.autoComplete }
        className={ this.props.className }
        disabled={ this.props.disabled ? 'disabled' : false }
        readOnly={ this.props.readonly ? 'readonly' : false }
        name={ this.props.fieldName }
        id={ this.props.fieldId }
        value={ this.props.value }
        placeholder={ this.props.placeholder }
        onChange={ this.props.handleInputChange }
        onBlur={ this.props.handleOnBlur }
        autoFocus={ this.props.autoFocus }
      />
    );
  }
}

TelInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  fieldName: PropTypes.string,
  fieldId: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  handleInputChange: PropTypes.func,
  handleOnBlur: PropTypes.func,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  inputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  refCallback: PropTypes.func.isRequired,
  cursorPosition: PropTypes.number,
};

export default TelInput;
