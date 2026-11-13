const { expect } = require("@playwright/test");

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.url = "/checkout";
        this.cartItemNames = page.getByTestId("product-title");
        this.quantityInput = page.getByTestId("product-quantity");
        this.itemPrice = page.getByTestId("product-price");
        this.linePrice = page.getByTestId("line-price");
        this.cartTotal = page.getByTestId("cart-total");

    }

    // ---------- Assertions ----------
    async expectCartOpened() {
        await expect(this.page).toHaveURL(this.url);
    }

    async expectCartLine(productName, lineCount, quantity) {
        await expect(this.cartItemNames).toHaveCount(lineCount);
        await expect(this.cartItemNames).toContainText(productName);
        await expect(this.quantityInput).toHaveValue(String(quantity));
    }

    async expectLinePrice(quantity) {
        const unitPrice = Number((await this.itemPrice.textContent()).replace("$", ""));
        const expectedLinePrice = "$" + (unitPrice * quantity).toFixed(2);
        await expect(this.linePrice).toHaveText(expectedLinePrice);
    }

    async expectTotalEqualsLinePrice() {
        const linePrice = await this.linePrice.textContent();
        await expect(this.cartTotal).toHaveText(linePrice);
    }

}

module.exports = { CheckoutPage };