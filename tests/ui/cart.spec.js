const { test } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");   
const { NavBar } = require("../../pages/NavBar");            
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

        // ✔ name and price match the card
        await productPage.expectProductPageOpened(data.productName);
        await productPage.expectUnitPrice(cardPrice);

        // add to cart
        await productPage.clickAddToCart();

        // message + badge
        await productPage.expectToastMessage(data.addedToCartMessage);
        await navBar.expectCartQuantity(data.quantity);
    });
});