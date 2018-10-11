import {
  DialogflowApp,
  Contexts,
  DialogflowConversation
} from 'actions-on-google';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { ContextName } from './contexts/recall-context-names';

export class RecallSearchIntent {
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
    this.app.intent('recent recalls - recent', async conv => {
      var repository = new RecallRepository();
      var recentRecallResults = await repository.GetRecentRecalls();

      conv.close('recent recalls - recent received');
    });
  }
}
