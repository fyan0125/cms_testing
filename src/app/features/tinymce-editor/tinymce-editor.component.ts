import { Component, Input, Output,EventEmitter, input, output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { componentSet } from '../component-list/component-list.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-tinymce-editor',
  standalone: true,
  imports: [EditorComponent, ButtonModule],
  templateUrl: './tinymce-editor.component.html',
  styleUrl: './tinymce-editor.component.scss',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class TinymceEditorComponent{
  @Input() gridItem!: componentSet;
  @Output() heightChange = new EventEmitter<number>(); 
  @Output() contentChange = new EventEmitter<string>();
  mode = input.required<'layout' | 'content' | 'preview'>();
  private editorInstance: any;
  private requiredRows: number = 14;

  remove = output();


  init: EditorComponent['init'] = {
      selector: '#editor',
      base_url: '/tinymce', 
      suffix: '.min',
      language: 'zh_TW', 
      language_url: '/assets/tinymce/langs/zh_TW.js',
      promotion: false,
      menubar: 'insert view format table tools help',
      plugins: 'autoresize media table image',
      toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor emoticons',
      branding: false,         
      setup: (editor: any) => {
        this.editorInstance = editor;

        editor.on('ResizeEditor', () => {
          const editorHeight = editor.iframeElement?.offsetHeight || 0;
          const padding = 10; 
          const adjustedHeight = editorHeight + padding;

          const gridRowHeight = 20; 
          const requiredRows = Math.ceil(adjustedHeight / gridRowHeight);
          this.requiredRows = requiredRows;
          this.heightChange.emit(requiredRows);
        });


    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] && !changes['mode'].isFirstChange()) {
      this.adjustRequiredRows();
    }
  }

  adjustRequiredRows(): void {
    let adjustedRows = this.requiredRows;

    if (this.mode() !== 'content') {
      adjustedRows = Math.max(1, this.requiredRows - 8); 
    }
    this.heightChange.emit(adjustedRows);

  }

  getRenderedContent(): string {
    if (this.editorInstance) {
      const iframe = this.editorInstance.iframeElement;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const content = iframeDoc.body.innerHTML.trim();          
          return content !=='<p><br data-mce-bogus="1"></p>' ? content : '(內容空白)';
        }
      }
    }
    return '(內容空白)';
  }


}
