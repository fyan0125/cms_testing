import { Component, Input, Output,EventEmitter } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { componentSet } from '../component-list/component-list.component';

@Component({
  selector: 'app-tinymce-editor',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './tinymce-editor.component.html',
  styleUrl: './tinymce-editor.component.scss',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class TinymceEditorComponent {
  @Input() gridItem!: componentSet;
  @Output() heightChange = new EventEmitter<number>(); 
  private editorInstance: any;

  init: EditorComponent['init'] = {
    selector: '#editor',
    base_url: '/tinymce', 
    suffix: '.min',
    relative_urls: false,
    menubar: false,
    plugins: 'autoresize',
    toolbar: 
      `undo redo | formatselect | bold italic | ` +
      'alignleft aligncenter alignright alignjustify  | ' +
      'bullist numlist outdent indent | removeformat | help',
    paste_data_images: true, 
    browser_spellcheck: true, 
    branding: false,         
    theme_advanced_resizing : false,
    nowrap : false,
    content_style: `html, body { overflow: hidden; }`,
    setup: (editor: any) => {
      this.editorInstance = editor;

      editor.on('ResizeEditor', () => {
        const editorHeight = editor.iframeElement?.offsetHeight || 0;
  const padding = 10; // 考慮編輯器內邊距
  const adjustedHeight = editorHeight + padding;

  const gridRowHeight = 20; // 每行的高度需與 CSS 中的 `grid-auto-rows` 保持一致
  const requiredRows = Math.ceil(adjustedHeight / gridRowHeight);

  this.heightChange.emit(requiredRows);
      });
    },
  };

}
