module.exports.visit = async (page, url) => {
    await Promise.all([
        page.goto(url),
        page.waitForNavigation({ waitUtil: "networkidle2" }),
    ]);
};
