import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Subscription, timer, switchMap, forkJoin } from 'rxjs';
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
          ])
        )
      )
      .subscribe(([candidatos, sexo]) => {
        this.candidatos.set(candidatos);
        this.votosPorSexo.set(sexo);
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