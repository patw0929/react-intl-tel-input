import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs/react';

import IntlTelInput from '../../src/components/IntlTelInputApp';
import '../../example/main.css';

const stories = storiesOf('IntlTelInput', module);

stories.addDecorator(withKnobs);


stories.add('Basic Example', (() => {
  return (
    <IntlTelInput
      onPhoneNumberChange={action('onPhoneNumberChange')}
      onPhoneNumberBlur={action('onPhoneNumberBlur')}
      onSelectFlag={action('onSelectFlag')}
      defaultCountry="auto"
      // value={this.state.phone1}
      // geoIpLookup={lookup}
      css={['intl-tel-input', 'form-control']}
      format
    />
   );
}));
