import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../../conversations/recent-recalls-all.conv';

export class LaunchRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();
    const message: string = conversation.Say('welcome', language);

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .withSimpleCard(conversation.Say('appName', language), message)
      .getResponse();
  }
}
