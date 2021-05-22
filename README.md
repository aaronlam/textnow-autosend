# TextNow AutoSend

> TextNow Autosent is a Node Application that allows automantic sent message to anyone. All communication is handled through the [Puppeteer API](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md).

## Getting Started

### 1. GitHub Actions

1.  Fork repository
2.  Goto https://2captcha.com/
    -> Registration (If you haven't account)
    -> I'm developer
    -> Get API KEY from Account settings, this is CAPTCHA_TOKEN
    -> Payment funds abount 3 USD to you account
    (Because each API call requires 0.00299 USD, and we can implement cookie cache to pass them).
3.  Setting repository secrets for autosend parameters
    * TEXTNOW_USERNAME
    * TEXTNOW_PASSWORD
    * TEXTNOW_RECIPIENT
    * TEXTNOW_MESSAGE
    * CAPTCHA_TOKEN
    * CACHE_NAME
4.  Change actions permissions to allow all actions
5.  Done, it will every hour trigger autosend action

### 2. Server Side

```bash
    git clone https://github.com/aaronlam/textnow-autosend.git
```

Modify config file, and excute script on the command line:

```bash
    npm install
    # or "yarn install"

    npm start
    # or "yarn start"
```
