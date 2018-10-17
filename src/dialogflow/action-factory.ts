import {
  dialogflow,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
  OmniHandler,
} from 'actions-on-google';
import { RecentRecallAllIntent } from './intents/recent-recalls-all.intent';
import { RecentRecallYesIntent } from './intents/recent-recalls-yes.intent';
import { RecentRecallPreviousIntent } from './intents/recent-recalls-previous.intent';
import { RecentRecallAllNoYes } from './intents/recent recalls-all-no-yes.intent';
import { RecentRecallCategoryIntent } from './intents/recent-recalls-category.intent';
import { RecallSearch } from './intents/recent-recalls-search.intent';

export class ActionFactory {
  app: DialogflowApp<
    any,
    any,
    Contexts,
    DialogflowConversation<any, any, Contexts>
  > &
    OmniHandler;

  /**
   *
   */
  constructor() {
    // Instantiate the Dialogflow client.
    this.app = dialogflow({ debug: true });
  }

  public Create(): OmniHandler {
    const recallSearch = new RecallSearch(this.app);
    recallSearch.ApplyIntent();
    const recentRecallsAll = new RecentRecallAllIntent(this.app);
    recentRecallsAll.ApplyIntent();
    const recentRecallsCategory = new RecentRecallCategoryIntent(this.app);
    recentRecallsCategory.ApplyIntent();
    const recentRecallsAllYes = new RecentRecallYesIntent(this.app);
    recentRecallsAllYes.ApplyIntent();
    const recentRecallsAllPrevious = new RecentRecallPreviousIntent(this.app);
    recentRecallsAllPrevious.ApplyIntent();
    const recentRecallsAllNoYes = new RecentRecallAllNoYes(this.app);
    recentRecallsAllNoYes.ApplyIntent();

    return this.app;
  }
}
