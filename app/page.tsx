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
type View = 'landing' | 'dashboard' | 'deploy' | 'service-settings' | 'services' | 'workers' | 'r2' | 'databases' | 'logs' | 'settings' | 'billing' | 'api-tokens' | 'domains';
type DeployStep = 'select' | 'configure' | 'deploying';
type ServiceStatus = 'live' | 'building' | 'failed' | 'idle';

interface ApiToken {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

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
  // Web Service Settings
  rootDir?: string;
  buildCommand?: string;
  outputDir?: string;
  installCommand?: string;
  syncWithGithub?: boolean;
  // Cloudflare-like features
  customDomain?: string;
  securityLevel?: 'essentially_off' | 'low' | 'medium' | 'high' | 'under_attack';
  sslMode?: 'off' | 'flexible' | 'full' | 'strict';
  cacheLevel?: 'bypass' | 'standard' | 'aggressive';
  // Database Settings
  dbVersion?: string;
  dbStorage?: string;
  dbRam?: string;
  dbRegion?: string;
}

const MOCK_SETTINGS: Record<string, ServiceSettingsData> = {
  '1': { 
    rootDir: './', 
    buildCommand: 'npm run build', 
    outputDir: '.next', 
    installCommand: 'npm install', 
    syncWithGithub: true,
    customDomain: 'gateway.cloud-lift.app',
    securityLevel: 'medium',
    sslMode: 'full',
    cacheLevel: 'standard'
  },
  '2': { 
    rootDir: './docs', 
    buildCommand: 'npm run build', 
    outputDir: 'dist', 
    installCommand: 'npm install', 
    syncWithGithub: false,
    customDomain: 'docs.cloud-lift.app',
    securityLevel: 'low',
    sslMode: 'flexible',
    cacheLevel: 'aggressive'
  },
  '3': { 
    rootDir: './', 
    buildCommand: 'npm run build', 
    outputDir: 'dist', 
    installCommand: 'npm install', 
    syncWithGithub: true,
    securityLevel: 'high',
    sslMode: 'strict',
    cacheLevel: 'bypass'
  },
  '4': { dbVersion: 'PostgreSQL 15.4', dbStorage: '20GB NVMe', dbRam: '4GB DDR4', dbRegion: 'us-east-1' },
};

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'api-gateway', type: 'Servicio Web', status: 'live', updatedAt: 'hace 2m', url: 'https://gateway.cloud-lift.app', repo: 'org/api-gateway' },
  { id: '2', name: 'docs-site', type: 'Sitio Estático', status: 'live', updatedAt: 'hace 15m', url: 'https://docs.cloud-lift.app', repo: 'org/docs' },
  { id: '3', name: 'auth-worker', type: 'Servicio Web', status: 'building', updatedAt: 'Ahora mismo', url: 'https://auth.cloud-lift.app', repo: 'org/auth' },
  { id: '4', name: 'prod-postgres', type: 'Base de Datos', status: 'live', updatedAt: 'hace 1h', url: 'db.host.internal', repo: 'N/A' },
];

const MOCK_TOKENS: ApiToken[] = [
  { id: '1', name: 'Producción Gateway', key: 'cl_live_8f2...k92', createdAt: '2026-04-10' },
  { id: '2', name: 'CLI Local', key: 'cl_live_2a1...p33', createdAt: '2026-05-01' },
];

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

