import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssistantManagementPage } from './assistant-management.page';

describe('AssistantManagementPage', () => {
  let component: AssistantManagementPage;
  let fixture: ComponentFixture<AssistantManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
