export class Company {
  public id?: number;
  public industry: string;
  public sector: string;
  public name: string;
  public ticker?: string;
  public exchange?: string;

  static newInstance(options: any): Company {
    let company = new Company();

    company.id = options.id;
    company.industry = options.industry;
    company.sector = options.sector;
    company.name = options.name;
    company.ticker = options.ticker;
    company.exchange = options.exchange;
    return company;
  }
}
