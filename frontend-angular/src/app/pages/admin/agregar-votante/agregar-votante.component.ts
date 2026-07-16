import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { VotantesService } from '../../../services/votantes.service';
import { mensajeDeApi } from '../../../core/api-error';

function mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
  const dob = control.value;
  if (!dob) return null;

  const hoy = new Date();
  const nacimiento = new Date(dob);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad >= 18 ? null : { menorDeEdad: true };
}

type Mensaje = { tipo: 'success' | 'error'; texto: string } | null;

@Component({
  selector: 'app-agregar-votante',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-votante.component.html',
  styleUrl: './agregar-votante.component.css',
})
export class AgregarVotanteComponent {
  private fb = inject(FormBuilder);
  private votantesService = inject(VotantesService);

  enviando = signal(false);
  mensaje = signal<Mensaje>(null);

  form = this.fb.nonNullable.group({
    documento: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    tipo: ['votante' as 'votante' | 'candidato', Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dob: ['', [Validators.required, mayorDeEdadValidator]],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    sexo: ['M' as 'M' | 'F' | 'Otro', Validators.required],
  });

  agregar(): void {
    this.mensaje.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.votantesService.agregar(this.form.getRawValue()).subscribe({
      next: () => {
        this.mensaje.set({ tipo: 'success', texto: 'Votante agregado correctamente.' });
        this.form.reset({ tipo: 'votante', sexo: 'M' });
        this.enviando.set(false);
      },
      error: (err) => {
        this.mensaje.set({ tipo: 'error', texto: mensajeDeApi(err, 'No se pudo agregar el votante.') });
        this.enviando.set(false);
      },
    });
  }
}