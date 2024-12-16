import { Component } from '@angular/core';
import { SidemenuComponent } from '../../../features/common/sidemenu/sidemenu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [SidemenuComponent],
})
export class HomeComponent {}
