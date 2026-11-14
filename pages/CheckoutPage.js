const { expect } = require("@playwright/test");

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.url = "/checkout";

        // ----- Step 1: Cart -----
        this.cartItemNames = page.getByTestId("product-title");
        this.quantityInput = page.getByTestId("product-quantity");
        this.itemPrice = page.getByTestId("product-price");
        this.linePrice = page.getByTestId("line-price");
        this.cartTotal = page.getByTestId("cart-total");
        this.proceedToSignInButton = page.getByTestId("proceed-1");

        // ----- Step 2: Sign in -----
        this.signInStep = page.locator("app-login");
        this.proceedToAddressButton = page.getByTestId("proceed-2");

        // ----- Step 3: Billing Address -----
        this.streetInput = page.getByTestId("street");
        this.cityInput = page.getByTestId("city");
        this.stateInput = page.getByTestId("state");
        this.countryInput = page.getByTestId("country");
        this.postalCodeInput = page.getByTestId("postal_code");
        this.houseNumberInput = page.getByTestId("house_number");
        this.proceedToPaymentButton = page.getByTestId("proceed-3");

        // ----- Step 4: Payment -----
        this.paymentMethodSelect = page.getByTestId("payment-method");
        this.finishButton = page.getByTestId("finish");
        this.paymentSuccessMessage = page.getByTestId("payment-success-message");

        // ----- Confirmation -----
        this.orderConfirmation = page.locator("#order-confirmation");
        this.invoiceNumber = page.locator("#order-confirmation span");
    }

    // ---------- Actions ----------
    async proceedToSignIn() {
        await this.proceedToSignInButton.click();
    }

    async proceedToAddress() {
        await this.proceedToAddressButton.click();
    }

    async fillHouseNumber(houseNumber) {
        await this.houseNumberInput.fill(houseNumber);
    }

    async proceedToPayment() {
        await this.proceedToPaymentButton.click();
    }

    async selectPaymentMethod(method) {
        await this.paymentMethodSelect.selectOption({ label: method });
    }

    async clickFinish() {
        await this.finishButton.click();
    }

    async getInvoiceNumber() {
        return await this.invoiceNumber.textContent();
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

    async expectAlreadyLoggedIn(message) {
        await expect(this.signInStep).toContainText(message);
    }

    async expectBillingAddressPrefilled(address) {
        await expect(this.streetInput).toHaveValue(address.street);
        await expect(this.cityInput).toHaveValue(address.city);
        await expect(this.stateInput).toHaveValue(address.state);
        await expect(this.countryInput).toHaveValue(address.country);
        await expect(this.postalCodeInput).toHaveValue(address.postalCode);
    }

    async expectPaymentSuccess(message) {
        await expect(this.paymentSuccessMessage).toHaveText(message);
    }

    async expectOrderConfirmed(confirmationText) {
        await expect(this.orderConfirmation).toContainText(confirmationText);
        await expect(this.invoiceNumber).not.toBeEmpty();
    }
}

module.exports = { CheckoutPage };