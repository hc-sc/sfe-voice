import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../../language/languageService';

export class FallbackHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.FallbackIntent'
    );
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);

    const reprompt = `${languageService.dictionary[`askHelp`]}`;
    const message = `${languageService.dictionary[`fallBack`]}`;
    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(reprompt)
      .getResponse();
  }
}
