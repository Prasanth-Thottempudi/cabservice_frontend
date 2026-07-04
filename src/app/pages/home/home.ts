import { Component } from '@angular/core';
import { Topbar } from '../../shared/topbar/topbar';
import { Navbar } from '../../shared/navbar/navbar';
import { Hero } from '../../home/hero/hero';
import { WhyChooseComponent } from '../../home/why-choose/why-choose';
import { Services } from '../../home/services/services';
import { FeaturedFleet } from '../../home/featured-fleet/featured-fleet';
import { Airport } from '../../home/airport/airport';
import { Corporate } from '../../home/corporate/corporate';
import { Routes } from '../../home/routes/routes';
import { Offers } from '../../home/offers/offers';
import test from 'node:test';
import { Testimonials } from '../../home/testimonials/testimonials';
import { Faq } from '../../home/faq/faq';
import { Contact } from '../../home/contact/contact';
import { Footer } from '../../home/footer/footer';
import { AppDownload } from '../../home/app-download/app-download';
import { Location } from '../../home/location/location';
import { FloatingButtons } from '../../shared/floating-buttons/floating-buttons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Topbar,
    Navbar,
    Hero,
    // WhyChooseComponent,
    Services,
    FeaturedFleet,
    Airport,
    Corporate,
    Routes,
    Offers,
    Testimonials,
    Faq,
    Contact,
    Location,
    Footer,
    FloatingButtons
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
