/**
 * @file botsociety/index.js
 * @description Main file in the Voice botsociety module used to retrieve conversation data from botsociety
 */

const Botsociety = require( 'botsociety' )
const util = require( 'util' )
const fs = require( 'fs' )

const config = {  
  userId: process.env.BS_USER_ID,
  apiKey: process.env.BS_API_KEY,
}

const botsociety = new Botsociety( config )

botsociety.getConversation( process.env.BS_DESIGN_ID, )

  .then( data => {
    // conversation data
    // console.log( util.inspect( data, { depth: null } ) )

    // Persist conversation model in file
    fs.writeFileSync( '/app/models/bs-conversation-en.json', JSON.stringify( data, null, 2 ) )
  })

  .catch(function (err) {
    console.log( `***********************************************\nERROR FETCHING BOTSOCIETY CONVERSATION:\n***********************************************\n${ util.inspect( err, { depth: null } ) }\n***********************************************\n` )
  })
