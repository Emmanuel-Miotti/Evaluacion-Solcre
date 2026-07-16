import { Routes } from '@angular/router';
import { VotacionComponent } from './pages/votacion/votacion.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ResultadosComponent } from './pages/admin/resultados/resultados.component';
import { ListadoVotosComponent } from './pages/admin/listado-votos/listado-votos.component';
import { AgregarVotanteComponent } from './pages/admin/agregar-votante/agregar-votante.component';
import { CambiarClaveComponent } from './pages/admin/cambiar-clave/cambiar-clave.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: VotacionComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'resultados', pathMatch: 'full' },
      { path: 'resultados', component: ResultadosComponent },
      { path: 'listado', component: ListadoVotosComponent },
      { path: 'agregar', component: AgregarVotanteComponent },
      { path: 'clave', component: CambiarClaveComponent },
    ],
  },
];