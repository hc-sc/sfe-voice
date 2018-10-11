import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';
import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import { IRecentRecall } from 'recall-alert-api/models/recent-recall';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class RecentRecallNextIntent {
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
    this.app.intent('recent recalls - all - next', async conv => {

      const conversation = new RecentRecallsAllConversations();    
      const context = RecentRecallsAllFollowupContext.Create(conv);

      if(context != undefined)
      {
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
