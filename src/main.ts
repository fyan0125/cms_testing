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
import { HomeComponent } from './app/pages/maintenance/home/home.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
  },
  {
    path: 'edit/:id',
    component: EditPageComponent,
  },
  {
    path: 'maintenance',
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
  {
    // 無輸入路徑導向首頁
    path: '',
    redirectTo: '/manage',
    pathMatch: 'full',
  },
  {
    // 無法解析的路由
    path: '**',
    redirectTo: '/manage',
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
