import { IRecentRecall } from 'recall-alert-api/models/recent-recall';
import { ContextName } from './recall-context-names';

export class RecentRecallsAllFollowupContext {
  private _recalls: IRecentRecall[];
  private _counter: number;

  /**
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

  public get CurrentRecall():IRecentRecall
  {
      return this.Recalls[this.Counter - 1];
  }

  public get PreviousRecall():IRecentRecall
  {
      if(this._counter > 1)
      {
          this._counter--;
      }
      return this.CurrentRecall;
  }

  public get NextRecall():IRecentRecall
  {
      if(this._counter < this._recalls.length){
        this._counter++;
      }
      return this.CurrentRecall;
  }

  public static get ContextName(): string {
    return ContextName.RecentRecallsAllFollowup;
  }
}
