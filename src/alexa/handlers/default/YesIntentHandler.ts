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
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const conversation = new RecentRecallsAllConversations();

    const repository = new RecallRepository();
    let message = conversation.Say('nextRecall', language);
    let promptAgain = conversation.Say('askAnother', language);

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
          promptAgain += conversation.Say('askAnother', language);

          if (!result) {
            message += conversation.Say('smthWrong', language);
          } else {
            message += conversation.SayRecall(
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
              message += conversation.Say('smthWrong', language);
            } else {
              dataPersist = result.results.ALL;
              message += conversation.SayRecall(
                dataPersist[persist++],
                language
              );
            }
          } else {
            message += conversation.SayRecall(dataPersist[persist++], language);
          }
        }
        break;
      default: {
        message += conversation.Say('smthWrong', language);
      }
    }

    handlerInput.attributesManager.setSessionAttributes({
      [this.Counter]: persist,
      [this.Data]: dataPersist,
      [this.RecallMethod]: recallnamePersist,
      [this.SearchTerm]: searchtermPersist,
    });

    return handlerInput.responseBuilder
      .speak(message + promptAgain)
      .reprompt(promptAgain)
      .withSimpleCard(conversation.Say('appName', language), message)
      .getResponse();
  }
}
