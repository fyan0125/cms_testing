import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
  standalone: true,
  imports: [PanelMenu],
})
export class SidemenuComponent {
  items: MenuItem[] = [
    {
      label: '系統設定',
      icon: 'pi pi-wrench',
      items: [
        {
          label: '推薦商品',
          icon: 'pi pi-shop',
        },
        {
          label: '列舉值設定',
          icon: 'pi pi-list',
        },
        {
          label: '帳號權限管理',
          icon: 'pi pi-users',
        },
      ],
    },
    {
      label: '操作紀錄',
      icon: 'pi pi-table',
      items: [
        {
          label: '成效分析',
          icon: 'pi pi-chart-bar',
        },
        {
          label: '資料異動紀錄',
          icon: 'pi pi-file-edit',
        },
      ],
    },
    {
      label: '審核管理',
      icon: 'pi pi-book',
    },
    {
      label: '文章管理',
      icon: 'pi pi-book',
      routerLink: '/manage',
    },
    {
      label: 'QA管理',
      icon: 'pi pi-pen-to-square',
    },
    {
      label: '推薦商品設定',
      icon: 'pi pi-pen-to-square',
    },
    {
      label: '畫面維護',
      icon: 'pi pi-expand',
      items: [
        {
          label: '首頁',
          icon: 'pi pi-home',
          routerLink: '/maintenance/home',
        },
        {
          label: '商品總覽',
          icon: 'pi pi-chart-line',
        },
        {
          label: '商品詳情',
          icon: 'pi pi-objects-column',
        },
        {
          label: '頁尾與條款管理',
          icon: 'pi pi-inbox',
        },
      ],
    },
    {
      label: '商品管理',
      icon: 'pi pi-cog',
      items: [
        {
          label: '商品資訊編輯',
          icon: 'pi pi-users',
        },
        {
          label: '資料上傳',
          icon: 'pi pi-upload',
        },
        {
          label: '檔案上傳',
          icon: 'pi pi-file-arrow-up',
        },
      ],
    },
  ];
}
