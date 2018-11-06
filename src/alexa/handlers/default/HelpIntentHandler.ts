import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

export class HelpIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  }

  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const message = 'you can ask about current recalls in Canada!';

    return handlerInput.responseBuilder
      .speak(message)
      .withSimpleCard('Sample Recall Test', message)
      .getResponse();
  }
}
