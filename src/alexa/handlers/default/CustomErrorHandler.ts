import { ErrorHandler, HandlerInput } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../../language/languageService';

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
    const languageService = new LanguageService();
    languageService.use(language);
    const message = `${languageService.dictionary[`cannotUnderstand`]}`;

    // tslint:disable-next-line
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .getResponse();
  }
}
