const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { HomePage } = require("../../pages/HomePage");
const { AccountPage } = require("../../pages/AccountPage");
const { RegisterPage } = require("../../pages/RegisterPage");
const { NavBar } = require("../../pages/NavBar");
const data = require("../../data/registration.json");

test.describe("Registration", () => {
    let homePage;
    let loginPage;
    let registerPage;
    let accountPage;
    let navBar;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        accountPage = new AccountPage(page);
        navBar = new NavBar(page);
    });

    test("TC-01 Register a new customer and log in", async () => {
        const email = data.emailPrefix + Date.now() + data.emailDomain;

          // go to the register page
        await homePage.open();
        await navBar.goToSignIn();
        await loginPage.clickRegisterLink();

        // register
        await registerPage.register(data.user, email);

        // landed on login
        await loginPage.expectLoginPageOpened();

        // login with the new account
        await loginPage.login(email, data.user.password);

        // My account + the name
        await accountPage.expectAccountPageOpened(data.accountTitle);
        await navBar.expectUserName(data.user.fullName);
    });

});