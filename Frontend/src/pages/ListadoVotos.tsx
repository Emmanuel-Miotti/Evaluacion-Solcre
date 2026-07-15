import { useEffect, useState } from 'react';
import api from '../api/client';

// Formatea una fecha "YYYY-MM-DD..." a DD/MM/YYYY sin pasar por Date(),
// para evitar que la conversion de zona horaria corra el dia (dob no tiene hora real).
function formatearFechaSolo(fechaIso: string): string {
  const [anio, mes, dia] = fechaIso.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

interface VotoResumen {
  id: number;
  voter: { id: number; nombre: string; apellido: string };
  candidate: { id: number; nombre: string; apellido: string };
  voted_at: string;
}

interface VotoDetalle {
  id: number;
  voted_at: string;
  voter: {
    id: number;
    documento: string;
    tipo: string;
    nombre: string;
    apellido: string;
    dob: string;
    direccion: string;
    telefono: string;
    sexo: string;
  };
  candidate: { id: number; nombre: string; apellido: string };
}

interface ListadoResponse {
  va_ganando: { id: number; nombre: string; apellido: string } | null;
  empate: boolean;
  votos: {
    data: VotoResumen[];
    current_page: number;
    last_page: number;
  };
}

function ListadoVotos() {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<ListadoResponse | null>(null);
  const [detalle, setDetalle] = useState<VotoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
  let esPrimeraCarga = true;

  const cargarDatos = () => {
    api.get<ListadoResponse>(`/votos?page=${pagina}`).then((res) => {
      setDatos(res.data);
      if (esPrimeraCarga) {
        setCargando(false);
        esPrimeraCarga = false;
      }
    });
  };

  cargarDatos();
  const intervalo = setInterval(cargarDatos, 1000); // Actualiza cada 1 segundo
  return () => clearInterval(intervalo);
}, [pagina]);

  const verDetalle = (id: number) => {
    api.get<VotoDetalle>(`/votos/${id}`).then((res) => setDetalle(res.data));
  };

  useEffect(() => {
    if (!detalle) return;
    const cerrarConEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetalle(null);
    };
    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [detalle]);

  if (cargando || !datos) {
    return (
      <div>
        <h2>Listado de votos</h2>
        <div className="skeleton skeleton-line" style={{ width: '40%' }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton skeleton-row" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>Listado de votos</h2>

      {datos.empate && <p>Empate en el primer puesto</p>}
      {!datos.empate && datos.va_ganando && (
        <p>
          Va ganando: {datos.va_ganando.nombre} {datos.va_ganando.apellido}
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th>Votante</th>
            <th>Candidato</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datos.votos.data.map((v, i) => (
            <tr key={v.id} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <td>{v.voter.nombre} {v.voter.apellido}</td>
              <td>{v.candidate.nombre} {v.candidate.apellido}</td>
              <td>{new Date(v.voted_at).toLocaleString()}</td>
              <td>
                <button onClick={() => verDetalle(v.id)}>Ver detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>
          Anterior
        </button>
        <span> Pagina {datos.votos.current_page} de {datos.votos.last_page} </span>
        <button
          disabled={pagina >= datos.votos.last_page}
          onClick={() => setPagina((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>

      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalle del voto</h3>
              <button className="modal-close" onClick={() => setDetalle(null)} aria-label="Cerrar">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detalle-fila">
                <span>Documento</span>
                <strong>{detalle.voter.documento}</strong>
              </div>
              <div className="detalle-fila">
                <span>Tipo</span>
                <strong>{detalle.voter.tipo}</strong>
              </div>
              <div className="detalle-fila">
                <span>Nombre</span>
                <strong>{detalle.voter.nombre} {detalle.voter.apellido}</strong>
              </div>
              <div className="detalle-fila">
                <span>Fecha de nacimiento</span>
                <strong>{formatearFechaSolo(detalle.voter.dob)}</strong>
              </div>
              <div className="detalle-fila">
                <span>Direccion</span>
                <strong>{detalle.voter.direccion}</strong>
              </div>
              <div className="detalle-fila">
                <span>Telefono</span>
                <strong>{detalle.voter.telefono}</strong>
              </div>
              <div className="detalle-fila">
                <span>Sexo</span>
                <strong>{detalle.voter.sexo}</strong>
              </div>
              <div className="detalle-fila">
                <span>Voto a</span>
                <strong>{detalle.candidate.nombre} {detalle.candidate.apellido}</strong>
              </div>
              <div className="detalle-fila">
                <span>Fecha del voto</span>
                <strong>{new Date(detalle.voted_at).toLocaleString()}</strong>
              </div>
            </div>

            <button onClick={() => setDetalle(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListadoVotos;