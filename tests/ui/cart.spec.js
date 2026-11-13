const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");
const { NavBar } = require("../../pages/NavBar");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const data = require("../../data/cart.json");

test.describe("TC-04 Add to cart", () => {
    let loginPage;
    let accountPage;
    let homePage;
    let productPage;
    let navBar;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        navBar = new NavBar(page);

        // precondition: login
        await loginPage.open();
        await loginPage.login(data.user.email, data.user.password);
        await accountPage.expectAccountPageOpened(data.accountTitle);
    });

    test("TC-04 Add Thor Hammer to cart", async () => {
        // search
        await homePage.open();
        await homePage.fillSearchInput(data.searchTerm);
        await homePage.clickSearchButton();
        await homePage.expectResultCount(data.expectedResultCount);

        // read the price from the card
        const cardPrice = await homePage.getProductPrice();

        // open the product
        await homePage.clickProduct(data.productName);

        // name and price match the card
        await productPage.expectProductPageOpened(data.productName);
        await productPage.expectUnitPrice(cardPrice);

        // add to cart
        await productPage.clickAddToCart();

        // toast + badge
        await productPage.expectToastMessage(data.addedToCartMessage);
        await navBar.expectCartQuantity(data.quantity);
    });
});

test.describe("TC-05 Cart", () => {
    let loginPage;
    let accountPage;
    let homePage;
    let productPage;
    let navBar;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        navBar = new NavBar(page);
        checkoutPage = new CheckoutPage(page);

        // precondition 1: login
        await loginPage.open();
        await loginPage.login(data.user.email, data.user.password);
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

    test("TC-05 Cart shows correct line and total", async () => {
        // open the cart
        await navBar.openCart();
        await checkoutPage.expectCartOpened();

        // one line: Thor Hammer × 1
        await checkoutPage.expectCartLine(data.productName, data.expectedCartLines, data.quantity);

        // line price = unit price × quantity
        await checkoutPage.expectLinePrice(data.quantity);

        // ✔ total = line price
        await checkoutPage.expectTotalEqualsLinePrice();
    });
});