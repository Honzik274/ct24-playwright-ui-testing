import { Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickLiveBroadcast() {
    const header = this.page.getByTestId('ctg-header');
    await header.getByRole('button', { name: 'Živé vysílání' }).click();
  }
}
