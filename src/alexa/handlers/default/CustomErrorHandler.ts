import { ErrorHandler, HandlerInput } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

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
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
}
