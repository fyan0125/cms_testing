import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import {
  componentSet,
  ComponentListComponent,
} from '../../features/component-list/component-list.component';
import { DraggableComponent } from '../../features/draggable/draggable.component';
import { page } from '../manage/manage.component';

import { ButtonModule } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ComponentListComponent,
    DraggableComponent,
    ButtonModule,
    Panel,
    Dialog,
    InputTextModule,
  ],
})
export class EditPageComponent implements OnInit {
  pageId = signal<string | null>(null);
  pageName: string | null = null;
  editPageName = false;
  nextId = 0;
  componentList: componentSet[] = [];
  result: string = '';
  private http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.pageId.set(params.get('id')); // 如果 URL 沒有帶 id，這裡會是 null
      if (this.pageId()) {
        this.getData();
      }
    });
  }

  addItem(item: componentSet) {
    this.componentList.push({ id: this.nextId++, ...item });
  }

  remove(e: componentSet) {
    this.componentList = this.componentList.filter(
      (component) => component.id != e.id
    );
  }

  getData() {
    const url = `http://localhost:3000/getData/${this.pageId()}`;

    this.http.get<page>(url).subscribe({
      next: (data: page) => {
        this.componentList = data.structure;
        this.pageName = data.name;
        const maxId = this.componentList.reduce(
          (max, component) =>
            (component.id as number) > max ? (component.id as number) : max,
          0
        );
        this.nextId = maxId + 1;
      },
      error: (err) => {
        console.error('Failed to get data:', err);
        alert('Failed to get data!');
      },
    });
  }

  save() {
    if (!this.pageName) {
      this.editPageName = true;
      return;
    }

    const url = 'http://localhost:3000/editPage/';
    const request = {
      id: this.pageId(),
      name: this.pageName,
      structure: this.componentList,
    };

    this.http.post(url, request).subscribe({
      next: () => {
        console.log('Save data successfully.');
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Failed to save data:', err);
        alert('Failed to save data!');
      },
    });
  }

  cancel() {
    const deleteRequests = this.componentList
      .filter((component) => component.layoutType == '圖片')
      .map((img) => {
        if (img.data) {
          const normalizedPath = img.data.replace(/\\/g, '/');
          const fileName = normalizedPath.split('/').pop();

          const deleteUrl = 'http://localhost:3000/deleteFile/';
          const request = {
            filename: fileName,
          };

          return this.http.post(deleteUrl, request).toPromise();
        }
        return null;
      })
      .filter((request) => request !== undefined);

    Promise.all(deleteRequests)
      .then(() => {
        this.componentList = []; // 清空 componentList
        this.router.navigate(['']);
      })
      .catch((err) => {
        console.error('Failed to delete some images:', err);
        alert('Failed to delete some images!');
      });
  }
}
