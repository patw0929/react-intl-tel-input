import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, select, number } from '@storybook/addon-knobs/react';
// import { withPropsTable } from 'storybook-addon-react-docgen';

// import { reat as centered } from '@storybook/addon-centered';

import IntlTelInput from '../../../src/components/IntlTelInputApp';
// import '../../../example/main.css';

// export default class Introduction extends React.Component {
//   render() {
//     return (
//       // <div className="introduction">
//       //   <h1 className="title">react-intl-tel-input</h1>
//       //   <h2 className="subtitle">Rewrite International Telephone Input in React.js</h2>

//       //   <div className="demo">

//       //   </div>
//       // </div>
//       <IntlTelInput
//         onPhoneNumberChange={action('onPhoneNumberChange')}
//         onPhoneNumberBlur={action('onPhoneNumberBlur')}
//         onSelectFlag={action('onSelectFlag')}
//         defaultCountry="tw"
//         css={['intl-tel-input', 'form-control']}
//         format
//       />
//     );
//   }
// }
storiesOf('IntlTelInput - Introduction', module)
  // .addDecorator(withPropsTable)
  .addDecorator(withKnobs)
  .add('Detailed Props and source', withInfo({
    inline: true,
  })(() =>
  (
    <IntlTelInput
      onPhoneNumberChange={action('onPhoneNumberChange')}
      onPhoneNumberBlur={action('onPhoneNumberBlur')}
      onSelectFlag={action('onSelectFlag')}
      defaultCountry={text('defaultCountry', '')}
      css={['intl-tel-input', 'form-control']}
      format={boolean('format: ', false)}
      disabled={boolean('disabled: ', false)}
    />
  )));
