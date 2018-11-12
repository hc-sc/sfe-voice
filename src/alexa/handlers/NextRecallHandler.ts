import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

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
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();
    let promptAgain = `. ${conversation.Write('askAgain', language)}`;
    let rewelcome = `. ${conversation.Write('rewelcome', language)}`;
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
      message += conversation.Write('okNext', language);
      message += conversation.WriteRecall(recallList[counter++], language);
    } else {
      message += conversation.Write('resultsEnd', language);
      handlerInput.attributesManager.setSessionAttributes({
        [this.Counter]: counter,
        [this.RecallList]: recallList,
        [this.RecallMethod]: recallnamePersist,
        [this.SearchTerm]: searchtermPersist,
      });
      return responseBuilder
        .speak(message + rewelcome)
        .reprompt(rewelcome)
        .withSimpleCard(conversation.Write('appName', language), message)
        .getResponse();
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
      .withSimpleCard(conversation.Write('appName', language), message)
      .getResponse();
  }
}
