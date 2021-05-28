# TextNow AutoSend

> TextNow AutoSend is a Node Application that allows automatic sent message to anyone. All communication is handled through the [Puppeteer API](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md).

## Getting Started

### 1. GitHub Actions

1. Fork repository

2. Setting repository secrets for auto-send parameters, for multi-users, split them with "|"

    | Name              | Description                                                  |
    | ----------------- | ------------------------------------------------------------ |
    | TEXTNOW_USERNAME  | TextNow username to login, if multi, use "\|" to split.      |
    | TEXTNOW_PASSWORD  | TextNow password to login, if multi, use "\|" to split.      |
    | TEXTNOW_COOKIES   | TextNow cookies to auto login, base64 encoded, and must with username defined, if multi, use "\|" to split. |
    | TEXTNOW_RECIPIENT | Auto-send recipient, if not defined, "(726) 666-0002" will be used. |
    | TEXTNOW_MESSAGE   | Auto-send message, if not defined, "auto-send message" will be used. |
    | CAPTCHA_TOKEN     | 2captcha token, if defined, hCaptcha will be auto-resolved.  |

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

### 3. How to get cookies for TextNow
1. Use Chrome to login to https://www.textnow.com/
2. Install Chrome extension EditThisCookie: https://chrome.google.com/webstore/detail/fngmhnnpilhplaeedifhccceomclgfbg
3. Use export function of EditThisCookie, all cookies will in clipboard
4. Convert the clipboard cookies into base64 format: https://www.bejson.com/enc/base64/
