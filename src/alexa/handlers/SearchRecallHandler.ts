import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecallRepository } from '../../recall-alert-api/recall-repository';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../recall-alert-api/models/recall-search-options';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class SearchRecallHandler implements RequestHandler {
  private readonly RecallMethod: string = 'RecallMethod';
  private readonly SearchTerm: string = 'SearchTerm';
  private readonly Counter: string = 'Counter';
  private readonly RecallList: string = 'RecallList';

  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'SearchResponseIntent'
    );
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const responseBuilder = handlerInput.responseBuilder;
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const intent = request.intent;
    const search =
      intent && intent.slots && intent.slots.Search && intent.slots.Search.value
        ? intent.slots.Search.value
        : 'SR';
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();
    let searchType: string = 'SearchRecalls';

    const repository = new RecallRepository();
    let message: string = '';

    search.toString();

    message += `Sure, `;

    let searchName = search;

    const options = new RecallSearchOptions(
      searchName,
      RecallCategory.None,
      5,
      0,
      language
    );

    const result = await repository.SearchRecalls(options);
    let counter: number = 0;
    const askAgain: string = conversation.Write('askAgain', language);

    if (!result) {
      message += conversation.Write('smthWrong', language);
    } else if (result.results.length == 0) {
      message += conversation.Write('noResults', language);
    } else {
      message += conversation.WriteRecall(result.results[counter++], language);
    }

    handlerInput.attributesManager.setSessionAttributes({
      [this.RecallMethod]: searchType,
      [this.SearchTerm]: search.toString(),
      [this.Counter]: counter,
      [this.RecallList]: result.results,
    });

    return responseBuilder
      .speak(message)
      .reprompt(askAgain)
      .withSimpleCard(conversation.Write('appName', language), message)
      .getResponse();
  }
}
