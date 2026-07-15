import { useEffect, useState } from 'react';
import api from '../api/client';

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

  if (cargando || !datos) return <p>Cargando...</p>;

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
          {datos.votos.data.map((v) => (
            <tr key={v.id}>
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
        <div className="detalle-voto">
          <h3>Detalle del voto</h3>
          <p>Documento: {detalle.voter.documento}</p>
          <p>Tipo: {detalle.voter.tipo}</p>
          <p>Nombre: {detalle.voter.nombre} {detalle.voter.apellido}</p>
          <p>Fecha de nacimiento: {detalle.voter.dob}</p>
          <p>Direccion: {detalle.voter.direccion}</p>
          <p>Telefono: {detalle.voter.telefono}</p>
          <p>Sexo: {detalle.voter.sexo}</p>
          <p>Voto a: {detalle.candidate.nombre} {detalle.candidate.apellido}</p>
          <p>Fecha del voto: {new Date(detalle.voted_at).toLocaleString()}</p>
          <button onClick={() => setDetalle(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default ListadoVotos;