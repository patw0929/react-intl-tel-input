'use strict';

import React from 'react';

export default React.createClass({
  render () {
    return (
      <input type="tel" autoComplete="off"
             disabled={this.props.disabled ? "disabled" : false}
             readOnly={this.props.readonly ? "readonly" : false} />
    );
  }
});
