import { Routes } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LeaderboardComponent },
  {
    path: 'pontuacao',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pontuacao/pontuacao.component').then(m => m.PontuacaoComponent),
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agenda/agenda.component').then(m => m.AgendaComponent),
  }
];
