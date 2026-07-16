import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidatosService } from '../../services/candidatos.service';
import { VotosService } from '../../services/votos.service';
import { Candidato } from '../../models/candidato.model';

type Mensaje = { tipo: 'success' | 'error'; texto: string } | null;

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './votacion.component.html',
  styleUrl: './votacion.component.css',
})
export class VotacionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private candidatosService = inject(CandidatosService);
  private votosService = inject(VotosService);

  candidatos = signal<Candidato[]>([]);
  cargandoCandidatos = signal(true);
  enviando = signal(false);
  mensaje = signal<Mensaje>(null);

  form = this.fb.nonNullable.group({
    documento: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(20)]],
    candidatoId: ['', Validators.required],
  });

  ngOnInit(): void {
    this.candidatosService.getCandidatos().subscribe({
      next: (candidatos) => {
        this.candidatos.set(candidatos);
        this.cargandoCandidatos.set(false);
      },
      error: () => {
        this.mensaje.set({ tipo: 'error', texto: 'No se pudo cargar la lista de candidatos.' });
        this.cargandoCandidatos.set(false);
      },
    });
  }

  votar(): void {
    this.mensaje.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const { documento, candidatoId } = this.form.getRawValue();

    this.votosService.emitirVoto(documento, Number(candidatoId)).subscribe({
      next: (res) => {
        this.mensaje.set({ tipo: 'success', texto: res.message });
        this.form.reset({ documento: '', candidatoId: '' });
        this.enviando.set(false);
      },
      error: (err) => {
        const texto = err.error?.message ?? 'Ocurrio un error al procesar el voto.';
        this.mensaje.set({ tipo: 'error', texto });
        this.enviando.set(false);
      },
    });
  }
}