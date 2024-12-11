import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { Dialog } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

export interface title {
  text: string;
  color: string;
}

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule,FormsModule, ButtonModule, ColorPicker, Dialog, InputGroup, InputGroupAddonModule, InputTextModule],
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.scss'
})
export class MarqueeComponent {
  mode = input.required<'layout' | 'content' | 'preview'>();
  remove = output();
  outputData = output<title[]>();
  visible: boolean = false;

  marqueeContents: string[] = [
    'Your scrolling text goes here 111111111111111111111111111111111111111111111111111111111.',
    'Your scrolling text goes here 222222222222222222222222222222222222222222222222222222222.',
    'Your scrolling text goes here 333333333333333333333333333333333333333333333333333333333.'
  ];

  showDialog() {
    this.visible = true;
  }

}
