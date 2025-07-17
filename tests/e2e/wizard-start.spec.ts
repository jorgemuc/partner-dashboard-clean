test('wizard hidden on launch', async ({ electronApp }) => {
  const page = await electronApp.firstWindow();
  await expect(page.locator('#wizardModal')).toBeHidden();
});
