import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDefaultDailogComponent } from './error-default-dailog.component';

describe('ErrorDefaultDailogComponent', () => {
  let component: ErrorDefaultDailogComponent;
  let fixture: ComponentFixture<ErrorDefaultDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDefaultDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDefaultDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
