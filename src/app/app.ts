import { Component } from '@angular/core';
import { Home } from './pages/home/home';
import { FloatingButtons } from './shared/floating-buttons/floating-buttons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Home,FloatingButtons],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
