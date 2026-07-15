import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/client';
import ListadoVotos from './ListadoVotos';
import AgregarVotante from './AgregarVotante';
import CambiarClave from './CambiarClave';

type Vista = 'candidatos' | 'listado' | 'agregar' | 'clave';

interface CandidatoResultado {
  id: number;
  nombre: string;
  apellido: string;
  votes_received_count: number;
}

interface VotosPorSexo {
  sexo: string;
  total: number;
}

const COLORES_SEXO: Record<string, string> = {
  M: '#4f46e5',
  F: '#ec4899',
  Otro: '#6b7280',
};

function CandidatosMasVotados() {
  const [candidatos, setCandidatos] = useState<CandidatoResultado[]>([]);
  const [votosPorSexo, setVotosPorSexo] = useState<VotosPorSexo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
  let esPrimeraCarga = true;

  const cargarDatos = () => {
    Promise.all([
      api.get<CandidatoResultado[]>('/candidatos-mas-votados'),
      api.get<VotosPorSexo[]>('/estadisticas-sexo'),
    ]).then(([resCandidatos, resSexo]) => {
      setCandidatos(resCandidatos.data);
      setVotosPorSexo(resSexo.data);
      if (esPrimeraCarga) {
        setCargando(false);
        esPrimeraCarga = false;
      }
    });
  };

  cargarDatos();
  const intervalo = setInterval(cargarDatos, 5000);
  return () => clearInterval(intervalo);
}, []);

  if (cargando) {
    return (
      <div>
        <h2>Candidatos mas votados</h2>
        <div className="skeleton" style={{ height: 280, borderRadius: 12 }} />
      </div>
    );
  }

  const datosGrafico = candidatos.map((c) => ({
    nombre: `${c.nombre} ${c.apellido}`,
    votos: c.votes_received_count,
  }));

  return (
    <div>
      <h2>Candidatos mas votados</h2>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e5ea" />
            <XAxis dataKey="nombre" tick={{ fontSize: 13 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
            <Tooltip />
            <Bar dataKey="votos" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ol>
        {candidatos.map((c) => (
          <li key={c.id}>
            {c.nombre} {c.apellido} - {c.votes_received_count} votos
          </li>
        ))}
      </ol>

      <h2 style={{ marginTop: 32 }}>Votos por sexo</h2>

      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={votosPorSexo} dataKey="total" nameKey="sexo" outerRadius={80} label>
              {votosPorSexo.map((entry) => (
                <Cell key={entry.sexo} fill={COLORES_SEXO[entry.sexo] ?? '#6b7280'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
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
        {vista === 'agregar' && <AgregarVotante />}
        {vista === 'clave' && <CambiarClave />}
      </main>
    </div>
  );
}

export default AdminPanelPage;