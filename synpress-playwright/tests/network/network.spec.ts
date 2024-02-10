import { test, expect } from "../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import * as helpers from "@synthetixio/synpress/helpers";
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

test("getCurrentNetwork should return network by default", async () => {
  const network = await helpers.getCurrentNetwork();
  expect(network.name).toMatch(/sepolia/i);
  expect(network.id).toBe(11155111);
  expect(network.testnet).toBe(true);
});

test("addMetamaskNetwork should add custom network", async () => {
  const networkAdded = await metamask.addNetwork({
    networkName: 'Optimism Network',
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: '0xa',
    symbol: 'oETH',
    blockExplorer: 'https://optimistic.etherscan.io',
    isTestnet: false,
  });
  expect(networkAdded).toBe(true);
  await expect(sharedPage.locator("#network")).toHaveText("0xa");
  await expect(sharedPage.locator("#chainId")).toHaveText("0xa");
});

test("getCurrentNetwork should return valid network after adding a new network", async () => {
  const network = await helpers.getCurrentNetwork();
  expect(network.name).toMatch(/optimism network/i);
  expect(network.id).toBe('0xa');
  expect(network.testnet).toBe(false);
});

test("changeMetamaskNetwork should change network using pre-defined network", async () => {
  const networkChanged = await metamask.changeNetwork('ethereum');
  expect(networkChanged).toBe(true);
  await expect(sharedPage.locator("#network")).toHaveText("0x1");
  await expect(sharedPage.locator("#chainId")).toHaveText("0x1");
});

