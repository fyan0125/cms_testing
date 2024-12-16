import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { componentSet } from '../../features/edit-page/component-list/component-list.component';
import { SidemenuComponent } from '../../features/common/sidemenu/sidemenu.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';

export interface page {
  id: string;
  name: string;
  type: string;
  startdt: string;
  enddt: string;
  status: string;
  structure: componentSet[];
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SidemenuComponent,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    Select,
    DatePicker,
  ],
  providers: [DatePipe],
})
export class ManageComponent implements OnInit {
  private http = inject(HttpClient);
  private date = inject(DatePipe);
  router = inject(Router);
  data = signal<page[]>([]);

  dialog = false;
  validate = signal<boolean>(false);
  editing: page = {} as page;

  typeOptions = [
    { name: '廣告', value: 'ad' },
    { name: '文章', value: 'art' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const url = 'http://localhost:3000/getData/';

    this.http.get<page[]>(url).subscribe({
      next: (data: page[]) => {
        this.data.set(data);
      },
      error: (err) => {
        console.error('Failed to get data:', err);
        alert('Failed to get data!');
      },
    });
  }

  deletePage(page: page) {
    const url = 'http://localhost:3000/deletePage/';
    const request = {
      id: page.id,
    };

    this.http.post(url, request).subscribe({
      next: () => {
        console.log('Delete data successfully.');
        this.getData();
      },
      error: (err) => {
        console.error('Failed to delete data:', err);
        alert('Failed to delete data!');
      },
    });
  }

  editPage(page: page) {
    this.editing = JSON.parse(
      JSON.stringify({
        ...page,
        startdt: this.date.transform(page.startdt, 'yyyy/MM/dd hh:mm a'),
        enddt: this.date.transform(page.enddt, 'yyyy/MM/dd hh:mm a'),
      })
    );
    this.dialog = true;
  }

  savePage() {
    if (
      !this.editing.name ||
      !this.editing.type ||
      !this.editing.startdt ||
      !this.editing.enddt
    ) {
      this.validate.set(true);
      return;
    }

    const url = 'http://localhost:3000/editPage/';
    const request = {
      id: this.editing.id,
      name: this.editing.name,
      type: this.editing.type,
      startdt: this.editing.startdt,
      enddt: this.editing.enddt,
    };

    this.http.post(url, request).subscribe({
      next: () => {
        console.log('Save data successfully.');
        this.dialog = false;
        this.editing = {} as page;
        this.getData();
      },
      error: (err) => {
        console.error('Failed to save data:', err);
        alert('Failed to save data!');
      },
    });
  }

  cancel() {
    this.editing = {} as page;
    this.dialog = false;
  }

  getTypeName(typeValue: string): string {
    return (
      this.typeOptions.find((type) => type.value === typeValue)?.name ||
      'Unknown'
    );
  }
}
