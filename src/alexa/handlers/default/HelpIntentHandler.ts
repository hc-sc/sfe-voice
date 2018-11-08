import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../../language/languageService';

export class HelpIntentHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  }

  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);

    const message = `${languageService.dictionary[`canAsk`]}`;

    return handlerInput.responseBuilder
      .speak(message)
      .withSimpleCard(languageService.dictionary[`appName`], message)
      .getResponse();
  }
}
