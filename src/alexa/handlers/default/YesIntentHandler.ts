import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { RecallRepository } from '../../../recall-alert-api/recall-repository';
import {
  RecallSearchOptions,
  RecallCategory,
} from '../../../recall-alert-api/models/recall-search-options';

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
    const repository = new RecallRepository();
    let speechText = 'Sure, the next recall is ';
    let promptAgain = '. Do you want to hear another recall?';
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
          promptAgain += 'Would you like to hear the next recall?';

          if (!result) {
            speechText += `Something went wrong`;
          } else {
            speechText += `${result.results[persist++].title} . In Switch case`;
          }
        }
        break;
      case 'RecentRecalls':
        {
          if (!dataPersist) {
            const result = await repository.GetRecentRecalls(options);
            if (!result) {
              speechText += `Something went wrong`;
            } else {
              dataPersist = result.results.ALL;
              speechText += ` ${dataPersist[persist++].title}`;
            }
          } else {
            speechText += ` ${dataPersist[persist++].title} `;
          }
        }
        break;
      default: {
        speechText += 'Switch Case Default, something probably went wrong';
      }
    }

    handlerInput.attributesManager.setSessionAttributes({
      [this.Counter]: persist,
      [this.Data]: dataPersist,
      [this.RecallMethod]: recallnamePersist,
      [this.SearchTerm]: searchtermPersist,
    });

    return handlerInput.responseBuilder
      .speak(speechText + promptAgain)
      .reprompt(promptAgain)
      .withSimpleCard('Sample Recall Test', speechText)
      .getResponse();
  }
}
