import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class GoodbyeHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'GoodbyeResponseIntent'
    );
  }

  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();

    return handlerInput.responseBuilder
      .speak(conversation.Write('goodbye', language))
      .withShouldEndSession(true)
      .getResponse();
  }
}
