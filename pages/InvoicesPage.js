const { expect } = require("@playwright/test");

class InvoicesPage {
    constructor(page) {
        this.page = page;
        this.url = "/account/invoices";
        this.pageTitle = page.getByTestId("page-title");
        this.invoiceRows = page.locator("tbody tr");
    }

    // ---------- Assertions ----------
    async expectInvoicesPageOpened(title) {
        await expect(this.page).toHaveURL(this.url);
        await expect(this.pageTitle).toHaveText(title);
    }

    async expectInvoiceListed(invoiceNumber) {
        await expect(this.invoiceRows.filter({ hasText: invoiceNumber })).toHaveCount(1);
    }
}

module.exports = { InvoicesPage };