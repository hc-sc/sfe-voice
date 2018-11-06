import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';
/**
 *  This class handles all requests to Alexa
 *  regarding the most recent recalls in
 *  Canada.
 *  Storing all API and iterating information
 *  in Session Attributes
 */
export class RecentRecallHandler implements RequestHandler {
  private readonly RecallMethod: string = 'RecallMethod';
  private readonly Counter: string = 'Counter';
  private readonly RecallList: string = 'RecallList';

  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'RecentResponseIntent'
    );
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const askAgain: string = ' Would you like to hear the next recall?';
    const searchType: string = 'RecentRecalls';
    const responseBuilder = handlerInput.responseBuilder;
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';

    let options = new RecallSearchOptions(
      '',
      RecallCategory.None,
      0,
      0,
      language
    );

    const repository = new RecallRepository();
    let message: string = '';

    message += `Sure, `;

    const result = await repository.GetRecentRecalls(options);
    let counter: number = 0;

    if (!result) {
      message += `Something went wrong`;
    } else {
      message += `These are the most recent recalls. ${result.results.ALL[
        counter++
      ].title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')}.`;

      handlerInput.attributesManager.setSessionAttributes({
        [this.RecallMethod]: searchType,
        [this.Counter]: counter,
        [this.RecallList]: result.results.ALL,
      });
    }

    return responseBuilder
      .speak(message + askAgain)
      .reprompt(askAgain)
      .withSimpleCard('Sample Recall Test', message)
      .getResponse();
  }
}
