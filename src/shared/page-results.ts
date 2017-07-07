import {DIR, PageRequest} from './page-request';

export class PageResults<T> extends PageRequest {
  public count;

  constructor(public results: Array<T>, public total, public page = PageRequest.DEFAULT_PAGE,
              public pageSize = PageRequest.DEFAULT_PAGE_SIZE, public sort: string = undefined, public dir: DIR = 'ASC') {
    super(page, pageSize, sort, dir);
    this.count = results.length;
  }
}
