import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { MostReadComponent } from '../components/mostRead.component';

export class SectionPage extends BasePage {

  currentRubrikaUrl: string = ''; // ⭐ DOPLNĚNO – tohle opraví chybu TS2339

  constructor(page: Page) {
    super(page);
  }

  async openRubrika(name: string): Promise<void> {
    const burger = this.page.getByTestId('menu-button');

    if (await burger.isVisible().catch(() => false)) {
      await burger.click();

      const mobileLink = this.page
        .locator('.ctg-header__context-menu-item-link')
        .filter({ hasText: name });

      await expect(mobileLink).toBeVisible();
      await mobileLink.click();
    } else {
      const link = this.page
        .getByTestId('ctg-header')
        .getByRole('link', { name });

      await expect(link).toBeVisible();
      await link.click();
    }

    // ⭐ Stabilizace načtení rubriky
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');

    // ⭐ Uložíme URL rubriky
    this.currentRubrikaUrl = this.page.url();
  }

  mostReadBottom(): MostReadComponent {
    const heading = this.page.locator('h2.wc-ta__header-title', { hasText: 'Nejčtenější' });
    const section = heading.locator('xpath=ancestor::section');
    return new MostReadComponent(this.page, section, this.currentRubrikaUrl);
  }

  mostReadTopRight(): MostReadComponent {
    const heading = this.page.locator('h2, h3').filter({
      hasText: /nejčtenější z rubriky/i
    });

    const wrapper = heading
      .locator('xpath=ancestor::*[contains(@class, "wc-ta")]')
      .first();

    return new MostReadComponent(this.page, wrapper, this.currentRubrikaUrl);
  }
}
