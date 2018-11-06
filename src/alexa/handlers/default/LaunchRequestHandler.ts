import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

export class LaunchRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const speechText =
      'Welcome to your portal for Recalls Canada. Would you like to hear about recent recalls?' +
      ' Or search for a specific recall by saying "Search for" and the item you are looking for, ' +
      'or by category by saying Medical, Vehicle, Consumer Products or Food.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Sample Recall Test', speechText)
      .getResponse();
  }
}
