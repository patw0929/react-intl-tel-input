'use strict';

import React from 'react';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    readonly: React.PropTypes.bool,
    fieldName: React.PropTypes.string,
    value: React.PropTypes.string,
    handleInputChange: React.PropTypes.func,
    handleKeyPress: React.PropTypes.func,
    handleKeyUp: React.PropTypes.func
  },

  render () {
    return (
      <input type="tel" autoComplete="off"
             className={this.props.className}
             disabled={this.props.disabled ? 'disabled' : false}
             readOnly={this.props.readonly ? 'readonly' : false}
             name={this.props.fieldName}
             value={this.props.value}
             onChange={this.props.handleInputChange}
             onKeyPress={this.props.handleKeyPress}
             onKeyUp={this.props.handleKeyUp} />
    );
  }
});
