const { expect } = require("@playwright/test");

class NavBar {
  constructor(page) {
    this.page = page;
    this.signInLink = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.invoicesLink = page.getByTestId('nav-my-invoices');
    this.cartIcon = page.getByTestId('nav-cart');
    this.cartBadge = page.getByTestId('cart-quantity');
  }


  // ---------- Actions ----------
  async goToSignIn() {
    await this.signInLink.click();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async goToInvoices() {
    await this.userMenu.click();
    await this.invoicesLink.click();
  }

  // ---------- Assertions ----------
  async expectUserName(name) {
    await expect(this.userMenu).toHaveText(name);
  }

  async expectCartQuantity(qty) {
    await expect(this.cartBadge).toHaveText(String(qty));
  }

}
module.exports = { NavBar };