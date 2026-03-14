import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Menu, X, ChevronUp, Instagram, Facebook, Youtube, Music, Star, Calendar, Users, Mail, Phone, MapPin, Quote, Play, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Components ---

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = 'rgba(212, 168, 67, 0.3)'; // Gold with low opacity
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Domov', href: '#home' },
    { name: 'O nás', href: '#about' },
    { name: 'Služby', href: '#services' },
    { name: 'Repertoár', href: '#repertoire' },
    { name: 'Video', href: '#video' },
    { name: 'Galéria', href: '#gallery' },
    { name: 'Referencie', href: '#testimonials' },
    { name: 'Kontakt', href: '#contact' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 right-8 z-50 p-3 bg-charcoal text-gold rounded-full shadow-lg hover:bg-gold hover:text-charcoal transition-all duration-300"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-charcoal/95 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center space-y-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl font-serif text-white hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
            <div className="absolute bottom-12 flex space-x-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="text-gold cursor-pointer hover:text-white transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="text-gold cursor-pointer hover:text-white transition-colors" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="text-gold cursor-pointer hover:text-white transition-colors" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-8 md:mb-16 px-4">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-bold text-white mb-2"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-gold font-serif italic text-base md:text-lg"
      >
        {subtitle}
      </motion.p>
    )}
    <div className="w-16 md:w-20 h-1 bg-gold mx-auto mt-4" />
  </div>
);

