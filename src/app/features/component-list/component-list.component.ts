import { Component, output } from '@angular/core';

export interface component {
  id?: number;
  name: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrl: './component-list.component.scss',
  standalone: true,
})
export class ComponentListComponent {
  add = output<component>();

  componentList: component[] = [
    {
      name: '跑馬燈',
      width: 12,
      height: 1,
    },
    {
      name: '文章',
      width: 6,
      height: 1,
    },
    {
      name: '圖片',
      width: 12,
      height: 1,
    },
  ];

  addItem(item: component) {
    this.add.emit(item);
  }
}
