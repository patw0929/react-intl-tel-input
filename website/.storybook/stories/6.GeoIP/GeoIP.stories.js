import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'

import IntlTelInput from '../../../../src/components/IntlTelInput'
import '../../../../src/intlTelInput.scss'
import { lookup } from '../../helpers/helpers'

storiesOf('Usage', module)
  .addParameters({ options: { selectedPanel: 'ACTION LOGGER' } })
  .add(
    'Geo IP',
    withInfo({ inline: true, source: false, propTables: null })(() => (
      <IntlTelInput
        defaultCountry="tw"
        geoIpLookup={lookup}
        onPhoneNumberChange={action('onPhoneNumberChange')}
        format
      />
    )),
  )
