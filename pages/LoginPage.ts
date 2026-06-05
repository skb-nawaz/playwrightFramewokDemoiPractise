import type { Locator, Page } from "@playwright/test";

class LoginPage {
  readonly page: Page;
  readonly userName: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentailsError: Locator;

  constructor(page: Page) {
    console.log("========== LoginPage Constructor ==========");
    console.log("Page initialized");

    this.page = page;

    this.userName = page.getByRole("textbox", { name: "Username" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.invalidCredentailsError = page.getByRole("alert");
  }

  /**
   * Open OrangeHRM URL
   */
  async gotoOrangeHrm() {
    const url = `${process.env.BASE_URL}web/index.php/auth/login`;

    console.log("========== GOTO ORANGE HRM ==========");
    console.log("BASE_URL:", process.env.BASE_URL);
    console.log("Final URL:", url);
    console.log("Current URL Before Navigation:", this.page.url());

    const startTime = Date.now();

    await this.page.goto(url, {
      timeout: 120000,
      waitUntil: "domcontentloaded",
    });

    console.log("Navigation completed");
    console.log("Current URL After Navigation:", this.page.url());
    console.log("Page Title:", await this.page.title());
    console.log("Elapsed Time(ms):", Date.now() - startTime);

    const usernameVisible = await this.userName.isVisible().catch(() => false);

    console.log("Username Visible:", usernameVisible);

    console.log("=====================================");
  }

  /**
   * Login into OrangeHRM
   */
  async loginOrangeHrm(username: string, password: string) {
    console.log("========== LOGIN START ==========");
    console.log("Username:", username);
    console.log("Password:", password);

    console.log("Current URL:", this.page.url());
    console.log("Page Title:", await this.page.title());

    console.log("Filling Username...");
    await this.userName.fill(username, {
      timeout: 120000,
    });
    console.log("Username Filled");

    console.log("Filling Password...");
    await this.password.fill(password, {
      timeout: 120000,
    });
    console.log("Password Filled");

    console.log("Clicking Login Button...");
    const startTime = Date.now();

    await this.loginButton.click({
      timeout: 120000,
    });

    console.log("Login Button Clicked");
    console.log("Elapsed Time(ms):", Date.now() - startTime);

    await this.page.waitForTimeout(5000);

    console.log("Current URL After Login:", this.page.url());
    console.log("Page Title After Login:", await this.page.title());

    const alertVisible = await this.invalidCredentailsError
      .isVisible()
      .catch(() => false);

    console.log("Error Alert Visible:", alertVisible);

    if (alertVisible) {
      console.log(
        "Error Message:",
        await this.invalidCredentailsError.textContent(),
      );
    }

    console.log("========== LOGIN END ==========");
  }
}

export default LoginPage;
