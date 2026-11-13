const { expect } = require("@playwright/test");

class AccountPage {
    constructor(page) {
        this.page = page;
        this.url = "/account";
        this.pageTitle = page.getByTestId("page-title");
        this.FavoritesLink = page.getByTestId("nav-favorites");
        this.ProfileLink = page.getByTestId("nav-profile");
        this.InvoicesLink = page.getByTestId("nav-invoices");
        this.messageLink = page.getByTestId("nav-messages");
    }

    // ---------- Actions ----------
    async goToInvoices() {
        await this.InvoicesLink.click();
    }

    // ---------- Assertions ----------
    async expectAccountPageOpened(title) {
        await expect(this.page).toHaveURL(this.url);
        await expect(this.pageTitle).toHaveText(title);
    }

}

module.exports = { AccountPage };