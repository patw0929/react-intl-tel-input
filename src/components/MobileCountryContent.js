import React, { Component, PropTypes } from 'react';

class MobileCountryContent extends Component {
  static propTypes = {
    index: PropTypes.number,
    countryClass: PropTypes.string,
    iso2: PropTypes.string,
    name: PropTypes.string,
    dialCode: PropTypes.string,
    handleMouseOver: PropTypes.func,
    handleClick: PropTypes.func,
  };

  render() {
    const {
      countryClass,
      dialCode,
      name,
      iso2,
      index,
      handleMouseOver,
      handleClick,
    } = this.props;

    return (
      <li key={`country-${index}`}
        className={countryClass}
        data-dial-code={dialCode}
        data-country-code={iso2}
        onMouseOver={handleMouseOver}
        onClick={handleClick}
      >

        <span className="country-name">{name}</span>
        <div className="flagAndCountryCode">
          <span className="dial-code">+{dialCode}</span>
          <div ref="selectedFlag" className="flag-box">
            <div ref="selectedFlagInner" className={`iti-flag ${iso2}`}></div>
          </div>
        </div>
      </li>
    );
  }
}

export default MobileCountryContent;
