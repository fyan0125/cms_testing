import { Routes } from '@angular/router';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ManageComponent } from './pages/manage/manage.component';

export const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
  },
  {
    path: 'edit',
    component: EditPageComponent,
  },
  {
    path: 'edit/:id',
    component: EditPageComponent,
  },
];
