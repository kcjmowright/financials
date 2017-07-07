export type DIR = 'ASC' | 'DESC';

export class PageRequest {
  public static DEFAULT_PAGE_SIZE = 50;
  public static DEFAULT_PAGE = 1;

  constructor(public page = PageRequest.DEFAULT_PAGE, public pageSize = PageRequest.DEFAULT_PAGE_SIZE, public sort: string = '', public dir: DIR = 'ASC') {
  }

  public getOffset() {
    return (this.page - 1) * this.pageSize;
  }

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
