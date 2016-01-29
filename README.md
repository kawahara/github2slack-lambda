# github2slack-lambda

The lambda function to send GitHub event message to Slack.

http://qiita.com/ooharabucyou/items/2a3dca643f6b7783d665 (Japanese)

- This Lambda fucntion works with notification by AmazonSNS.
- It can allow to mention Slack account via GitHub.
- It can customize message format.

## How to deoloy Lambda function

This repository has script for lambda function deployment.
Read document for [node-aws-lambda](node-aws-lambda) and make your configuration from `lambda-config.js.sample`.

After that, you can deploy by following command:

```
npm install
./node_modules/.bin/gulp deploy
```

# LICENSE

This software is released under the MIT License, see LICENSE
