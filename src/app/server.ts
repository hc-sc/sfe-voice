import Express from 'express';
import bodyParser from 'body-parser';
import { ActionFactory } from '../dialogflow/action-factory';

const actionFactory = new ActionFactory();
const app = actionFactory.Create();
const PORT = process.env.PORT || 3000;

Express()
  .use(bodyParser.json(), app)
  .listen(PORT);
