import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'
import { withKnobs, text } from '@storybook/addon-knobs/react'

import IntlTelInput from '../../../../src/components/IntlTelInput'
import './styles.scss'

storiesOf('Usage', module)
  .addDecorator(withKnobs)
  .add(
    'Custom CSS',
    withInfo({ inline: true, source: false, propTables: null })(() => {
      return (
        <IntlTelInput
          defaultCountry="tw"
          containerClassName={text(
            'containerClassName',
            'intl-tel-input tel-wrapper',
          )}
          inputClassName={text('inputClassName', 'form-control tel-input')}
          onPhoneNumberChange={action('onPhoneNumberChange')}
          format
        />
      )
    }),
  )
