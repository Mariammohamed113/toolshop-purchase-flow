const { expect } = require("@playwright/test");

class HomePage {
    constructor(page) {
        this.page = page;
        this.searchInput = page.getByTestId("search-query");
        this.searchButton = page.getByTestId("search-submit");
        this.searchTerm = page.getByTestId("search-term");
        this.searchCaption = page.getByTestId("search-caption");
        this.productNames = page.getByTestId("product-name");
    }

    // ---------- Actions ----------
    async open() {
        await this.page.goto("/");
    }


    async fillSearchInput(searchQuery) {
        await this.searchInput.fill(searchQuery);
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    async clickProduct(productName) {
        await this.productNames.filter({ hasText: productName }).click();
    }

    // ---------- Assertions ----------   
    async expectPageTitle(ExpectedTitle) {
        await expect(this.page).toHaveTitle(ExpectedTitle);
    }

    async expectSearchInputVisible() {
        await expect(this.searchInput).toBeVisible();
    }

    async expectSearchButtonVisible() {
        await expect(this.searchButton).toBeVisible();
    }

    async expectSearchResult(searchQuery) {
        await expect(this.searchTerm).toHaveText(searchQuery);
    }

    async expectResultCount(count) {
        await expect(this.productNames).toHaveCount(count);
    }

    async expectProductName(productName) {
        await expect(this.productNames).toHaveText(productName);
    }

    async expectSearchCaption(caption) {
        await expect(this.searchCaption).toHaveText(caption);
    }

}

module.exports = { HomePage };



