import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../../language/languageService';

export class LaunchRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);
    const speechText: string = languageService.dictionary['welcome'];

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(languageService.dictionary['appName'], speechText)
      .getResponse();
  }
}
