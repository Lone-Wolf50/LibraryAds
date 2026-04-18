import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Library, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Printer, 
  RefreshCcw,
  BookOpen
} from "lucide-react";
import { generateLibraryProject, LibraryProject } from "./services/geminiService";
import ProjectPackage from "./components/ProjectPackage";

const DEFAULT_PROJECT_NAME = "Book Page Tiny Book Nooks";

export default function App() {
  const [project, setProject] = useState<LibraryProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load default project on first render
  useEffect(() => {
    handleGenerate(DEFAULT_PROJECT_NAME, "Using weeded books to create whimsical tiny shelf inserts or book nooks.");
  }, []);

  async function handleGenerate(name: string, desc?: string) {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateLibraryProject(name, desc);
      setProject(result);
    } catch (err) {
      console.error(err);
      setError("The Libris Architect failed to construct this project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleGenerate(projectName, description);
  };

  return (
    <div className="min-h-screen bg-paper selection:bg-accent selection:text-white">
      {/* Search Header */}
      <header className="sticky top-0 z-50 bg-paper border-b border-line px-10 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-ink text-paper w-12 h-12 flex items-center justify-center font-display text-2xl" title="Wolf Libris Logo">W</div>
          <div>
            <h1 className="text-xl font-black leading-none">Wolf Libris</h1>
            <span className="text-[10px] font-mono font-bold tracking-widest opacity-50">Architect v1.0</span>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="flex-1 max-w-xl mx-12 relative hidden md:block">
          <input
            type="text"
            placeholder="Search blueprints..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-box border-2 border-ink py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all font-sans text-sm font-bold uppercase tracking-tight"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-100 text-ink" />
          <button 
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-ink text-paper p-1.5 rounded-full hover:bg-accent transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => window.print()} 
             className="text-ink hover:text-accent transition-colors"
             title="Print Blueprint"
           >
             <Printer className="w-6 h-6" />
           </button>
           <button 
             onClick={() => handleGenerate(project?.name || DEFAULT_PROJECT_NAME)}
             className={`text-ink hover:text-accent transition-colors ${loading ? 'animate-spin' : ''}`}
             title="Regenerate"
           >
             <RefreshCcw className="w-6 h-6" />
           </button>
        </div>
      </header>

      {/* Main Blueprint Content */}
      <main className="flex-1 overflow-auto">
        <div className="md:hidden p-6 bg-box border-b border-ink">
           <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Blueprint Name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-white border-2 border-ink py-4 px-4 font-bold"
              />
              <button 
                disabled={loading}
                className="w-full bg-ink text-paper font-black py-4 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 text-accent" />}
                Construct Blueprint
              </button>
           </form>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-48 text-center px-10"
            >
              <div className="font-display text-[120px] leading-tight text-ink animate-pulse opacity-10">
                LOADING...
              </div>
              <div className="h-2 w-64 bg-box mt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent animate-[loading_2s_infinite]" />
              </div>
              <p className="mt-8 font-mono text-sm tracking-[0.4em] uppercase opacity-50">Architecting makerspace metadata</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto py-48 text-center px-10"
            >
              <div className="bg-ink text-paper p-12 border-8 border-accent">
                <h2 className="text-4xl font-display mb-4">SYSTEM CRASH</h2>
                <p className="font-mono text-sm uppercase mb-8 opacity-70">{error}</p>
                <button 
                  onClick={() => handleGenerate(projectName || DEFAULT_PROJECT_NAME)}
                  className="px-10 py-4 bg-accent text-white font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  REBOOT & RETRY
                </button>
              </div>
            </motion.div>
          ) : project && (
            <div key="project" className="bg-paper animate-in fade-in duration-500">
               <ProjectPackage project={project} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
