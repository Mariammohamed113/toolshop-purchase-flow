const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { RegisterPage } = require("../../pages/RegisterPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");
const { NavBar } = require("../../pages/NavBar");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const data = require("../../data/purchase-journey.json");

test.describe("TC-07 Purchase journey", () => {
    test("TC-07 Full purchase journey from login to payment", async ({ page }) => {
        const loginPage = new LoginPage(page);
        const registerPage = new RegisterPage(page);
        const accountPage = new AccountPage(page);
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const navBar = new NavBar(page);
        const checkoutPage = new CheckoutPage(page);
        const email = data.emailPrefix + Date.now() + data.emailDomain;

        await test.step("Create a new customer", async () => {
            await loginPage.open();
            await loginPage.clickRegisterLink();
            await registerPage.register(data.user, email);
            await loginPage.expectLoginPageOpened();
        });

        await test.step("Login", async () => {
            await loginPage.login(email, data.user.password);
            await accountPage.expectAccountPageOpened(data.accountTitle);
        });

        await test.step("Search for Thor Hammer", async () => {
            await homePage.open();
            await homePage.fillSearchInput(data.searchTerm);
            await homePage.clickSearchButton();
            await homePage.expectResultCount(data.expectedResultCount);
            await homePage.expectProductName(data.productName);
        });

        await test.step("Add to cart", async () => {
            await homePage.clickProduct(data.productName);
            await productPage.expectProductPageOpened(data.productName);
            await productPage.clickAddToCart();
            await navBar.expectCartQuantity(data.quantity);
        });

        await test.step("Checkout", async () => {
            await navBar.openCart();
            await checkoutPage.expectCartOpened();
            await checkoutPage.proceedToSignIn();
            await checkoutPage.proceedToAddress();
            await checkoutPage.fillHouseNumber(data.user.houseNumber);
            await checkoutPage.proceedToPayment();
        });

        await test.step("Pay", async () => {
            await checkoutPage.selectPaymentMethod(data.paymentMethod);
            await checkoutPage.clickFinish();
            await checkoutPage.expectPaymentSuccess(data.paymentSuccessMessage);
            await checkoutPage.clickFinish();
        });

        await test.step("Order confirmed with an invoice number", async () => {
            await checkoutPage.expectOrderConfirmed(data.orderConfirmationText);
        });
    });
});