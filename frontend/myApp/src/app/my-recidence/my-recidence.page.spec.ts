import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyRecidencePage } from './my-recidence.page';

describe('MyRecidencePage', () => {
  let component: MyRecidencePage;
  let fixture: ComponentFixture<MyRecidencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRecidencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
