import { RecentRecallsAllFollowupContext } from '../../../src/dialogflow/intents/contexts/recentrecalls-all-followup.context';
import { IRecentRecall } from '../../../src/recall-alert-api/models/recent-recall';

test('If context count is equal to recall array length. Current recall should be provided.', async () => {
  const recalls: IRecentRecall[] = [
    {
      title: 'I am number 1',
      category: ['1'],
      date_published: 1,
      recallId: '1',
      url: '1',
    },
    {
      title: 'I am number 2',
      category: ['2'],
      date_published: 2,
      recallId: '2',
      url: '2',
    },
  ];

  const sut = new RecentRecallsAllFollowupContext(recalls, recalls.length);
  let current = sut.CurrentRecall;
  let actual = sut.NextRecall;
  expect(actual).toEqual(current);
});

test('If context count is less then to recall array length. The next recall should be provided', async () => {
  const recalls: IRecentRecall[] = [
    {
      title: 'I am number 1',
      category: ['1'],
      date_published: 1,
      recallId: '1',
      url: '1',
    },
    {
      title: 'I am number 2',
      category: ['2'],
      date_published: 2,
      recallId: '2',
      url: '2',
    },
  ];

  const sut = new RecentRecallsAllFollowupContext(recalls, recalls.length - 1);
  let current = sut.CurrentRecall;
  let actual = sut.NextRecall;
  expect(actual).not.toEqual(current);
  expect(actual).toEqual(recalls[1]);
});

test('If context count is equal to recall array length. The previous recall should be provided', async () => {
  const recalls: IRecentRecall[] = [
    {
      title: 'I am number 1',
      category: ['1'],
      date_published: 1,
      recallId: '1',
      url: '1',
    },
    {
      title: 'I am number 2',
      category: ['2'],
      date_published: 2,
      recallId: '2',
      url: '2',
    },
  ];

  const sut = new RecentRecallsAllFollowupContext(recalls, recalls.length);
  let current = sut.CurrentRecall;
  let actual = sut.PreviousRecall;
  expect(actual).not.toEqual(current);
  expect(actual).toEqual(recalls[0]);
});
