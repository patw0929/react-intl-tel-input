import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withOptions } from '@storybook/addon-options';

import IntlTelInput from '../../../src/components/IntlTelInput';

storiesOf('Documentation', module)
  .addDecorator(withOptions({ showAddonPanel: false }))
  .add('Getting Started', withInfo({ inline: true, source: false, propTables: null})(() =>
  (
    <IntlTelInput />
  )), { info: {
    text: `
      ## Installation

      ~~~bash
      npm install react-intl-tel-input --save
      ~~~

      or

      ~~~bash
      yarn add react-intl-tel-input
      ~~~

      ## Basic Usage
      ~~~js
        import React from 'react';
        import ReactDOM from 'react-dom';
        import IntlTelInput from 'react-intl-tel-input';
        import 'react-intl-tel-input/dist/main.css';

        ReactDOM.render(
          <IntlTelInput
            preferredCountries={['tw']}
            onPhoneNumberChange={onChange()}
            onPhoneNumberBlur={onBlur()}
          />,
          document.getElementById('root'),
      );
      ~~~
        `,
  },});
