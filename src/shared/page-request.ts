export type DIR = 'ASC' | 'DESC';

/**
 * Defines the parameters around a page request.
 */
export class PageRequest {
  public static DEFAULT_PAGE_SIZE = 50;
  public static DEFAULT_PAGE = 1;

  /**
   *
   * @param {number} [page=DEFAULT_PAGE]
   * @param {number} [pageSize=DEFAULT_PAGE_SIZE]
   * @param {string} [sort=''] Column to sort.
   * @param {DIR} [dir=ASC] Sort direction ASC or DESC.
   */
  constructor(public page = PageRequest.DEFAULT_PAGE, public pageSize = PageRequest.DEFAULT_PAGE_SIZE, public sort: string = '',
              public dir: DIR = 'ASC') {
  }

  /**
   * Row offset computed from page and page size.
   * @return {number}
   */
  public getOffset() {
    return (this.page - 1) * this.pageSize;
  }

  /**
   * Converts an any to a PageRequest instance.
   * @param {*} options
   * @return {PageRequest}
   */
  static newPageRequest(options: any): PageRequest {
    let page = new PageRequest();

    page.page = !!options.page ? +options.page : PageRequest.DEFAULT_PAGE;
    page.pageSize = !!options.pageSize ? +options.pageSize : PageRequest.DEFAULT_PAGE_SIZE;
    page.sort = options.sort;

    if(options.dir && options.dir.toUpperCase() === 'DESC') {
      page.dir = 'DESC';
    } else {
      page.dir = 'ASC';
    }
    return page;
  }
}
