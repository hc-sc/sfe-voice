import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../../conversations/recent-recalls-all.conv';

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
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
    const conversation = new RecentRecallsAllConversations();

    const promptAgain = conversation.Write('askNext', language);

    const responseBuilder = handlerInput.responseBuilder;
    const intent = (handlerInput.requestEnvelope.request as IntentRequest)
      .intent;
    const counter: number = handlerInput.attributesManager.getSessionAttributes()[
      this.Counter
    ];
    const recallList = handlerInput.attributesManager.getSessionAttributes()[
      this.RecallList
    ];
    const recallnamePersist = handlerInput.attributesManager.getSessionAttributes()[
      this.RecallMethod
    ];
    const searchtermPersist = handlerInput.attributesManager.getSessionAttributes()[
      this.SearchTerm
    ];

    let message: string = '';
    message += conversation.Write('noProblem', language);
    message +=
      ' ' + conversation.WriteRecall(recallList[counter - 1], language);

    handlerInput.attributesManager.setSessionAttributes({
      [this.Counter]: counter,
      [this.RecallList]: recallList,
      [this.RecallMethod]: recallnamePersist,
      [this.SearchTerm]: searchtermPersist,
    });

    return responseBuilder
      .speak(message)
      .reprompt(promptAgain)
      .withSimpleCard(conversation.Write('appName', language), message)
      .getResponse();
  }
}
