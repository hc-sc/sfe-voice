import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response, SessionEndedRequest } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../../conversations/recent-recalls-all.conv';

export class SessionEndedRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  }

  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();

    // tslint:disable-next-line
    console.log(
      `${conversation.Write('endReason', language)}` +
        `${
          (handlerInput.requestEnvelope.request as SessionEndedRequest).reason
        }`
    );
    return handlerInput.responseBuilder.getResponse();
  }
}
