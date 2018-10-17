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
    this.app.intent('recent recalls - all - yes', async conv => {
      const conversation = new RecentRecallsAllConversations();
      const context = RecentRecallsAllFollowupContext.Create(conv);

      if (context != undefined) {
        const utterance = conversation.Default(context.NextRecall);
        context.Save(conv);
        conv.ask(utterance);
        return;
      }

      conv.close('Something has gone wrong. Please start again.');
      return;
    });
  }
}