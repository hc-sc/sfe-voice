import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { ContextName } from './contexts/recall-context-names';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';

export class RecentRecallCategoryIntent {
  app: DialogflowApp<
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
    this.app.intent(
      'recent recalls - category',
      async (conv, { RecallType }) => {
        let repository = new RecallRepository();
        let conversation = new RecentRecallsAllConversations();
        let options = new RecallSearchOptions(
          '',
          RecallCategory.None,
          0,
          0,
          'en'
        );

        let recentRecallResults = await repository.GetRecentRecalls(options);
        let context: RecentRecallsAllFollowupContext;

        if (
          recentRecallResults != null &&
          recentRecallResults.results.ALL.length > 0
        ) {
          switch (RecallType) {
            case 'Food': {
              context = new RecentRecallsAllFollowupContext(
                recentRecallResults.results.FOOD
              );
              break;
            }
            case 'Medical': {
              context = new RecentRecallsAllFollowupContext(
                recentRecallResults.results.HEALTH
              );
              break;
            }
            case 'Vehicle': {
              context = new RecentRecallsAllFollowupContext(
                recentRecallResults.results.VEHICLE
              );
              break;
            }
            case 'CPS': {
              context = new RecentRecallsAllFollowupContext(
                recentRecallResults.results.CPS
              );
              break;
            }
            default: {
              context = new RecentRecallsAllFollowupContext(
                recentRecallResults.results.ALL
              );
            }
          }

          if (context.Recalls.length <= 0) {
            context = new RecentRecallsAllFollowupContext(
              recentRecallResults.results.ALL
            );
          }

          const recall = context.CurrentRecall;
          conv.contexts.set(RecentRecallsAllFollowupContext.ContextName, 2, <
            any
          >context);
          conv.ask(conversation.Default(recall));
          return;
        }

        conv.close(
          'It seems something has gone wrong getting the recall information. Please try again later'
        );
        return;
      }
    );
  }
}
