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
        const request = handlerInput.requestEnvelope.request as IntentRequest;
        const language =
            request && request.locale && request.locale.toLowerCase() === 'fr-ca'
                ? 'fr'
                : 'en';
        const responseBuilder = handlerInput.responseBuilder;
        const intent = (handlerInput.requestEnvelope.request as IntentRequest)
            .intent;
        const searchItem = (intent &&
            intent.slots &&
            intent.slots.searchItem &&
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

        switch (searchItem) {
            case 'tr': {
                if (language === 'en') {
                    message += `There was a recall published on November 26, 2018. Acme train sets include lead-based paint and may pose health risks. Would you like to hear the next recall?`;
                }
                else {
                    message += `FR There was a recall published on November 26, 2018. Acme train sets include lead-based paint and may pose health risks. Would you like to hear the next recall?`;
                }
                break;
            }
            case 'ty': {
                if (language === 'en') {
                    message += `There was a recall published on November 26, 2018. The bath toy can break apart exposing small parts, posing a choking hazard for young children Would you like to hear the next recall?`;
                }
                else {
                    message += `FR There was a recall published on November 26, 2018. The bath toy can break apart exposing small parts, posing a choking hazard for young children Would you like to hear the next recall?`;
                }
                break;
            }

            case 'tp': {
                if (language === 'en') {
                    message += `I found no recalls for Acme toothpaste.`;
                }
                else {
                    message += `FR I found no recalls for Acme toothpaste.`;
                }
                break;
            }
            default: {
                return responseBuilder
                    .speak(conversation.Write('cannotUnderstand', language))
                    .reprompt(conversation.Write('cannotUnderstand', language))
                    .withSimpleCard(conversation.Write('appName', language), message)
                    .getResponse();
            }
        }

        const askAgain: string = `. ${conversation.Write('askNext', language)}`;

        return responseBuilder
            .speak(message)
            .reprompt(askAgain)
            .withSimpleCard(conversation.Write('appName', language), message)
            .getResponse();
    }
}
