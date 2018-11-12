import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecallRepository } from '../../../recall-alert-api/recall-repository';
import {
  RecallCategory,
  RecallSearchOptions,
} from '../../../recall-alert-api/models/recall-search-options';
import { RecentRecallsAllConversations } from '../../../conversations/recent-recalls-all.conv';

export class YesIntentHandler implements RequestHandler {
  private readonly Counter: string = 'Counter';
  private readonly Data: string = 'Data';
  private readonly RecallMethod: string = 'RecallMethod';
  private readonly SearchTerm: string = 'SearchTerm';

  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.YesIntent'
    );
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();

    const repository = new RecallRepository();
    let message = conversation.Write('nextRecall', language);
    let promptAgain = conversation.Write('askAnother', language);

    let persist: number = handlerInput.attributesManager.getSessionAttributes()[
      this.Counter
    ];

    let dataPersist = handlerInput.attributesManager.getSessionAttributes()[
      this.Data
    ];
    let recallnamePersist = handlerInput.attributesManager.getSessionAttributes()[
      this.RecallMethod
    ];
    let searchtermPersist = handlerInput.attributesManager.getSessionAttributes()[
      this.SearchTerm
    ];

    const options = new RecallSearchOptions(
      searchtermPersist,
      RecallCategory.None,
      1,
      0,
      'en'
    );

    // Switch case to determine which repository function call
    switch (recallnamePersist) {
      case 'SearchRecalls':
        {
          const result = await repository.SearchRecalls(options);
          promptAgain += conversation.Write('askAnother', language);

          if (!result) {
            message += conversation.Write('smthWrong', language);
          } else {
            message += conversation.WriteRecall(
              result.results[persist++],
              language
            );
          }
        }
        break;
      case 'RecentRecalls':
        {
          if (!dataPersist) {
            const result = await repository.GetRecentRecalls(options);
            if (!result) {
              message += conversation.Write('smthWrong', language);
            } else {
              dataPersist = result.results.ALL;
              message += conversation.WriteRecall(
                dataPersist[persist++],
                language
              );
            }
          } else {
            message += conversation.WriteRecall(
              dataPersist[persist++],
              language
            );
          }
        }
        break;
      default: {
        message += conversation.Write('smthWrong', language);
      }
    }

    handlerInput.attributesManager.setSessionAttributes({
      [this.Counter]: persist,
      [this.Data]: dataPersist,
      [this.RecallMethod]: recallnamePersist,
      [this.SearchTerm]: searchtermPersist,
    });

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(promptAgain)
      .withSimpleCard(conversation.Write('appName', language), message)
      .getResponse();
  }
}
