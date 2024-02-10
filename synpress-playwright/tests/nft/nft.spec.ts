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

test("deployNFTs should deploy NFTs", async () => {
  await sharedPage.click("#deployNFTsButton");
  await metamask.confirmTransaction();
});

test("mintNFT should mint NFT", async () => {
  await sharedPage.click("#mintButton");
  await metamask.confirmTransaction();
});

test("rejectMetamaskPermisionToApproveAll should reject permission to approve all collectibles upon warning", async () => {
  await sharedPage.click("#setApprovalForAllButton");
  const rejected = await metamask.rejectPermisionToApproveAll();
  expect(rejected).toBe(true);
});

test("confirmMetamaskPermisionToApproveAll should confirm permission to approve all collectibles", async () => {
  await sharedPage.click("#setApprovalForAllButton");
  const confirmed = await metamask.confirmPermisionToApproveAll();
  expect(confirmed).toBe(true);
});

test("rejectMetamaskPermisionToTransfer should reject permission to transfer collectible upon warning", async () => {
  await sharedPage.click("#transferFromButton");
  await metamask.rejectTransaction();
});

test("confirmMetamaskPermisionToTransfer should confirm permission to transfer collectible", async () => {
  await sharedPage.click("#transferFromButton");
  await metamask.confirmTransaction();
});
