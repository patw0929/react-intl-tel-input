'use strict';

import React from 'react';

export default React.createClass({
  render () {
    return (
      <input type="tel" autoComplete="off"
             className={this.props.className}
             disabled={this.props.disabled ? "disabled" : false}
             readOnly={this.props.readonly ? "readonly" : false}
             value={this.props.value}
             onChange={this.props.handleInputChange}
             onKeyPress={this.props.handleKeyPress}
             onKeyUp={this.props.handleKeyUp} />
    );
  }
});
