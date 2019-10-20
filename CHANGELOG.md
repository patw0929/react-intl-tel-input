# Changelog

## [v7.1.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v7.1.0)

### New features

- [#308](https://github.com/patw0929/react-intl-tel-input/pull/308): Add optional onPhoneNumberFocus function (by [@johannessjoberg](https://github.com/johannessjoberg))

## [v7.0.3](https://github.com/patw0929/react-intl-tel-input/releases/tag/v7.0.2)

### Bug fixes

- [#285](https://github.com/patw0929/react-intl-tel-input/pull/285): Update flag when defaultCountry value is changed (by [@dhanesh-kapadiya](https://github.com/dhanesh-kapadiya))

## [v7.0.2](https://github.com/patw0929/react-intl-tel-input/releases/tag/v7.0.2)

### Bug fixes:

- [#302](https://github.com/patw0929/react-intl-tel-input/pull/302): Remove package-lock.json (by [@patw0929](https://github.com/patw0929))
- [#283](https://github.com/patw0929/react-intl-tel-input/pull/283): Fix: invoke onPhoneNumberChange callback with formatted value on init instead of unformatted value from previous state (by [@coox](https://github.com/coox))
- [#300](https://github.com/patw0929/react-intl-tel-input/pull/300): fixed bug with pasting number over another number (by [@flagoon](https://github.com/flagoon))
- [#299](https://github.com/patw0929/react-intl-tel-input/pull/299): Use cross-env to solve cross platforms issue (scripts with node env variables) (by [@patw0929](https://github.com/patw0929))

### Docs:

- [#298](https://github.com/patw0929/react-intl-tel-input/pull/298): Update LICENSE (by [@Parikshit-Hooda](https://github.com/Parikshit-Hooda))
- [#297](https://github.com/patw0929/react-intl-tel-input/pull/297): Update README.md Update LICENSE (by [@Parikshit-Hooda](https://github.com/Parikshit-Hooda))
- [#294](https://github.com/patw0929/react-intl-tel-input/pull/294): Removed bash highlighting for npm/yarn commands in README (by [@bhumijgupta](https://github.com/bhumijgupta))

## [v7.0.1](https://github.com/patw0929/react-intl-tel-input/releases/tag/v7.0.1)

### Bug fixes

- [#277](https://github.com/patw0929/react-intl-tel-input/pull/277): Fix([#272](https://github.com/patw0929/react-intl-tel-input/pull/272)): Updating Allowdropdown after mount (by [@nutboltu](https://github.com/nutboltu))

### Docs

- [#273](https://github.com/patw0929/react-intl-tel-input/pull/273): Feature: Introducing storybook for documentation and playground (by [@nutboltu](https://github.com/nutboltu))
- [#274](https://github.com/patw0929/react-intl-tel-input/pull/274): fix(storybook-deploy): Fixed the storybook deployment script in travis (by [@nutboltu](https://github.com/nutboltu))
- [#275](https://github.com/patw0929/react-intl-tel-input/pull/275): Fix: storybook's public path (by [@patw0929](https://github.com/patw0929))
- [#276](https://github.com/patw0929/react-intl-tel-input/pull/276): Refactor: Removing all unused files and codes for example (by [@nutboltu](https://github.com/nutboltu))

## [v7.0.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v7.0.0)

### Bug fixes

- [#270](https://github.com/patw0929/react-intl-tel-input/pull/270): Fixed the issue of pasting number to text input cannot update flag in international mode (by [@patw0929](https://github.com/patw0929))
- [#271](https://github.com/patw0929/react-intl-tel-input/pull/271): Fixed the CSS prop name issue of styled-component (by [@patw0929](https://github.com/patw0929))

## [v6.1.1](https://github.com/patw0929/react-intl-tel-input/releases/tag/v6.1.1)

### Bug fixes

- [#269](https://github.com/patw0929/react-intl-tel-input/pull/269): Fixed issue [#268](https://github.com/patw0929/react-intl-tel-input/issues/268) - disabled state doesn't update an input field (by [@patw0929](https://github.com/patw0929))
- [#265](https://github.com/patw0929/react-intl-tel-input/pull/265): update cursor position after focused (by [@Loongwoo](https://github.com/Loongwoo))

### Chores

- [#267](https://github.com/patw0929/react-intl-tel-input/pull/267) - Use createPortal API to implement RootModal (by [@patw0929](https://github.com/patw0929))
- Added `ISSUE_TEMPLATE.md` & `PULL_REQUEST_TEMPLATE.md`

## [v6.1.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v6.1.0)

### New features

- [#249](https://github.com/patw0929/react-intl-tel-input/pull/249): Add support for onFlagClick (by [@tomegz](https://github.com/tomegz))
- [#254](https://github.com/patw0929/react-intl-tel-input/pull/254): Updated libphonenumber to 8.10.2 (by [@superhit0](https://github.com/superhit0))
- [#256](https://github.com/patw0929/react-intl-tel-input/pull/256): Added event object to onPhoneNumberBlur callback's parameter (by [@superhit0](https://github.com/superhit0))

### Bug fixes

- [#254](https://github.com/patw0929/react-intl-tel-input/pull/254): Fixed issue [#253](https://github.com/patw0929/react-intl-tel-input/issues/253) - Can not import from Node.js since module build upgrade to webpack 4 (by [@superhit0](https://github.com/superhit0))
- [#256](https://github.com/patw0929/react-intl-tel-input/pull/256): Defined `.npmrc` to avoid overriding the default npm registry server (by [@superhit0](https://github.com/superhit0))
- [#259](https://github.com/patw0929/react-intl-tel-input/pull/259): Fixed not update value issue when value is empty string (by [@patw0929](https://github.com/patw0929))

## [v6.0.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v6.0.0)

### Breaking changes

- [#235](https://github.com/patw0929/react-intl-tel-input/pull/245): Remove utilsScript prop (by [@patw0929](https://github.com/patw0929))
- [#247](https://github.com/patw0929/react-intl-tel-input/pull/247): Removed libphonenumber.js (by [@patw0929](https://github.com/patw0929))

### New features

- [#248](https://github.com/patw0929/react-intl-tel-input/pull/248): Analyze bundle size & decrease the size of main.js (by [@patw0929](https://github.com/patw0929))
- [#227](https://github.com/patw0929/react-intl-tel-input/pull/227): Bumping React version to 16.4.1 & removing deprecated lifecycle events (by [@superhit0](https://github.com/superhit0))
- [#214](https://github.com/patw0929/react-intl-tel-input/pull/214): Provide fullNumber and isValid when onSelectFlag (by [@adrienharnay](https://github.com/adrienharnay))
- [#232](https://github.com/patw0929/react-intl-tel-input/pull/232): npmignore updated with file list (fixed [#231](https://github.com/patw0929/react-intl-tel-input/issues/231)) (by [@nutboltu](https://github.com/nutboltu))
- [#242](https://github.com/patw0929/react-intl-tel-input/pull/242): Upgrade webpack, eslint, babel and refine coding style (by [@patw0929](https://github.com/patw0929))
- [#243](https://github.com/patw0929/react-intl-tel-input/pull/243): Improvement: Utilize @babel/plugin-proposal-class-properties by using class properties in class components (by [@tomegz](https://github.com/tomegz))

### Bug fixes

- [#246](https://github.com/patw0929/react-intl-tel-input/pull/246): Refactor FlagDropDown: Avoid creating functions every time render() is invoked, use class properties instead (by [@tomegz](https://github.com/tomegz))
- [#221](https://github.com/patw0929/react-intl-tel-input/pull/221): Fix cursor Issue ([#205](https://github.com/patw0929/react-intl-tel-input/issues/205)) (by [@superhit0](https://github.com/superhit0))
- [#223](https://github.com/patw0929/react-intl-tel-input/pull/223): Removed second argument of parseFloat (by [@patw0929](https://github.com/patw0929))
- [#234](https://github.com/patw0929/react-intl-tel-input/pull/234): Hide country list when click on flag button (by [@ilagnev](https://github.com/ilagnev))
- [#241](https://github.com/patw0929/react-intl-tel-input/pull/241): Fixes [#235](https://github.com/patw0929/react-intl-tel-input/issues/235): Show countrylist when allowDropdown flag is set to true (by [@tomegz](https://github.com/tomegz))

## [v5.1.0-rc.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.1.0-rc.0)

### New features

- [#227](https://github.com/patw0929/react-intl-tel-input/pull/227): Bumping React version to 16.4.1 & removing deprecated lifecycle events (by [@superhit0](https://github.com/superhit0))
- [#214](https://github.com/patw0929/react-intl-tel-input/pull/214): Provide fullNumber and isValid when onSelectFlag (by [@adrienharnay](https://github.com/adrienharnay))
- [#232](https://github.com/patw0929/react-intl-tel-input/pull/232): npmignore updated with file list (fixed [#231](https://github.com/patw0929/react-intl-tel-input/issues/231)) (by [@nutboltu](https://github.com/nutboltu))
- [#242](https://github.com/patw0929/react-intl-tel-input/pull/242): Upgrade webpack, eslint, babel and refine coding style (by [@patw0929](https://github.com/patw0929))
- [#243](https://github.com/patw0929/react-intl-tel-input/pull/243): Improvement: Utilize @babel/plugin-proposal-class-properties by using class properties in class components (by [@tomegz](https://github.com/tomegz))

### Bug fixes

- [#221](https://github.com/patw0929/react-intl-tel-input/pull/221): Fix cursor Issue ([#205](https://github.com/patw0929/react-intl-tel-input/issues/205)) (by [@superhit0](https://github.com/superhit0))
- [#223](https://github.com/patw0929/react-intl-tel-input/pull/223): Removed second argument of parseFloat (by [@patw0929](https://github.com/patw0929))
- [#234](https://github.com/patw0929/react-intl-tel-input/pull/234): Hide country list when click on flag button (by [@ilagnev](https://github.com/ilagnev))
- [#241](https://github.com/patw0929/react-intl-tel-input/pull/241): Fixes [#235](https://github.com/patw0929/react-intl-tel-input/issues/235): Show countrylist when allowDropdown flag is set to true (by [@tomegz](https://github.com/tomegz))

## [v5.0.7](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.7)

### Bug fixes

- [#220](https://github.com/patw0929/react-intl-tel-input/pull/220): Upgrade Libphonenumber to v8.9.9 (by [@superhit0](https://github.com/superhit0))


## [v5.0.6](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.6)

### Bug fixes

- [#217](https://github.com/patw0929/react-intl-tel-input/pull/217): Add findIndex implementation for IE 11 (by [@ostap0207](https://github.com/ostap0207))
- [#219](https://github.com/patw0929/react-intl-tel-input/pull/219): Fixed [#218](https://github.com/patw0929/react-intl-tel-input/issues/218): Fix expanded class not being removed from wrapper (by [@MilosMosovsky](https://github.com/MilosMosovsky))


## [v5.0.5](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.5)

### Bug fixes

- Fixed [#208](https://github.com/patw0929/react-intl-tel-input/issues/208): issue of dial code shows twice in input ([#209](https://github.com/patw0929/react-intl-tel-input/pull/209) & [#210](https://github.com/patw0929/react-intl-tel-input/pull/210))


## [v5.0.4](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.4)

### Bug fixes

- [#207](https://github.com/patw0929/react-intl-tel-input/pull/207): Move Prop-types out of peer dependency. remove proptypes in dist ([57a6956](https://github.com/patw0929/react-intl-tel-input/commit/57a695617582a7662e1af4a66d326a9ff7d61ba7) by [@dphrag](https://github.com/dphrag))


## [v5.0.3](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.3)

### Bug fixes

- [#204](https://github.com/patw0929/react-intl-tel-input/pull/204): Handle placeholder and customPlaceholder change (by [@adrienharnay](https://github.com/adrienharnay))


## [v5.0.2](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.2)

### Bug fixes

- [#202](https://github.com/patw0929/react-intl-tel-input/pull/202): Fix runtime error when this.tel is null ([e021526](https://github.com/patw0929/react-intl-tel-input/commit/e02152686a39ae76dc801aa5a31df5f5b00e74ea) by[@adrienharnay](https://github.com/adrienharnay))
- [#201](https://github.com/patw0929/react-intl-tel-input/pull/201): Update placeholder when receiving new placeholder prop (4e9bcaf by @patw0929)

## [v5.0.1](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.1)

### Bug fixes

- [#199](https://github.com/patw0929/react-intl-tel-input/pull/199): reconfigure packages to bring back compatibility to both react 15 & 16 ([ea2d593](https://github.com/patw0929/react-intl-tel-input/commit/ea2d593df075d59446d58f11df2d191afb813c6b) by [@ignatiusreza](https://github.com/ignatiusreza))


## [v5.0.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v5.0.0)

### Breaking change

- [#196](https://github.com/patw0929/react-intl-tel-input/pull/196) Upgrade to React 16 (by [@puffo](https://github.com/puffo) & [@ignatiusreza](https://github.com/ignatiusreza))


## [v4.3.4](https://github.com/patw0929/react-intl-tel-input/releases/tag/v4.3.4)

### Bug fixes

- [#198](https://github.com/patw0929/react-intl-tel-input/pull/198) Allow country code to be deleted (Fixed [#197](https://github.com/patw0929/react-intl-tel-input/issues/197)) ([c731a6b](https://github.com/patw0929/react-intl-tel-input/commit/c731a6b913b5d8852d886c4b0e35ae7cbc7c37b7) by [@MatthewAnstey](https://github.com/MatthewAnstey))


## [v4.3.3](https://github.com/patw0929/react-intl-tel-input/releases/tag/v4.3.3)

### Bug fixes

- [#195](https://github.com/patw0929/react-intl-tel-input/pull/195): Add flag update when phones changes through props ([9d58356](https://github.com/patw0929/react-intl-tel-input/commit/9d583560a80c0ff30ff5bf390d6ebcb31cea1130) by [@MatthewAnstey](https://github.com/MatthewAnstey))


## [v4.3.2](https://github.com/patw0929/react-intl-tel-input/releases/tag/v4.3.2)

### Bug fixes

- [#192](https://github.com/patw0929/react-intl-tel-input/pull/192): highlight country from preferred list ([b37cc3d](https://github.com/patw0929/react-intl-tel-input/commit/b37cc3d6c1f7d9f2b94dc912b4698b0143c5d4ee), [7f2b90e](https://github.com/patw0929/react-intl-tel-input/commit/7f2b90ecd74768e0a729327bd4af7e8ee4deeba3), [5bdbb79](https://github.com/patw0929/react-intl-tel-input/commit/5bdbb798bfec46c0df2237c2c52ceb72ef8b8ec0) by [@denis-k](https://github.com/denis-k))


## [v4.3.1](https://github.com/patw0929/react-intl-tel-input/releases/tag/v4.3.1)

### Bug fixes

- Changed line that sets countryCode. Now, when CC is invalid, it is set to null and therefor not changed ([34b5517](https://github.com/patw0929/react-intl-tel-input/commit/34b551772d3a21d823e42864f99d5f925ff9273a) by [@darkenvy](https://github.com/darkenvy))


## [v4.0.1](https://github.com/patw0929/react-intl-tel-input/releases/tag/v4.0.1)

### Bug fixes

- Make isMobile isomorphic-friendly ([690f25b](https://github.com/patw0929/react-intl-tel-input/commit/690f25b954fde8e810d029e70515229849722ff2) by [@mariusandra](https://github.com/mariusandra))


## [v3.7.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v3.7.0)

### New features

- [#162](https://github.com/patw0929/react-intl-tel-input/pull/162): Pass arbitrary props to the tel input element (Also fixed [#158](https://github.com/patw0929/react-intl-tel-input/issues/158)) ([5e2d4f9](https://github.com/patw0929/react-intl-tel-input/commit/5e2d4f999942b6cb33beb518ff317de76d6fafac) by [@Arkq](https://github.com/Arkq))


## [v3.2.0](https://github.com/patw0929/react-intl-tel-input/releases/tag/v3.2.0)

### New features

- [#140](https://github.com/patw0929/react-intl-tel-input/pull/140): Pass down status to onSelectFlag by using isValidNumberForRegion ([fd39e98](https://github.com/patw0929/react-intl-tel-input/commit/fd39e98607b833aec297a2dcfd23b7149a267677), [ed781ed](https://github.com/patw0929/react-intl-tel-input/commit/ed781edcc8bb686e43cb75998f2cf9a04e387349) by [@viqh](https://github.com/viqh))
- [#141](https://github.com/patw0929/react-intl-tel-input/pull/141): Added on blur callback handler ([5aaef6e](https://github.com/patw0929/react-intl-tel-input/commit/5aaef6edb0a0a3f27b28e9bb1fd4e31e7142d020) by [@matteoantoci](https://github.com/matteoantoci))

### Bug fixes

- [#142](https://github.com/patw0929/react-intl-tel-input/pull/142): implement state.value change in componentWillReceiveProps ([09eae7e](https://github.com/patw0929/react-intl-tel-input/commit/09eae7ec7132ab70fb34ffc1a2ff26becfe6424a) by [@pwlmaciejewski](https://github.com/pwlmaciejewski))

