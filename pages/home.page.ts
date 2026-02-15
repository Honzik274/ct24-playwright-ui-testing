import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly liveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.liveButton = page.getByRole('button', { name: /živé vysílání/i });
  }

  // Původní metoda – kvůli kompatibilitě testů
  async goto() {
    await this.page.goto('/');
  }

  // Nová metoda – pokud ji chceš používat
  async navigateToHome() {
    await this.page.goto('/');
  }

  async openLiveStream() {
    await this.liveButton.click();
  }
}
