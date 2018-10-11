import {
  DialogflowApp,
  Contexts,
  DialogflowConversation
} from 'actions-on-google';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { ContextName } from './contexts/recall-context-names';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class RecentRecallAllIntent {
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
    this.app.intent('recent recalls - all', async conv => {
      let repository = new RecallRepository();
      let conversation = new RecentRecallsAllConversations();
      let recentRecallResults = await repository.GetRecentRecalls();
      
      if(recentRecallResults != null && recentRecallResults.results.ALL.length > 0)
      {
        const recall = recentRecallResults.results.ALL[0];        
        conv.ask(conversation.Default(recall))
      }
      
      conv.close("It seems something has gone wrong getting the recall information. Please try again later");

    });
  }
}
