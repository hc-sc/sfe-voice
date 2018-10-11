import {
    DialogflowApp,
    Contexts,
    DialogflowConversation
  } from 'actions-on-google';
  import { RecentRecallsAllFollowupContext } from './contexts/recentrecalls-all-followup.context';
import { IRecentRecall } from 'recall-alert-api/models/recent-recall';
import { RecentRecallsAllConversations } from 'conversations/recent-recalls-all.conv';
  
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
      this.app.intent('recent recalls - next', async conv => {
          let context = conv.contexts.get(RecentRecallsAllFollowupContext.ContextName);
          let conversation = new RecentRecallsAllConversations();
          if(context != undefined)
          {
              let recalls = <IRecentRecall[]>context.parameters.Recalls
              let counter = <number>context.parameters.Counter
              let allContext = new RecentRecallsAllFollowupContext(recalls, counter);
              let utterance = conversation.Default(allContext.NextRecall);
              conv.ask(utterance);
          }

          conv.close("Something has gone wrong. Please start again.");
      });
    }
  }
  