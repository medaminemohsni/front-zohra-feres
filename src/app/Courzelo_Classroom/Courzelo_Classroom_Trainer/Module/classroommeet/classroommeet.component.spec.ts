import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroommeetComponent } from './classroommeet.component';

describe('ClassroommeetComponent', () => {
  let component: ClassroommeetComponent;
  let fixture: ComponentFixture<ClassroommeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroommeetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroommeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
