'use client';

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
type View = 'landing' | 'dashboard' | 'deploy';
type ServiceStatus = 'live' | 'building' | 'failed' | 'idle';

interface Service {
  id: string;
  name: string;
  type: 'Web Service' | 'Static Site' | 'Database';
  status: ServiceStatus;
  updatedAt: string;
  url: string;
  repo: string;
}

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'api-gateway', type: 'Web Service', status: 'live', updatedAt: '2m ago', url: 'https://gateway.cloud-lift.app', repo: 'org/api-gateway' },
  { id: '2', name: 'docs-site', type: 'Static Site', status: 'live', updatedAt: '15m ago', url: 'https://docs.cloud-lift.app', repo: 'org/docs' },
  { id: '3', name: 'auth-worker', type: 'Web Service', status: 'building', updatedAt: 'Just now', url: 'https://auth.cloud-lift.app', repo: 'org/auth' },
  { id: '4', name: 'prod-postgres', type: 'Database', status: 'live', updatedAt: '1h ago', url: 'db.host.internal', repo: 'N/A' },
];

export default function CloudLift() {
  const [view, setView] = useState<View>('landing');
  const [services] = useState<Service[]>(MOCK_SERVICES);

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
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Enterprise</a>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md text-xs font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                Launch Console <ArrowRight className="w-3.5 h-3.5" />
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
                  Status: All Systems Operational
                </div>
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.85]">
                  Deploy with <br/>
                  <span className="text-indigo-500">Geometric Precision.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                  Professional infrastructure for modern web engineering. 
                  Deploy to the edge in seconds with precise control over your cloud resources.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                  >
                    Get Started Free
                  </button>
                  <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                    <Github className="w-4 h-4" /> View Docs
                  </button>
                </div>
              </motion.div>

              {/* Feature Grid */}
              <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-1 max-w-6xl w-full bg-slate-800 p-[1px]">
                {[
                  { icon: Zap, title: 'Edge Performance', desc: 'Global distribution with sub-50ms latency for all static assets and serverless functions.' },
                  { icon: Shield, title: 'Identity Isolation', desc: 'Secure environments with automated TLS and built-in DDoS protection at the network layer.' },
                  { icon: Globe, title: 'Global Sync', desc: 'Direct GitHub integration with automatic preview deployments for every pull request.' }
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
              <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center font-bold text-white">CL</div>
                  <span className="text-xl font-semibold tracking-tight text-white">Cloud-Lift</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3">Infrastructure</div>
                  {[
                    { icon: Layout, label: 'Dashboard', active: true },
                    { icon: Server, label: 'Services' },
                    { icon: Database, label: 'Databases' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${item.active ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                      <item.icon className={`w-4 h-4 ${item.active ? 'text-indigo-400' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-3 mt-4">Observability</div>
                  {[
                    { icon: Activity, label: 'Logs', active: false },
                    { icon: Settings, label: 'Settings', active: false }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">RA</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-medium text-white truncate">rsv_admin</p>
                      <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">Pro Plan Enabled</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setView('landing')}
                    className="w-full mt-4 flex items-center gap-2 px-3 py-2 rounded hover:bg-red-500/10 text-xs font-bold text-slate-500 hover:text-red-400 transition-all uppercase tracking-widest"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto bg-[#020617]">
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/20">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">Infrastructure</span>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-medium">Services Overview</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setView('deploy')}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500 transition-colors uppercase tracking-widest"
                    >
                      New Service
                    </button>
                  </div>
                </header>

                <div className="p-8">
                  {/* Metric Stats */}
                  <div className="grid grid-cols-12 gap-6 mb-8">
                    {[
                      { label: 'System Uptime', value: '99.99%', sub: 'Healthy', color: 'bg-emerald-500' },
                      { label: 'Edge Traffic', value: '1.2M', sub: 'Last 24h', color: 'bg-blue-500' },
                      { label: 'Active Builds', value: '03', sub: 'Running', color: 'bg-indigo-500' },
                      { label: 'Global Nodes', value: '14', sub: 'Edge sites', color: 'bg-amber-500' }
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
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Active Services</h4>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Filter..." 
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
                              {service.type === 'Web Service' ? <Server className="w-5 h-5 text-indigo-400" /> : service.type === 'Static Site' ? <Globe className="w-5 h-5 text-blue-400" /> : <Database className="w-5 h-5 text-emerald-400" />}
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
                                <span>Updated {service.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <a 
                              href={service.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-3 py-1.5 text-[10px] font-bold text-slate-300 uppercase rounded border border-slate-800 hover:bg-slate-800 transition-all"
                            >
                              Visit
                            </a>
                            <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-500 hover:text-white">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sidebar Context Area */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">Live Logs</h4>
                        <div className="bg-black/40 rounded p-4 font-mono text-[10px] space-y-1 h-64 overflow-hidden relative">
                          <p className="text-slate-500">[12:04:11] Starting build</p>
                          <p className="text-slate-500">[12:04:15] Dependency fetch...</p>
                          <p className="text-slate-400">[12:04:32] Cache hit: node_modules</p>
                          <p className="text-indigo-400">[12:05:01] Build size: 1.42MB</p>
                          <p className="text-emerald-400">[12:05:05] Edge Propagating...</p>
                          <p className="text-emerald-500">[12:05:12] LIVE: gateway.cloud-lift.app</p>
                          <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <div className="w-1 h-3 bg-indigo-500 animate-pulse"></div>
                            <span className="text-slate-600">IDLE</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <Github className="w-5 h-5 text-white" />
                          <h5 className="text-xs font-semibold text-white uppercase tracking-widest">Git Linkage</h5>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
                          Connected to <span className="text-white font-mono">github.com/cloud-lift/monorepo</span>. All pushes to <span className="text-white font-mono">main</span> trigger automatic deploys.
                        </p>
                        <button className="w-full py-2 bg-slate-800 text-[10px] font-bold text-white uppercase rounded border border-slate-700 hover:bg-slate-700 transition-all tracking-widest">
                          Force Manual Build
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
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Systems Operational</span>
                <span>Latency: 42ms</span>
              </div>
              <div className="text-slate-700 font-bold tracking-widest uppercase">
                CL-Core-v2.4
              </div>
            </footer>
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
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">New Service Deployment</h2>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest font-bold"
              >
                Exit Deployment
              </button>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-16">
                  <div className="bg-indigo-600 w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter">Connect To Edge</h1>
                  <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Select repository source</p>
                </div>

                <div className="grid grid-cols-1 gap-1 bg-slate-800 p-[1px]">
                  {[
                    { name: 'awesome-web-app', updated: '2h ago', language: 'TypeScript' },
                    { name: 'nextjs-dashboard', updated: '1d ago', language: 'JavaScript' },
                    { name: 'python-api-v2', updated: '3d ago', language: 'Python' },
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
                        Connect
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 rounded-lg bg-indigo-900/5 border border-indigo-500/20 flex gap-4">
                  <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Automated Discovery</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      We&apos;ll automatically detect environments and suggest optimal build settings. Deployment logic follows geometric branch patterns for maximum isolation.
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
