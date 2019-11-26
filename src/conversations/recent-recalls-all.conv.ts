import { IRecentRecall } from '../recall-alert-api/models/recent-recall';
import moment, { lang } from 'moment';
import { LanguageService } from '../language/languageService';

/* tslint:disable */
// FIXME: Find @types for these packages
const ssml = require('ssml');
const xmlescape = require('xml-escape');
/* tslint:enable */

export class RecentRecallsAllConversations {
  public SayRecall(recall: IRecentRecall, language: string): string {
    const languageService = new LanguageService();
    languageService.use(language);

    const date = new Date(recall.date_published * 1000);
    recall.title = xmlescape(recall.title);
    const ssmlDoc = new ssml();
    ssmlDoc
      .say(languageService.dictionary.recallPublished)
      .say({
        text: moment.utc(date).format('MM/DD/YYYY'),
        interpretAs: 'date',
        format: 'mdy',
      })
      .break(500)
      .say(recall.title)
      .break(1000)
      .say(languageService.dictionary.askNext);

    return ssmlDoc.toString();
  }

  public WriteRecall(recall: IRecentRecall, language: string): string {
    const languageService = new LanguageService();
    languageService.use(language);

    const date = new Date(recall.date_published * 1000);
    recall.title = xmlescape(recall.title);

    const message = `${languageService.dictionary.recallPublished}
        ${moment.utc(date).format('MM/DD/YYYY')}
        ${recall.title}.
        ${languageService.dictionary.askNext}`;

    return message;
  }

  public Say(message: string, language: string): string {
    const languageService = new LanguageService();
    languageService.use(language);
    const ssmlDoc = new ssml();
    ssmlDoc.say(languageService.dictionary[message]);

    return ssmlDoc.toString();
  }

  public Write(message: string, language: string): string {
    const languageService = new LanguageService();
    languageService.use(language);
    return languageService.dictionary[message];
  }
}
