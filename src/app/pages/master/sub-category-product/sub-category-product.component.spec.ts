import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubCategoryProductComponent} from './sub-category-product.component';

describe('SubCategoryProductComponent', () => {
  let component: SubCategoryProductComponent;
  let fixture: ComponentFixture<SubCategoryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubCategoryProductComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
