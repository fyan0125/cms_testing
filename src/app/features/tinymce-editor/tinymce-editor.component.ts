import { Component, Input, Output,EventEmitter, input, output, SimpleChanges } from '@angular/core';
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
  private isEditorInitialized = false;

  remove = output();

  init: EditorComponent['init'] = {
      selector: '#editor',
      base_url: '/tinymce', 
      suffix: '.min',
      relative_urls: false,
      menubar: true,
      plugins: 'autoresize advlist autolink link image lists charmap print preview',
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
          const padding = 10; 
          const adjustedHeight = editorHeight + padding;

          const gridRowHeight = 20; 
          const requiredRows = Math.ceil(adjustedHeight / gridRowHeight);
          if (this.isEditorInitialized) {
            this.heightChange.emit(requiredRows);
          }
          this.isEditorInitialized = true;
        });

      editor.on('change', () => {
        this.emitHeightChange();
      });
    },
  };

  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']  && this.isEditorInitialized) {
      this.emitHeightChange();
    }
  }

  emitHeightChange(): void {
    let contentHeight = 0;

    const renderedContent = this.getRenderedContent();
    if(renderedContent === '(內容空白)')
      return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedContent;
    document.body.appendChild(tempDiv);
    contentHeight = tempDiv.scrollHeight + 1;
    document.body.removeChild(tempDiv);

    const gridRowHeight = 20; 
    const requiredRows = Math.ceil(contentHeight / gridRowHeight);
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
