import { RecentRecallsAllConversations } from '../../src/conversations/recent-recalls-all.conv';
import { IRecentRecall } from '../../src/recall-alert-api/models/recent-recall';

test('Recent recalls default conversation should be valid', async () => {
  const conversation: RecentRecallsAllConversations = new RecentRecallsAllConversations();
  const mockRecall: IRecentRecall = {
    category: ['1'],
    date_published: 1412899200,
    title: 'FORD issued a recall on the ESCAPE,  and FOCUS models',
    recallId: '41163',
    url: '/api/41163/en',
  };

  const Expected =
    '<?xml version="1.0"?><speak xmlns="http://www.w3.org/2001/10/synthesis" version="1.0" xml:lang="en-US">There was a recall published on<say-as interpret-as="date" format="mdy">10/10/2014</say-as><break time="500ms"/>FORD issued a recall on the ESCAPE,  and FOCUS models<break time="1000ms"/>Would you like to hear the next recall?</speak>';
  const Actual = conversation.SayRecall(mockRecall, 'en');

  expect(Actual).toEqual(Expected);
});

test('Recent recalls title should be cleansed for xml use', async () => {
  const conversation: RecentRecallsAllConversations = new RecentRecallsAllConversations();
  const mockRecall: IRecentRecall = {
    category: ['1'],
    date_published: 1412899200,
    title:
      'Mom Life Market recalls 10" & 16" Personalized Stuffed Plush Bunnies',
    recallId: '41163',
    url: '/api/41163/en',
  };

  const Expected =
    '<?xml version="1.0"?><speak xmlns="http://www.w3.org/2001/10/synthesis" version="1.0" xml:lang="en-US">There was a recall published on<say-as interpret-as="date" format="mdy">10/10/2014</say-as><break time="500ms"/>Mom Life Market recalls 10&quot; &amp; 16&quot; Personalized Stuffed Plush Bunnies<break time="1000ms"/>Would you like to hear the next recall?</speak>';
  const Actual = conversation.SayRecall(mockRecall, 'en');

  expect(Actual).toEqual(Expected);
});
