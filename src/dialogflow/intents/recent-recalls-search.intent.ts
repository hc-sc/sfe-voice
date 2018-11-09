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
import { IRecallSearchResult } from 'recall-alert-api/models/recall-search-results';
import { LanguageService } from '../../language/languageService';

export class RecallSearch {
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
    this.app.intent('recall - search', async (conv, { SearchTerm }) => {
      let repository = new RecallRepository();
      let conversation = new RecentRecallsAllConversations();
      let options: RecallSearchOptions;
      let searchRecallResults: IRecallSearchResult;
      const language = conv.user.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
      const languageService = new LanguageService();
      languageService.use(language);

      if (typeof SearchTerm === 'string') {
        options = RecallSearchOptions.Default(SearchTerm);
        searchRecallResults = await repository.SearchRecalls(options);
      } else {
        searchRecallResults = {
          results: [],
          results_count: 0,
        };
      }

      if (
        searchRecallResults != null &&
        searchRecallResults.results.length > 0
      ) {
        let context = new RecentRecallsAllFollowupContext(
          searchRecallResults.results
        );
        const recall = context.CurrentRecall;
        conv.contexts.set(RecentRecallsAllFollowupContext.ContextName, 2, <any>(
          context
        ));
        conv.ask(conversation.Default(recall));
        return;
      }

      conv.close(languageService.dictionary[`seemsWrong`]);
      return;
    });
  }
}
