import {PageRequest} from './page-request';

export class PageResults<T> extends PageRequest {
  public count;

  constructor(public results: Array<T>, public total, public page = PageRequest.DEFAULT_PAGE, public pageSize = PageRequest.DEFAULT_PAGE_SIZE) {
    super(page, pageSize);
    this.count = results.length;
  }
}