const ParallaxWrapper = ({ children, offset = 100 }: { children: React.ReactNode, offset?: number }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const currentOffset = isMobile ? offset * 0.3 : offset;
  const y = useTransform(scrollYProgress, [0, 1], [-currentOffset, currentOffset]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={{ y }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
};

const DecorativeParallax = ({ speed = 0.5, className = "" }: { speed?: number, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [200 * speed, -200 * speed]);

  return (
    <motion.div 
      ref={ref} 
      style={{ y }} 
      className={`absolute pointer-events-none opacity-20 z-0 ${className}`}
    >
      <div className="w-64 h-64 rounded-full border border-gold/40 blur-[2px]" />
      <div className="absolute inset-0 w-64 h-64 rounded-full bg-gold/5 blur-xl" />
    </motion.div>
  );
};

const ParallaxBackground = ({ src, opacity = 0.2 }: { src: string, opacity?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        <img 
          src={src} 
          alt="Background" 
          className="w-full h-full object-cover grayscale"
          style={{ opacity }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const scrollToTestimonial = (index: number) => {
    if (testimonialRef.current) {
      const width = testimonialRef.current.offsetWidth;
      testimonialRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
      setActiveTestimonial(index);
    }
  };

  const handleTestimonialScroll = () => {
    if (testimonialRef.current) {
      const scrollLeft = testimonialRef.current.scrollLeft;
      const width = testimonialRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      if (index !== activeTestimonial) {
        setActiveTestimonial(index);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768) { // Only auto-play on mobile
        setActiveTestimonial((prev) => {
          const next = (prev + 1) % 3;
          scrollToTestimonial(next);
          return next;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 200]);

  const heroSlides = [
    {
      title: "Ľudové",
      accent: "Trio Javor",
      subtitle: "Srdcom pre folklór",
      image: "https://picsum.photos/seed/folk-violin/1920/1080?grayscale"
    },
    {
      title: "Tradičné",
      accent: "Nôty",
      subtitle: "Husle, cimbal, kontrabas",
      image: "https://picsum.photos/seed/cimbalom/1920/1080?grayscale"
    },
    {
      title: "Veselá",
      accent: "Muzika",
      subtitle: "Pre každú dobrú zábavu",
      image: "https://picsum.photos/seed/folk-dance/1920/1080?grayscale"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: 'Svadobné veselice',
      description: 'Odobierka, čepčenie a poriadna ľudová zábava až do rána bieleho.',
      icon: <Users className="w-8 h-8 text-gold" />,
    },
    {
      title: 'Oslavy a jubileá',
      description: 'Piesne na želanie, ktoré pohladia dušu a rozveselia každého oslávenca.',
      icon: <Music className="w-8 h-8 text-gold" />,
    },
    {
      title: 'Firemné posedenia',
      description: 'Autentická atmosféra slovenského folklóru pre vašich kolegov a partnerov.',
      icon: <Star className="w-8 h-8 text-gold" />,
    },
    {
      title: 'Folklórne večery',
      description: 'Koncertné vystúpenia plné energie, tanca a tých najkrajších tradičných melódií.',
      icon: <Calendar className="w-8 h-8 text-gold" />,
    },
  ];

  const repertoire = [
    { category: 'Zemplín a Šariš', items: ['A od Prešova', 'V pondelok doma nebudem', 'Kapura, kapura'] },
    { category: 'Podpoľanie', items: ['Horehronský čardáš', 'Na kráľovej holi', 'Pijú chlapci, pijú'] },
    { category: 'Terchová a Orava', items: ['Macejko', 'Slovenské mamičky', 'V hlbokej doline'] },
    { category: 'Čardáše a Polky', items: ['Tancuj, tancuj', 'Dedinka v údolí', 'Slovensko moje'] },
  ];

  const galleryImages = [
    'https://picsum.photos/seed/band1/800/600',
    'https://picsum.photos/seed/band2/800/600',
    'https://picsum.photos/seed/band3/800/600',
    'https://picsum.photos/seed/band4/800/600',
    'https://picsum.photos/seed/band5/800/600',
    'https://picsum.photos/seed/band6/800/600',
  ];

  const testimonials = [
    {
      name: 'Ján Kováč',
      role: 'Starosta obce',
      text: 'Trio Javor u nás hralo na dožinkách a lepšiu muziku sme tu ešte nemali. Chlapi vedia poriadne udrieť do strún!',
    },
    {
      name: 'Mária Nováková',
      role: 'Nevesta',
      text: 'Ďakujeme za nádherné čepčenie a úžasnú náladu na našej svadbe. Hostia tancovali až do rána!',
    },
    {
      name: 'Peter Malý',
      role: 'Manažér hotela',
      text: 'Profesionálny prístup a skvelý repertoár. Ich cimbalista je skutočný virtuóz, ktorý očaril všetkých hostí.',
    },
  ];

  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-charcoal">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal" />
          </motion.div>
        </AnimatePresence>
        
        <ParticleBackground />

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 text-center px-4"
        >
          {/* Floating Photo Effect */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="mb-8 flex justify-center"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-gold p-1 bg-charcoal/50 backdrop-blur-sm overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/violin-detail/300/300" 
                alt="Violin Detail" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-tighter">
                {heroSlides[currentSlide].title}<span className="text-gold">{heroSlides[currentSlide].accent}</span>
              </h1>
              <p className="text-xl md:text-3xl text-gold-light font-serif italic tracking-widest">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
        </motion.div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'bg-gold w-8' : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 md:px-8 bg-charcoal overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/folk-pattern/1920/1080" opacity={0.15} />
        <DecorativeParallax speed={1.2} className="-top-20 -left-20" />
        <DecorativeParallax speed={0.8} className="bottom-0 -right-20" />
        
        <ParallaxWrapper offset={100}>
          <div className="max-w-6xl mx-auto pt-10 md:pt-0">
            <SectionHeading title="O nás" subtitle="Muzika, ktorá spája generácie" />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://picsum.photos/seed/folk-trio/600/800"
                  alt="Ľudové Trio Javor"
                  className="rounded-sm shadow-2xl w-full max-w-[280px] mx-auto md:max-w-none grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 md:-bottom-6 md:-right-6 md:w-48 md:h-48 border-8 border-gold/20 -z-10" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-2xl md:text-3xl font-serif text-white">Poctivá slovenská muzika</h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  Ľudové Trio Javor vzniklo z lásky k našim tradíciám a slovenskému folklóru. Naše zloženie – husle, cimbal a kontrabas – je základom autentického zvuku, ktorý poznáte z dedinských tancovačiek aj veľkých folklórnych pódií.
                </p>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  Hráme s radosťou a srdcom, či už ide o svadobnú hostinu, oslavu životného jubilea alebo firemné posedenie. Naším cieľom je zachovať krásu ľudovej piesne a rozveseliť každého, kto má rád dobrú muziku a slovenský temperament.
                </p>
              </motion.div>
            </div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 md:px-8 bg-black overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/sheet-music/1920/1080" opacity={0.1} />
        <DecorativeParallax speed={0.5} className="top-40 right-0" />
        <DecorativeParallax speed={1.5} className="-bottom-20 left-10" />
        
        <ParallaxWrapper offset={100}>
          <div className="max-w-6xl mx-auto pt-10 md:pt-0">
            <SectionHeading title="Naše služby" subtitle="Muzika pre každú príležitosť" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 text-center hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="mb-6 flex justify-center">{service.icon}</div>
                  <h4 className="text-lg md:text-xl font-bold mb-4 text-white">{service.title}</h4>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Repertoire Section */}
      <section id="repertoire" className="py-20 px-4 md:px-8 bg-charcoal overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/orchestra/1920/1080" opacity={0.15} />
        <DecorativeParallax speed={1.0} className="top-0 left-1/2" />
        
        <ParallaxWrapper offset={100}>
          <div className="max-w-6xl mx-auto pt-10 md:pt-0">
            <SectionHeading title="Repertoár" subtitle="Rozmanitá hudobná cesta" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {repertoire.map((cat, i) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-2 border-gold/30 pl-6"
                >
                  <h4 className="text-lg md:text-xl font-serif text-gold mb-6 italic">{cat.category}</h4>
                  <ul className="space-y-4">
                    {cat.items.map((item) => (
                      <li key={item} className="text-xs md:text-sm text-white/70 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gold/40 rounded-full mr-3 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Video Section */}
      <section id="video" className="py-20 md:py-24 px-4 md:px-8 bg-black overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/cello/1920/1080" opacity={0.25} />
        <DecorativeParallax speed={1.2} className="top-20 -right-20" />
        
        <ParallaxWrapper offset={150}>
          <div className="max-w-5xl mx-auto text-center pt-10 md:pt-0">
            <SectionHeading title="Video Ukážka" subtitle="Vypočujte si našu muziku" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video w-full max-w-3xl mx-auto group shadow-2xl border border-white/10 overflow-hidden rounded-sm"
            >
              {!isVideoPlaying ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
                  {/* Video Cover */}
                  <img 
                    src="https://picsum.photos/seed/performance-video/1280/720" 
                    alt="Video Cover" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  {/* Play Button */}
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-16 h-16 md:w-20 md:h-20 bg-gold rounded-full flex items-center justify-center shadow-glow z-20"
                  >
                    <Play size={28} className="text-charcoal fill-charcoal ml-1" />
                    <div className="absolute inset-0 rounded-full border-2 border-gold animate-ping opacity-30" />
                  </motion.div>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 uppercase tracking-[0.4em] text-[8px] md:text-[10px] font-bold">
                    Spustiť video
                  </div>
                </div>
              ) : (
                <iframe 
                  className="w-full h-full z-20"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="Ľudové Trio Javor - Vystúpenie" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-24 px-4 md:px-8 bg-black overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/violin-performance/1920/1080" opacity={0.1} />
        <DecorativeParallax speed={1.8} className="-top-40 right-20" />
        <DecorativeParallax speed={0.6} className="bottom-20 -left-20" />
        
        <ParallaxWrapper offset={150}>
          <div className="max-w-6xl mx-auto pt-10 md:pt-0">
            <SectionHeading title="Galéria" subtitle="Momenty z našich vystúpení" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" 
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: (i % 3) * 0.1,
                    ease: [0.21, 0.47, 0.32, 0.98] 
                  }}
                  className="relative group cursor-pointer overflow-hidden aspect-square z-0 hover:z-10 border border-white/5"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`Performance ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white border border-white px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest">Zobraziť obrázok</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 md:px-8 bg-charcoal text-white overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/audience/1920/1080" opacity={0.15} />
        <ParallaxWrapper offset={60}>
          <div className="max-w-6xl mx-auto pt-10 md:pt-0">
            <SectionHeading title="Referencie" subtitle="Čo hovoria naši klienti" />
            <div className="relative">
              <div 
                ref={testimonialRef}
                onScroll={handleTestimonialScroll}
                className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar md:gap-8 pb-8"
              >
                {testimonials.map((t, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="w-full flex-shrink-0 md:flex-shrink md:w-auto snap-center text-center px-6 py-10 bg-white/5 backdrop-blur-sm border border-white/10 relative group hover:bg-white/10 transition-all duration-500"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gold flex items-center justify-center rounded-full">
                      <Quote size={16} className="text-charcoal fill-charcoal" />
                    </div>
                    <div className="mb-6 flex justify-center">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} className="text-gold fill-gold mx-0.5" />
                      ))}
                    </div>
                    <p className="text-sm md:text-base font-serif italic mb-8 leading-relaxed text-white/90">
                      "{t.text}"
                    </p>
                    <div className="mt-auto">
                      <h5 className="text-gold font-bold uppercase tracking-widest text-xs">{t.name}</h5>
                      <p className="text-white/40 text-[10px] mt-1">{t.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation Arrows (Desktop) */}
              <div className="hidden md:block">
                <button 
                  onClick={() => scrollToTestimonial(Math.max(0, activeTestimonial - 1))}
                  className="absolute top-1/2 -left-12 -translate-y-1/2 p-2 text-white/30 hover:text-gold transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={() => scrollToTestimonial(Math.min(testimonials.length - 1, activeTestimonial + 1))}
                  className="absolute top-1/2 -right-12 -translate-y-1/2 p-2 text-white/30 hover:text-gold transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Mobile indicators */}
              <div className="flex justify-center space-x-3 md:hidden">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeTestimonial === i ? 'bg-gold w-6' : 'bg-gold/30'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 md:px-8 bg-black overflow-hidden relative border-t border-white/5">
        <ParallaxBackground src="https://picsum.photos/seed/contact-bg/1920/1080" opacity={0.1} />
        
        <ParallaxWrapper offset={100}>
          <div className="max-w-4xl mx-auto pt-10 md:pt-0 text-center">
            <SectionHeading title="Kontaktujte nás" subtitle="Zavolajte si nás na vašu hostinu" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h3 className="text-3xl font-serif text-white">Dajte nám vedieť</h3>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Hráme po celom Slovensku aj v zahraničí. Vyplňte formulár alebo nám zavolajte a dohodneme sa na podrobnostiach vašej akcie.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                <a href="mailto:info@triojavor.sk" className="flex flex-col items-center space-y-4 group">
                  <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full text-gold border border-white/10 group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
                    <Mail size={28} />
                  </div>
                  <span className="text-white/80 text-lg group-hover:text-gold transition-colors">info@triojavor.sk</span>
                </a>
                
                <a href="tel:+421900123456" className="flex flex-col items-center space-y-4 group">
                  <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full text-gold border border-white/10 group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
                    <Phone size={28} />
                  </div>
                  <span className="text-white/80 text-lg group-hover:text-gold transition-colors">+421 900 123 456</span>
                </a>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full text-gold border border-white/10">
                    <MapPin size={28} />
                  </div>
                  <span className="text-white/80 text-lg">Slovensko</span>
                </div>
              </div>
            </motion.div>
          </div>
        </ParallaxWrapper>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Ľudové Trio Javor. Všetky práva vyhradené.
          </p>
          <div className="flex space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} className="text-white/30 hover:text-gold cursor-pointer transition-colors" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} className="text-white/30 hover:text-gold cursor-pointer transition-colors" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={18} className="text-white/30 hover:text-gold cursor-pointer transition-colors" />
            </a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 z-50 p-3 bg-gold text-charcoal rounded-full shadow-xl hover:bg-charcoal hover:text-gold transition-all duration-300"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-8 right-8 text-white hover:text-gold transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
