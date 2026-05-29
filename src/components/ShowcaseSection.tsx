import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, Award, Fingerprint, ScanEye, Code, Layers, Zap, PenTool } from "lucide-react";
import { CVPreview } from "./CVPreview";

export function ShowcaseSection() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{url: string, title: string} | null>(null);

    return (
        <section 
            id="showcase" 
            className="relative w-full py-24 md:py-32 md:px-12 lg:px-24 pointer-events-none"
            style={{
                paddingLeft: "max(1rem, env(safe-area-inset-left))",
                paddingRight: "max(1rem, env(safe-area-inset-right))"
            }}
        >
            <div className="pointer-events-auto max-w-5xl mx-auto z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6">
                        Capabilities & Credentials
                    </h2>
                    <p className="text-gray-400 font-mono text-xs md:text-sm mb-8 md:mb-12 uppercase tracking-widest">
                        Interactive Secured Gallery
                    </p>

                    <div className="relative w-full rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden min-h-[500px] shadow-2xl">
                        {/* Advanced Interior Lighting / Ambient Background */}
                        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-900/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-900/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
                        
                        {/* Decorative acoustic panel / ribbed texture effect */}
                        <div 
                        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
                        style={{
                            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 1px, #fff 1px, #fff 2px)",
                            backgroundSize: "8px 100%"
                        }}
                        />

                        <AnimatePresence mode="wait">
                            {!isUnlocked ? (
                                <motion.div 
                                    key="locked"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl p-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                        <Lock className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 relative z-10 mb-6 mx-auto" />
                                    </div>
                                    
                                    <h3 className="font-mono text-sm md:text-lg text-white mb-3 md:mb-2 uppercase tracking-[0.2em] md:tracking-[0.3em] text-center mt-4 border border-white/10 px-4 py-1 rounded-full">
                                        Encrypted Showcase
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm mb-8 text-center max-w-sm px-4 leading-relaxed mt-4">
                                        Advanced privacy layout. Certificates and engineering metrics require explicit unlocking to view below contents.
                                    </p>
                                    
                                    <button 
                                        onClick={() => setIsUnlocked(true)}
                                        className="group relative px-6 md:px-8 py-3 md:py-4 bg-transparent border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 rounded-full flex items-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 hover:bg-emerald-500/10"
                                    >
                                        <ScanEye className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-mono font-semibold tracking-widest uppercase text-xs md:text-sm">
                                            Authenticate
                                        </span>
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="unlocked"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative z-20 w-full h-full p-6 sm:p-8 md:p-12"
                                >
                                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
                                            <span className="font-mono text-emerald-400 uppercase tracking-widest text-[10px] md:text-xs font-semibold">Verified Secure</span>
                                        </div>
                                        <button 
                                            onClick={() => setIsUnlocked(false)}
                                            className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                                            title="Lock showcase"
                                            aria-label="Lock showcase"
                                        >
                                            <Lock size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {/* Core Skills */}
                                        <div className="col-span-1 md:col-span-2">
                                            <h3 className="text-lg md:text-xl font-display font-medium text-white mb-6">Expertise Matrix</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <SkillCard 
                                                    icon={<Code size={20} />}
                                                    title="Frontend Architecture" 
                                                    desc="React, Next.js, TypeScript, State Management" 
                                                />
                                                <SkillCard 
                                                    icon={<Layers size={20} />}
                                                    title="Creative Development" 
                                                    desc="WebGL, Three.js, GSAP, Canvas API, Glsl" 
                                                />
                                                <SkillCard 
                                                    icon={<PenTool size={20} />}
                                                    title="UI/UX Engineering" 
                                                    desc="Figma, Tailwind, Motion Design, A11y" 
                                                />
                                                <SkillCard 
                                                    icon={<Zap size={20} />}
                                                    title="Performance Tuning" 
                                                    desc="Lighthouse optimization, Asset delivery" 
                                                />
                                            </div>
                                        </div>

                                        {/* Certificates */}
                                        <div className="col-span-1 md:col-span-2">
                                            <h3 className="text-lg md:text-xl font-display font-medium text-white mb-6">Credentials Gallery</h3>
                                            <div className="space-y-4">
                                                <CertCard 
                                                    title="Creative Coding Specialization" 
                                                    issuer="Awwwards Academy" 
                                                    date="2024" 
                                                    id="AWWD-8921"
                                                    onClick={() => setPreviewDoc({ url: "https://drive.google.com/file/d/1wzvYQdy3LTLekoCOhytPM5m0AGO0n9nr/preview", title: "Creative Coding Specialization" })}
                                                />
                                                <CertCard 
                                                    title="Advanced React Patterns" 
                                                    issuer="Frontend Masters" 
                                                    date="2023" 
                                                    id="FEM-4432"
                                                    onClick={() => setPreviewDoc({ url: "https://drive.google.com/file/d/1wzvYQdy3LTLekoCOhytPM5m0AGO0n9nr/preview", title: "Advanced React Patterns" })}
                                                />
                                                <CertCard 
                                                    title="Certified Web Accessibility (CPWA)" 
                                                    issuer="IAAP" 
                                                    date="2023" 
                                                    id="IAAP-1099"
                                                    onClick={() => setPreviewDoc({ url: "https://drive.google.com/file/d/1wzvYQdy3LTLekoCOhytPM5m0AGO0n9nr/preview", title: "Certified Web Accessibility (CPWA)" })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {previewDoc && (
                    <div className="pointer-events-auto relative z-[100]">
                        <CVPreview 
                            pdfUrl={previewDoc.url}
                            title={`Credential: ${previewDoc.title}`}
                            onClose={() => setPreviewDoc(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

function SkillCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group backdrop-blur-sm h-full">
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-3 group-hover:text-emerald-400 group-hover:scale-110 transition-all border border-white/5">
               {icon}
           </div>
           <h4 className="text-white font-medium mb-1.5 text-sm md:text-base">{title}</h4>
           <p className="text-[11px] md:text-xs text-gray-400 font-mono leading-relaxed">{desc}</p>
        </div>
    )
}

function CertCard({ title, issuer, date, id, onClick }: { title: string, issuer: string, date: string, id: string, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="w-full text-left p-4 md:p-5 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
        >
            <div className="flex-1 pr-4">
                <h4 className="text-white font-medium mb-1.5 group-hover:text-emerald-300 transition-colors text-sm md:text-base leading-snug">{title}</h4>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                   <span className="text-[10px] md:text-xs text-gray-400 font-mono shrink-0">{issuer}</span>
                   <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                   <span className="text-[10px] md:text-xs text-gray-500 font-mono shrink-0">{date}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
               <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse mix-blend-overlay"></div>
                  <Award className="text-gray-500 group-hover:text-emerald-400 transition-colors w-3.5 h-3.5 md:w-4 md:h-4 relative z-10" />
               </div>
               <span className="text-[8px] md:text-[9px] font-mono text-white/30 tracking-widest uppercase">{id}</span>
            </div>
        </button>
    )
}
