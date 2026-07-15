import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/client';

function CambiarClave() {
  const [claveActual, setClaveActual] = useState('');
  const [claveNueva, setClaveNueva] = useState('');
  const [claveNuevaRepetida, setClaveNuevaRepetida] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const clavesNoCoinciden = claveNueva !== '' && claveNuevaRepetida !== '' && claveNueva !== claveNuevaRepetida;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!claveActual || !claveNueva || !claveNuevaRepetida) {
      setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios.' });
      return;
    }

    if (claveNueva !== claveNuevaRepetida) {
      setMensaje({ tipo: 'error', texto: 'Las claves nuevas no coinciden.' });
      return;
    }

    setEnviando(true);
    try {
      const res = await api.patch('/clave', {
        clave_actual: claveActual,
        clave_nueva: claveNueva,
        clave_nueva_confirmation: claveNuevaRepetida,
      });
      setMensaje({ tipo: 'success', texto: res.data.message });
      setClaveActual('');
      setClaveNueva('');
      setClaveNuevaRepetida('');
    } catch (error: any) {
      const texto = error.response?.data?.message ?? 'No se pudo actualizar la clave.';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <h2>Modificar clave del administrador</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="claveActual">Clave actual</label>
        <input id="claveActual" type="password" value={claveActual} onChange={(e) => setClaveActual(e.target.value)} />

        <label htmlFor="claveNueva">Clave nueva</label>
        <input id="claveNueva" type="password" value={claveNueva} onChange={(e) => setClaveNueva(e.target.value)} />

        <label htmlFor="claveNuevaRepetida">Repetir clave nueva</label>
        <input id="claveNuevaRepetida" type="password" value={claveNuevaRepetida} onChange={(e) => setClaveNuevaRepetida(e.target.value)} />

        {clavesNoCoinciden && <p className="mensaje-error">Las claves nuevas no coinciden.</p>}

        <button type="submit" disabled={enviando || clavesNoCoinciden}>
          {enviando ? 'Guardando...' : 'Actualizar clave'}
        </button>
      </form>

      {mensaje && (
        <p className={mensaje.tipo === 'success' ? 'mensaje-exito' : 'mensaje-error'}>
          {mensaje.texto}
        </p>
      )}
    </div>
  );
}

export default CambiarClave;