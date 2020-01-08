import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import { ActionFactory } from '../dialogflow/action-factory';
import { SkillFactory } from '../alexa/SkillFactory';

const actionFactory = new ActionFactory();
const googleAssistant = actionFactory.Create();
const alexa = new SkillFactory().skill;
const jsonParser = bodyParser.json();

const PORT = process.env.PORT || 8080;

const app = express();

const server = app
  .use( helmet() )

  // Voice API Routes
  .all( '/google', jsonParser, googleAssistant )
  .all( '/alexa', jsonParser, (req, res) => {
    alexa.invoke(req.body).then(responseBody => res.json(responseBody));
  })

  // TODO: API Docs using Swagger/OpenAPI?

  // Serve static content (404, landing page)
  .use( '/', express.static(
    path.join( __dirname, 'static' ),
    {
      extensions: [ 'html' ]
    }
  ))

  // Catch-all, 404
  .get( '*', ( req, res ) => { res.redirect( '/404' ); } )

  // Start
  .listen( PORT, () => {
    process.stdout.write( `Voice server started at ${ server.address().address }:${ server.address().port }\n\n` );
  } );
