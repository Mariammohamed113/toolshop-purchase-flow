const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { RegisterPage } = require("../../pages/RegisterPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");
const { NavBar } = require("../../pages/NavBar");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { InvoicesPage } = require("../../pages/InvoicesPage");
const data = require("../../data/checkout.json");

test.describe("TC-06 Checkout", () => {
    let loginPage;
    let registerPage;
    let accountPage;
    let homePage;
    let productPage;
    let navBar;
    let checkoutPage;
    let invoicesPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        accountPage = new AccountPage(page);
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        navBar = new NavBar(page);
        checkoutPage = new CheckoutPage(page);
        invoicesPage = new InvoicesPage(page);

        // precondition 1: a new user every run (unique email) + login
        const email = data.emailPrefix + Date.now() + data.emailDomain;
        await loginPage.open();
        await loginPage.clickRegisterLink();
        await registerPage.register(data.user, email);
        await loginPage.expectLoginPageOpened();
        await loginPage.login(email, data.user.password);
        await accountPage.expectAccountPageOpened(data.accountTitle);

        // precondition 2: add Thor Hammer to cart
        await homePage.open();
        await homePage.fillSearchInput(data.searchTerm);
        await homePage.clickSearchButton();
        await homePage.expectResultCount(data.expectedResultCount);
        await homePage.clickProduct(data.productName);
        await productPage.clickAddToCart();
        await navBar.expectCartQuantity(data.quantity);
    });

    test("TC-06 Checkout with an assert after every step", async () => {
        // 1. cart line correct
        await navBar.openCart();
        await checkoutPage.expectCartOpened();
        await checkoutPage.expectCartLine(data.productName, data.expectedCartLines, data.quantity);
        await checkoutPage.expectLinePrice(data.quantity);
        await checkoutPage.expectTotalEqualsLinePrice();

        // 2. sign-in step skipped ("already logged in")
        await checkoutPage.proceedToSignIn();
        await checkoutPage.expectAlreadyLoggedIn(data.alreadyLoggedInMessage);

        // 3. billing address prefilled with the user's data
        await checkoutPage.proceedToAddress();
        await checkoutPage.expectBillingAddressPrefilled(data.user);
        await checkoutPage.fillHouseNumber(data.user.houseNumber);

        // 4. "Payment was successful"
        await checkoutPage.proceedToPayment();
        await checkoutPage.selectPaymentMethod(data.paymentMethod);
        await checkoutPage.clickFinish();
        await checkoutPage.expectPaymentSuccess(data.paymentSuccessMessage);

        // 5. order confirmed with an invoice number
        await checkoutPage.clickFinish();
        await checkoutPage.expectOrderConfirmed(data.orderConfirmationText);
        const invoiceNumber = await checkoutPage.getInvoiceNumber();

        // 6. invoice listed in My invoices
        await navBar.goToInvoices();
        await invoicesPage.expectInvoicesPageOpened(data.invoicesTitle);
        await invoicesPage.expectInvoiceListed(invoiceNumber);
    });
});