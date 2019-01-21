import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

/**
 * Deals with the next recall - all - yes intent.
 */
export class RecentRecallYesIntent {
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
    this.app.intent('next recall - all - yes', async conv => {
      const conversation = new RecentRecallsAllConversations();
      const context = RecentRecallsAllFollowupContext.Create(conv);
      const language =
        conv.user &&
        conv.user.locale &&
        conv.user.locale.substring(0, 2).toLowerCase() === 'fr'
          ? 'fr'
          : 'en';

      if (context != undefined) {
        const utterance = conversation.SayRecall(context.NextRecall, language);
        context.Save(conv);
        conv.ask(utterance);
        return;
      }

      conv.close(conversation.Say('seemsWrong', language));
      return;
    });
  }
}
