# TextNow AutoSend

> TextNow Autosent is a Node Application that allows automantic sent message to anyone. All communication is handled through the [Puppeteer API](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md).

## Getting Started

```bash
    git clone https://github.com/aaronlam/textnow-autosend.git
```

## Usage

### 1. Server Side

Modify config file, and excute script on the command line:

```bash
    npm install
    # or "yarn install"

    npm start
    # or "yarn start"
```

### 2. GitHub Actions

1. Fork repository
2. Setting repository secrets for send parameters
   1. TEXTNOW_USERNAME
   2. TEXTNOW_PASSWORD
   3. TEXTNOW_RECIPIENT
   4. TEXTNOW_MESSAGE
3. Done
