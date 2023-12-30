export class Page {
  page: number = 1;
  size: number = 10;
}

export class Pagination {
  constructor(count: number, page: Page) {
    this.count = count;
    this.next = page.page + 1;
    this.has_next = count > page.size * page.page;
    this.previous = page.page - 1;
    this.has_previous = page.page > 1;
  }
  count: number;
  next: number;
  has_next: boolean;
  previous: number;
  has_previous: boolean;
}
