import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class DefaultWelcome {
  protected app: DialogflowApp<
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
      const conversation = new RecentRecallsAllConversations();
      const language =
        conv.user &&
        conv.user.locale &&
        conv.user.locale.substring(0, 2).toLowerCase() === 'fr'
          ? 'fr'
          : 'en';

      conv.ask(conversation.Say('welcome', language));
      return;
    });
  }
}
