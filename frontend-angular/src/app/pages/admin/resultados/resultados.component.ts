import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Subscription, timer, switchMap, forkJoin, catchError, of } from 'rxjs';
import { CandidatosService } from '../../../services/candidatos.service';
import { CandidatoResultado, VotosPorSexo } from '../../../models/candidato.model';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent implements OnInit, OnDestroy {
  private candidatosService = inject(CandidatosService);
  private sub?: Subscription;

  candidatos = signal<CandidatoResultado[]>([]);
  votosPorSexo = signal<VotosPorSexo[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  totalVotos = computed(() =>
    this.candidatos().reduce((acc, c) => acc + c.votes_received_count, 0)
  );
  maxVotos = computed(() =>
    Math.max(0, ...this.candidatos().map((c) => c.votes_received_count))
  );
  ranking = computed(() =>
    [...this.candidatos()].sort((a, b) => b.votes_received_count - a.votes_received_count)
  );
  liderTexto = computed(() => {
    const total = this.totalVotos();
    const max = this.maxVotos();
    if (total === 0) return 'Sin votos aun';
    const lideres = this.candidatos().filter((c) => c.votes_received_count === max);
    return lideres.length > 1 ? 'Empate' : `${lideres[0].nombre} ${lideres[0].apellido}`;
  });

  ngOnInit(): void {
  this.sub = timer(0, 5000)
    .pipe(
      switchMap(() =>
        forkJoin([
          this.candidatosService.getMasVotados(),
          this.candidatosService.getEstadisticasSexo(),
        ]).pipe(
          // Si un tick falla (red, backend caido), devolvemos null para no
          // matar el timer: el proximo tick a los 5s reintenta solo.
          catchError(() => of(null))
        )
      )
    )
    .subscribe((resultado) => {
      if (resultado === null) {
        this.error.set('No se pudieron actualizar los resultados. Reintentando...');
        this.cargando.set(false);
        return;
      }
      const [candidatos, sexo] = resultado;
      this.candidatos.set(candidatos);
      this.votosPorSexo.set(sexo);
      this.error.set(null);
      this.cargando.set(false);
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  porcentaje(votos: number): number {
    return this.maxVotos() > 0 ? (votos / this.maxVotos()) * 100 : 0;
  }
}