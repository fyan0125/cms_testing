import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

import { componentSet } from '../../features/component-list/component-list.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

export interface page {
  id: string;
  name: string;
  structure: componentSet[];
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
  standalone: true,
  imports: [TableModule, ButtonModule],
})
export class ManageComponent implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);
  data = signal<page[]>([]);

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
}
