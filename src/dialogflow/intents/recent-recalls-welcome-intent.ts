import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class DefaultWelcome {
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
    this.app.intent('Default Welcome Intent', async conv => {
      let conversation = new RecentRecallsAllConversations();
      const language = conv.user.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';

      conv.ask(conversation.Say('welcome', language));
      return;
    });
  }
}
