import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response, SessionEndedRequest } from 'ask-sdk-model';

export class SessionEndedRequestHandler implements RequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  }

  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    console.log(
      `Session ended with reason: ${
        (handlerInput.requestEnvelope.request as SessionEndedRequest).reason
      }`
    );
    return handlerInput.responseBuilder.getResponse();
  }
}
