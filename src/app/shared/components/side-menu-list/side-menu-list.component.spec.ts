import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuListComponent } from './side-menu-list.component';

describe('SideMenuListComponent', () => {
  let component: SideMenuListComponent;
  let fixture: ComponentFixture<SideMenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
