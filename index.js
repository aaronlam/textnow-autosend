const actionFunc = async (username, password, recipient, message) => {
  console.log("textnow bot start...");
  const path = require("path");
  const fs = require("fs").promises;
  const puppeteer = require("puppeteer");
  const textNowHelper = require("./utils/helper");

  let browser = null;
  let page = null;
  let md5Username = textNowHelper.md5(username).substr(0, 8);

  try {
    browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
    const client = await page.target().createCDPSession();
    let cookies = null;

    // Importing exsiting cookies from file
    try {
      console.log("Importing existing cookies...");
      const cookiesJSON = await fs.readFile(
        path.resolve(__dirname, `.cahce/${md5Username}.cookies.json`)
      );
      cookies = JSON.parse(cookiesJSON);
    } catch (error) {
      console.log("Failed to import existing cookies.");
    }

    // Log into TextNow and get cookies
    try {
      console.log("Logging in with existing cookies");
      await page.setCookie(...cookies);
      cookies = await textNowHelper.logIn(page, client);
    } catch (error) {
      console.log("Failed to log in with existing cookies.");
      console.log("Logging in with account credentials...");
      cookies = await textNowHelper.logIn(page, client, username, password);
    }

    try {
      console.log("Successfully logged into TextNow!");
      // Save cookies to file
      await fs.writeFile(
        path.resolve(__dirname, `.cahce/${md5Username}.cookies.json`),
        JSON.stringify(cookies)
      );
    } catch (error) {
      console.log("Failed to save cookies to file.");
    }

    // Select a conversation using recipient info
    console.log("Selecting conversation...");
    await textNowHelper.selectConversation(page, recipient);

    // Send a message to the current recipient
    console.log("Sending message...");
    await textNowHelper.sendMessage(page, message);

    console.log("Message sent!");
    await browser.close();
  } catch (error) {
    console.log(error);

    if (page) {
      await page.screenshot({ path: "./error-screenshot.jpg", type: "jpeg" });
    }

    if (browser) {
      await browser.close();
    }

    process.exit(1);
  }
};

(async () => {
  console.log("start...");
  const config = require("./config");

  const { username, password, recipient, message } = config;
  const arrUsername = username.split("|");
  const arrPassword = password.split("|");
  if (arrUsername.length === arrPassword.length) {
    for (let i = 0, length = arrUsername.length; i < length; i++) {
      const strUsername = arrUsername[i];
      const strPassword = arrPassword[i];

      console.log(`User:${strUsername} start...`);
      await actionFunc(strUsername, strPassword, recipient, message);
      console.log(`User:${strUsername} end...`);
    }
  } else {
    console.log("User information is error.");
  }

  console.log("end...");
})();
