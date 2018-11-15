import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class RecentRecallRepeatIntent {
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
    this.app.intent('recent recalls - repeat', async conv => {
      const conversation = new RecentRecallsAllConversations();
      const context = RecentRecallsAllFollowupContext.Create(conv);
      const language =
        conv.user &&
        conv.user.locale &&
        conv.user.locale.substring(0, 2).toLowerCase() === 'fr'
          ? 'fr'
          : 'en';

      if (context != undefined) {
        const utterance = conversation.SayRecall(
          context.CurrentRecall,
          language
        );
        context.Save(conv);
        conv.ask(conversation.Say('noProblem', language)).ask(utterance);
        return;
      }

      conv.close(conversation.Say('smthWrong', language));
      return;
    });
  }
}
