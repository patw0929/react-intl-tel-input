import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withOptions } from '@storybook/addon-options';

import IntlTelInput from '../../../src/components/IntlTelInput';

storiesOf('Documentation', module)
  .addDecorator(withOptions({ showAddonPanel: false }))
  .add('Props', withInfo({ inline: true, source: false })(() => <IntlTelInput />));
