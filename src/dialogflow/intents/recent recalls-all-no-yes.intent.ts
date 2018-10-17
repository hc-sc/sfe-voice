import {
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from 'actions-on-google';

export class RecentRecallAllNoYes {
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
    this.app.intent('recent recalls - all - no - yes', async conv => {
      conv.followup('start-again');
    });
  }
}
