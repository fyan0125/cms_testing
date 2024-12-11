import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { Dialog } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

export interface content {
  text: string;
  color: string;
}

export interface marquee {
  time: number;
  content: content[];
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
  outputData = output<marquee>();
  visible: boolean = false;

  marqueeContents: content[] = [];
  animationDuration: number = 20;

  showDialog() {
    this.visible = true;
  }

  addMarqueeContent() {
    this.marqueeContents.push({ color: '#000000', text: '' });
  }

  removeMarqueeContent(index: number) {
    this.marqueeContents.splice(index, 1);
  }

}
