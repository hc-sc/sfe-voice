import {
  dialogflow,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
  OmniHandler,
} from 'actions-on-google';

export class ActionFactory {
  app: DialogflowApp<
    any,
    any,
    Contexts,
    DialogflowConversation<any, any, Contexts>
  > &
    OmniHandler;

  /**
   *
   */
  constructor() {
    // Instantiate the Dialogflow client.
    this.app = dialogflow({ debug: true });
  }

  public Create(): OmniHandler {

    return this.app;
  }
}
