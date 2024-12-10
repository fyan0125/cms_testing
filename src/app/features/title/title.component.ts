import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';

export interface title {
  text: string;
  color: string;
}

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ColorPicker],
})
export class TitleComponent {
  mode = input.required<'layout' | 'content' | 'preview'>();
  remove = output();
  outputData = output<title>();

  data: title = { text: '', color: '#000000' };
}
