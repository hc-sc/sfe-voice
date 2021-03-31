'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const fs = require( 'fs' );
// const { endianness, setPriority } = require('os');
const axios = require( 'axios' ).default;

const { NativeFileInformation } = require( 'jovo-model' );
const { JovoModelAlexa } = require( 'jovo-model-alexa' );

const jovoAlexaInstance = new JovoModelAlexa();
const alexaModelFiles = new NativeFileInformation([
  {
    path: [
      '../models/en.json'
    ]
  }
])

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------


// Load conversation from botsociety api data

const bsConversation = JSON.parse( 
  fs.readFileSync( '/app/models/bs-conversation-en.json' )
)

// Configure Jovo

const RECALL_INCRIMENT = 3; // Number of recalls to fetch each request
const RSA_ENDPOINT = 'http://healthycanadians.gc.ca/recall-alert-rappel-avis/api/';
const RSA_SEARCH_PATH = `search?search={term}&lang=en&lim=${ RECALL_INCRIMENT }&off={offset}`;

const jovoConfig = {
  LAUNCH() {
    // Create session
    this.$session.$data.recallIndex = 0;
    this.$session.$data.recallOffset = 0;
    this.$session.$data.recalls = null;
    this.$session.$data.activeRecallIndex = null;
    this.$session.$data.searchTerm = "";

    return this.toIntent( 'WelcomeIntent' );
  },

  WelcomeIntent() {
    this.followUpState( 'LatestRecallsState' )
      .ask( 
        bsConversation.messages
          .find( msg => msg.id === '5f0f039f973c40477bc00ab0' )
          .attachments[ 0 ]
          .utterances[ 0 ]
          .components[ 0 ]
          .ssmlText
      )
  },

  LatestRecallsState: {

    GetCategoryIntent() {
      // If no category found, ask for it
      if ( !this.$inputs.recall-category.value ) { //TODO: Map input to corresponding API # (0-5)
        this.ask( 
          bsConversation.messages
            .find( msg => msg.id === '5f0f061e973c406881c00d60' ) // TODO: Find message ID for re-prompt of categories
            .attachments[ 0 ]
            .utterances[ 0 ]
            .components[ 0 ]
            .ssmlText
        )
      }
      else {
        return this.toIntent( "LatestRecallsState.LatestRecallsIntent" )
      }
  
    },
  
    async LatestRecallsIntent() {
      // Check for category, get category if none
      try {
        if ( !this.$inputs.recall-category.value ) {
          return this.toIntent( "LatestRecallsState.GetCategoryIntent" );
        }
      }
      catch( err ) {
        console.log( "DEBUG: No latest recall-category value err" )
        return this.toIntent( "LatestRecallsState.GetCategoryIntent" );
      }

      this.tell( 
        bsConversation.messages
          .find( msg => msg.id === '5f0f0659973c40bfaac00d90' ) // TODO: Find message ID for re-prompt of categories
          .attachments[ 0 ]
          .utterances[ 0 ]
          .components[ 0 ]
          .ssmlText
      )

      // Get recent recalls
      try {
        const searchPath = RSA_SEARCH_PATH
          .replace( '{term}', '' )
          .replace( '{offset}', '0' )
        const uri = `${ RSA_ENDPOINT }${ searchPath }`
        const recalls = await axios.get( uri )

        this.$session.$data.recalls = recalls.results
        return this.toIntent( "LatestRecallsState.MoreRecallsIntent" )
      }
      // Handle error getting recalls
      catch( err ) {
        console.log( "DEBUG: ERROR GETTING RECENT RECALLS", err )
        return this.toIntent( 'ErrorReachingRecallServiceIntent' )
      }
    },
  
    async MoreRecallsIntent() {
      if ( !this.$session.$data.recalls || !Array.isArray( this.$session.$data.recalls ) ) {
        return this.toIntent( "LatestRecallsState.LatestRecallsIntent" )
      }
      else if ( this.$session.$data.recallIndex >= this.$session.$data.recalls.length ) {
        // TODO: Get more recalls && check for no more recalls
        try {
          this.$session.$data.recallOffset += RECALL_INCRIMENT;

          const searchPath = RSA_SEARCH_PATH
            .replace( '{term}', '' )
            .replace( '{offset}',  this.$session.$data.recallOffset )
          const uri = `${ RSA_ENDPOINT }${ searchPath }`
          const recalls = await axios.get( uri )
  
          this.$session.$data.recalls = recalls.results
          return this.toIntent( "LatestRecallsState.MoreRecallsIntent" )
        }
        // Handle error getting recalls
        catch( err ) {
          console.log( "DEBUG: ERROR GETTING RECENT RECALLS", err )
          return this.toIntent( 'ErrorReachingRecallServiceIntent' )
        }
      }
      
      try {
        // 5f0f072c973c402507c00dbd
        const activeRecall = this.$session.$data.recalls[ this.$session.$data.recallIndex ];

        this.tell(  )

        bsConversation.messages
          .find( msg => msg.id === '5f0f061e973c406881c00d60' ) // TODO: Find message ID for re-prompt of categories
          .attachments[ 0 ]
          .utterances[ 0 ]
          .components[ 0 ]
          .ssmlText
          .replace( '[Recall title]', activeRecall.title )
          .replace( '[Date]', new Date( activeRecall.date_published ) )

        this.$session.$data.recallIndex++;

        // TODO: Ask for more, details or end
      }
      catch( err ) {
        console.log( `DEBUG: ERROR TELLING RECENT RECALLS (${ this.$session.$data.recallIndex })`, err, { recalls: this.$session.$data.recalls } )
        return this.toIntent( 'ErrorReachingRecallServiceIntent' )
      }
  
      
    },

  },

  // async SearchRecallsIntent() {
  //   if ( !this.$inputs.keyword && !this.$session.$data.searchTerm ) {
  //     // Ask user for keyword to search
  //     this.ask( 
  //       bsConversation.messages
  //         .find( msg => msg.id === '' ) // TODO: Find message ID for search
  //         .attachments[ 0 ]
  //         .utterances[ 0 ]
  //         .components[ 0 ]
  //         .ssmlText
  //     ) 
  //   }
  // },

  // FoundRecallIntent() {

  // },

  // NoRecallsFoundIntent() {

  // },

  CloseRecallsIntent() {
    this.toIntent( "END" )
  },

  ErrorReachingRecallServiceIntent() {
    this.tell( "I'm sorry, there was a problem while reaching the recalls and safety alerts service, pleased try again later." )
    this.toIntent( "END" )
  },

  END() {
    this.tell(
      bsConversation.messages
          .find( msg => msg.id === '' ) // TODO: Find message ID for search
          .attachments[ 0 ]
          .utterances[ 0 ]
          .components[ 0 ]
          .ssmlText
    )
  }

  
}

  
//   // jovoConfig[  ] = () => {
//   //   // this.ask( message.attachments[ 0 ].utterances[ 0 ].components[ 0 ].ssmlText )
//   // }
// }

