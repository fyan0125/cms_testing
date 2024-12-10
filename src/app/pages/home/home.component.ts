import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  componentSet,
  ComponentListComponent,
} from '../../features/component-list/component-list.component';
import { DraggableComponent } from '../../features/draggable/draggable.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, ComponentListComponent, DraggableComponent],
})
export class HomeComponent {
  nextId = 0;
  componentList: componentSet[] = [];
  result: string = '';

  addItem(item: componentSet) {
    this.componentList.push({ id: this.nextId++, ...item });
  }

  remove(e: componentSet) {
    this.componentList = this.componentList.filter(
      (component) => component.id != e.id
    );
  }
}
