import {
  dialogflow,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
  OmniHandler,
} from 'actions-on-google';
import { RecentRecallAllIntent } from './intents/recent-recalls-all.intent';
import { RecentRecallYesIntent } from './intents/recent-recalls-yes.intent';
import { RecentRecallAllNoYes } from './intents/recent recalls-all-no-yes.intent';
import { RecallSearch } from './intents/search-recalls.intent';
import { DefaultWelcome } from './intents/recent-recalls-welcome-intent';
import { DefaultFallback } from './intents/recent-recalls-default-fallback-intent';
import { RecentRecallRepeatIntent } from './intents/recent-recalls-repeat.intent';
import { RecentRecallFallbackIntent } from './intents/recent-recalls-fallback.intent';
import { RecentRecallAllNo } from './intents/recent recalls-all-no.intent';
import { SearchRecallRepeatIntent } from './intents/search-recalls-repeat.intent.';

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
    const searchRecallRepeatIntent = new SearchRecallRepeatIntent(this.app);
    searchRecallRepeatIntent.ApplyIntent();
    const recallSearch = new RecallSearch(this.app);
    recallSearch.ApplyIntent();
    const recentRecallsAll = new RecentRecallAllIntent(this.app);
    recentRecallsAll.ApplyIntent();
    const recentRecallsAllYes = new RecentRecallYesIntent(this.app);
    recentRecallsAllYes.ApplyIntent();
    const recentRecallRepeatIntent = new RecentRecallRepeatIntent(this.app);
    recentRecallRepeatIntent.ApplyIntent();
    const recentRecallsAllNoYes = new RecentRecallAllNoYes(this.app);
    recentRecallsAllNoYes.ApplyIntent();
    const recentRecallsAllNo = new RecentRecallAllNo(this.app);
    recentRecallsAllNo.ApplyIntent();
    const recentRecallFallbackIntent = new RecentRecallFallbackIntent(this.app);
    recentRecallFallbackIntent.ApplyIntent();

    return this.app;
  }
}
