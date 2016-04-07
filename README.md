# React-Intl-Tel-Input 

[![Build Status](https://travis-ci.org/patw0929/react-intl-tel-input.svg)](https://travis-ci.org/patw0929/react-intl-tel-input)
[![npm version](https://badge.fury.io/js/react-intl-tel-input.svg)](http://badge.fury.io/js/react-intl-tel-input)
[![Coverage Status](https://coveralls.io/repos/github/patw0929/react-intl-tel-input/badge.svg)](https://coveralls.io/github/patw0929/react-intl-tel-input)

Rewrite [International Telephone Input](https://github.com/jackocnr/intl-tel-input) in React.js.


## Demo & Examples

Live demo: [patw0929.github.io/react-intl-tel-input](http://patw0929.github.io/react-intl-tel-input/)

To build the examples locally, run:

```bash
npm install
npm run example
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-intl-tel-input is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/main.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```bash
npm install react-intl-tel-input --save
```


## Usage

```javascript
import IntlTelInput from 'react-intl-tel-input';
import 'file?name=libphonenumber.js!./node_modules/react-intl-tel-input/dist/libphonenumber.js';
import './node_modules/react-intl-tel-input/dist/main.css';

<IntlTelInput css={['intl-tel-input', 'form-control']}
  utilsScript={'libphonenumber.js'}>Example</IntlTelInput>
```

### Properties

Please see the [Demo Page](http://patw0929.github.io/react-intl-tel-input/)


## Development (`src` and the build process)

**NOTE:** The source code for the component is in `src`. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm run example`.

## Inspired by

[International Telephone Input](https://github.com/jackocnr/intl-tel-input) - [@jackocnr](https://github.com/jackocnr)

## License

MIT

Copyright (c) 2015-2016 patw.
