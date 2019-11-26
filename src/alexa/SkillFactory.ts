import { Skill, SkillBuilders } from 'ask-sdk';
import { CancelAndStopIntentHandler } from './handlers/default/CancelAndStopIntentHandler';
import { CustomErrorHandler } from './handlers/default/CustomErrorHandler';
import { FallbackHandler } from './handlers/default/FallbackHandler';
import { HelpIntentHandler } from './handlers/default/HelpIntentHandler';
import { LaunchRequestHandler } from './handlers/default/LaunchRequestHandler';
import { SessionEndedRequestHandler } from './handlers/default/SessionEndedRequestHandler';
import { RecentRecallHandler } from './handlers/RecentRecallHandler';
import { NoIntentHandler } from './handlers/default/NoIntentHandler';
import { SearchRecallHandler } from './handlers/SearchRecallHandler';
import { NextRecallHandler } from './handlers/NextRecallHandler';
import { RepeatIntentHandler } from './handlers/default/RepeatIntentHandler';
import { GoodbyeHandler } from './handlers/GoodbyeHandler';

export class SkillFactory {
  // tslint:disable-next-line:variable-name
  private _skill: Skill;
  constructor() {
    this._skill = SkillBuilders.custom()
      .addRequestHandlers(
        new LaunchRequestHandler(),
        new NextRecallHandler(),
        new RecentRecallHandler(),
        new HelpIntentHandler(),
        new FallbackHandler(),
        new SessionEndedRequestHandler(),
        new CancelAndStopIntentHandler(),
        new NoIntentHandler(),
        new SearchRecallHandler(),
        new RepeatIntentHandler(),
        new GoodbyeHandler()
      )
      .addErrorHandlers(new CustomErrorHandler())
      .create();
  }

  public get skill() {
    return this._skill;
  }
}
