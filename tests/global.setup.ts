import { test } from "../fixtures/common-fixture";
import { expect } from "@playwright/test";

test("global setup for auto login", async ({
  page,
  loginPageFixture,
  commonUtilsFixture,
  dashBoardFixture,
}) => {
  console.log("=================================================");
  console.log("GLOBAL SETUP STARTED");
  console.log("=================================================");

  console.log("BASE_URL:", process.env.BASE_URL);
  console.log("USER_NAME (Encrypted):", process.env.USER_NAME);
  console.log("PASSWORD (Encrypted):", process.env.PASSWORD);

  const userName = commonUtilsFixture.encryptData("orangehrm_skbn");
  const password = commonUtilsFixture.encryptData("184G1a0126@");

  console.log("Username Env Exists:", !!userName);
  console.log("Password Env Exists:", !!password);

  console.log("Starting Username Decryption...");
  const dec_userName_data = commonUtilsFixture.decryptData(userName);

  console.log("Starting Password Decryption...");
  const dec_password_data = commonUtilsFixture.decryptData(password);

  console.log("Decrypted Username:", dec_userName_data);
  console.log("Decrypted Password:", dec_password_data);

  console.log("-------------------------------------------------");
  console.log("Launching OrangeHRM...");
  console.log("-------------------------------------------------");

  await loginPageFixture.gotoOrangeHrm();

  console.log("Current URL After Navigation:", page.url());
  console.log("Page Title:", await page.title());

  console.log("-------------------------------------------------");
  console.log("Performing Login...");
  console.log("-------------------------------------------------");

  await loginPageFixture.loginOrangeHrm(dec_userName_data, dec_password_data);

  console.log("Current URL After Login:", page.url());
  console.log("Page Title After Login:", await page.title());

  console.log("-------------------------------------------------");
  console.log("Waiting For Dashboard...");
  console.log("-------------------------------------------------");

  await expect(dashBoardFixture.dashBoardText).toBeVisible({
    timeout: 120000,
  });

  console.log("Dashboard Visible Successfully");

  console.log("-------------------------------------------------");
  console.log("Saving Authentication State...");
  console.log("-------------------------------------------------");

  await page.context().storageState({
    path: "./PlaywrightAuthFile/.auth/auth.json",
  });

  console.log("Storage State Saved: ./PlaywrightAuthFile/.auth/auth.json");

  console.log("Cookies Count:", (await page.context().cookies()).length);

  console.log("Final URL:", page.url());

  console.log("=================================================");
  console.log("GLOBAL SETUP COMPLETED SUCCESSFULLY");
  console.log("=================================================");
});
