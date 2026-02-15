import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/home.page';
import { SectionPage } from '../../../pages/section.page';

test('@regression : Nejčtenější články (horní) - Domácí', async ({ page }) => {
  const home = new HomePage(page);
  const section = new SectionPage(page);

  await home.goto();
  await section.openRubrika('Domácí');

  const mostReadTop = section.mostReadTopRight();

  await mostReadTop.waitForVisible(20000);

  // Horní komponenta nemá obrázky → použijeme správnou metodu
  await mostReadTop.verifyArticlesNoImages();

  await mostReadTop.openAllArticles('top');
});
