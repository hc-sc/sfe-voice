import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';
import { userInfo } from 'os';

export class GoodbyeIntent {
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
    this.app.intent('goodbye -  all intent', async conv => {
      let conversation = new RecentRecallsAllConversations();
      const language =
        conv.user &&
        conv.user.locale &&
        conv.user.locale.substring(0, 2).toLowerCase() === 'fr'
          ? 'fr'
          : 'en';
      conv.close(conversation.Say('goodbye', language));
    });
  }
}
