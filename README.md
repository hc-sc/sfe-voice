# Canada Recalls Voice Assistants

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png" />

The Canada Recalls Voice Assistant project that leverages the [Canadian Recalls and Safety Alerts API](http://healthycanadians.gc.ca/connect-connectez/data-donnees/recall-alert-rappel-avis-eng.php). The project provides voice accessibility on both Amazon Alexa and Google Assistant.
The voice assistants are connected a custom built service that utilizes the Canadian Recalls and Safety Alerts API.
The following sections describe the various parts of the solution.

## Technology

1. Node.js
2. Typescript
3. Alexa Skills Kit SDK for Node.js
4. Actions on Google Client Library for Node.js (DialogFlow)
5. Speech Synthesis Markup Language (SSML)

## The Canada Recall Service

This is the back-end service of the solution. It has been built to provide a gateway to the Canadian Recalls and Safety Alerts API. The service is utilized by both the Amazon Alexa and Google Assistant. Both voice assistants utilize the same back-end service to guarantee code reusability and maintainability.

## Google Assistant Action 

The Canada Recall Action is developed using [DialogFlow Console](https://console.dialogflow.com). The Canada Recall Action is is connected to the back-end service by configuring it's Fulfillment to point to the back-end service that provides the webhooks. The webhooks on the back-end side are developed using **Actions on Google Client Library for Node.js SDK** ([actions-on-google](https://www.npmjs.com/package/actions-on-google)). Each designed intent on the DialogFlow console can be configured with fulfillment enabled in order to send requests to the back-end service. The SDK enables the developer to write back-end functions that intercept requests sent from the DialogFlow application, and handle its requests and return ssml responses. For example, the Welcome intent on the DialogFlow side with the unique name `welcome-intent` can have the following back-end intent function to send a welcome message based on the user local:

````js

    public async ApplyIntent() {
    this.app.intent('welcome-intent', async conv => {
      const language = conv.user.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
      if (language === 'fr') {
        conv.ask('Welcome!');
        return;
      }
      else {
        conv.ask('Salut!');
        return;
      }
    });
  }

````

**Important**:Each created DialogFlow intent handler must be registered to the `ActionFactory` class in order to make it available for the DialogFlow action.

### Google Action Backup

Both English and French action backup are synced under `AssistantModels\DialogFlow` folder. The developers are responsible for backing up the actions through the DialogFlow Console by exporting the DilaogFlow agent as a zip folder by navigating to `Export and Import` then clicking `EXPORT AS ZIP`. The agent can be restored from the zip folder anytime through the same location by selecting `IMPORT FROM ZIP`

## Amazon Alexa Skill

The Canada Recall Alexa Skill is developed using [Alexa Console](https://developer.amazon.com/alexa/console/ask). The console is used to develop the skill intents and entities. The skill is configured with the Food Recall service endpoint. The skill captures the user requests and forwards them to the back-end service for processing. Each intent on the console side has a corresponding intent handler on the service side. This handler intercepts the user requests and sends back ssml messages to be played/displayed for the user. For example, a launch intent on the console side would have a intent handler on the service side like this

````js

export class LaunchRequestHandler implements RequestHandler {
  
  public canHandle(handlerInput: HandlerInput): boolean | Promise<boolean> {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  }
  public handle(handlerInput: HandlerInput): Response | Promise<Response> {
    const request = handlerInput.requestEnvelope.request as IntentRequest;
    const language =
      request && request.locale && request.locale.toLowerCase() === 'fr-ca'
        ? 'fr'
        : 'en';
        const message: string = conversation.Write('welcome', language);
     if (language ==='en'){
     message = 'Welcome!';
     }
     else{
     message = 'Salut!';

     }

    return handlerInput.responseBuilder
      .speak(message)
      .getResponse();
  }

````

Each Alexa intent handler has two parts. The first one is `canHandle()` which makes sure the handler is invoked for the right intent. The second part is `handle()` which is where the intent requests get handled and responses get constructed and sent back to the Alexa skill

**Important**:Each created Alexa intent handler must be registered to the `SkillFactory` class in order to make it available for the DialogFlow action. 

### Alexa Skill Backup

Both English and French skills json backup files are synced under `AssistantModels\Alexa` folder. The developers are responsible for backing up the skills through the Alexa Console by navigating to `JSON Editor` and copy over both English and French json contents to the `en-ca.json` and `fr-ca.json` files.
