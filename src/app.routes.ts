
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';

export const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent, title: 'Rishi Jha | Home' },
  { path: 'about', component: AboutComponent, title: 'About | Rishi Jha' },
  { path: 'services', component: ServicesComponent, title: 'Services | Rishi Jha' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
