import React, { useEffect, useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { ReactLenis, useLenis } from "lenis/react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  X,
  Activity,
  Instagram,
  Twitter,
  Globe,
  Pin,
  AtSign,
  Home as HomeIcon,
  User as UserIcon,
  LayoutGrid as GridIcon,
  Mail as MailIcon,
  Award as AwardIcon
} from "lucide-react";
import { Scene } from "./components/canvas/Scene";
import { Preloader } from "./components/Preloader";
import { CVPreview } from "./components/CVPreview";
import { TechSphere } from "./components/TechSphere";
import { ShowcaseSection } from "./components/ShowcaseSection";
import Lottie from "lottie-react";
import mobileBgAnimation from "./components/mobile-bg.json";

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Mouse coordinates
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Smooth trailing coordinates
    const trails = Array.from({ length: 12 }, () => ({ x: mouseX, y: mouseY }));
    let rafId: number;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("hover-trigger")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    const animate = () => {
      // Main cursor update
      if (cursorRef.current) {
        // Small lerp for the main ring
        const currentX = parseFloat(
          cursorRef.current.style.getPropertyValue("--x") || mouseX.toString(),
        );
        const currentY = parseFloat(
          cursorRef.current.style.getPropertyValue("--y") || mouseY.toString(),
        );

        const targetX = currentX + (mouseX - currentX) * 0.3;
        const targetY = currentY + (mouseY - currentY) * 0.3;

        cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        cursorRef.current.style.setProperty("--x", targetX.toString());
        cursorRef.current.style.setProperty("--y", targetY.toString());
      }

      // Trail update
      let prevX = mouseX;
      let prevY = mouseY;

      trails.forEach((pt, index) => {
        // Interpolate point towards the previous point in the chain
        pt.x += (prevX - pt.x) * (0.35 - index * 0.015);
        pt.y += (prevY - pt.y) * (0.35 - index * 0.015);

        const el = trailsRef.current[index];
        if (el) {
          const scale = 1 - index * 0.06;
          const opacity = 1 - index * 0.08;
          el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) scale(${scale})`;
          el.style.opacity = opacity.toString();
        }

        // Next point follows this point
        prevX = pt.x;
        prevY = pt.y;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  )
    return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 md:w-12 md:h-12 border border-white/30 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center transition-all duration-300"
        style={{
          marginLeft: "-1rem",
          marginTop: "-1rem",
          transformOrigin: "center",
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering
            ? "rgba(255, 255, 255, 0.1)"
            : "transparent",
        }}
      >
        <div
          className="w-1 h-1 bg-white rounded-full transition-all duration-300"
          style={{
            scale: isHovering ? 0 : 1,
            opacity: isHovering ? 0 : 1,
          }}
        />
      </div>

      {/* Particle Trail */}
      <div className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen hidden md:block">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (trailsRef.current[i] = el)}
            className="absolute w-2 h-2 rounded-full"
            style={{
              marginLeft: "-4px", // Center dot offsets
              marginTop: "-4px",
              backgroundColor: `hsl(${260 + i * 5}, 80%, ${70 - i * 2}%)`, // Analogous shifted colors for trail
              boxShadow: `0 0 ${4 + i}px hsl(${260 + i * 5}, 80%, 60%)`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </>
  );
}

function Navigation() {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState("top");

  // Keep track of active section for mobile tabs
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["top", "about", "works", "showcase", "contact"];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    target: string,
  ) => {
    e.preventDefault();
    const id = target.replace("#", "");
    setActiveSection(id);
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 md:px-12 z-50 flex justify-between items-center mix-blend-difference pointer-events-auto text-white">
        <div
          className="font-display font-bold text-xl md:text-2xl tracking-tight cursor-pointer hover-trigger select-none"
          onClick={(e) => handleNavClick(e as any, "#top")}
        >
          MN.
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 font-mono text-sm uppercase tracking-widest text-gray-300">
          <button
            onClick={(e) => handleNavClick(e, "#about")}
            className="nav-link hover:text-white transition-colors uppercase"
            aria-label="Navigate to About section"
          >
            About
          </button>
          <button
            onClick={(e) => handleNavClick(e, "#works")}
            className="nav-link hover:text-white transition-colors uppercase"
            aria-label="Navigate to Works section"
          >
            Works
          </button>
          <button
            onClick={(e) => handleNavClick(e, "#showcase")}
            className="nav-link hover:text-white transition-colors uppercase"
            aria-label="Navigate to Showcase section"
          >
            Skills
          </button>
          <button
            onClick={(e) => handleNavClick(e, "#contact")}
            className="nav-link hover:text-white transition-colors uppercase"
            aria-label="Navigate to Contact section"
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-[360px]">
        <div className="flex justify-around items-center px-2 h-[56px] bg-[#0a0a0ab3] backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          {[
            { id: "top", label: "Home", icon: <HomeIcon className="w-6 h-6 mb-1" /> },
            { id: "about", label: "About", icon: <UserIcon className="w-6 h-6 mb-1" /> },
            { id: "works", label: "Work", icon: <GridIcon className="w-6 h-6 mb-1" /> },
            { id: "contact", label: "Contact", icon: <MailIcon className="w-6 h-6 mb-1" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, `#${item.id}`)}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 transition-all duration-300 ${
                activeSection === item.id 
                  ? "text-emerald-400 font-semibold" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-mono tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const projects = [
  {
    id: "polystudy",
    title: "PolyStudy",
    category: "Education",
    year: "2023",
    description:
      "An immersive learning management system designed with clarity and focus. Features include real-time collaboration, a completely custom 3D course map, and ultra-fast Next.js architecture.",
    tech: ["React", "Next.js", "Three.js", "Tailwind"],
    link: "https://polystudy.vercel.app/",
    image:
      "https://raw.githubusercontent.com/mohdnihadkp1/GALLERY/refs/heads/main/icon_of_chaliyam_connect/polystudy.png",
  },
  {
    id: "calicutstore",
    title: "Calicut Store",
    category: "E-Commerce",
    year: "2024",
    description:
      "A modern digital storefront prioritizing smooth user flows and hyper-fast performance. Employs Edge computing and statically generated pages for a flawless shopping experience.",
    tech: ["Next.js", "Stripe", "Framer Motion", "GSAP"],
    link: "https://calicutstore.vercel.app/",
    image:
      "https://raw.githubusercontent.com/mohdnihadkp1/GALLERY/refs/heads/main/icon_of_chaliyam_connect/calicut.png",
  },
  {
    id: "chaliyam",
    title: "Chaliyam Connect",
    category: "Community",
    year: "2024",
    description:
      "A local networking platform combining elegant UI with highly scalable backend architecture. Includes real-time chat, community forums, and event management.",
    tech: ["React", "Firebase", "Node.js", "Socket.io"],
    link: "https://chaliyam.vercel.app",
    image:
      "https://raw.githubusercontent.com/mohdnihadkp1/GALLERY/refs/heads/main/icon_of_chaliyam_connect/chaliyam.png",
  },
];

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-black z-[9999] relative">
          <div className="bg-red-950/20 border border-red-500/20 p-6 md:p-8 rounded-2xl max-w-lg text-center backdrop-blur-md">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-red-400 font-sans tracking-tight">
              Oops, something went wrong.
            </h2>
            <p className="text-sm md:text-base text-red-200/70 mb-6 font-mono text-left bg-black/40 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.message ||
                "An unexpected rendering error occurred."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Recover Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GSAPSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

function ScrollLock({ isLocked }: { isLocked: boolean }) {
  const lenis = useLenis();
  useEffect(() => {
    if (isLocked) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "auto";
    }
  }, [isLocked, lenis]);
  return null;
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showFPS, setShowFPS] = useState(false);
  const [showCV, setShowCV] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Check for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Close modal on escape and refresh ScrollTrigger on resize
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };

    // Sometimes mobile browser bars hide after initial load, changing dimensions.
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", handleResize);

    // Initial refresh to ensure GSAP knows correct layouts
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ReactLenis root>
        <ScrollLock isLocked={!!selectedProject || showCV} />
        <GSAPSync />
        <Preloader />
        <div
          id="top"
          className="relative w-full min-h-screen bg-bg overflow-x-hidden text-gray-200"
        >
          <CustomCursor />

          {/* Floating Developer Tools (FPS Monitor Toggle) */}
          <div className="fixed bottom-4 left-4 z-50">
            <button
              onClick={() => setShowFPS(!showFPS)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md hover-trigger text-white mix-blend-difference pointer-events-auto"
              title="Toggle Performance Monitor"
              aria-label="Toggle Performance Monitor"
            >
              <Activity
                size={16}
                className={showFPS ? "text-accent-neon" : "text-gray-400"}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* 3D WebGL Layer - Fixed Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {isMobile || prefersReducedMotion ? (
              // Lottie fallback for mobile & prefers-reduced-motion
              <div 
                className="absolute inset-0 z-0 flex items-center justify-center opacity-30 select-none pointer-events-none" 
                style={{
                  background: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #030303 100%)"
                }}
              >
                <Lottie animationData={mobileBgAnimation} loop={true} className="w-full h-full max-w-2xl blur-3xl opacity-50" />
              </div>
            ) : (
              <ErrorBoundary
                fallback={<div className="fixed inset-0 z-0 bg-[#030303]"></div>}
              >
                <Canvas
                  dpr={[1, 2]}
                  performance={{ min: 0.5 }}
                  gl={{ antialias: false, powerPreference: "high-performance" }}
                >
                  <Suspense fallback={null}>
                    <Scene />
                  </Suspense>
                  {showFPS && (
                    <Stats className="!fixed !top-4 !left-20 !z-[51]" />
                  )}
                </Canvas>
              </ErrorBoundary>
            )}
          </div>

          {/* DOM Layer - Scrolling Content */}
          <div className="relative z-10 w-full">
            <Navigation />

            {/* Section 1: Hero */}
            <section className="relative w-full h-[60svh] md:h-[100svh] min-h-[480px] flex flex-col justify-center px-4 md:px-12 lg:px-24 pointer-events-none">
              <div className="pointer-events-auto max-w-5xl z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="mb-2 md:mb-6 flex items-center gap-4"
                >
                  <div className="w-8 md:w-12 h-[1px] bg-accent-light" />
                  <span className="font-mono text-gray-400 md:text-accent-light uppercase tracking-widest text-sm">
                    Creative Developer
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-[clamp(2.5rem,12vw,4rem)] md:text-[clamp(4rem,15vw,10rem)] font-semibold md:font-bold tracking-tighter leading-[1] md:leading-[0.9] mb-6 md:mb-8 text-white mix-blend-difference flex flex-col md:flex-row md:gap-4 lg:flex-col lg:gap-0"
                >
                  <span>NIHAD</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-blue-400">
                    MOHAMMED
                  </span>
                </motion.h1>

                {isMobile || prefersReducedMotion ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="w-full max-w-sm md:max-w-xl flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-2 mask-linear-fade"
                  >
                    {["React", "Three.js", "GSAP", "Next.js", "Tailwind", "WebGL"].map((tech, i) => (
                      <div 
                        key={tech}
                        className="snap-start shrink-0 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-mono text-gray-300 pointer-events-auto"
                      >
                        {tech}
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="w-full max-w-md h-[400px] mt-4 -ml-16 pointer-events-auto relative"
                  >
                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                      <ambientLight intensity={0.5} />
                      <Suspense fallback={null}>
                        <TechSphere />
                      </Suspense>
                    </Canvas>
                  </motion.div>
                )}
              </div>
            </section>

            {/* Section 2: About */}
            <section
              id="about"
              className="relative w-full min-h-[100svh] flex items-center px-4 md:px-12 lg:px-24 py-20 md:py-32 pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12"
              >
                <div className="w-full lg:w-[80%] xl:w-[70%] pointer-events-auto glass-panel p-6 sm:p-8 md:p-12 rounded-[24px] md:rounded-[32px] z-10 text-left backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-2 sm:mb-4 text-white leading-tight">
                    Bridging Technology <br className="hidden sm:block" />& Creation
                  </h2>
                  <div className="font-mono text-accent-light uppercase tracking-widest text-[10px] sm:text-xs md:text-sm mb-6 sm:mb-8">
                    A Tech Enthusiast & Innovator
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg text-gray-300 font-light leading-relaxed mb-8 sm:mb-10">
                    <p>
                      I am an ambitious tech enthusiast and professional freelancer who thrives at the intersection of technology and digital creation. While my educational roots are in computer engineering, my drive for independence led me to chart my own path in business and practical innovation.
                    </p>
                    <p>
                      I am deeply fascinated by web design and artificial intelligence, constantly seeking creative ways to turn ideas into reality through video editing, photography, and videography. Beyond the screen, I am a dedicated problem solver and business planner who is eager to connect with global teams, explore new cultures through travel, and share my skills with others through teaching.
                    </p>
                  </div>

                  <h3 className="text-xl sm:text-2xl text-white font-display font-medium mb-4 sm:mb-6">
                    Core Skills & Competencies
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 text-xs sm:text-sm text-gray-400">
                    <div className="space-y-2">
                      <strong className="block text-white font-medium text-sm sm:text-base mb-1">Artificial Intelligence</strong>
                      <p>Generative AI, AI Enablement, Claude/AI Fundamentals.</p>
                    </div>
                    <div className="space-y-2">
                      <strong className="block text-white font-medium text-sm sm:text-base mb-1">Development & Tech</strong>
                      <p>Web Development, Web Design, Software Testing.</p>
                    </div>
                    <div className="space-y-2">
                      <strong className="block text-white font-medium text-sm sm:text-base mb-1">Digital Creation</strong>
                      <p>Video Editing, Photography, Videography.</p>
                    </div>
                    <div className="space-y-2">
                      <strong className="block text-white font-medium text-sm sm:text-base mb-1">Business & Strategy</strong>
                      <p>Business Planning, Problem Solving, Independent Freelancing.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCV(true)}
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-bg font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest rounded-full hover-trigger w-full sm:w-auto"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, backgroundColor: "#e2e8f0", duration: 0.3, ease: "power2.out" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, backgroundColor: "#ffffff", duration: 0.3, ease: "power2.out" })}
                  >
                    View Secure CV
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Section 3: Works */}
            <section
              id="works"
              className="relative w-full min-h-[150svh] flex flex-col justify-center px-4 md:px-12 lg:px-24 py-16 md:py-24 pointer-events-none"
            >
              <div className="w-full max-w-7xl mx-auto pointer-events-auto z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-6xl font-display font-bold mb-12 md:mb-16 text-left md:text-right mix-blend-difference text-white"
                >
                  Selected Works
                </motion.h2>

                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-hidden snap-y snap-mandatory scroll-py-24">
                  {projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="snap-start w-full"
                    >
                      <div
                        className="glass-card p-4 md:p-8 group flex flex-col h-auto w-full text-left rounded-[16px] md:rounded-[32px] overflow-hidden"
                        style={{
                          marginTop:
                            typeof window !== "undefined" &&
                            window.innerWidth >= 1024
                              ? idx === 1
                                ? "4rem"
                                : idx === 2
                                  ? "8rem"
                                  : "0"
                              : "0",
                        }}
                      >
                        {/* 16:9 Thumbnail for Mobile / Desktop */}
                        <div className="relative w-full aspect-video rounded-lg md:rounded-2xl overflow-hidden mb-3 md:mb-6 bg-white/5 border border-white/5">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 md:px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                            <span className="font-mono text-[9px] sm:text-[10px] text-accent-light uppercase tracking-widest block">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex-grow px-1">
                          <h3 className="text-xl md:text-3xl font-display font-semibold text-white mb-1 md:mb-2 line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">
                            {project.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-auto px-1 border-t border-white/5 pt-3 md:pt-4">
                          <span className="text-[10px] md:text-xs font-mono text-gray-500">
                            {project.year}
                          </span>
                          
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-transparent md:bg-white/5 hover:bg-white/10 rounded-full text-xs font-mono tracking-widest uppercase text-emerald-400 md:text-white transition-all min-h-[44px] md:min-h-0"
                            aria-label={`View case study for ${project.title}`}
                          >
                            View
                            <ArrowUpRight size={16} className="md:text-accent-light" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: Showcase */}
            <ShowcaseSection />

            {/* Section 4: Contact & Footer */}
            <section
              id="contact"
              className="relative w-full min-h-[80svh] flex flex-col items-center justify-center px-4 md:px-6 py-16 md:py-24 pointer-events-none bg-gradient-to-t from-bg to-transparent"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="pointer-events-auto glass-panel p-8 md:p-12 text-center rounded-[32px] md:rounded-[40px] z-10 border-b-0 border-x-0 w-full max-w-4xl"
              >
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 md:mb-8">
                  Let's Talk.
                </h2>
                <p className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto mb-8 md:mb-10">
                  Currently open for new opportunities. Whether you have a
                  question or just want to say hi, I'll try my best to get back
                  to you!
                </p>

                <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-6 md:pb-0 mb-8 md:mb-12 w-full max-w-2xl mx-auto px-4 justify-start md:justify-center">
                  {[
                    { icon: <Mail className="w-6 h-6 md:w-5 md:h-5" />, label: "Email", href: "mailto:mohdnihadkp@gmail.com" },
                    { icon: <Github className="w-6 h-6 md:w-5 md:h-5" />, label: "GitHub", href: "https://github.com/mohdnihadkp" },
                    { icon: <Linkedin className="w-6 h-6 md:w-5 md:h-5" />, label: "LinkedIn", href: "https://www.linkedin.com/in/mohdnihadkp" },
                    { icon: <Instagram className="w-6 h-6 md:w-5 md:h-5" />, label: "Instagram", href: "https://www.instagram.com/mohdnihadkp" },
                    { icon: <Twitter className="w-6 h-6 md:w-5 md:h-5" />, label: "X", href: "https://drive.google.com/file/d/1I3xkNY3UucLe2T9bMvOpIzIrp1lrV0_W/view?usp=drivesdk" },
                    { icon: <AtSign className="w-6 h-6 md:w-5 md:h-5" />, label: "Threads", href: "https://www.threads.com/@mohdnihadkp" },
                    { icon: <Pin className="w-6 h-6 md:w-5 md:h-5" />, label: "Pinterest", href: "https://pin.it/4SKTJurgS" },
                    { icon: <Globe className="w-6 h-6 md:w-5 md:h-5" />, label: "Portfolio", href: "https://mohdnihadkp.vercel.app" }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      title={social.label}
                      className="snap-center shrink-0 w-16 h-16 md:w-14 md:h-14 rounded-full border border-white/10 flex flex-col md:flex-row items-center justify-center gap-1 hover:bg-white hover:text-black hover:scale-110 transition-all hover-trigger bg-white/5 active:scale-95 group relative"
                    >
                      {social.icon}
                      <span className="text-[10px] font-mono opacity-100 md:opacity-0 md:absolute md:-bottom-8 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Mobile fixed Email Me button (only visible on mobile, positioned above the bottom tabs) */}
                <div className="md:hidden fixed bottom-[96px] left-[16px] right-[16px] z-[90]">
                  <a
                    href="mailto:mohdnihadkp@gmail.com"
                    className="flex items-center justify-center gap-2 w-full h-[48px] bg-emerald-500 text-bg font-mono text-[16px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-transform"
                  >
                    Email Me
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>

                <div className="w-full h-[1px] bg-white/10 mb-6 md:mb-8" />

                <p className="text-gray-600 font-mono text-xs md:text-sm">
                  © {new Date().getFullYear()} Mohammed Nihad KP. All rights
                  reserved.
                </p>
              </motion.div>
            </section>
          </div>
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/60 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors hover-trigger border border-white/10"
                  aria-label="Close project details"
                >
                  <X
                    aria-hidden="true"
                    size={16}
                    className="text-white md:w-5 md:h-5"
                  />
                </button>

                <span className="font-mono text-xs md:text-sm text-accent-light uppercase tracking-widest mb-3 md:mb-4 block mt-2 md:mt-0">
                  {selectedProject.category} • {selectedProject.year}
                </span>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6 pr-8">
                  {selectedProject.title}
                </h3>

                {selectedProject.image && (
                  <div className="w-full relative aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 border border-white/10">
                    <img
                      src={selectedProject.image}
                      alt={`Preview of ${selectedProject.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="w-full h-[1px] bg-white/10 mb-6 md:mb-8" />

                <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
                  {selectedProject.description}
                </p>

                <div className="mb-8 md:mb-10">
                  <h4 className="text-xs md:text-sm font-mono text-gray-400 uppercase tracking-widest mb-3 md:mb-4">
                    Core Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 md:px-3 py-1 md:py-1.5 rounded-md bg-white/5 border border-white/10 text-xs md:text-sm text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-black text-sm md:text-base font-semibold rounded-full hover:scale-105 transition-transform hover-trigger w-full sm:w-auto"
                  aria-label={`Visit live site for ${selectedProject.title}`}
                >
                  Visit Live Site{" "}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    className="md:w-4 md:h-4"
                  />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCV && <CVPreview onClose={() => setShowCV(false)} />}
        </AnimatePresence>
      </ReactLenis>
    </ErrorBoundary>
  );
}
