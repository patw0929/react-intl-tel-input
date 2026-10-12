# React-Intl-Tel-Input

![React-Intl-Tel-Input: Deprecated & Archived](./assets/banner.jpg)

Rewrite [International Telephone Input](https://github.com/jackocnr/intl-tel-input) in React.js.


> [!WARNING]
> ### ⚠️ Project Status: Deprecated & Archived
>
> This project is no longer actively maintained and has been officially archived.
>
> **A Note from the Author (@patw0929):**
> 
> Back in 2015, I started `react-intl-tel-input` because there was no straightforward way to use [Jack O'Connor's `intl-tel-input`](https://github.com/jackocnr/intl-tel-input) in the early React ecosystem.
> 
> Over the years, due to various ups and downs in my personal life, I found myself without the time and energy to maintain this project. I sincerely apologize for leaving this repository unattended for such a long time without clearly communicating its status.
> 
> Even with its long hiatus, the repository still gathered nearly 300 stars, over 200 forks, and continues to see tens of thousands of weekly downloads. I am deeply grateful to everyone who trusted this package in their applications, and to all the contributors who submitted pull requests, reported issues, or helped keep this project going over the years.
> 
> Today, the React and frontend ecosystem has evolved significantly, and most importantly, **the original `intl-tel-input` now provides an official React component ([`@intl-tel-input/react`](https://www.npmjs.com/package/@intl-tel-input/react))**. The original mission of this project is now fully and officially supported upstream.
> 
> Rather than leaving this project in limbo with unresolved issues and pull requests, I believe the most responsible closure is to formally archive it and guide developers to modern, actively maintained solutions.
> 
> Existing versions will stay on npm for legacy builds, but no further updates or fixes will be provided. Thank you all for your support, patience, and understanding over the years. ❤️
>
> ---
>
> ### 📦 Recommended Alternatives & Migration
>
> If you are starting a new project or upgrading React, please migrate to one of the following:
>
> 1. **Official React Component**: [`@intl-tel-input/react`](https://www.npmjs.com/package/@intl-tel-input/react) (by [@jackocnr](https://github.com/jackocnr))
>    - Official wrapper with React 18+ support, dynamic utils loading, and active upstream maintenance.
> 2. **Community Favorite**: [`react-phone-number-input`](https://www.npmjs.com/package/react-phone-number-input) (by [@catamphetamine](https://github.com/catamphetamine))
>    - Lightweight, customizable, and powered by `libphonenumber-js`.

## Demo & Examples

Live demo: [patw0929.github.io/react-intl-tel-input](https://patw0929.github.io/react-intl-tel-input/)

To build the examples locally, run:

```bash
yarn
yarn website:start
```

Then open [`localhost:3000`](http://localhost:3000) in a browser.


## Installation

```bash
yarn add react-intl-tel-input
```


### TypeScript

`react-intl-tel-input` ships with official type declarations out of the box.


## Usage

```javascript
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

<IntlTelInput
  containerClassName="intl-tel-input"
  inputClassName="form-control"
/>
```

### Properties

Please see the [Demo Page](https://patw0929.github.io/react-intl-tel-input/)


## Development (`src` and the build process)

To build, watch and serve the examples (which will also watch the component source), run `yarn website:start`.

You can prepare a distribution build using `yarn build`.

## Contributing

Any kind of contribution including proposals, doc improvements, enhancements, bug fixes are always welcome. 

To contribute to `react-intl-tel-input`, clone this repo locally and commit your code on a separate branch. Please write tests for your code, and run the linter before opening a pull-request:

```bash
yarn test    # if you are enhancing the JavaScript modules
yarn test:ts # if you are enhancing the TypeScript type declarations
yarn lint
```

Also, please let us know if you encounter any issue by filing an [issue](https://github.com/patw0929/react-intl-tel-input/issues).

## Inspired by

[International Telephone Input](https://github.com/jackocnr/intl-tel-input) - [@jackocnr](https://github.com/jackocnr)


## License

MIT

Copyright (c) 2015-2019 patw.
