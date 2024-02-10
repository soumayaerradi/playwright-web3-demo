import { test, expect } from "../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { type Page } from "@playwright/test";

let sharedPage: Page;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ page }) => {
  sharedPage = page;
  await sharedPage.goto("http://localhost:3000");
});

test.afterAll(async ({}) => {
  await sharedPage.close();
});

test("acceptMetamaskAccess should accept connection request to metamask", async () => {
  await sharedPage.click("#connectButton");
  const connected = await metamask.acceptAccess();
  expect(connected).toBe(true);
  await expect(sharedPage.locator("#network")).toHaveText("11155111");
  await expect(sharedPage.locator("#chainId")).toHaveText("0xaa36a7");
  await expect(sharedPage.locator("#accounts")).toHaveText(
    "0xc3c6f796335f9d1cceeb4f0ad92a21d6ad48a117"
  );
});

test("connect wallet using default metamask account", async () => {
  await metamask.disconnectWalletFromAllDapps();
  await sharedPage.click("#connectButton");
  await metamask.acceptAccess();
  await expect(sharedPage.locator("#accounts")).toHaveText(
    "0xc3c6f796335f9d1cceeb4f0ad92a21d6ad48a117"
  );
});

test("import private key and connect wallet using imported metamask account", async () => {
  await metamask.disconnectWalletFromAllDapps();
  await metamask.importAccount(
    "7f7fb59418ef0ca2583d1a7e899078347ab2e19d823fef3fb2d43497bde0fb9f"
  );
  await sharedPage.click("#connectButton");
  await metamask.acceptAccess();
  await expect(sharedPage.locator("#accounts")).toHaveText(
    "0x99207f24db020810b9b63fec17e1cfa1801e4c28"
  );
});


// FIXME: The next 3 tests are not showing anything on the browser because the metamask popup is hidden
/*
test("createMetamaskAccount should create new account with default name", async () => {
  const created = await metamask.createAccount();
  expect(created).toBe(true);
});

test("createMetamaskAccount should create new account with custom name", async () => {
  const created = await metamask.createAccount("custom-wallet");
  expect(created).toBe(true);
});

test("createMetamaskAccount should not fail when creating new account with already existing custom name", async () => {
  const created = await metamask.createAccount("custom-wallet");
  expect(created).toBe("This account name already exists");
});
*/
