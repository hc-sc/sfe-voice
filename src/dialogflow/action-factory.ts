import {
  dialogflow,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
  OmniHandler,
} from 'actions-on-google';
import { RecentRecallAllIntent } from './intents/recent-recalls-all.intent';
import { RecentRecallNextIntent } from './intents/recent-recalls-next.intent';
import { RecentRecallPreviousIntent } from './intents/recent-recalls-previous.intent';
import { RecentRecallAllNoYes } from './intents/recent recalls-all-no-yes.intent';

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
    const recentRecallsAll = new RecentRecallAllIntent(this.app);
    recentRecallsAll.ApplyIntent();
    const recentRecallsAllNext = new RecentRecallNextIntent(this.app);
    recentRecallsAllNext.ApplyIntent();
    const recentRecallsAllPrevious = new RecentRecallPreviousIntent(this.app);
    recentRecallsAllPrevious.ApplyIntent();
    const recentRecallsAllNoYes = new RecentRecallAllNoYes(this.app);
    recentRecallsAllNoYes.ApplyIntent();

    return this.app;
  }
}
