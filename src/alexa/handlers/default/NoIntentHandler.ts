import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

export class NoIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.NoIntent'
    );
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const speechText = 'Thanks for using our Recall App, goodbye.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Sample Recall Test', speechText)
      .getResponse();
  }
}
