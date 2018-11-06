import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

export class CancelAndStopIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name ===
        'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name ===
          'AMAZON.StopIntent')
    );
  }

  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const message = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(message)
      .withSimpleCard('Sample Recall Test', message)
      .getResponse();
  }
}
