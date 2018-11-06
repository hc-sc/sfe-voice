import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

export class FallbackHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.FallbackIntent'
    );
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const reprompt = 'What can I help you with?';
    const message = `Recall Canada test cannot help you with that. It can tell you about current Canadian Recalls. ${reprompt}`;

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(reprompt)
      .getResponse();
  }
}
