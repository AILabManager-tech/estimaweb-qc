import { expect, test, type Download, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(() =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  ).toBe(true);
}

async function expectValidPdf(download: Download, locale: "fr" | "en") {
  expect(download.suggestedFilename()).toMatch(
    new RegExp(`^estimaweb-qc-${locale}-\\d{4}-\\d{2}-\\d{2}\\.pdf$`)
  );
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();
  const chunks: Buffer[] = [];
  if (stream) {
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);
  expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
  expect(buffer.byteLength).toBeGreaterThan(5_000);
}

test("complete French flow supports keyboard, back, editing, recalculation, PDF and refresh", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("votre site web");
  await expect(page.getByText("Aucune donnée transmise")).toBeVisible();
  await page.getByRole("button", { name: "Démarrer l'estimation" }).click();

  const next = page.getByRole("button", { name: "Suivant" });
  await expect(next).toBeDisabled();
  const legal = page.getByRole("radio", { name: /Juridique/ });
  await legal.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio", { name: /Médical/ })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("radio", { name: /PME générale/ }).click();
  await next.click();

  await page.getByRole("button", { name: "Précédent" }).click();
  await expect(page.getByRole("radio", { name: /PME générale/ })).toHaveAttribute("aria-checked", "true");
  await next.click();
  await page.getByRole("radio", { name: /E-commerce basique/ }).click();
  await next.click();

  const booking = page.getByRole("checkbox", { name: /Réservation en ligne/ });
  await booking.click();
  await expect(booking).toHaveAttribute("aria-checked", "true");
  await booking.click();
  await expect(booking).toHaveAttribute("aria-checked", "false");
  await booking.click();
  const payment = page.getByRole("checkbox", { name: /Paiement en ligne/ });
  await expect(payment).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByText("Cette fonctionnalité est déjà comprise dans une autre sélection.").first()).toBeVisible();
  await payment.focus();
  await page.keyboard.press("Space");
  await expect(payment).toHaveAttribute("aria-checked", "false");
  await page.getByRole("checkbox", { name: /Google Business/ }).click();
  await next.click();

  await page.getByRole("radio", { name: /Bilingue.*Exactement deux langues/ }).click();
  await page.getByRole("button", { name: "Voir mon estimation" }).click();
  await expect(page.getByRole("heading", { name: "Votre estimation personnalisée" })).toBeVisible();
  await expect(page.getByText(/15.?755/).first()).toBeVisible();
  await expect(page.getByText("Bilingue, exactement deux langues")).toBeVisible();
  await expect(page.getByText(/Estimations basées sur la grille tarifaire interne d’Auxo Systems/)).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger le PDF" }).click();
  await expectValidPdf(await downloadPromise, "fr");

  await page.getByRole("button", { name: "Modifier mes réponses" }).click();
  await expect(page.getByRole("radio", { name: /PME générale/ })).toHaveAttribute("aria-checked", "true");
  await next.click();
  await next.click();
  await page.getByRole("checkbox", { name: /Réservation en ligne/ }).click();
  await next.click();
  await page.getByRole("button", { name: "Voir mon estimation" }).click();
  await expect(page.getByText(/13.?455/).first()).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Quel est votre secteur d'activité?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Suivant" })).toBeDisabled();
});

test("complete English flow produces the independent custom-app total and an English PDF", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Start the estimate" }).click();
  const next = page.getByRole("button", { name: "Next", exact: true });
  await page.getByRole("radio", { name: /Regulated professions/ }).click();
  await next.click();
  await page.getByRole("radio", { name: /Custom platform/ }).click();
  await next.click();
  await page.getByRole("checkbox", { name: /Client portal/ }).click();
  await page.getByRole("checkbox", { name: /CRM integration/ }).click();
  await page.getByRole("checkbox", { name: /Business software integration/ }).click();
  await next.click();
  await page.getByRole("button", { name: "See my estimate" }).click();

  await expect(page.getByRole("heading", { name: "Your personalized estimate" })).toBeVisible();
  await expect(page.getByText(/81,363/).first()).toBeVisible();
  await expect(page.getByText("A free tool by Auxo Systems")).toBeVisible();
  await expect(page.getByText("One language", { exact: true })).toBeVisible();
  await expect(page.getByText(/Estimates based on Auxo Systems’ internal pricing grid/)).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  await expectValidPdf(await downloadPromise, "en");
});

test("specialized medical options replace generic features and the language mode stays exclusive", async ({ page }) => {
  await page.goto("/fr");
  await page.getByRole("button", { name: "Démarrer l'estimation" }).click();
  const next = page.getByRole("button", { name: "Suivant" });
  await page.getByRole("radio", { name: /Médical/ }).click();
  await next.click();
  await page.getByRole("radio", { name: /Site vitrine \(1-5 pages\)/ }).click();
  await next.click();

  const genericBooking = page.getByRole("checkbox", { name: /Réservation en ligne/ });
  await genericBooking.click();
  await page.getByRole("checkbox", { name: /Prise de RDV en ligne/ }).click();
  await expect(genericBooking).toHaveAttribute("aria-checked", "false");
  await expect(genericBooking).toHaveAttribute("aria-disabled", "true");
  await expect(
    page.getByText("Cette fonctionnalité est déjà comprise dans le module spécialisé sélectionné.").first()
  ).toBeVisible();

  await next.click();
  const bilingual = page.getByRole("radio", { name: /Bilingue.*Exactement deux langues/ });
  const multilingual = page.getByRole("radio", { name: /Multilingue.*Trois langues ou plus/ });
  await bilingual.click();
  await expect(bilingual).toHaveAttribute("aria-checked", "true");
  await multilingual.click();
  await expect(multilingual).toHaveAttribute("aria-checked", "true");
  await expect(bilingual).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "Voir mon estimation" }).click();

  await expect(page.getByText("Prise de RDV en ligne", { exact: true })).toBeVisible();
  await expect(page.getByText("Réservation en ligne", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Multilingue, trois langues ou plus")).toBeVisible();
});

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`all wizard screens remain usable without horizontal overflow on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/fr");
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Démarrer l'estimation" }).click();
    const next = page.getByRole("button", { name: "Suivant" });
    await page.getByRole("radio", { name: /PME générale/ }).click();
    await expectNoHorizontalOverflow(page);
    await next.click();
    await page.getByRole("radio", { name: /Site vitrine \(1-5 pages\)/ }).click();
    await expectNoHorizontalOverflow(page);
    await next.click();
    await expectNoHorizontalOverflow(page);
    await next.click();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Voir mon estimation" }).click();
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole("heading", { name: "Votre estimation personnalisée" })).toBeVisible();
  });
}

test("direct navigation cannot fabricate an incomplete result", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://estimaweb-qc.vercel.app/opengraph-image"
  );
  const socialImage = await page.request.get("/opengraph-image");
  expect(socialImage.status()).toBe(200);
  expect(socialImage.headers()["content-type"]).toContain("image/png");

  const response = await page.goto("/fr/results");
  expect(response?.status()).toBe(404);
});
