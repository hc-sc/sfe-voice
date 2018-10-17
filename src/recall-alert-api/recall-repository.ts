import { HttpClient } from 'typed-rest-client/HttpClient';
import { IRecentRecall, IAllRecentRecalls, IRecentRecallResults } from './models/recent-recall';
import { RecallSearchOptions } from './models/recall-search-options';
import { IRecallSearchResult } from './models/recall-search-results';

export interface IUser {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export class RecallRepository {
  public async GetRecentRecalls(): Promise<IAllRecentRecalls | null> {
    const httpc = new HttpClient('food-recall');
    const res = await httpc.get(
      'http://healthycanadians.gc.ca/recall-alert-rappel-avis/api/recent/en'
    );
    const body = await res.readBody();
    console.log(body);
    const recall: IAllRecentRecalls = JSON.parse(body);
    return recall;
  }

  public async SearchRecalls(
    options: RecallSearchOptions
  ): Promise<IRecallSearchResult> {
    const httpc = new HttpClient('food-recall');
    const baseUrl =
      'http://healthycanadians.gc.ca/recall-alert-rappel-avis/api';
    const url = `${baseUrl}/search?search=${options.Search}&lim=${
      options.Limit
    }&off=${options.Offset}&cat=${options.Category}&lang=${options.Language}`;

    const res = await httpc.get(url);
    const body = await res.readBody();
    console.log(body);
    const recall: IRecallSearchResult = JSON.parse(body);
    return recall;
  }
}
