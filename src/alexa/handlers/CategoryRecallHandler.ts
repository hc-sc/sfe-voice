import { RequestHandler, HandlerInput } from 'ask-sdk';
import { Response, IntentRequest } from 'ask-sdk-model';

import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { IRecallSearchResult } from '../../recall-alert-api/models/recall-search-results';

export class CategoryRecallHandler implements RequestHandler {
  private readonly categoryType: string = 'CategoryType';
  private readonly RecallMethod: string = 'RecallMethod';
  private readonly Counter: string = 'Counter';
  private readonly RecallList: string = 'RecallList';

  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'CategoryResponseIntent'
    );
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const responseBuilder = handlerInput.responseBuilder;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent;
    const category = (intent &&
    intent.slots &&
    intent.slots.Category &&
    intent.slots.Category.value
      ? intent.slots.Category.value
      : 'Food'
    )
      .toString()
      .toLowerCase();

    let counter: number = 0;
    const repository = new RecallRepository();
    let message: string = '';
    message += `Sure, `;
    let recalls: IRecallSearchResult;

    switch (category) {
      case 'food': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.Food,
          15,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `Here is the latest Food related recall in ${language}. ${recalls.results[
          counter
        ].title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')}`;
        counter++;
        break;
      }
      case 'vehicle': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.Vehicles,
          15,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `Here is the latest Vehicle related recall. ${recalls.results[
          counter
        ].title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')}`;
        counter++;
        break;
      }
      case 'medical': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.HealthProducts,
          15,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `Here is the latest Medical related recall. ${
          recalls.results[counter].title
        }`;
        counter++;
        break;
      }
      case 'consumer products': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.ConsumerProducts,
          15,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `Here is the latest Consumer Product related recall. ${recalls.results[
          counter
        ].title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')}`;
        counter++;
        break;
      }
      default: {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.Food,
          15,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `Here is the latest Food recall. ${recalls.results[
          counter
        ].title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')}`;
        counter++;
      }
    }

    let searchType: string = 'RecallsCategory';
    handlerInput.attributesManager.setSessionAttributes({
      [this.RecallMethod]: searchType,
      [this.categoryType]: category,
      [this.Counter]: counter,
      [this.RecallList]: recalls.results,
    });

    const askAgain: string = '. Would you like to hear the next recall?';

    return responseBuilder
      .speak(message + askAgain)
      .reprompt(askAgain)
      .withSimpleCard('Sample Recall Test', message)
      .getResponse();
  }
}