export default function CloudLift() {
  const [view, setView] = useState<View>('landing');
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [allSettings, setAllSettings] = useState<Record<string, ServiceSettingsData>>(MOCK_SETTINGS);
  
  // New States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>(MOCK_TOKENS);
  const [isGithubConnected, setIsGithubConnected] = useState(true);
  
  // Deploy State
  const [deployStep, setDeployStep] = useState<DeployStep>('select');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [deploySettings, setDeploySettings] = useState({
    name: '',
    framework: 'nextjs',
    branch: 'main',
    rootDir: './',
    buildCommand: 'npm run build',
    outputDir: '.next'
  });

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

        {['dashboard', 'services', 'databases', 'logs', 'settings', 'billing', 'api-tokens', 'workers', 'r2', 'domains', 'service-settings', 'deploy'].includes(view) && (
          <motion.div
            key="dashboard-shell"
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
                    { icon: Layout, label: 'Panel Control', view: 'dashboard' as View },
                    { icon: Server, label: 'Servicios', view: 'services' as View, subViews: ['service-settings', 'deploy'] },
                    { icon: Zap, label: 'Workers (Edge)', view: 'workers' as View },
                    { icon: Database, label: 'Bases de Datos', view: 'databases' as View },
                    { icon: Cloud, label: 'R2 Almacenamiento', view: 'r2' as View },
                  ].map((item, i) => {
                    const isActive = view === item.view || (item.subViews?.includes(view));
                    return (
                      <button 
                        key={i} 
                        onClick={() => setView(item.view)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${isActive ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                        title={!isSidebarExpanded ? item.label : undefined}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
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
                    );
                  })}
                  
                  <div className={`text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 mt-4 truncate ${!isSidebarExpanded ? 'text-center' : ''}`}>
                    {isSidebarExpanded ? 'Observabilidad' : 'Obs'}
                  </div>
                  {[
                    { icon: Globe, label: 'Dominios', view: 'domains' as View },
                    { icon: Activity, label: 'Logs', view: 'logs' as View },
                    { icon: Settings, label: 'Ajustes', view: 'settings' as View }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setView(item.view)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${view === item.view ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                      title={!isSidebarExpanded ? item.label : undefined}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${view === item.view ? 'text-indigo-400' : ''}`} />
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
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20 shrink-0">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">
                      {['dashboard', 'services', 'databases', 'workers', 'r2'].includes(view) ? 'Infraestructura' : 'Observabilidad'}
                    </span>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-medium lowercase first-letter:uppercase tracking-tight">
                      {view === 'dashboard' ? 'Resumen General' : 
                       view === 'services' ? 'Gestión de Servicios' :
                       view === 'workers' ? 'Workers & Functions' :
                       view === 'databases' ? 'Instancias de Base de Datos' :
                       view === 'r2' ? 'Almacenamiento R2' :
                       view === 'domains' ? 'Gestión de Dominios' :
                       view === 'logs' ? 'Explorador de Logs' :
                       view === 'settings' ? 'Ajustes de la Plataforma' : 
                       view === 'billing' ? 'Facturación y Planes' :
                       view === 'service-settings' ? 'Ajustes del Servicio' :
                       view === 'deploy' ? 'Nuevo Despliegue' :
                       view === 'api-tokens' ? 'Configuración de API' : view}
                    </span>
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
                  {view === 'dashboard' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      {/* Metric Stats */}
                      <div className="grid grid-cols-12 gap-6">
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

                      {/* Dashboard Content */}
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Estatus del Sistema</h4>
                          </div>
                          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-10 text-center">
                            <Activity className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
                            <h3 className="text-white font-bold mb-2">Todos los sistemas operativos</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">Tu infraestructura está rindiendo de forma óptima. No se han detectado incidentes en las últimas 24 horas.</p>
                          </div>

                          <div className="flex items-center justify-between mb-4 mt-8">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Despliegues Recientes</h4>
                          </div>
                          {services.slice(0, 2).map((service) => (
                             <div key={service.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-sm bg-slate-800 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-indigo-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">{service.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Producción • {service.updatedAt}</p>
                                  </div>
                               </div>
                               <StatusBadge status={service.status} />
                             </div>
                          ))}
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                           <div className="bg-indigo-600/5 border border-indigo-500/10 p-6 rounded-lg h-full">
                              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Uso de Recursos</h4>
                              <div className="space-y-6">
                                {[
                                  { label: 'CPU (Global)', val: 24, color: 'bg-indigo-500' },
                                  { label: 'RAM (Global)', val: 68, color: 'bg-emerald-500' },
                                  { label: 'Almacenamiento', val: 42, color: 'bg-blue-500' },
                                ].map((bar, i) => (
                                  <div key={i} className="space-y-2">
                                     <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                                       <span>{bar.label}</span>
                                       <span>{bar.val}%</span>
                                     </div>
                                     <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: 0 }} 
                                          animate={{ width: `${bar.val}%` }} 
                                          className={`h-full ${bar.color}`} 
                                        />
                                     </div>
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {(view === 'services' || (view === 'dashboard' && false)) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Lista de Servicios</h4>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Filtrar servicios..." 
                            className="bg-slate-950 border border-slate-800 rounded-md pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-64"
                          />
                        </div>
                      </div>

                      {services.filter(s => s.type !== 'Base de Datos').map((service) => (
                        <div 
                          key={service.id} 
                          className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-900 transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-10 h-10 rounded-sm bg-slate-950 border border-slate-800 flex items-center justify-center`}>
                              {service.type === 'Servicio Web' ? <Server className="w-5 h-5 text-indigo-400" /> : <Globe className="w-5 h-5 text-blue-400" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{service.name}</h3>
                                <StatusBadge status={service.status} />
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
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-xl z-20 py-1"
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
                                        <AlertCircle className="w-3.5 h-3.5" /> Eliminar
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {view === 'databases' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Instancias Activas</h4>
                        <button className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded uppercase tracking-widest hover:bg-emerald-500 transition-colors">
                          Nueva Base de Datos
                        </button>
                      </div>

                      {services.filter(s => s.type === 'Base de Datos').map((db) => (
                        <div key={db.id} className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center">
                                <Database className="w-6 h-6 text-emerald-400" />
                             </div>
                             <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{db.name}</h3>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase tracking-tighter">Postgres 15</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                                  <span>{db.url}</span>
                                  <span className="text-slate-700">|</span>
                                  <span>4/5 Conexiones</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => {
                                 setSelectedServiceId(db.id);
                                 setView('service-settings');
                               }}
                               className="p-2 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors"
                             >
                                <Settings className="w-4 h-4" />
                             </button>
                             <button className="px-3 py-1.5 text-[10px] font-bold text-slate-300 uppercase bg-slate-800 border border-slate-700 rounded hover:bg-slate-700">Backup</button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {view === 'workers' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                       <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Edge Workers Activos</h4>
                        <button 
                          onClick={() => setView('deploy')}
                          className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                        >
                          Crear Worker
                        </button>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded flex items-center justify-center">
                               <Zap className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-white">auth-middleware-edge</h3>
                                 <StatusBadge status="live" />
                               </div>
                               <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                 <span>12.5ms avg latency</span>
                                 <span className="text-slate-700">|</span>
                                 <span>244 rps</span>
                               </div>
                            </div>
                         </div>
                         <button className="text-[10px] font-bold text-indigo-400 hover:text-white uppercase tracking-widest">Ver Script</button>
                      </div>
                    </motion.div>
                  )}

                  {view === 'r2' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                       <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Buckets de Almacenamiento R2</h4>
                        <button className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-widest hover:bg-blue-500 transition-colors">
                          Crear Bucket
                        </button>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded flex items-center justify-center">
                               <Cloud className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-white">user-assets-prod</h3>
                                 <StatusBadge status="live" />
                               </div>
                               <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                 <span>12.4 GB utilizados</span>
                                 <span className="text-slate-700">|</span>
                                 <span>Región Global</span>
                               </div>
                            </div>
                         </div>
                         <button className="text-[10px] font-bold text-blue-400 hover:text-white uppercase tracking-widest">Explorar</button>
                      </div>
                    </motion.div>
                  )}

                  {view === 'domains' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                       <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Dominios Conectados</h4>
                        <button className="px-4 py-1.5 bg-white text-black text-[10px] font-bold rounded uppercase tracking-widest hover:bg-slate-200 transition-colors">
                          Añadir Dominio
                        </button>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded flex items-center justify-center">
                               <Globe className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-white tracking-tight">cloud-lift.app</h3>
                                 <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase tracking-tighter">Activo</span>
                               </div>
                               <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                 <span>DNS Administrado por CL</span>
                                 <span className="text-slate-700">|</span>
                                 <span>SSL Full (Strict)</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">DNS</button>
                            <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">SSL</button>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {view === 'logs' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-12rem)] flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                         <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Log Explorer</h4>
                         <div className="flex items-center gap-2">
                            <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                               <RefreshCw className="w-3 h-3 animate-spin" /> Live Streaming
                            </span>
                         </div>
                       </div>
                       <div className="flex-1 bg-black border border-slate-800 rounded-lg p-6 font-mono text-xs overflow-y-auto space-y-1 custom-scrollbar shadow-inner">
                          <p className="text-slate-500">[2026-05-12 10:41:02] <span className="text-blue-400">INFO</span>: System kernel initialized.</p>
                          <p className="text-slate-500">[2026-05-12 10:41:05] <span className="text-blue-400">INFO</span>: 14 Edge nodes synchronized.</p>
                          <p className="text-slate-500">[2026-05-12 10:42:12] <span className="text-emerald-400">SUCCESS</span>: api-gateway build completed in 42.1s.</p>
                          <p className="text-slate-500">[2026-05-12 10:42:15] <span className="text-indigo-400">DEPLOY</span>: Propagating to {"'london-edge-1'"}.</p>
                          <p className="text-slate-500">[2026-05-12 10:42:18] <span className="text-indigo-400">DEPLOY</span>: Propagating to {"'new-york-edge-2'"}.</p>
                          <p className="text-slate-500">[2026-05-12 10:43:01] <span className="text-amber-400">WARN</span>: High latency detected in {"'tokyo-edge'"}.</p>
                          <p className="text-slate-500">[2026-05-12 10:43:05] <span className="text-blue-400">INFO</span>: Automated rerouting active.</p>
                          <p className="text-slate-500">[2026-05-12 10:44:22] <span className="text-emerald-400">SUCCESS</span>: docs-site assets optimized (3.2MB {"->"} 1.1MB).</p>
                          <p className="text-white animate-pulse">_</p>
                       </div>
                    </motion.div>
                  )}

                  {view === 'billing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Administración de Plan</h4>
                          <button onClick={() => setView('settings')} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Volver a Ajustes</button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { name: 'Starter', price: '$0', current: false, features: ['3 Proyectos', '100GB Ancho de Banda', 'Soporte Comunitario'] },
                            { name: 'Pro', price: '$20/mes', current: true, features: ['Proyectos Ilimitados', '1TB Ancho de Banda', 'Soporte Prioritario', 'Roles de Equipo'] },
                            { name: 'Enterprise', price: 'Contactar', current: false, features: ['SLA 99.99%', 'Ancho de Banda Ilimitado', 'Gerente de Cuenta Dedicado', 'Auditoría de Seguridad'] },
                          ].map((plan, i) => (
                            <div key={i} className={`p-8 rounded-lg border flex flex-col ${plan.current ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}>
                               <div className="flex justify-between items-start mb-6">
                                  <div>
                                     <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                                     <p className="text-2xl font-mono text-white">{plan.price}</p>
                                  </div>
                                  {plan.current && <span className="px-2 py-0.5 bg-emerald-500 text-[10px] font-bold text-white rounded uppercase">Actual</span>}
                               </div>
                               <ul className="space-y-3 mb-8 flex-1">
                                  {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-[11px] text-slate-400">
                                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {f}
                                    </li>
                                  ))}
                               </ul>
                               <button 
                                 disabled={plan.current}
                                 className={`w-full py-2.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${plan.current ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                               >
                                  {plan.current ? 'Plan Actual' : i === 2 ? 'Contactar' : 'Cambiar Plan'}
                               </button>
                            </div>
                          ))}
                       </div>

                       <section>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Historial de Facturación</h4>
                          <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                             <table className="w-full text-left">
                                <thead className="bg-slate-900 border-b border-slate-800">
                                   <tr>
                                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
                                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Concepto</th>
                                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monto</th>
                                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                                      <th className="px-6 py-3"></th>
                                   </tr>
                                </thead>
                                <tbody className="text-[11px]">
                                   {[
                                     { date: '1 May, 2026', desc: 'Suscripción Plan Pro - Mayo', amount: '$20.00', status: 'Pagado' },
                                     { date: '1 Abr, 2026', desc: 'Suscripción Plan Pro - Abril', amount: '$20.00', status: 'Pagado' },
                                     { date: '1 Mar, 2026', desc: 'Suscripción Plan Pro - Marzo', amount: '$20.00', status: 'Pagado' },
                                   ].map((inv, i) => (
                                     <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 font-mono">{inv.date}</td>
                                        <td className="px-6 py-4 text-white font-medium">{inv.desc}</td>
                                        <td className="px-6 py-4 text-white">{inv.amount}</td>
                                        <td className="px-6 py-4"><span className="text-emerald-500">● {inv.status}</span></td>
                                        <td className="px-6 py-4 text-right">
                                           <button className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-tighter">PDF</button>
                                        </td>
                                     </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                       </section>
                    </motion.div>
                  )}

                  {view === 'api-tokens' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Tokens de API Globales</h4>
                          <button onClick={() => setView('settings')} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Volver a Ajustes</button>
                       </div>

                       <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-lg flex gap-4">
                          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                             Los tokens globales tienen permisos de administrador sobre todos los recursos. Manténlos a salvo y nunca los expongas en el código de tu cliente.
                          </p>
                       </div>

                       <div className="flex items-center justify-between mb-2">
                          <h5 className="text-[10px] uppercase font-bold text-slate-500">Tus Tokens</h5>
                          <button 
                            onClick={() => {
                              const newToken = { 
                                id: Date.now().toString(), 
                                name: 'Nuevo Token de API', 
                                key: `cl_live_${Math.random().toString(36).substring(7)}`, 
                                createdAt: new Date().toISOString().split('T')[0] 
                              };
                              setApiTokens([newToken, ...apiTokens]);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-widest hover:bg-indigo-500"
                          >
                             <Plus className="w-3.5 h-3.5" /> Generar Token
                          </button>
                       </div>

                       <div className="space-y-3">
                          {apiTokens.length === 0 ? (
                            <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded">
                               <p className="text-xs text-slate-600 uppercase tracking-widest">No hay tokens activos</p>
                            </div>
                          ) : apiTokens.map((token) => (
                            <div key={token.id} className="bg-slate-900 border border-slate-800 p-5 rounded flex items-center justify-between group">
                               <div className="flex items-center gap-6">
                                  <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 flex items-center justify-center">
                                     <Terminal className="w-5 h-5 text-indigo-400 group-hover:animate-pulse" />
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-bold text-white mb-1">{token.name}</h4>
                                     <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                                        <span className="bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-indigo-500/20">{token.key}</span>
                                        <span>Creado: {token.createdAt}</span>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Revelar</button>
                                  <button 
                                    onClick={() => setApiTokens(apiTokens.filter(t => t.id !== token.id))}
                                    className="text-[10px] font-bold text-red-500/60 hover:text-red-500 uppercase tracking-widest"
                                  >
                                    Revocar
                                  </button>
                               </div>
                            </div>
                          ))}
                       </div>
                                 {view === 'settings' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-12">
                       <section>
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3 mb-8">Información de la Cuenta</h4>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-500">Nombre de Usuario</label>
                                <input readOnly type="text" value="rsv_admin" className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-sm text-slate-400" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-500">Email de Contacto</label>
                                <input readOnly type="text" value="rsv@cloud-lift.app" className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-sm text-slate-400" />
                             </div>
                          </div>
                       </section>

                       <section>
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3 mb-8">Planes y Facturación</h4>
                          <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-lg flex items-center justify-between">
                             <div>
                                <div className="flex items-center gap-3 mb-2">
                                   <span className="text-xl font-bold text-white">Plan Pro</span>
                                   <span className="px-2 py-0.5 bg-emerald-500 text-[10px] font-bold text-white rounded uppercase tracking-widest">Activo</span>
                                </div>
                                <p className="text-xs text-slate-500">Tu próximo ciclo de facturación comienza el 1 de Junio, 2026.</p>
                             </div>
                             <button 
                                onClick={() => setView('billing')}
                                className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                             >
                                Administrar
                             </button>
                          </div>
                       </section>

                       <section>
                          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3 mb-8">Seguridad de la Plataforma</h4>
                          <div className="space-y-4">
                             <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded">
                                <div>
                                   <p className="text-sm font-bold text-white">Autenticación de Dos Pasos</p>
                                   <p className="text-[10px] text-slate-500 uppercase">Protege tu cuenta con seguridad adicional</p>
                                </div>
                                <div 
                                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                  className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${twoFactorEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}`}
                                >
                                   <motion.div layout className="w-3.5 h-3.5 bg-white rounded-full" />
                                </div>
                             </div>
                             <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded">
                                <div>
                                   <p className="text-sm font-bold text-white">Tokens de API Globales</p>
                                   <p className="text-[10px] text-slate-500 uppercase">Gestiona accesos externos a la infraestructura</p>
                                </div>
                                <button 
                                  onClick={() => setView('api-tokens')}
                                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                                >
                                   Configurar
                                </button>
                             </div>
                          </div>
                       </section>
                    </motion.div>
                  )}

                  {view === 'service-settings' && selectedService && currentSettings && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setView('services')} className="p-2 hover:bg-slate-800 rounded transition-colors">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-180" />
                          </button>
                          <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">{selectedService.name}</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ajustes del Proyecto</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setView('services')}
                          className="px-6 py-2 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500 transition-colors uppercase tracking-widest"
                        >
                          Guardar y Volver
                        </button>
                      </div>

                      <section>
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-indigo-500 pl-3">General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Nombre del Recurso</label>
                            <input readOnly type="text" value={selectedService.name} className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{selectedService.type === 'Base de Datos' ? 'Endpoint Interno' : 'Repositorio GitHub'}</label>
                            <input readOnly type="text" value={selectedService.type === 'Base de Datos' ? selectedService.url : selectedService.repo} className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono" />
                          </div>
                        </div>
                      </section>

                      {selectedService.type === 'Base de Datos' ? (
                        <section>
                          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-emerald-500 pl-3">Instancia & Capacidad</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Motor / Versión</label>
                              <input type="text" value={currentSettings.dbVersion || ''} onChange={(e) => updateSetting(selectedService.id, 'dbVersion', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500/50 outline-none font-mono" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Región</label>
                              <input type="text" value={currentSettings.dbRegion || ''} onChange={(e) => updateSetting(selectedService.id, 'dbRegion', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500/50 outline-none" />
                            </div>
                          </div>
                        </section>
                      ) : (
                        <section>
                          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-indigo-500 pl-3">Build & Despliegue</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Directorio Raíz</label>
                              <input type="text" value={currentSettings.rootDir || ''} onChange={(e) => updateSetting(selectedService.id, 'rootDir', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Comando Build</label>
                              <input type="text" value={currentSettings.buildCommand || ''} onChange={(e) => updateSetting(selectedService.id, 'buildCommand', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none" />
                            </div>
                          </div>
                        </section>
                      )}
                      
                      <section className="pt-8 border-t border-slate-800">
                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-6">Zona Peligrosa</h3>
                        <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-lg flex items-center justify-between">
                           <div>
                              <h4 className="text-sm font-bold text-white mb-1">Eliminar Recurso</h4>
                              <p className="text-xs text-slate-500">Esta acción no se puede deshacer.</p>
                           </div>
                           <button onClick={() => { deleteService(selectedService.id); setView('services'); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded uppercase tracking-widest">Eliminar</button>
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {view === 'deploy' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                       <div className="flex items-center justify-between mb-8">
                          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Nuevo Despliegue</h2>
                          <button onClick={() => setView('dashboard')} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase">Cancelar</button>
                       </div>
                       <div className="max-w-2xl mx-auto text-center py-20 border border-dashed border-slate-800 rounded-lg">
                          <Rocket className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Iniciando orquestador...</p>
                          <button onClick={() => setView('services')} className="mt-8 px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded uppercase tracking-widest">Volver</button>
                       </div>
                    </motion.div>
                  )}           </motion.div>
                  )}
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
      </AnimatePresence>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
    </main>
  );
}
