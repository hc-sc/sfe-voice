import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';
import { LanguageService } from 'language/languageService';

export class RecentRecallPreviousIntent {
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
    this.app.intent('recent recalls - all - previous', async conv => {
      const conversation = new RecentRecallsAllConversations();
      const context = RecentRecallsAllFollowupContext.Create(conv);
      const language = conv.user.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
      const languageService = new LanguageService();
      languageService.use(language);

      if (context != undefined) {
        const utterance = conversation.Default(context.PreviousRecall);
        context.Save(conv);
        conv.ask(utterance);
        return;
      }

      conv.close(languageService.dictionary[`smthWrong`]);
      return;
    });
  }
}
