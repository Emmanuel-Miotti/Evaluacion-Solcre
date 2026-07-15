import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
}

function VotingPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [documento, setDocumento] = useState('');
  const [candidatoId, setCandidatoId] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get<Candidato[]>('/candidatos').then((res) => setCandidatos(res.data));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!documento.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa tu documento.' });
      return;
    }
    if (!candidatoId) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un candidato.' });
      return;
    }

    setEnviando(true);
    try {
      const res = await api.post('/votos', {
        documento,
        candidato_id: Number(candidatoId),
      });
      setMensaje({ tipo: 'success', texto: res.data.message });
      setDocumento('');
      setCandidatoId('');
    } catch (error: any) {
      const texto = error.response?.data?.message ?? 'Ocurrio un error al procesar el voto.';
      setMensaje({ tipo: 'error', texto });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="voting-page">
      <h1>Emitir voto</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="documento">Documento</label>
        <input
          id="documento"
          type="text"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <label htmlFor="candidato">Candidato</label>
        <select
          id="candidato"
          value={candidatoId}
          onChange={(e) => setCandidatoId(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {candidatos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Votar'}
        </button>
      </form>

      {mensaje && (
        <p className={mensaje.tipo === 'success' ? 'mensaje-exito' : 'mensaje-error'}>
          {mensaje.texto}
        </p>
      )}

      <Link to="/login">Ir a gestion</Link>
    </div>
  );
}

export default VotingPage;