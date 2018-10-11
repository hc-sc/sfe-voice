import {
  dialogflow,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
  OmniHandler,
} from 'actions-on-google';
import { RecentRecallRecentIntent } from './intents/recent-recalls-recent.intent';

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
    const recentRecallsRecent = new RecentRecallRecentIntent(this.app);
    recentRecallsRecent.ApplyIntent();

    return this.app;
  }
}
