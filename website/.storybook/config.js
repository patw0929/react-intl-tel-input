import { configure, addDecorator } from '@storybook/react'
import { withOptions } from '@storybook/addon-options'
import { version } from '../../package.json'

const req = require.context('./stories', true, /.js*/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
  // eslint-disable-next-line global-require
  require('./styles/styles.scss')
}

addDecorator(
  withOptions({
    name: `react-intl-tel-input v${version}`,
    url: 'https://github.com/patw0929/react-intl-tel-input',
    sidebarAnimations: true,
  }),
)

configure(loadStories, module)
