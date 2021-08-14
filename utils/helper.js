const loginUrl = 'https://www.textnow.com/login';
const messagingUrl = 'https://www.textnow.com/messaging';

/**
 * Log into TextNow and get cookies
 * @param {object} page Puppeteer browser page
 * @param {object} client Puppeteer CDPSession
 * @param {string} username Optional account credential
 * @param {string} password Optional account credential
 * @return {object} Updated login cookies
 */
module.exports.logIn = async (
    page, client, username = undefined, password = undefined) => {
  await Promise.all([
    page.goto(loginUrl),
    page.waitForNavigation({waitUtil: 'networkidle2'}),
  ]);

  // Resolve captcha if found.
  if (await page.$('div.cf-captcha-container') !== null) {
    console.log('hCaptcha was found, try to solve.');

    await page.waitForSelector('iframe[title~="hCaptcha"]');

    await Promise.all([
      page.solveRecaptchas(),
      page.waitForNavigation(),
    ]);
  }

  if (username && password) {
    await page.type('#txt-username', username);
    await page.type('#txt-password', password);

    const logInButton = await page.waitForSelector('#btn-login');
    await Promise.all([
      logInButton.click(),
      page.waitForNavigation({waitUtil: 'networkidle2'}),
    ]);

    return (await client.send('Network.getAllCookies')).cookies;
  }

  const isLoggedIn = page.url() === messagingUrl;
  if (!isLoggedIn) {
    await client.send('Network.clearBrowserCookies');
    throw new Error('Detected invalid or expires cookies');
  }

  return (await client.send('Network.getAllCookies')).cookies;
};

/**
 * Select a conversation using recipient info
 * @param {object} page Puppeteer browser page
 * @param {string} recipient Recipient info
 */
module.exports.selectConversation = async (page, recipient) => {
  await Promise.all([
    page.goto(messagingUrl),
    page.waitForNavigation({waitUtil: 'networkidle2'}),
  ]);

  await page.waitForTimeout(5000);

  await page.$eval('#newText', (element) => element.click());
  await page.waitForTimeout(500);

  const recipientField = await page.waitForSelector(
      '.newConversationTextField',
  );
  await page.waitForTimeout(500);
  await recipientField.type(recipient);
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
};

/**
 * Send a message to the current recipient
 * @param {object} page Puppeteer browser page
 * @param {string } message Message content
 */
module.exports.sendMessage = async (page, message) => {
  const messageField = await page.waitForSelector('#text-input');
  await page.waitForTimeout(500);
  await messageField.type(message);
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
};

/**
 * Encipher string and return the result
 * @param {string} str crypto string
 */
module.exports.md5 = (str) => {
  const crypto = require('crypto');
  const md5 = crypto.createHash('md5');
  md5.update(str, 'utf8');

  return md5.digest('hex').toUpperCase();
};
