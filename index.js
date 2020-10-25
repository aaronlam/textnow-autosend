(async () => {
  console.log("textnow bot start...");
  const path = require("path");
  const fs = require("fs").promises;
  const puppeteer = require("puppeteer");
  const textNowHelper = require("./utils/helper");
  const config = require("./config");
  const {
    username = "",
    password = "",
    recipient = "(726) 666-0002",
    message = "message",
  } = config;

  let browser = null;
  let page = null;

  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    const client = await page.target().createCDPSession();
    let cookies = null;

    // Importing exsiting cookies from file
    try {
      console.log("Importing existing cookies...");
      const cookiesJSON = await fs.readFile(
        path.resolve(__dirname, ".cahce/cookies.json")
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

    // Save cookies to file
    console.log("Successfully logged into TextNow!");
    await fs.writeFile(
      path.resolve(__dirname, ".cache/cookies.json"),
      JSON.stringify(cookies)
    );

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
})();
