import {TestBed} from '@angular/core/testing';

import {SubCategoryProductService} from './sub-category-product.service';

describe('SubCategoryProductService', () => {
  let service: SubCategoryProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCategoryProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
