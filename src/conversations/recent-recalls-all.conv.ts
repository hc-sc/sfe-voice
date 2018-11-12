import { IRecentRecall } from '../recall-alert-api/models/recent-recall';
import moment, { lang } from 'moment';
import { LanguageService } from '../language/languageService';

let ssml = require('ssml');
let xmlescape = require('xml-escape');

export class RecentRecallsAllConversations {

  public SayRecall(recall: IRecentRecall, language: string): string {
    const languageService = new LanguageService();
    languageService.use(language);

    var date = new Date(recall.date_published * 1000);
    recall.title = xmlescape(recall.title);
    const ssmlDoc = new ssml();
    ssmlDoc
      .say(languageService.dictionary['recallPublished'])
      .say({
        text: moment.utc(date).format('MM/DD/YYYY'),
        interpretAs: 'date',
        format: 'mdy',
      })
      .break(500)
      .say(recall.title)
      .break(1000)
      .say(languageService.dictionary['askNext']);

    return ssmlDoc.toString();
  }

  public Say(message: string, language: string): string {
    const languageService = new LanguageService();
    languageService.use(language);
    const ssmlDoc = new ssml();
    ssmlDoc.say(languageService.dictionary[message]);

    return ssmlDoc.toString();
  }
}
