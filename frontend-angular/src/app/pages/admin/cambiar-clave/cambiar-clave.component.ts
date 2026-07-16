import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

function clavesCoincidenValidator(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('claveNueva')?.value;
  const repetida = control.get('claveNuevaRepetida')?.value;
  if (!nueva || !repetida) return null;
  return nueva === repetida ? null : { clavesNoCoinciden: true };
}

// Replica la regla del backend: Password::min(8)->letters()->numbers()->symbols()
function claveFuerteValidator(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value ?? '';
  if (!valor) return null;

  const errores: ValidationErrors = {};
  if (valor.length < 8) errores['muyCorta'] = true;
  if (!/[a-zA-Z]/.test(valor)) errores['sinLetras'] = true;
  if (!/[0-9]/.test(valor)) errores['sinNumeros'] = true;
  if (!/[^a-zA-Z0-9]/.test(valor)) errores['sinSimbolos'] = true;

  return Object.keys(errores).length > 0 ? errores : null;
}

type Mensaje = { tipo: 'success' | 'error'; texto: string } | null;

@Component({
  selector: 'app-cambiar-clave',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cambiar-clave.component.html',
  styleUrl: './cambiar-clave.component.css',
})
export class CambiarClaveComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  enviando = signal(false);
  mensaje = signal<Mensaje>(null);

  form = this.fb.nonNullable.group(
    {
      claveActual: ['', Validators.required],
      claveNueva: ['', [Validators.required, claveFuerteValidator]],
      claveNuevaRepetida: ['', Validators.required],
    },
    { validators: clavesCoincidenValidator }
  );

  actualizar(): void {
    this.mensaje.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const { claveActual, claveNueva, claveNuevaRepetida } = this.form.getRawValue();

    this.adminService
      .cambiarClave({
        clave_actual: claveActual,
        clave_nueva: claveNueva,
        clave_nueva_confirmation: claveNuevaRepetida,
      })
      .subscribe({
        next: (res) => {
          this.mensaje.set({ tipo: 'success', texto: res.message });
          this.form.reset();
          this.enviando.set(false);
        },
        error: (err) => {
          const texto = err.error?.message ?? 'No se pudo actualizar la clave.';
          this.mensaje.set({ tipo: 'error', texto });
          this.enviando.set(false);
        },
      });
  }
}