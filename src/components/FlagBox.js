import React from 'react'
import PropTypes from 'prop-types'

const FlagBox = ({
  dialCode,
  isoCode,
  name,
  onMouseOver,
  onFocus,
  onClick,
  flagRef,
  innerFlagRef,
  countryClass,
  isSelected,
  index,
}) => (
  <li
    className={countryClass}
    data-dial-code={dialCode}
    data-country-code={isoCode}
    onMouseOver={onMouseOver}
    onFocus={onFocus}
    onClick={onClick}
    role="option"
    aria-selected={isSelected}
    id={`intl-tel-item-${index}`}
    tabIndex="-1"
  >
    <div ref={flagRef} className="flag-box">
      <div ref={innerFlagRef} className={`iti-flag ${isoCode}`} />
    </div>

    <span className="country-name">{name}</span>
    <span className="dial-code">{`+ ${dialCode}`}</span>
  </li>
)

FlagBox.propTypes = {
  dialCode: PropTypes.string.isRequired,
  isoCode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onMouseOver: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  flagRef: PropTypes.func,
  innerFlagRef: PropTypes.func,
  countryClass: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  index: PropTypes.number,
}

FlagBox.defaultProps = {
  onFocus: () => {},
  onMouseOver: () => {},
  onClick: () => {},
}

export default FlagBox
