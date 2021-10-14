const actionFunc = async (
    username, password, cookies, recipient, message, captchaToken) => {
  console.log('TextNow bot start...');
  const path = require('path');
  const fs = require('fs').promises;
  const puppeteer = require('puppeteer-extra');
  const recaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
  const stealthPlugin = require('puppeteer-extra-plugin-stealth');
  const adblockerPlugin = require('puppeteer-extra-plugin-adblocker');
  const textNowHelper = require('./utils/helper');

  let browser = null;
  let page = null;
  let md5Username = textNowHelper.md5(username);

  // Make cache folder
  const cacheFolder = path.resolve(__dirname, '.cache');
  try {
    await fs.access(cacheFolder);
  } catch (error) {
    await fs.mkdir(cacheFolder);
  }

  try {
    puppeteer.use(stealthPlugin());
    if (captchaToken) {
      puppeteer.use(
          recaptchaPlugin({
            provider: {
              id: '2captcha',
              token: captchaToken,
            },
            visualFeedback: true,
          }),
      );
    }
    puppeteer.use(adblockerPlugin());

    browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      args: [
        process.env.HTTP_PROXY ?
            `--proxy-server=${process.env.HTTP_PROXY}` :
            '',
        '--no-sandbox',
      ],
    });
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    const client = await page.target().createCDPSession();

    try {
      console.log('Importing cookies from environment...');
      cookies = JSON.parse(Buffer.from(cookies, 'base64').toString());
    } catch (error) {
      console.log(`Environment cookies is invalid format: ${error}`);
      cookies = null;
      try {
        console.log('Importing existing cookies from file...');
        const cookiesString = await fs.readFile(
            path.resolve(cacheFolder, `${md5Username}.cookies.json`),
        );
        cookies = JSON.parse(cookiesString.toString());
      } catch (error) {
        console.log(`Failed to import existing cookies: ${error}`);
        cookies = null;
      }
    }

    // Log into TextNow and get cookies
    try {
      if (cookies === null) {
        throw new Error("Cookies is null");
      }
      console.log('Logging in with existing cookies');
      await page.setCookie(...cookies);
      cookies = await textNowHelper.logIn(page, client);
    } catch (error) {
      console.log(`Failed to log in with existing cookies: ${error}`);
      console.log('Logging in with account credentials...');
      cookies = await textNowHelper.logIn(page, client, username, password);
    }

    try {
      console.log('Successfully logged into TextNow!');
      // Save cookies to file
      await fs.writeFile(
          path.resolve(cacheFolder, `${md5Username}.cookies.json`),
          JSON.stringify(cookies),
      );
    } catch (error) {
      console.log(`Failed to save cookies to file: ${error}`);
    }

    // Select a conversation using recipient info
    console.log('Selecting conversation...');
    await textNowHelper.selectConversation(page, recipient);

    // Send a message to the current recipient
    console.log('Sending message...');
    await textNowHelper.sendMessage(page, message);

    console.log('Message sent!');
    await browser.close();
  } catch (error) {
    console.log(error);

    if (page) {
      await page.screenshot({
        path: path.resolve(cacheFolder, 'error-screenshot.jpg'),
        type: 'jpeg',
      });
    }

    if (browser) {
      await browser.close();
    }

    process.exit(1);
  }
};

(async () => {
  console.log('Start...');
  const config = require('./config');

  const {
    username,
    password,
    cookies,
    recipient,
    message,
    captchaToken,
  } = config;
  const arrUsername = username.split('|');
  const arrPassword = password.split('|');
  const arrCookies = cookies.split('|');
  if (arrUsername.length === arrPassword.length) {
    for (let i = 0, length = arrUsername.length; i < length; i++) {
      const strUsername = arrUsername[i];
      const strPassword = arrPassword[i];
      const strCookies = arrCookies[i];
      console.log(`User: ${strUsername} start...`);
      await actionFunc(strUsername, strPassword, strCookies,
          recipient, message, captchaToken);
      console.log(`User: ${strUsername} end...`);
    }
  } else {
    console.log('Multi user information is error.');
  }

  console.log('End...');
})();
