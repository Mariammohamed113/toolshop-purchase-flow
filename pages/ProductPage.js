const { expect } = require("@playwright/test");

class ProductPage {

    constructor(page) {
        this.page = page;
        this.productName = page.getByTestId("product-name");
        this.addToCartButton = page.getByTestId("add-to-cart");
        this.unitPrice = page.getByTestId("unit-price");
        this.toastMessage = page.locator(".toast-success");
    }

    // ---------- Actions ----------
    async clickAddToCart() {
        await this.addToCartButton.click();
    }


    // ---------- Assertions ----------
    async expectProductPageOpened(expectedProductName) {
        await expect(this.productName).toContainText(expectedProductName);
    }

    async expectUnitPrice(price) {
        await expect(this.unitPrice).toHaveText(price);
    }

    async expectToastMessage(message) {
        await expect(this.toastMessage).toHaveText(message);
    }


}
module.exports = { ProductPage };