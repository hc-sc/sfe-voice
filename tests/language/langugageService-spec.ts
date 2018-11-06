import { LanguageService } from '../../src/language/languageService';

test('Language Service should return english translation', async () => {
  const language = new LanguageService();

  var result = language.use('en');

  expect(result).toBeTruthy();
});

test('Language Service should return french translation', async () => {
  const language = new LanguageService();

  var result = language.use('fr');

  expect(result).toBeTruthy();
});
