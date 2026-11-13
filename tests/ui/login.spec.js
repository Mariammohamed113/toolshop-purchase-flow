const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { NavBar } = require("../../pages/NavBar");
const data = require("../../data/login.json");

test.describe("Login", () => {
    let loginPage;
    let accountPage;
    let navBar;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        navBar = new NavBar(page);

        await loginPage.open();
        await loginPage.expectLoginPageOpened();
    });

        test("TC-02 Login with valid test user", async () => {
        await loginPage.login(data.user.email, data.user.password);
        await accountPage.expectAccountPageOpened(data.accountTitle);
        await navBar.expectUserName(data.user.fullName);
    });


});