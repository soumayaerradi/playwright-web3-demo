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

test("confirmMetamaskTransaction should confirm transaction for token creation (contract deployment) and check tx data", async () => {
  await sharedPage.click("#createToken");
  const txData = await metamask.confirmTransaction();
  expect(txData.confirmed).toBe(true);
  expect(txData.networkName).not.toBe("");
  expect(txData.customNonce).not.toBe("");
  await expect(sharedPage.locator("#tokenAddresses")).toContainText(/0x.*/, {timeout: 60000});
});

test("rejectMetamaskAddToken should cancel importing a token", async () => {
  await sharedPage.click("#watchAssets");
  const rejected = await metamask.rejectAddToken();
  expect(rejected).toBe(true);
});

test("confirmMetamaskAddToken should confirm importing a token", async () => {
  await sharedPage.click("#watchAssets");
  const confirmed = await metamask.confirmAddToken();
  expect(confirmed).toBe(true);
});

test("importMetamaskToken should import token to metamask", async () => {
  const USDCContractAddressOnSepolia =
    "0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f";
  const tokenData = await metamask.importToken(USDCContractAddressOnSepolia);
  expect(tokenData.tokenContractAddress).toBe(
    USDCContractAddressOnSepolia
  );
  expect(tokenData.tokenSymbol).toBe("USDC");
  expect(tokenData.tokenDecimals).toBe("6");
  expect(tokenData.imported).toBe(true);
});

test("importMetamaskToken should import token to metamask using advanced token settings", async () => {
  const tDAIContractAddressOnSepolia =
    "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0";
  const tokenData = await metamask.importToken({
    address: tDAIContractAddressOnSepolia,
    symbol: "IADt",
  });
  expect(tokenData.tokenContractAddress).toBe(
    tDAIContractAddressOnSepolia
  );
  expect(tokenData.tokenSymbol).toBe("IADt");
  expect(tokenData.tokenDecimals).toBe("18");
  expect(tokenData.imported).toBe(true);
});

test("rejectMetamaskPermissionToSpend should reject permission to spend token", async () => {
  await sharedPage.click("#approveTokens");
  const rejected = await metamask.rejectPermissionToSpend();
  expect(rejected).toBe(true);
});

test("confirmMetamaskPermissionToSpend should approve permission to spend token", async () => {
  await sharedPage.click("#approveTokens");
  const approved = await metamask.confirmPermissionToSpend();
  expect(approved).toBe(true);
});
