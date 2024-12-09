import {
  Component,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Sortable from 'sortablejs';

import { component } from '../../features/component-list/component-list.component';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class DraggableComponent implements OnInit {
  @ViewChild('sortableList', { static: true }) sortableList!: ElementRef;
  componentList = input.required<component[]>();
  sortList = signal<component[]>([]);
  resizingItem: component | null = null;
  startY: number = 0;
  startX: number = 0;
  startWidth: number = 0;
  widthOptions = [12, 6, 4];

  result = output<component[]>();

  constructor() {
    this.onResizing = this.onResizing.bind(this);
    this.onResizeEnd = this.onResizeEnd.bind(this);

    effect(() => {
      this.componentList();
      untracked(() => {
        this.sortList.set(this.componentList());
      });
    });
  }

  ngOnInit() {
    const sortable = new Sortable(this.sortableList.nativeElement, {
      animation: 150,
      handle: '.handle',
      group: {
        name: 'shared',
        pull: false,
        put: false,
      },
      onEnd: (event: any) => {
        const [movedItem] = this.sortList().splice(event.oldIndex, 1);
        this.sortList().splice(event.newIndex, 0, movedItem);
        this.result.emit(this.sortList());
      },
    });
  }

  onResizeStart(event: MouseEvent, item: component) {
    this.onResizeEnd();
    this.resizingItem = item;
    this.startY = event.clientY;
    this.startX = event.clientX;
    this.startWidth = item.width;

    const gridItem = (event.target as HTMLElement).closest('.grid-item');
    if (gridItem) {
      gridItem.classList.add('resizing');
    }

    window.addEventListener('mousemove', this.onResizing, true);
    window.addEventListener('mouseup', this.onResizeEnd, true);
  }

  onResizing(event: MouseEvent) {
    if (this.resizingItem) {
      const deltaY = event.clientY - this.startY;
      const deltaX = event.clientX - this.startX;

      const gridHeight = 100;
      const newRows = Math.min(
        10,
        Math.max(1, this.resizingItem.height + Math.round(deltaY / gridHeight))
      );

      const gridWidth = window.innerWidth / 12;
      const newWidth = Math.round(this.startWidth + deltaX / gridWidth);

      const closestWidth = this.widthOptions.reduce((prev, curr) =>
        Math.abs(curr - newWidth) < Math.abs(prev - newWidth) ? curr : prev
      );

      this.resizingItem.width = closestWidth;

      this.resizingItem.height = newRows;
      this.startY = event.clientY;
    }
  }

  onResizeEnd() {
    const gridItem = document.querySelector('.resizing');
    if (gridItem) {
      gridItem.classList.remove('resizing');
    }

    this.resizingItem = null;

    window.removeEventListener('mousemove', this.onResizing, true);
    window.removeEventListener('mouseup', this.onResizeEnd, true);
  }
}
