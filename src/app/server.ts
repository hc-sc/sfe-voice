import Express from 'express';
import bodyParser from 'body-parser';
import { ActionFactory } from '../dialogflow/action-factory';
import { SkillFactory } from '../alexa/SkillFactory';

const actionFactory = new ActionFactory();
const googleAssistant = actionFactory.Create();
const alexa = new SkillFactory().skill;
const jsonParser = bodyParser.json();

const PORT = process.env.PORT || 3000;

Express()
  .all('/google', jsonParser, googleAssistant)
  .all('/alexa', jsonParser, (req, res) => {
    alexa.invoke(req.body).then(responseBody => res.json(responseBody));
  })
  .listen(PORT);
