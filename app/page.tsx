'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Github, 
  Cloud, 
  Cpu, 
  Globe, 
  Zap, 
  Shield, 
  Layout, 
  Server, 
  Database,
  ArrowRight,
  Plus,
  Settings,
  Activity,
  Terminal,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';

// --- Types ---
type View = 'landing' | 'dashboard' | 'deploy' | 'service-settings';
type ServiceStatus = 'live' | 'building' | 'failed' | 'idle';

interface Service {
  id: string;
  name: string;
  type: 'Servicio Web' | 'Sitio Estático' | 'Base de Datos';
  status: ServiceStatus;
  updatedAt: string;
  url: string;
  repo: string;
}

interface ServiceSettingsData {
  rootDir: string;
  buildCommand: string;
  outputDir: string;
  installCommand: string;
  syncWithGithub: boolean;
}

const MOCK_SETTINGS: Record<string, ServiceSettingsData> = {
  '1': { rootDir: './', buildCommand: 'npm run build', outputDir: '.next', installCommand: 'npm install', syncWithGithub: true },
  '2': { rootDir: './docs', buildCommand: 'npm run build', outputDir: 'dist', installCommand: 'npm install', syncWithGithub: false },
  '3': { rootDir: './', buildCommand: 'npm run build', outputDir: 'dist', installCommand: 'npm install', syncWithGithub: true },
  '4': { rootDir: './db', buildCommand: 'N/A', outputDir: 'N/A', installCommand: 'N/A', syncWithGithub: false },
};

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'api-gateway', type: 'Servicio Web', status: 'live', updatedAt: 'hace 2m', url: 'https://gateway.cloud-lift.app', repo: 'org/api-gateway' },
  { id: '2', name: 'docs-site', type: 'Sitio Estático', status: 'live', updatedAt: 'hace 15m', url: 'https://docs.cloud-lift.app', repo: 'org/docs' },
  { id: '3', name: 'auth-worker', type: 'Servicio Web', status: 'building', updatedAt: 'Ahora mismo', url: 'https://auth.cloud-lift.app', repo: 'org/auth' },
  { id: '4', name: 'prod-postgres', type: 'Base de Datos', status: 'live', updatedAt: 'hace 1h', url: 'db.host.internal', repo: 'N/A' },
];

