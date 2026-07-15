import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/client';

function AgregarVotante() {
  const [documento, setDocumento] = useState('');
  const [tipo, setTipo] = useState<'votante' | 'candidato'>('votante');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dob, setDob] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F' | 'Otro'>('M');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const camposVacios = !documento || !nombre || !apellido || !dob || !direccion || !telefono;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (camposVacios) {
      setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios.' });
      return;
    }

    setEnviando(true);
    try {
      await api.post('/votantes', {
        documento,
        tipo,
        nombre,
        apellido,
        dob,
        direccion,
        telefono,
        sexo,
      });
      setMensaje({ tipo: 'success', texto: 'Votante agregado correctamente.' });
      setDocumento('');
      setNombre('');
      setApellido('');
      setDob('');
      setDireccion('');
      setTelefono('');
      setTipo('votante');
      setSexo('M');
    } catch (error: any) {
      const texto = error.response?.data?.message ?? 'No se pudo agregar el votante.';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <h2>Agregar nuevo votante</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="documento">Documento</label>
        <input id="documento" value={documento} onChange={(e) => setDocumento(e.target.value)} />

        <fieldset>
          <legend>Tipo</legend>
          <label>
            <input
              type="radio"
              name="tipo"
              value="votante"
              checked={tipo === 'votante'}
              onChange={() => setTipo('votante')}
            />
            Votante
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="candidato"
              checked={tipo === 'candidato'}
              onChange={() => setTipo('candidato')}
            />
            Candidato
          </label>
        </fieldset>

        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label htmlFor="apellido">Apellido</label>
        <input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />

        <label htmlFor="dob">Fecha de nacimiento</label>
        <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

        <label htmlFor="direccion">Direccion</label>
        <input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />

        <label htmlFor="telefono">Telefono</label>
        <input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <label htmlFor="sexo">Sexo</label>
        <select id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value as 'M' | 'F' | 'Otro')}>
          <option value="M">M</option>
          <option value="F">F</option>
          <option value="Otro">Otro</option>
        </select>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Agregar'}
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

export default AgregarVotante;