import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { Dialog } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

export interface Content {
  text: string;
  color: string;
}

export interface Marquee {
  duration: number;
  content: Content[];
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
  outputData = output<Marquee>();
  visible: boolean = false;

  marqueeContents: Content[] = [];
  data: Marquee = {
    duration: 20,
    content: []
  }

  showDialog() {
    this.visible = true;
    this.outputData.emit(this.data)
  }

  addMarqueeContent() {
    this.data.content.push({ color: '#000000', text: '' });
  }

  removeMarqueeContent(index: number) {
    this.data.content.splice(index, 1);
  }

}
