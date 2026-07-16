import { HttpErrorResponse } from '@angular/common/http';


// saca el mensaje de error de la respuesta de la API, o devuelve un mensaje por defecto si no hay uno.

export function mensajeDeApi(err: HttpErrorResponse, porDefecto: string): string {
  const errores = err.error?.errors as Record<string, string[]> | undefined;
  if (errores) {
    const primerCampo = Object.values(errores)[0];
    if (Array.isArray(primerCampo) && primerCampo.length > 0) {
      return primerCampo[0];
    }
  }
  return err.error?.message ?? porDefecto;
}