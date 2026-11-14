const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { RegisterPage } = require("../../pages/RegisterPage");
const { AccountPage } = require("../../pages/AccountPage");
const { NavBar } = require("../../pages/NavBar");
const data = require("../../data/login.json");

test.describe("Login", () => {
    let loginPage;
    let registerPage;
    let accountPage;
    let navBar;
    let email;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        accountPage = new AccountPage(page);
        navBar = new NavBar(page);

        // create the test user from data/ (unique email each run)
        email = data.emailPrefix + Date.now() + data.emailDomain;
        await loginPage.open();
        await loginPage.clickRegisterLink();
        await registerPage.register(data.user, email);

        // precondition: the login page is open
        await loginPage.expectLoginPageOpened();
    });

    test("TC-02 Login with valid test user", async () => {
        await loginPage.login(email, data.user.password);
        await accountPage.expectAccountPageOpened(data.accountTitle);
        await navBar.expectUserName(data.user.fullName);
    });
});