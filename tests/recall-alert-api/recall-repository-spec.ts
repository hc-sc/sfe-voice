import { RecallRepository } from '../../src/recall-alert-api/recall-repository';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../src/recall-alert-api/models/recall-search-options';

test('Recent Should get back recall information', async () => {
  const repository = new RecallRepository();

  let options = new RecallSearchOptions('', RecallCategory.None, 0, 0, 'en');

  var result = await repository.GetRecentRecalls(options);

  expect(result).toBeTruthy();
});

test('Search Should get back recall information', async () => {
  const repository = new RecallRepository();
  var options = new RecallSearchOptions(
    'cake',
    RecallCategory.Food,
    10,
    0,
    'en'
  );
  let result = await repository.SearchRecalls(options);

  expect(result.results).toBeTruthy();
  expect(result.results_count).toBeTruthy();
});
