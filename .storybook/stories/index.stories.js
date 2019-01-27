import React from 'react';
import { storiesOf } from '@storybook/react';

import Introduction from './Introduction/Introduction.stories';
import Basic from './Basic/Basic.stories';

import './styles/styles.scss';

storiesOf('Introduction', module)
  .add('react-intl-tel-input ', () => <Introduction />);

storiesOf('Basic', module)
  .add('Basic Usage', () => <Basic />);
