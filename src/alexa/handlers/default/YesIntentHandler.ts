import { HandlerInput, RequestHandler } from 'ask-sdk';
import { LanguageService } from '../../../language/languageService';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecallRepository } from '../../../recall-alert-api/recall-repository';
import {
  RecallCategory,
  RecallSearchOptions,
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
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);
    const repository = new RecallRepository();
    let message = `${languageService.dictionary[`nextRecall`]}`;
    let promptAgain = `${languageService.dictionary[`askAnother`]}`;

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
          promptAgain += `${languageService.dictionary[`askAgain`]}`;

          if (!result) {
            message += `${languageService.dictionary[`smthWrong`]}`;
          } else {
            message += `${result.results[persist++].title}`;
          }
        }
        break;
      case 'RecentRecalls':
        {
          if (!dataPersist) {
            const result = await repository.GetRecentRecalls(options);
            if (!result) {
              message += `${languageService.dictionary[`smthWrong`]}`;
            } else {
              dataPersist = result.results.ALL;
              message += ` ${dataPersist[persist++].title}`;
            }
          } else {
            message += ` ${dataPersist[persist++].title} `;
          }
        }
        break;
      default: {
        message += `${languageService.dictionary[`smthWrong`]}`;
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
      .withSimpleCard(languageService.dictionary[`appName`], message)
      .getResponse();
  }
}
