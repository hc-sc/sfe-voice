import { RequestHandler, HandlerInput } from 'ask-sdk';
import { Response, IntentRequest } from 'ask-sdk-model';

import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import { IRecallSearchResult } from '../../recall-alert-api/models/recall-search-results';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

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
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();

    const responseBuilder = handlerInput.responseBuilder;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent;
    const category = (intent &&
    intent.slots &&
    intent.slots.Category &&
    intent.slots.Category.resolutions &&
    intent.slots.Category.resolutions.resolutionsPerAuthority &&
    intent.slots.Category.resolutions.resolutionsPerAuthority[0].values
      ? intent.slots.Category.resolutions.resolutionsPerAuthority[0].values[0]
          .value.id
      : ''
    )
      .toString()
      .toLowerCase();

    let counter: number = 0;
    const repository = new RecallRepository();
    let message: string = '';
    let recalls: IRecallSearchResult;

    switch (category) {
      case 'fd': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.Food,
          5,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `${conversation.Write('foodLatest', language)} 
          ${conversation.WriteRecall(recalls.results[counter], language)}`;
        counter++;
        break;
      }
      case 'vh': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.Vehicles,
          5,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `${conversation.Write('vehicleLatest', language)} 
          ${conversation.WriteRecall(recalls.results[counter], language)}`;
        counter++;
        break;
      }
      case 'md': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.HealthProducts,
          5,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `${conversation.Write('medicalLatest', language)} 
          ${conversation.WriteRecall(recalls.results[counter], language)}`;
        counter++;
        break;
      }
      case 'cp': {
        let options = new RecallSearchOptions(
          '',
          RecallCategory.ConsumerProducts,
          5,
          0,
          language
        );
        recalls = await repository.SearchRecalls(options);
        message += `${conversation.Write('consumerLatest', language)} 
          ${conversation.WriteRecall(recalls.results[counter], language)}`;
        counter++;
        break;
      }
      default: {
        return responseBuilder
          .speak(conversation.Write('cannotUnderstand', language))
          .reprompt(conversation.Write('cannotUnderstand', language))
          .withSimpleCard(conversation.Write('appName', language), message)
          .getResponse();
      }
    }

    let searchType: string = 'RecallsCategory';
    handlerInput.attributesManager.setSessionAttributes({
      [this.RecallMethod]: searchType,
      [this.categoryType]: category,
      [this.Counter]: counter,
      [this.RecallList]: recalls.results,
    });

    const askAgain: string = `. ${conversation.Write('askNext', language)}`;

    return responseBuilder
      .speak(message)
      .reprompt(askAgain)
      .withSimpleCard(conversation.Write('appName', language), message)
      .getResponse();
  }
}
