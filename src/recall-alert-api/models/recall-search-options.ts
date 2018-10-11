enum RecallCategory {
  None = 0,
  Food = 1,
  Vehicles = 2,
  HealthProducts = 3,
  ConsumerProducts = 4,
}

enum Languages {
  None = "",
  English = "en",
  French = "fr"
}

class RecallSearchOptions {
  private readonly search: string;
  private readonly category: RecallCategory;
  private readonly limit: number;
  private readonly offset: number;
  private readonly lang: string;
  /**
   *
   */
  constructor(
    search: string,
    category: RecallCategory,
    limit: number,
    offset: number,
    lang: string,
  ) {
    this.search = search;
    this.category = category;
    this.limit = limit;
    this.offset = offset;
    this.lang = lang;
  }

  get Search(): string {
    return this.search;
  }

  get Category(): RecallCategory {
    return this.category;
  }

  get Limit(): number {
    return this.limit;
  }

  get Offset(): number {
    return this.offset;
  }

  get Language(): string{
    return this.lang;
  }

  public static get Default():RecallSearchOptions
  {
    return new RecallSearchOptions("", RecallCategory.None, 10, 0, Languages.English);
  }
}

export { RecallCategory, RecallSearchOptions };
