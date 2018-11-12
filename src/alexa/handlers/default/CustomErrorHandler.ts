import { ErrorHandler, HandlerInput } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../../conversations/recent-recalls-all.conv';

export class CustomErrorHandler implements ErrorHandler {
  public canHandle(
    handlerInput: HandlerInput,
    error: Error
  ): boolean | Promise<boolean> {
    return true;
  }
  public handle(
    handlerInput: HandlerInput,
    error: Error
  ): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const conversation = new RecentRecallsAllConversations();

    const message = conversation.Say('cannotUnderstand', language);

    // tslint:disable-next-line
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .getResponse();
  }
}
