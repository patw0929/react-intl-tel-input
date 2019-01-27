import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/styles/prism';

import IntlTelInput from '../../../src/components/IntlTelInputApp';
import '../../../example/main.css';

const codeString = `\
<IntlTelInput
  defaultCountry="tw"
  css={['intl-tel-input', 'form-control']}
  format
/>
`;

export default () => {
  return (
    <div className="story">
      <h1 className="title">Basic Usage</h1>

      <div className="demo">
        <IntlTelInput
          defaultCountry="tw"
          css={['intl-tel-input', 'form-control']}
          format
        />
      </div>

      <h2>Code</h2>

      <SyntaxHighlighter
        language="jsx"
        style={xonokai}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
