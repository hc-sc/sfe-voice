import { IRecentRecall } from '../recall-alert-api/models/recent-recall';
import moment from 'moment';

let ssml = require('ssml');
let xmlescape = require('xml-escape');

export class RecentRecallsAllConversations {
  public Default(recall: IRecentRecall): string {
    var date = new Date(recall.date_published * 1000);
    recall.title = xmlescape(recall.title);
    const ssmlDoc = new ssml();
    ssmlDoc
      .say('There was a recall published on')
      .say({
        text: moment.utc(date).format('MM/DD/YYYY'),
        interpretAs: 'date',
        format: 'mdy',
      })
      .break(500)
      .say(recall.title)
      .break(1000)
      .say('Would you like to hear the next recall?');

    return ssmlDoc.toString();
  }
}