export default function CloudLift() {
  const [view, setView] = useState<View>('landing');
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [allSettings, setAllSettings] = useState<Record<string, ServiceSettingsData>>(MOCK_SETTINGS);

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    setActiveMenu(null);
  };

  const updateSetting = (id: string, field: keyof ServiceSettingsData, value: any) => {
    setAllSettings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const selectedService = services.find(s => s.id === selectedServiceId);
  const currentSettings = selectedServiceId ? allSettings[selectedServiceId] : null;

  const StatusBadge = ({ status }: { status: ServiceStatus }) => {
    const colors = {
      live: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      building: 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20',
      idle: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30 font-sans">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 w-8 h-8 rounded-sm flex items-center justify-center font-bold text-white text-sm">
                  CL
                </div>
                <span className="font-semibold text-xl tracking-tighter text-white">Cloud-Lift</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold text-slate-500">
                <a href="#" className="hover:text-white transition-colors">Documentación</a>
                <a href="#" className="hover:text-white transition-colors">Precios</a>
                <a href="#" className="hover:text-white transition-colors">Empresa</a>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md text-xs font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                Abrir Consola <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center max-w-4xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-900 border border-slate-800 text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-8">
                  <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full animate-pulse" />
                  Estado: Sistemas Operativos
                </div>
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.85]">
                  Despliega con <br/>
                  <span className="text-indigo-500">Precisión Geométrica.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                  Infraestructura profesional para ingeniería web moderna.
                  Despliega al borde en segundos con control preciso sobre tus recursos en la nube.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                  >
                    Empezar Gratis
                  </button>
                  <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                    <Github className="w-4 h-4" /> Ver Docs
                  </button>
                </div>
              </motion.div>

              {/* Feature Grid */}
              <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-1 max-w-6xl w-full bg-slate-800 p-[1px]">
                {[
                  { icon: Zap, title: 'Rendimiento Edge', desc: 'Distribución global con latencia inferior a 50 ms para todos los activos estáticos y funciones serverless.' },
                  { icon: Shield, title: 'Aislamiento de Identidad', desc: 'Entornos seguros con TLS automatizado y protección DDoS integrada en la capa de red.' },
                  { icon: Globe, title: 'Sincronización Global', desc: 'Integración directa con GitHub con despliegues de vista previa automáticos para cada pull request.' }
                ].map((feature, i) => (
                  <div key={i} className="p-10 bg-[#020617] hover:bg-slate-900 transition-colors group">
                    <feature.icon className="w-8 h-8 text-indigo-500 mb-6" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3 border-l-2 border-indigo-500 pl-3">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Sidebar & Main Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <motion.aside 
                animate={{ width: isSidebarExpanded ? 256 : 80 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-slate-900/50 border-r border-slate-800 flex flex-col relative"
              >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-3 min-w-max">
                    <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center font-bold text-white shrink-0">CL</div>
                    {isSidebarExpanded && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-semibold tracking-tight text-white whitespace-nowrap"
                      >
                        Cloud-Lift
                      </motion.span>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className="p-1.5 hover:bg-slate-800 rounded-sm text-slate-500 hover:text-white transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSidebarExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-hidden">
                  <div className={`text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 truncate ${!isSidebarExpanded ? 'text-center' : ''}`}>
                    {isSidebarExpanded ? 'Infraestructura' : 'Infra'}
                  </div>
                  {[
                    { icon: Layout, label: 'Panel Control', active: true },
                    { icon: Server, label: 'Servicios' },
                    { icon: Database, label: 'Bases de Datos' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${item.active ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                      title={!isSidebarExpanded ? item.label : undefined}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-indigo-400' : ''}`} />
                      {isSidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </button>
                  ))}
                  
                  <div className={`text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 mt-4 truncate ${!isSidebarExpanded ? 'text-center' : ''}`}>
                    {isSidebarExpanded ? 'Observabilidad' : 'Obs'}
                  </div>
                  {[
                    { icon: Activity, label: 'Logs', active: false },
                    { icon: Settings, label: 'Ajustes', active: false }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all font-medium"
                      title={!isSidebarExpanded ? item.label : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {isSidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">RA</div>
                    {isSidebarExpanded && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 overflow-hidden"
                      >
                        <p className="text-xs font-medium text-white truncate">rsv_admin</p>
                        <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">Plan Pro Activado</p>
                      </motion.div>
                    )}
                  </div>
                  <button 
                    onClick={() => setView('landing')}
                    className={`w-full mt-4 flex items-center gap-2 px-3 py-2 rounded hover:bg-red-500/10 text-xs font-bold text-slate-500 hover:text-red-400 transition-all uppercase tracking-widest ${!isSidebarExpanded ? 'justify-center px-0' : ''}`}
                    title={!isSidebarExpanded ? 'Cerrar Sesión' : undefined}
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" /> 
                    {isSidebarExpanded && <span>Cerrar Sesión</span>}
                  </button>
                </div>
              </motion.aside>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto bg-[#020617]">
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">Infraestructura</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-medium">Resumen de Servicios</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setView('deploy')}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500 transition-colors uppercase tracking-widest"
                    >
                      Nuevo Servicio
                    </button>
                  </div>
                </header>

                <div className="p-8">
                  {/* Metric Stats */}
                  <div className="grid grid-cols-12 gap-6 mb-8">
                    {[
                      { label: 'Tiempo de Actividad', value: '99.99%', sub: 'Saludable', color: 'bg-emerald-500' },
                      { label: 'Tráfico Edge', value: '1.2M', sub: 'Últimas 24h', color: 'bg-blue-500' },
                      { label: 'Builds Activos', value: '03', sub: 'En ejecución', color: 'bg-indigo-500' },
                      { label: 'Nodos Globales', value: '14', sub: 'Sitios Edge', color: 'bg-amber-500' }
                    ].map((stat, i) => (
                      <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-3 bg-slate-900/50 border border-slate-800 p-5 rounded-lg">
                        <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-2 font-bold">{stat.label}</p>
                        <h3 className="text-2xl font-mono text-white mb-3">{stat.value}</h3>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${stat.color} w-3/4`}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Services Row */}
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Servicios Activos</h4>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Filtrar..." 
                            className="bg-slate-950 border border-slate-800 rounded-md pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-48"
                          />
                        </div>
                      </div>

                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-900 transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-10 h-10 rounded-sm bg-slate-950 border border-slate-800 flex items-center justify-center`}>
                              {service.type === 'Servicio Web' ? <Server className="w-5 h-5 text-indigo-400" /> : service.type === 'Sitio Estático' ? <Globe className="w-5 h-5 text-blue-400" /> : <Database className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{service.name}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${service.status === 'live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                  {service.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
                                <span>{service.repo}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                <span>Actualizado {service.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 relative">
                            <a 
                              href={service.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-3 py-1.5 text-[10px] font-bold text-slate-300 uppercase rounded border border-slate-800 hover:bg-slate-800 transition-all"
                            >
                              Visitar
                            </a>
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(activeMenu === service.id ? null : service.id);
                                }}
                                className={`p-2 rounded transition-colors ${activeMenu === service.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                              >
                                <Settings className="w-4 h-4" />
                              </button>

                              <AnimatePresence>
                                {activeMenu === service.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setActiveMenu(null)}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-xl z-20 py-1 overflow-hidden"
                                    >
                                      <button 
                                        onClick={() => {
                                          setSelectedServiceId(service.id);
                                          setView('service-settings');
                                          setActiveMenu(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white uppercase tracking-widest flex items-center gap-2"
                                      >
                                        <Settings className="w-3.5 h-3.5" /> Configuraciones
                                      </button>
                                      <button 
                                        onClick={() => deleteService(service.id)}
                                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-500/10 uppercase tracking-widest flex items-center gap-2"
                                      >
                                        <AlertCircle className="w-3.5 h-3.5" /> Eliminar Proyecto
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sidebar Context Area */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">Logs en Vivo</h4>
                        <div className="bg-black/40 rounded p-4 font-mono text-[10px] space-y-1 h-64 overflow-hidden relative">
                          <p className="text-slate-500">[12:04:11] Iniciando build</p>
                          <p className="text-slate-500">[12:04:15] Buscando dependencias...</p>
                          <p className="text-slate-400">[12:04:32] Cache hit: node_modules</p>
                          <p className="text-indigo-400">[12:05:01] Tamaño del build: 1.42MB</p>
                          <p className="text-emerald-400">[12:05:05] Propagando Edge...</p>
                          <p className="text-emerald-500">[12:05:12] EN VIVO: gateway.cloud-lift.app</p>
                          <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <div className="w-1 h-3 bg-indigo-500 animate-pulse"></div>
                            <span className="text-slate-600">INACTIVO</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <Github className="w-5 h-5 text-white" />
                          <h5 className="text-xs font-semibold text-white uppercase tracking-widest">Enlace Git</h5>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
                          Conectado a <span className="text-white font-mono">github.com/cloud-lift/monorepo</span>. Todos los pushes a <span className="text-white font-mono">main</span> activan despliegues automáticos.
                        </p>
                        <button className="w-full py-2 bg-slate-800 text-[10px] font-bold text-white uppercase rounded border border-slate-700 hover:bg-slate-700 transition-all tracking-widest">
                          Forzar Build Manual
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <footer className="h-8 bg-slate-950 border-t border-slate-800 flex items-center px-6 justify-between text-[10px] font-mono">
              <div className="flex items-center gap-6 text-slate-500 uppercase tracking-tighter">
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sistemas Operativos</span>
                <span>Latencia: 42ms</span>
              </div>
              <div className="text-slate-700 font-bold tracking-widest uppercase">
                CL-Core-v2.4
              </div>
            </footer>
          </motion.div>
        )}

        {view === 'service-settings' && selectedService && currentSettings && (
          <motion.div
            key="service-settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-[#020617] flex flex-col"
          >
            <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-800 rounded transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
                <div className="flex flex-col">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">{selectedService.name}</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ajustes del Proyecto</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView('dashboard')}
                  className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500 transition-colors uppercase tracking-widest"
                >
                  Guardar Cambios
                </button>
              </div>
            </nav>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-8 space-y-12">
                {/* General Settings */}
                <section>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-indigo-500 pl-3">General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Nombre del Proyecto</label>
                      <input 
                        type="text" 
                        value={selectedService.name}
                        disabled
                        className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Repositorio GitHub</label>
                      <input 
                        type="text" 
                        value={selectedService.repo}
                        disabled
                        className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </section>

                {/* Build Settings */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Configuración de Build & Despliegue</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                      <RefreshCw className={`w-3 h-3 text-indigo-400 ${currentSettings.syncWithGithub ? 'animate-spin' : ''}`} />
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Sincronización Automática</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Directorio Raíz (Root Directory)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={currentSettings.rootDir}
                          onChange={(e) => updateSetting(selectedService.id, 'rootDir', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        />
                        <button 
                          onClick={() => updateSetting(selectedService.id, 'syncWithGithub', !currentSettings.syncWithGithub)}
                          className={`px-3 rounded border transition-all flex items-center gap-2 ${currentSettings.syncWithGithub ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                          title="Sincronizar con GitHub"
                        >
                          <Github className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Sync</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-600 italic">Sincroniza el directorio raíz con tu estructura de GitHub automáticamente.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Comando de Build</label>
                      <input 
                        type="text" 
                        value={currentSettings.buildCommand}
                        onChange={(e) => updateSetting(selectedService.id, 'buildCommand', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Directorio de Salida (Output Directory)</label>
                      <input 
                        type="text" 
                        value={currentSettings.outputDir}
                        onChange={(e) => updateSetting(selectedService.id, 'outputDir', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Comando de Instalación</label>
                      <input 
                        type="text" 
                        value={currentSettings.installCommand}
                        onChange={(e) => updateSetting(selectedService.id, 'installCommand', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Environment Variables */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Variables de Entorno</h3>
                    <button className="flex items-center justify-center w-6 h-6 rounded-sm bg-slate-800 text-slate-400 hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5 px-4 py-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest bg-slate-900 border border-slate-800 rounded">Key</div>
                      <div className="col-span-6 px-4 py-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest bg-slate-900 border border-slate-800 rounded">Value</div>
                      <div className="col-span-1"></div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <input type="text" value="API_KEY" readOnly className="col-span-5 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-xs text-slate-400" />
                      <input type="password" value="••••••••••••" readOnly className="col-span-6 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-xs text-slate-400" />
                      <button className="col-span-1 flex items-center justify-center p-2 text-slate-600 hover:text-red-400 transition-colors">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <input type="text" value="NODE_ENV" readOnly className="col-span-5 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-xs text-slate-400" />
                      <input type="text" value="production" readOnly className="col-span-6 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-xs text-slate-400" />
                      <button className="col-span-1 flex items-center justify-center p-2 text-slate-600 hover:text-red-400 transition-colors">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-8 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-6">Zona de Peligro</h3>
                  <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Eliminar este proyecto</h4>
                      <p className="text-xs text-slate-500">Una vez que elimines un proyecto, no hay vuelta atrás. Por favor, asegúrate.</p>
                    </div>
                    <button 
                      onClick={() => {
                        deleteService(selectedService.id);
                        setView('dashboard');
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded uppercase tracking-widest transition-colors"
                    >
                      Eliminar Proyecto
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
        {view === 'deploy' && (
          <motion.div
            key="deploy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#020617] flex flex-col"
          >
            <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-800 rounded transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Despliegue de Nuevo Servicio</h2>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest font-bold"
              >
                Salir del Despliegue
              </button>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-16">
                  <div className="bg-indigo-600 w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter">Conectar al Borde</h1>
                  <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Seleccionar repositorio de origen</p>
                </div>

                <div className="grid grid-cols-1 gap-1 bg-slate-800 p-[1px]">
                  {[
                    { name: 'awesome-web-app', updated: 'hace 2h', language: 'TypeScript' },
                    { name: 'nextjs-dashboard', updated: 'hace 1d', language: 'JavaScript' },
                    { name: 'python-api-v2', updated: 'hace 3d', language: 'Python' },
                  ].map((repo, i) => (
                    <div 
                      key={i} 
                      className="group bg-[#020617] p-6 flex items-center justify-between hover:bg-slate-900 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                          <Github className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white uppercase tracking-tight text-sm mb-1">{repo.name}</h3>
                          <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono">
                            <span>{repo.updated}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <span>{repo.language}</span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        Conectar
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 rounded-lg bg-indigo-900/5 border border-indigo-500/20 flex gap-4">
                  <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Descubrimiento Automático</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Detectaremos automáticamente los entornos y sugeriremos ajustes de build óptimos. La lógica de despliegue sigue patrones de rama geométricos para el máximo aislamiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
    </main>
  );
}
