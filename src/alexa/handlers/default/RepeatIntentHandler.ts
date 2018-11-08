import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { LanguageService } from '../../../language/languageService';

/**
 *  This class handles requests to repeat the
 *  latest recall that was listed. This class is
 *  doing mostly the same work as the NextRecallHandler
 *  but it is not incrementing the array.
 */
export class RepeatIntentHandler implements RequestHandler {
  private readonly Counter: string = 'Counter';
  private readonly RecallList: string = 'RecallList';
  private readonly RecallMethod: string = 'RecallMethod';
  private readonly SearchTerm: string = 'SearchTerm';

  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.RepeatIntent'
    );
  }

  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language = request.locale.toLowerCase() === 'fr-ca' ? 'fr' : 'en';
    const languageService = new LanguageService();
    languageService.use(language);

    const promptAgain = `${languageService.dictionary[`askNext`]}`;

    const responseBuilder = handlerInput.responseBuilder;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent;
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
    message += `${languageService.dictionary[`noProblem`]}`;
    message += `${recallList[counter - 1].title.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g,
      ''
    )}`;

    handlerInput.attributesManager.setSessionAttributes({
      [this.Counter]: counter,
      [this.RecallList]: recallList,
      [this.RecallMethod]: recallnamePersist,
      [this.SearchTerm]: searchtermPersist,
    });

    return responseBuilder
      .speak(message + promptAgain)
      .reprompt(promptAgain)
      .withSimpleCard(languageService.dictionary[`appName`], message)
      .getResponse();
  }
}
