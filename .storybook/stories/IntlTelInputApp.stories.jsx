import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import IntlTelInputApp from '../../src/components/IntlTelInputApp';

const stories = storiesOf('IntlTelInput', module);

stories.addDecorator(withKnobs);


stories.add('Basic Example', (() => {
  return (
    <button>hello </button>
   );
}));
