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

test("rejectMetamaskEncryptionPublicKeyRequest should reject public encryption key request", async () => {
  await sharedPage.click("#getEncryptionKeyButton");
  const rejected = await metamask.rejectEncryptionPublicKeyRequest();
  expect(rejected).toBe(true);
  await expect(sharedPage.locator("#encryptionKeyDisplay")).toHaveText(
    "Error: MetaMask EncryptionPublicKey: User denied message EncryptionPublicKey."
  );
});

test("confirmMetamaskEncryptionPublicKeyRequest should confirm public encryption key request", async () => {
  await sharedPage.click("#getEncryptionKeyButton");
  const confirmed = await metamask.confirmEncryptionPublicKeyRequest();
  expect(confirmed).toBe(true);
  await expect(sharedPage.locator("#encryptionKeyDisplay")).toHaveText(
    "zhoSmidt69sNWTn8BSvPdlGC6UrgL9CNllCAR8nghQo="
  );
});

test("confirmMetamaskDecryptionRequest should confirm request to decrypt message with private key", async () => {
  await sharedPage.type("#encryptMessageInput", "test message");
  await sharedPage.click("#encryptButton");
  await expect(sharedPage.locator("#ciphertextDisplay")).toContainText("0x7");
  await sharedPage.click("#decryptButton");
  const confirmed = await metamask.confirmDecryptionRequest();
  expect(confirmed).toBe(true);
  await expect(sharedPage.locator("#cleartextDisplay")).toHaveText("test message");
});

test("rejectMetamaskDecryptionRequest should reject request to decrypt message with private key", async () => {
  await sharedPage.click("#decryptButton");
  const rejected = await metamask.rejectDecryptionRequest();
  expect(rejected).toBe(true);
  await expect(sharedPage.locator("#cleartextDisplay")).toHaveText(
    "Error: MetaMask Decryption: User denied message decryption."
  );
});
