import { Component } from '@angular/core';

import {
  component,
  ComponentListComponent,
} from '../../features/component-list/component-list.component';
import { DraggableComponent } from '../../features/draggable/draggable.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ComponentListComponent, DraggableComponent],
})
export class HomeComponent {
  componentList: component[] = [];
  result: string = '';

  addItem(item: component) {
    this.componentList.push({ id: this.componentList.length, ...item });
  }

  getResult(e: component[]) {
    this.result = JSON.stringify(e);
  }
}
