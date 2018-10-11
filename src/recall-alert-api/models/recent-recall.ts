export interface IAllRecentRecalls {
  results: IRecentRecallResults;
}

export interface IRecentRecallResults {
  ALL: IRecentRecall[];
  FOOD: IRecentRecall[];
  VEHICLE: IRecentRecall[];
  HEALTH: IRecentRecall[];
  CPS: IRecentRecall[];
}

export interface IRecentRecall {
  recallId: string;
  title: string;
  category: string[];
  date_published: number;
  url: string;
}