// fs.writeFileSync( '../models/testFormat.json', JSON.stringify( testObj, null, 2 ), 'utf8' )

// const bsInputs = [];

// // Add variables to input manager
// for ( const bsVar of bsConversation.variables ) {
//   bsInputs.push({
//     name: bsVar.name,
//     type: {
//       // alexa: // bsVar.defaultVartypes.alexa FIXME: Botsociety doesn't have this, Alexa literal is depreciated and now required custom slots...
//       dialogflow: bsVar.defaultVartypes.Dialogflow
//     }
//   })
// }

// fs.writeFileSync( '../models/slots.json', JSON.stringify( bsInputs, null, 2 ), 'utf8' )

// const bsMessages = [];

// // Add variables to input manager
// for ( const bsMsg of bsConversation.messages ) {
//   bsInputs.push({
//     name: bsMsg.id,
//     type: {
//       // alexa: // bsVar.defaultVartypes.alexa FIXME: Botsociety doesn't have this, Alexa literal is depreciated and now required custom slots...
//       dialogflow: bsMsg.defaultVartypes.Dialogflow
//     }
//   })
// }

// fs.writeFileSync( '../models/messages.json', JSON.stringify( bsMessages, null, 2 ), 'utf8' )

// {
//   "name": "HelloWorldIntent",
//   "phrases": ["hello", "say hello", "say hello world"]
// },
// {
//   "name": "MyNameIsIntent",
//   "phrases": ["{name}", "my name is {name}", "i am {name}", "you can call me {name}"],
//   "inputs": [
//     {
//       "name": "name",
//       "type": {
//         "alexa": "AMAZON.US_FIRST_NAME",
//         "dialogflow": "@sys.given-name"
//       }
//     }
//   ]
// }

app.setHandler( jovoConfig );

module.exports = { app };
