import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../../language/languageService';

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
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);

    const message = languageService.dictionary[`noProblem`];
    const reprompt = languageService.dictionary[`rewelcome`];

    return handlerInput.responseBuilder
      .speak(message + reprompt)
      .reprompt(reprompt)
      .withSimpleCard(languageService.dictionary[`appName`], message)
      .getResponse();
  }
}
