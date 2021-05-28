# TextNow AutoSend

> TextNow AutoSend is a Node Application that allows automatic sent message to anyone. All communication is handled through the [Puppeteer API](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md).

## Getting Started

### 1. GitHub Actions

1. Fork repository
2. Setting repository secrets for auto-send parameters, for multi-users, split them with "|"
    * TEXTNOW_USERNAME
    * TEXTNOW_PASSWORD
    * TEXTNOW_COOKIES
    * TEXTNOW_RECIPIENT
    * TEXTNOW_MESSAGE
3. Change actions permissions to allow all actions
4. Done, it will every hour trigger auto-send action

### 2. Server Side

```bash
git clone https://github.com/ye4241/textnow-autosend.git
```

Modify config file, and execute script on the command line:

```bash
npm install
# or "yarn install"
npm start
# or "yarn start"
```
