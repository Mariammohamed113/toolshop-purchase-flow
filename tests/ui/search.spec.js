const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { RegisterPage } = require("../../pages/RegisterPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const data = require("../../data/search.json");

test.describe("Search", () => {
    let loginPage;
    let registerPage;
    let accountPage;
    let homePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        accountPage = new AccountPage(page);
        homePage = new HomePage(page);

        // precondition: a new user every run (unique email) + login
        const email = data.emailPrefix + Date.now() + data.emailDomain;
        await loginPage.open();
        await loginPage.clickRegisterLink();
        await registerPage.register(data.user, email);
        await loginPage.expectLoginPageOpened();
        await loginPage.login(email, data.user.password);
        await accountPage.expectAccountPageOpened(data.accountTitle);
    });

    test("TC-03 Search for Thor Hammer", async () => {
        await homePage.open();
        await homePage.fillSearchInput(data.searchTerm);
        await homePage.clickSearchButton();
        await homePage.expectSearchCaption(data.searchCaption);
        await homePage.expectResultCount(data.expectedResultCount);
        await homePage.expectProductName(data.productName);
    });
});