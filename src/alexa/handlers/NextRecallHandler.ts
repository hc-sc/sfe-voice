import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../language/languageService';
/**
 *  This class handles the iteration through
 *  the array of recalls from the API. It also
 *  will help format the API result to prevent
 *  any inappropriate characters or symbols.
 */
export class NextRecallHandler implements RequestHandler {
  private readonly Counter: string = 'Counter';
  private readonly RecallList: string = 'RecallList';
  private readonly RecallMethod: string = 'RecallMethod';
  private readonly SearchTerm: string = 'SearchTerm';

  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'NextResponseIntent'
    );
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);
    let promptAgain = `. ${languageService.dictionary['askAgain']}`;
    const responseBuilder = handlerInput.responseBuilder;
    let counter: number = handlerInput.attributesManager.getSessionAttributes()[
      this.Counter
    ];
    let recallList = handlerInput.attributesManager.getSessionAttributes()[
      this.RecallList
    ];
    let recallnamePersist = handlerInput.attributesManager.getSessionAttributes()[
      this.RecallMethod
    ];
    let searchtermPersist = handlerInput.attributesManager.getSessionAttributes()[
      this.SearchTerm
    ];

    let message: string = '';

    if (recallList.length >= counter + 1) {
      message += languageService.dictionary['okNext'];
      message += `${recallList[counter++].title.replace(
        /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g,
        ''
      )}`;
    } else {
      message += languageService.dictionary['resultsEnd'];
    }

    handlerInput.attributesManager.setSessionAttributes({
      [this.Counter]: counter,
      [this.RecallList]: recallList,
      [this.RecallMethod]: recallnamePersist,
      [this.SearchTerm]: searchtermPersist,
    });

    return responseBuilder
      .speak(message + promptAgain)
      .reprompt(promptAgain)
      .withSimpleCard(languageService.dictionary['appName'], message)
      .getResponse();
  }
}
