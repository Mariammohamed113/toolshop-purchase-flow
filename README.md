# Toolshop Purchase Flow – Playwright + JavaScript

Automated UI tests for the purchase flow of [practicesoftwaretesting.com](https://practicesoftwaretesting.com):
register, log in, search for Thor Hammer, add it to the cart, check out, pay and confirm the order.

Built with **Playwright + JavaScript** and the **Page Object Model**.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm

## Install

```bash
git clone https://github.com/Mariammohamed113/toolshop-purchase-flow.git
cd toolshop-purchase-flow
npm install
npx playwright install chromium
```

## Run the tests

| What | Command |
|---|---|
| All tests | `npm test` |
| One test case | `npx playwright test -g "TC-05"` |
| In a visible browser | `npx playwright test --headed` |
| Only the E2E journey (TC-07) | `npx playwright test tests/e2e` |
| In parallel with 4 workers | `npx playwright test --workers=4` |
| Open the last Playwright HTML report | `npx playwright show-report` |
| Run all tests and open an Allure report of that run | `npx allure run --open -- npx playwright test` |

## Test cases

| ID | Spec file | What it checks |
|---|---|---|
| TC-01 | `tests/ui/registration.spec.js` | Register a new customer, land on login, log in, see My account and the user's name |
| TC-02 | `tests/ui/login.spec.js` | Log in with the test user: URL `/account`, title "My account", name in the menu |
| TC-03 | `tests/ui/search.spec.js` | Search "Thor Hammer": caption "Searched for: Thor Hammer" and exactly 1 result |
| TC-04 | `tests/ui/cart.spec.js` | Open Thor Hammer: name and price match the search card, toast, cart badge = 1 |
| TC-05 | `tests/ui/cart.spec.js` | Cart: one line, line price = unit price × quantity, total = line price |
| TC-06 | `tests/ui/checkout.spec.js` | Full checkout with an assert after every step, invoice listed in My invoices |
| TC-07 | `tests/e2e/purchase-journey.spec.js` | Full journey (new customer → login → search → cart → checkout → pay), each stage in `test.step()` |

## Project structure

```
pages/        Page objects: locators in the constructor, then actions, then expect... checks
  NavBar.js, LoginPage.js, RegisterPage.js, AccountPage.js,
  HomePage.js, ProductPage.js, CheckoutPage.js, InvoicesPage.js
tests/ui/     One spec file per feature (TC-01 to TC-06)
tests/e2e/    purchase-journey.spec.js (TC-07)
data/         One JSON file per spec, with the same name
```

## Design notes

- **Page Object Model:** only page objects touch the browser. Specs read their data and call page-object methods, and contain no locators or `expect()` calls.
- **Preconditions** are in `beforeEach`, so every test is independent and passes on its own and in parallel.
- **A new user per test:** every test that needs an account registers a new customer with a unique email (`Date.now()`), using the user details from its JSON file. Tests never share an account, so a locked or changed demo account can't break them.
- **No hard-coded prices or ids:** prices are read from the page (the search card, the cart line) and compared.
- **No** `waitForTimeout`, `nth()` or `first()`: tests rely on Playwright's auto-waiting and web-first assertions.

## Known limitation of the demo site

Thor Hammer has limited stock on the shared demo site, and every completed order (TC-06, TC-07) uses one.
If the stock runs out, **Add to cart** is disabled and TC-04 to TC-07 fail in their setup until the site restocks it.
