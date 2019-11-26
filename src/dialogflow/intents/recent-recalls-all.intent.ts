import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';
import { userInfo } from 'os';

export class RecentRecallAllIntent {
  protected app: DialogflowApp<
    any,
    any,
    Contexts,
    DialogflowConversation<any, any, Contexts>
  >;

  /**
   *
   */
  constructor(
    app: DialogflowApp<
      any,
      any,
      Contexts,
      DialogflowConversation<any, any, Contexts>
    >
  ) {
    this.app = app;
  }

  public async ApplyIntent() {
    this.app.intent('recent recalls - all', async conv => {
      const repository = new RecallRepository(),
        conversation = new RecentRecallsAllConversations(),
        language =
          conv.user &&
          conv.user.locale &&
          conv.user.locale.substring(0, 2).toLowerCase() === 'fr'
            ? 'fr'
            : 'en',
        options = new RecallSearchOptions(
          '',
          RecallCategory.None,
          0,
          0,
          language
        ),
        recentRecallResults = await repository.GetRecentRecalls(options);

      if (
        recentRecallResults !== null &&
        recentRecallResults.results.ALL.length > 0
      ) {
        const context = new RecentRecallsAllFollowupContext(
          recentRecallResults.results.ALL
        );
        const recall = context.CurrentRecall;
        conv.contexts.set(
          RecentRecallsAllFollowupContext.ContextName,
          2,
          context as any
        );
        conv.ask(conversation.SayRecall(recall, language));
        // conv.contexts;
        return;
      }

      conv.close(conversation.Say('seemsWrong', language));
      return;
    });
  }
}
