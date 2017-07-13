import {DIR, PageRequest} from './page-request';

/**
 * Meta data for encapsulating a collection of page results or type T.
 */
export class PageResults<T> extends PageRequest {
  /**
   * Results length.
   */
  public count;

  /**
   *
   * @param {Array<T>} results a collection of results.
   * @param {number} total Total number of available results.
   * @param {number} page The page number.
   * @param {number} pageSize The page size.
   * @param {string} sort The sorted column.
   * @param {DIR} dir The sort direction ASC or DESC.
   * @constructor
   */
  constructor(public results: Array<T>, public total, public page = PageRequest.DEFAULT_PAGE,
              public pageSize = PageRequest.DEFAULT_PAGE_SIZE, public sort: string = undefined, public dir: DIR = 'ASC') {
    super(page, pageSize, sort, dir);
    this.count = results.length;
  }
}
