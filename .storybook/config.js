import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { version } from '../package.json';

const req = require.context('./stories', true, /.js*/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));

  require('./stories.scss');
}

addDecorator(
  withOptions({
    showAddonPanel: false,
    name: `react-intl-tel-input v${version}`,
    url: 'https://github.com/patw0929/react-intl-tel-input',
    sidebarAnimations: true,
  })
);

configure(loadStories, module);
