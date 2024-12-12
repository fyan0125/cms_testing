import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from '../public/mytheme';
import { Routes } from '@angular/router';

import { EditPageComponent } from './app/pages/edit-page/edit-page.component';
import { ManageComponent } from './app/pages/manage/manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
  },
  {
    path: 'edit',
    component: EditPageComponent,
    children: [
      {
        path: ':id',
        component: EditPageComponent,
      },
    ],
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      },
    }),
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
