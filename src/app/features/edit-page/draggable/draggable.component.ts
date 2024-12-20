import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Sortable from 'sortablejs';
import { FormsModule } from '@angular/forms';

import { componentSet } from '../component-list/component-list.component';
import { TinymceEditorComponent } from '../tinymce-editor/tinymce-editor.component';
import { TitleComponent } from '../title/title.component';
import { MarqueeComponent } from '../marquee/marquee.component';
import { ImageComponent } from '../image/image.component';

import { SelectButton } from 'primeng/selectbutton';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TinymceEditorComponent,
    FormsModule,
    SelectButton,
    TitleComponent,
    ImageComponent,
    MarqueeComponent,
    FileUploadComponent
  ],
})
export class DraggableComponent implements OnInit {
  @ViewChild('sortableList', { static: true }) sortableList!: ElementRef;
  componentList = input.required<componentSet[]>();
  result = output<componentSet[]>();
  remove = output<componentSet>();
  private cd = inject(ChangeDetectorRef);

  modeOption = [
    {
      name: '排版',
      value: 'layout',
    },
    {
      name: '內容編輯',
      value: 'content',
    },
    {
      name: '預覽',
      value: 'preview',
    },
  ];
  mode: 'layout' | 'content' | 'preview' = 'layout';
  editLayout = signal<'layout' | 'content' | 'preview'>('layout');
  sortList = signal<componentSet[]>([]);
  sortable: Sortable | null = null;

  resizingItem: componentSet | null = null;
  startY: number = 0;
  startX: number = 0;
  startHeight: number = 0;
  startWidth: number = 0;
  widthOptions = [12, 8, 6, 4];

  constructor() {
    this.onResizing = this.onResizing.bind(this);
    this.onResizeEnd = this.onResizeEnd.bind(this);

    effect(() => {
      this.componentList();
      untracked(() => {
        this.sortList.set(this.componentList());
        this.result.emit(this.sortList());
      });
    });
  }

  ngOnInit() {
    this.sortable = new Sortable(this.sortableList.nativeElement, {
      animation: 150,
      draggable: '.draggable',
      sort: true,
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

  onResizeStart(event: MouseEvent, item: componentSet) {
    event.preventDefault();
    this.onResizeEnd();
    this.resizingItem = item;
    this.startY = event.clientY;
    this.startX = event.clientX;
    this.startHeight = item.height;
    this.startWidth = item.width;

    const gridItem = (event.target as HTMLElement).closest('.grid-item');
    if (gridItem) {
      gridItem.classList.add('resizing');
    }

    window.addEventListener('mousemove', this.onResizing, true);
    window.addEventListener('mouseup', this.onResizeEnd, true);
  }

  onResizing(event: MouseEvent) {
    event.preventDefault();
    if (this.resizingItem) {
      const deltaY = event.clientY - this.startY;
      const deltaX = event.clientX - this.startX;

      if (this.resizingItem.heightEditable) {
        const gridHeight = 20;
        const newRows = Math.max(
          this.resizingItem.defaultHeight,
          this.startHeight + Math.round(deltaY / gridHeight)
        );
        this.resizingItem.height = newRows;
      }

      const gridWidth = window.innerWidth / 12;
      const newWidth = Math.round(this.startWidth + deltaX / gridWidth);

      const closestWidth = this.widthOptions.reduce((prev, curr) =>
        Math.abs(curr - newWidth) < Math.abs(prev - newWidth) ? curr : prev
      );

      this.resizingItem.width = closestWidth;
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

  onEditorHeightChange(item: componentSet, newHeight: number): void {
    setTimeout(() => {
      item.height = newHeight + 6;
      this.cd.markForCheck();
    }, 0);
  }

  updateData(item: componentSet, event: any) {
    item.data = event;
    this.result.emit(this.sortList());
  }
}
