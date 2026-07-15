import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import ListadoVotos from './ListadoVotos';

type Vista = 'candidatos' | 'listado' | 'agregar' | 'clave';

interface CandidatoResultado {
  id: number;
  nombre: string;
  apellido: string;
  votes_received_count: number;
}

function CandidatosMasVotados() {
  const [candidatos, setCandidatos] = useState<CandidatoResultado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get<CandidatoResultado[]>('/candidatos-mas-votados').then((res) => {
      setCandidatos(res.data);
      setCargando(false);
    });
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Candidatos mas votados</h2>
      <ol>
        {candidatos.map((c) => (
          <li key={c.id}>
            {c.nombre} {c.apellido} - {c.votes_received_count} votos
          </li>
        ))}
      </ol>
    </div>
  );
}

function AdminPanelPage() {
  const [vista, setVista] = useState<Vista>('candidatos');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // si el token ya expiro, igual limpiamos localmente
    }
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="admin-panel">
      <nav>
        <button onClick={() => setVista('candidatos')}>Candidatos mas votados</button>
        <button onClick={() => setVista('listado')}>Listar votos ingresados</button>
        <button onClick={() => setVista('agregar')}>Agregar nuevo votante</button>
        <button onClick={() => setVista('clave')}>Modificar clave del administrador</button>
        <button onClick={handleLogout}>Cerrar sesion</button>
      </nav>

      <main>
        {vista === 'candidatos' && <CandidatosMasVotados />}
        {vista === 'listado' && <ListadoVotos />}
        {vista === 'agregar' && <p>Proximamente</p>}
        {vista === 'clave' && <p>Proximamente</p>}
      </main>
    </div>
  );
}

export default AdminPanelPage;