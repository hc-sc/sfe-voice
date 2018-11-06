import { default as en } from '../language/translations/en';
import { default as fr } from '../language/translations/fr';

export class LanguageService {
  private _dictionary: any;

  constructor() {
    this._dictionary = {};
  }

  get dictionary() {
    return this._dictionary;
  }

  /**
   * Set the language
   * @param lang language
   */
  public use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, _) => {
      switch (lang) {
        case 'fr':
          this._dictionary = fr;
          break;
        case 'en':
          this._dictionary = en;
          break;
        default:
          this._dictionary = en;
      }
      resolve(this.dictionary);
    });
  }
}
