import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

/**
 * Deals with the recent recalls - all - yes intent.
 */
export class RecentRecallFallbackIntent {
  app: DialogflowApp<
    any,
    any,
    Contexts,
    DialogflowConversation<any, any, Contexts>
    >;

  /**
   * Default Constructor
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

  /**
   * Applies the google action intent logic to the conversation
   */
  public async ApplyIntent() {
    this.app.intent('recent recalls - all - fallback', async conv => {
      const conversation = new RecentRecallsAllConversations();
      const context = RecentRecallsAllFollowupContext.Create(conv);
      const language = conv.user.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';

      if (context != undefined) {
        const utterance = conversation.Say('recallFallback', language);
        context.Save(conv);
        conv.ask(utterance);
        return;
      }

      conv.close(conversation.Say('seemsWrong', language));
      return;
    });
  }
}
