import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { Subscription, timer, switchMap } from 'rxjs';
import { VotosService } from '../../../services/votos.service';
import { ListadoVotosResponse, VotoDetalle } from '../../../models/voto.model';
import { DatePipe } from '@angular/common';

function formatearFechaSolo(fechaIso: string): string {
  const [anio, mes, dia] = fechaIso.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

@Component({
  selector: 'app-listado-votos',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './listado-votos.component.html',
  styleUrl: './listado-votos.component.css',
})
export class ListadoVotosComponent implements OnInit, OnDestroy {
  private votosService = inject(VotosService);
  private sub?: Subscription;

  pagina = signal(1);
  datos = signal<ListadoVotosResponse | null>(null);
  detalle = signal<VotoDetalle | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    this.reiniciarPolling();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private reiniciarPolling(): void {
    this.sub?.unsubscribe();
    this.sub = timer(0, 1000)
      .pipe(switchMap(() => this.votosService.getVotos(this.pagina())))
      .subscribe((datos) => {
        this.datos.set(datos);
        this.cargando.set(false);
      });
  }

  irAPagina(delta: number): void {
    this.pagina.update((p) => p + delta);
    this.cargando.set(true);
    this.reiniciarPolling();
  }

  verDetalle(id: number): void {
    this.votosService.getDetalle(id).subscribe((detalle) => this.detalle.set(detalle));
  }

  cerrarDetalle(): void {
    this.detalle.set(null);
  }

  formatearFecha(fechaIso: string): string {
    return formatearFechaSolo(fechaIso);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.detalle()) this.cerrarDetalle();
  }
}