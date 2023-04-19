import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubFolderModalComponent } from './new-sub-folder-modal.component';

describe('NewSubFolderModalComponent', () => {
  let component: NewSubFolderModalComponent;
  let fixture: ComponentFixture<NewSubFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubFolderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
