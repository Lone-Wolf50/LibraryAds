import { motion } from "motion/react";
import { 
  BookOpen, 
  Package, 
  Construction, 
  MapPin, 
  Users, 
  PlusCircle, 
  Megaphone, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import { LibraryProject } from "../services/geminiService";

interface ProjectPackageProps {
  project: LibraryProject;
}

export default function ProjectPackage({ project }: ProjectPackageProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="main-grid"
    >
      {/* Sidebar Area */}
      <aside className="sidebar-section">
        <div className="top-part">
          <div className="theme-badge">Makerspace Blueprint v1.0</div>
          <h1 className="bold-header">{project.name}</h1>
          <p className="text-xl font-medium leading-tight mb-12 opacity-90">
            {project.shortDescription}
          </p>
          
          <div className="bg-box p-8 rounded-sm mb-12">
            <h3 className="font-display text-base border-b-2 border-ink pb-2 mb-6">Materials & Cost</h3>
            <ul className="space-y-2 mb-8">
              {project.materials.list.map((m, idx) => (
                <li key={idx} className="text-sm border-b border-line pb-1 flex justify-between">
                  <span className="font-bold">{m.item}</span>
                  <span className="opacity-60">{m.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl text-accent">{project.materials.estimatedCost.lowBudget}</span>
              <span className="text-[10px] font-black uppercase leading-none opacity-50">Est. Total Cost</span>
            </div>
          </div>
        </div>

        <div className="footer-meta">
          <div className="flex flex-col">
            <span className="opacity-40 mb-1">Target Audience</span>
            <span>{project.overview.targetAgeGroups[0]?.group || "General"}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="opacity-40 mb-1">Time To Build</span>
            <span>{project.instructions.steps[0]?.timeEstimate || "Var"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="content-section flex flex-col gap-12">
        <section>
          <h2 className="font-display text-2xl mb-8 border-b-4 border-ink inline-block">Build Instructions</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {project.instructions.steps.map((step, idx) => (
              <div key={idx} className="brutal-card">
                <div className="step-number">{step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}</div>
                <h3 className="text-sm font-black mb-3">{step.description.split('.')[0]}</h3>
                <p className="text-xs leading-relaxed opacity-70 mb-4">{step.description}</p>
                <div className="p-4 bg-box/50 border border-line text-[10px] font-bold uppercase tracking-tight italic opacity-60">
                   Visual: {step.visualDescription}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="accent-banner">
          <div className="font-display text-4xl leading-none">
            {project.marketing.socialMediaPost.slice(0, 40)}...
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black opacity-70 mb-1 uppercase tracking-widest">Promotion Details</div>
            <div className="text-sm font-bold uppercase tracking-tighter">Launch the Project</div>
          </div>
        </section>

        {/* Extensions & Extras */}
        <section className="grid md:grid-cols-2 gap-12 mt-auto pt-12 border-t border-line">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Extensions</h4>
            <ul className="space-y-2">
              {project.extensions.variations.map((v, i) => (
                 <li key={i} className="text-xs font-bold uppercase border-l-4 border-accent pl-2">{v}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Inclusion</h4>
            <div className="text-xs font-medium space-y-4">
               {project.extensions.inclusiveAdaptations.map((a, i) => (
                 <p key={i}>{a}</p>
               ))}
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
