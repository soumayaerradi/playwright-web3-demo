# Playwright Web3 demo using Synpress 

🔥 Synpress works out-of-the-box with other frameworks! There is no need to use it directly.

## Supported wallets

- [MetaMask](https://metamask.io/)

## Available examples

- [Synpress](https://github.com/synpress-io/synpress-examples/tree/master/synpress) => examples of how to use synpress directly.
- [Playwright](https://github.com/synpress-io/synpress-examples/tree/master/playwright) => examples of how to use synpress with Playwright.
  - [isolated-state](https://github.com/synpress-io/synpress-examples/tree/master/playwright/isolated-state) => example setup of Playwright with synpress using isolated state meaning that each test is run in a separate browser context with fresh instance of metamask extension. Test isolation is preferred way of running tests, but it takes more time for setting up metamask extension before each test.
  - [shared-state](https://github.com/synpress-io/synpress-examples/tree/master/playwright/shared-state) => example setup of Playwright with synpress using shared state meaning that each test is run in same browser context and share same instance of metamask extension.
