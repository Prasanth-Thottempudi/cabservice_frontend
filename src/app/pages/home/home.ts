import { Component } from '@angular/core';
import { Topbar } from '../../shared/topbar/topbar';
import { Navbar } from '../../shared/navbar/navbar';
import { Hero } from '../../home/hero/hero';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Topbar, Navbar, Hero],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
