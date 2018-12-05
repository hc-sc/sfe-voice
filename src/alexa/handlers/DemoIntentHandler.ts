import { RequestHandler, HandlerInput } from 'ask-sdk';
import { Response, IntentRequest } from 'ask-sdk-model';
import { RecentRecallsAllConversations } from '../../conversations/recent-recalls-all.conv';

export class DemoIntentHandler implements RequestHandler {
    public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
        const request = handlerInput.requestEnvelope.request;
        return (
            request.type === 'IntentRequest' &&
            request.intent.name === 'DemoResponseIntent'
        );
    }

    public async handle(handlerInput: HandlerInput): Promise<Response> {
        const conversation = new RecentRecallsAllConversations();

        const responseBuilder = handlerInput.responseBuilder;
        const intent = (handlerInput.requestEnvelope.request as IntentRequest)
            .intent;
        const category = (intent &&
            intent.slots &&
            intent.slots.Category &&
            intent.slots.searchItem.resolutions &&
            intent.slots.searchItem.resolutions.resolutionsPerAuthority &&
            intent.slots.searchItem.resolutions.resolutionsPerAuthority[0].values
            ? intent.slots.searchItem.resolutions.resolutionsPerAuthority[0].values[0]
                .value.id
            : ''
        )
            .toString()
            .toLowerCase();

        let message: string = '';

        switch (category) {
            case 'tn': {
                message += `There was a recall published on November 26, 2018. Acme train sets include lead-based paint and may pose health risks. Would you like to hear the next recall?`;
                break;
            }
            case 'ty': {
                message += `There was a recall published on November 26, 2018. The bath toy can break apart exposing small parts, posing a choking hazard for young children Would you like to hear the next recall?`;
                break;
            }
            default: {
                return responseBuilder
                    .speak(conversation.Write('cannotUnderstand', 'en'))
                    .reprompt(conversation.Write('cannotUnderstand', 'en'))
                    .withSimpleCard(conversation.Write('appName', 'en'), message)
                    .getResponse();
            }
        }

        const askAgain: string = `. ${conversation.Write('askNext', 'en')}`;

        return responseBuilder
            .speak(message)
            .reprompt(askAgain)
            .withSimpleCard(conversation.Write('appName', 'en'), message)
            .getResponse();
    }
}
