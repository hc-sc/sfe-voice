import { IRecentRecall } from '../../../recall-alert-api/models/recent-recall';
import { ContextName } from './recall-context-names';
import { DialogflowConversation, Contexts } from 'actions-on-google';

/**
 * The class represents the recenentrecalls-all-followup context
 * It stores information on the recalls to iterate and the current counter.
 * It can be used to iterate the list, and to save and rehydrate the
 * context from a conversation
 */
export class RecentRecallsAllFollowupContext {
  public static Create(
    conv: DialogflowConversation<any, any, Contexts>
  ): RecentRecallsAllFollowupContext | undefined {
    const context = conv.contexts.get(
      RecentRecallsAllFollowupContext.ContextName
    );

    if (context !== undefined) {
      // tslint:disable-next-line
      console.log(
        `********* NEXT CONTEXT PARAMETERS *********\n${JSON.stringify(
          context.parameters
        )}`
      );

      const recalls = context.parameters._recalls as IRecentRecall[],
        counter = context.parameters._counter as number;

      return new RecentRecallsAllFollowupContext(recalls, counter);
    }

    return undefined;
  }

  public static get ContextName(): string {
    return ContextName.RecentRecallsAllFollowup;
  }

  private _recalls: IRecentRecall[];
  private _counter: number;

  /**
   * Base constructor
   *
   */
  constructor(recalls: IRecentRecall[], counter: number = 1) {
    this._recalls = recalls;
    this._counter = counter;
  }

  public get Recalls(): IRecentRecall[] {
    return this._recalls;
  }

  public get Counter(): number {
    return this._counter;
  }

  public get CurrentRecall(): IRecentRecall {
    return this.Recalls[this.Counter - 1];
  }

  public get PreviousRecall(): IRecentRecall {
    if (this._counter > 1) {
      this._counter--;
    }
    return this.CurrentRecall;
  }

  public get NextRecall(): IRecentRecall {
    if (this._counter < this._recalls.length) {
      this._counter++;
    }
    return this.CurrentRecall;
  }

  public Save(conv: DialogflowConversation<any, any, Contexts>) {
    conv.contexts.set(
      RecentRecallsAllFollowupContext.ContextName,
      2,
      this as any
    );
  }
}
