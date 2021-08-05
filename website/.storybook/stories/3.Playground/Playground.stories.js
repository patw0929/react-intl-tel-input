import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, array } from '@storybook/addon-knobs/react'

import IntlTelInput from '../../../../src/components/IntlTelInput'
import '../../../../src/intlTelInput.scss'

const { defaultProps } = IntlTelInput

storiesOf('Documentation', module)
  .addDecorator(withKnobs)
  .add(
    'Playground',
    withInfo({ inline: true, source: false, propTables: null })(() => (
      <IntlTelInput
        containerClassName={text(
          'containerClassName',
          defaultProps.containerClassName,
        )}
        inputClassName={text('inputClassName', defaultProps.inputClassName)}
        fieldName={text('fieldName', defaultProps.fieldName)}
        fieldId={text('fieldId', defaultProps.fieldId)}
        value={text('value', defaultProps.value)}
        defaultValue={text('defaultValue', defaultProps.defaultValue)}
        allowDropdown={boolean('allowDropdown', defaultProps.allowDropdown)}
        autoHideDialCode={boolean(
          'autoHideDialCode',
          defaultProps.autoHideDialCode,
        )}
        autoPlaceholder={boolean(
          'autoPlaceholder',
          defaultProps.autoPlaceholder,
        )}
        customPlaceholder={action('customPlaceholder')}
        excludeCountries={array(
          'excludeCountries',
          defaultProps.excludeCountries,
        )}
        formatOnInit={boolean('formatOnInit', defaultProps.formatOnInit)}
        separateDialCode={boolean(
          'separateDialCode',
          defaultProps.separateDialCode,
        )}
        defaultCountry={text('defaultCountry', defaultProps.defaultCountry)}
        geoIpLookup={action('geoIpLookup')}
        nationalMode={boolean('nationalMode', defaultProps.nationalMode)}
        numberType={text('defaultCountry', defaultProps.defaultCountry)}
        noCountryDataHandler={action('noCountryDataHandler')}
        onlyCountries={array('onlyCountries', defaultProps.onlyCountries)}
        preferredCountries={array(
          'preferredCountries',
          defaultProps.preferredCountries,
        )}
        onPhoneNumberChange={action('onPhoneNumberChange')}
        onPhoneNumberBlur={action('onPhoneNumberBlur')}
        onPhoneNumberFocus={action('onPhoneNumberFocus')}
        onSelectFlag={action('onSelectFlag')}
        disabled={boolean('disabled', defaultProps.disabled)}
        placeholder={text('placeholder', defaultProps.placeholder)}
        autoFocus={boolean('autoFocus', defaultProps.autoFocus)}
        autoComplete={text('autoComplete', defaultProps.autoComplete)}
        useMobileFullscreenDropdown={boolean(
          'useMobileFullscreenDropdown',
          defaultProps.useMobileFullscreenDropdown,
        )}
        format={boolean('format', defaultProps.format)}
        onFlagClick={action('onFlagClick')}
      />
    )),
  )
