import React from 'react';
import { storiesOf } from '@storybook/react';

import Introduction from './Introduction/Introduction.stories';
import Basic from './Basic/Basic.stories';
import Multiple from './Multiple/Multiple.stories';
import GeoIP from './GeoIP/GeoIP.stories';

import './styles/styles.scss';

storiesOf('Introduction', module)
  .add('react-intl-tel-input ', () => <Introduction />);

storiesOf('Usage', module)
  .add('Basic', () => <Basic />)
  .add('Multiple Components', () => <Multiple />)
  .add('GeoIP', () => <GeoIP />)
