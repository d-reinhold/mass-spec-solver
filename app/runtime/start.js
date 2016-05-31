require('babel-core/register');
require('babel-polyfill');
require('pui-css-alignment');
require('pui-css-whitespace');
const React = require('react');
const ReactDOM = require('react-dom');
const Application = require('components/application');
const AWS = require('aws-sdk');

// configure the AWS SDK with creds granting invocation ability to the recursiveSubsetSum lambda function
AWS.config.update({accessKeyId: 'AKIAILE7UA4MZKS7LBTQ', secretAccessKey: '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'});
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = {lambda: '2015-03-31'};

ReactDOM.render(<Application/>, root);