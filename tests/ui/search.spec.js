const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const data = require("../../data/search.json");

test.describe("Search", () => {
    let loginPage;
    let accountPage;
    let homePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        homePage = new HomePage(page);

        // precondition: login
        await loginPage.open();
        await loginPage.login(data.user.email, data.user.password);
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