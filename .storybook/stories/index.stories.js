import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Introduction from './Introduction/Introduction.stories';
import Basic from './Basic/Basic.stories';
import Multiple from './Multiple/Multiple.stories';
import GeoIP from './GeoIP/GeoIP.stories';
import Disabled from './Disabled/Disabled.stories';
import CustomCSS from './CustomCSS/CustomCSS.stories';
import CustomStyle from './CustomStyle/CustomStyle.stories';

import './styles/styles.scss';

// storiesOf('Introduction', module)
//   .add('react-intl-tel-input ', withInfo({ story: true })(() => <Introduction />));

storiesOf('Usage', module)
  .add('Basic', () => <Basic />)
  .add('Multiple Components', () => <Multiple />)
  .add('GeoIP', () => <GeoIP />)
  .add('Disabled', () => <Disabled />)
  .add('CustomCSS', () => <CustomCSS />)
  .add('CustomStyle', () => <CustomStyle />)
