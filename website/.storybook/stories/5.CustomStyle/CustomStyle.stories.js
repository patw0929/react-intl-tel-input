import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import IntlTelInput from '../../../../src/components/IntlTelInput'
import '../../../../src/intlTelInput.scss'

storiesOf('Usage', module)
  .addDecorator(withKnobs)
  .add(
    'Custom Style',
    withInfo({ inline: true, source: false, propTables: null })(() => (
      <IntlTelInput
        defaultCountry="tw"
        onPhoneNumberChange={action('onPhoneNumberChange')}
        style={object('style', { transform: 'rotate(3deg)' })}
        format
      />
    )),
  )
