import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import IntlTelInput from '../../../src/components/IntlTelInput';

storiesOf('Documentation', module)
  .addParameters({ options: { showAddonPanel: false } })
  .add('Props', withInfo({ inline: true, source: false })(() => <IntlTelInput />));
