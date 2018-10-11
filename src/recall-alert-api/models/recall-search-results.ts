interface IRecallSearchResult {
  results: ISearchRecall[];
  results_count: number;
}

interface ISearchRecall {
  recallId: string;
  title: string;
  department: string;
  date_published: number;
  category: string[];
  url: string;
}

export { IRecallSearchResult, ISearchRecall };
