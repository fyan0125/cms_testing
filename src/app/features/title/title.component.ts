import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';

export interface title {
  text: string;
  color: string;
  class: 'text-2xl' | 'text-xl';
  align: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    ColorPicker,
    Select,
    SelectButton,
  ],
})
export class TitleComponent implements OnInit {
  mode = input.required<'layout' | 'content' | 'preview'>();
  inputData = input.required<title | null>();
  remove = output();
  outputData = output<title>();

  classOptions = [
    { name: 'Heading', value: 'text-2xl' },
    { name: 'SubHeading', value: 'text-xl' },
  ];

  alignOptions: any[] = [
    { icon: 'pi pi-align-left', align: 'left' },
    { icon: 'pi pi-align-center', align: 'center' },
    { icon: 'pi pi-align-right', align: 'right' },
  ];

  data: title = {
    text: '',
    color: '#000000',
    class: 'text-2xl',
    align: 'left',
  };

  ngOnInit(): void {
    this.data = this.inputData() || {
      text: '',
      color: '#000000',
      class: 'text-2xl',
      align: 'left',
    };
  }
}
