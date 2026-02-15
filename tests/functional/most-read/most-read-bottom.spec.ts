import { test } from '@playwright/test';
import { HomePage } from '../../../pages/home.page';
import { SectionPage } from '../../../pages/section.page';

// Hlavní rubriky
const rubriky = ['Hlavní události', 'Ukrajina', 'Domácí'];

for (const rubrika of rubriky) {
  test(`@smoke @regression : Nejčtenější články (dolní) - ${rubrika}`, async ({ page }) => {
    const home = new HomePage(page);
    const section = new SectionPage(page);

    // Navigace
    await home.goto();
    await section.openRubrika(rubrika);

    // Komponenta až po načtení rubriky
    const mostReadBottom = section.mostReadBottom();

    await mostReadBottom.waitForVisible(20000);
    await mostReadBottom.verifyArticles();
    await mostReadBottom.switchView('za 24 hodin');
    await mostReadBottom.switchView('za 7 dní');
    await mostReadBottom.openAllArticles('bottom');
  });
}
