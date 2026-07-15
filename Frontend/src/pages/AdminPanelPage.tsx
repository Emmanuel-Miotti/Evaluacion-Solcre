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
        <h2>Panel de resultados</h2>
        <div className="stats-grid">
          <div className="skeleton" style={{ height: 76, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 76, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 76, borderRadius: 12 }} />
        </div>
        <div className="skeleton" style={{ height: 280, borderRadius: 12, marginTop: 20 }} />
      </div>
    );
  }

  if (candidatos.length === 0) {
    return (
      <div>
        <h2>Panel de resultados</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Todavia no hay candidatos cargados.</p>
      </div>
    );
  }

  const totalVotos = candidatos.reduce((acc, c) => acc + c.votes_received_count, 0);
  const maxVotos = Math.max(...candidatos.map((c) => c.votes_received_count));
  const lideres = maxVotos > 0 ? candidatos.filter((c) => c.votes_received_count === maxVotos) : [];
  const liderTexto =
    totalVotos === 0
      ? 'Sin votos aun'
      : lideres.length > 1
      ? 'Empate'
      : `${lideres[0].nombre} ${lideres[0].apellido}`;

  const ranking = [...candidatos].sort((a, b) => b.votes_received_count - a.votes_received_count);

  const datosGrafico = candidatos.map((c) => ({
    nombre: `${c.nombre} ${c.apellido}`,
    votos: c.votes_received_count,
  }));

  return (
    <div>
      <h2>Panel de resultados</h2>

      <div className="stats-grid">
        <div className="stat-card" style={{ animationDelay: '0ms' }}>
          <span className="stat-label">Total de votos</span>
          <strong className="stat-value">{totalVotos}</strong>
        </div>
        <div className="stat-card" style={{ animationDelay: '60ms' }}>
          <span className="stat-label">Va ganando</span>
          <strong className="stat-value">{liderTexto}</strong>
        </div>
        <div className="stat-card" style={{ animationDelay: '120ms' }}>
          <span className="stat-label">Candidatos</span>
          <strong className="stat-value">{candidatos.length}</strong>
        </div>
      </div>

      <div className="ranking-list">
        {ranking.map((c, i) => {
          const pct = maxVotos > 0 ? (c.votes_received_count / maxVotos) * 100 : 0;
          return (
            <div
              className={`ranking-row${i === 0 && maxVotos > 0 ? ' es-primero' : ''}`}
              key={c.id}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="ranking-rank">{i + 1}</div>
              <div className="ranking-info">
                <div className="ranking-nombre">{c.nombre} {c.apellido}</div>
                <div className="ranking-bar-track">
                  <div className="ranking-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="ranking-votos">{c.votes_received_count}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Votos por candidato</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="votos" fill="#5b4ff5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Votos por sexo</h3>
          <div style={{ width: '100%', height: 260 }}>
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
        <button className={vista === 'candidatos' ? 'activo' : ''} onClick={() => setVista('candidatos')}>Candidatos mas votados</button>
        <button className={vista === 'listado' ? 'activo' : ''} onClick={() => setVista('listado')}>Listar votos ingresados</button>
        <button className={vista === 'agregar' ? 'activo' : ''} onClick={() => setVista('agregar')}>Agregar nuevo votante</button>
        <button className={vista === 'clave' ? 'activo' : ''} onClick={() => setVista('clave')}>Modificar clave del administrador</button>
        <button onClick={handleLogout}>Cerrar sesion</button>
      </nav>

      <main>
        <div key={vista} className="vista-transition">
          {vista === 'candidatos' && <CandidatosMasVotados />}
          {vista === 'listado' && <ListadoVotos />}
          {vista === 'agregar' && <AgregarVotante />}
          {vista === 'clave' && <CambiarClave />}
        </div>
      </main>
    </div>
  );
}

export default AdminPanelPage;