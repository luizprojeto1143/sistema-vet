
import { test, expect } from '@playwright/test';

// Critical Flow Test: Login -> Schedule -> Consult
test('Critical Path: Vet Flow', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vet@vetz.com.br');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/vet');

    // 2. Access Agenda
    await page.click('a[href="/vet/agenda"]');
    await expect(page.locator('h1')).toContainText('Agenda');

    // 3. Open Consultation
    // Assuming there is an appointment today
    await page.click('.appointment-card:first-child');
    await page.click('button:has-text("Iniciar Atendimento")');

    // 4. Consultation Screen
    await expect(page.locator('text=Prontuário')).toBeVisible();

    // 5. Smart Templates (Feature 9 Check)
    await page.click('button:has-text("Normal")');
    await expect(page.locator('textarea[name="clinicalSigns"]')).toContainText('Paciente alerta');

    // 6. Upsell Widget (Feature 15 Check)
    await expect(page.locator('text=Oportunidades')).toBeVisible();
});
