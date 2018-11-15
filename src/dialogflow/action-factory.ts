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
import { DefaultWelcome } from './intents/recent-recalls-welcome-intent';
import { DefaultFallback } from './intents/recent-recalls-fallback-intent';
import { RecentRecallRepeatIntent } from './intents/recent-recalls-repeat.intent';
import { RecentRecallFallbackIntent } from './intents/recent-recalls-fallback.intent';

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
    const defaultWelcome = new DefaultWelcome(this.app);
    defaultWelcome.ApplyIntent();
    const defaultFallback = new DefaultFallback(this.app);
    defaultFallback.ApplyIntent();
    const recallSearch = new RecallSearch(this.app);
    recallSearch.ApplyIntent();
    const recentRecallsAll = new RecentRecallAllIntent(this.app);
    recentRecallsAll.ApplyIntent();
    const recentRecallsCategory = new RecentRecallCategoryIntent(this.app);
    recentRecallsCategory.ApplyIntent();
    const recentRecallsAllYes = new RecentRecallYesIntent(this.app);
    recentRecallsAllYes.ApplyIntent();
    const recentRecallRepeatIntent = new RecentRecallRepeatIntent(this.app);
    recentRecallRepeatIntent.ApplyIntent();
    const recentRecallsAllPrevious = new RecentRecallPreviousIntent(this.app);
    recentRecallsAllPrevious.ApplyIntent();
    const recentRecallsAllNoYes = new RecentRecallAllNoYes(this.app);
    recentRecallsAllNoYes.ApplyIntent();
    const recentRecallFallbackIntent = new RecentRecallFallbackIntent(this.app);
    recentRecallFallbackIntent.ApplyIntent();

    return this.app;
  }
}
