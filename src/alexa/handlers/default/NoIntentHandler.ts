import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../../conversations/recent-recalls-all.conv';

export class NoIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.NoIntent'
    );
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();

    const message = conversation.Write('resetConversation', language);
    const reprompt = conversation.Write('rewelcome', language);

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(reprompt)
      .withSimpleCard(conversation.Write('appName', language), message)
      .getResponse();
  }
}
