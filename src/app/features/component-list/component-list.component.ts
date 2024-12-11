import { Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';

export interface componentBase {
  layoutType: string;
  defaultWidth: number;
  defaultHeight: number;
  heightEditable: boolean;
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
      layoutType: '跑馬燈',
      defaultWidth: 12,
      defaultHeight: 3,
      heightEditable: true,
    },
    {
      layoutType: '標題',
      defaultWidth: 12,
      defaultHeight: 3,
      heightEditable: true,
    },
    {
      layoutType: '文章',
      defaultWidth: 6,
      defaultHeight: 14,
      heightEditable: false,
    },
    {
      layoutType: '圖片',
      defaultWidth: 12,
      defaultHeight: 10,
      heightEditable: true,
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
