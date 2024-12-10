import { Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';

export interface componentBase {
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  autoHeight: boolean;
}

export interface componentSet extends componentBase {
  id?: number;
  width: number;
  height: number;
  data?: any;
}

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrl: './component-list.component.scss',
  standalone: true,
  imports: [ButtonModule],
})
export class ComponentListComponent {
  add = output<componentSet>();

  componentList: componentBase[] = [
    {
      name: '跑馬燈',
      defaultWidth: 12,
      defaultHeight: 3,
      autoHeight: false,
    },
    {
      name: '標題',
      defaultWidth: 12,
      defaultHeight: 3,
      autoHeight: false,
    },
    {
      name: '副標題',
      defaultWidth: 12,
      defaultHeight: 2,
      autoHeight: false,
    },
    {
      name: '文章',
      defaultWidth: 6,
      defaultHeight: 4,
      autoHeight: false,
    },
    {
      name: '圖片',
      defaultWidth: 12,
      defaultHeight: 4,
      autoHeight: false,
    },
  ];

  addItem(item: componentBase) {
    this.add.emit({
      ...item,
      width: item.defaultWidth,
      height: item.defaultHeight,
    });
  }
}
