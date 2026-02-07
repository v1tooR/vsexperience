import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(5_38%_22%_/_0.3),transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(5_38%_22%_/_0.1)_0%,transparent_70%)]" />
      
      {/* Floating glass orbs */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full liquid-glass animate-float opacity-30" />
      <div className="absolute bottom-40 left-20 w-24 h-24 rounded-full liquid-glass animate-float opacity-20" style={{ animationDelay: '2s' }} />
      
      <div className="container-tight relative z-10 text-center px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-up">
          <Sparkles className="w-4 h-4 text-primary-light" />
          <span className="text-sm font-medium text-muted-foreground">Product Designer & Developer</span>
        </div>

        {/* Main heading */}
        <h1 className="text-display-sm md:text-display font-bold text-gradient mb-6 animate-fade-up delay-100">
          Experiências digitais premium
          <br />
          <span className="text-gradient-primary">— pensadas para validar, converter e escalar.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-up delay-200">
          Eu uno estratégia, UX/UI e execução técnica para transformar ideias em interfaces claras, 
          consistentes e orientadas a resultado. Para SaaS, dashboards, produtos digitais e presença 
          web que precisam performar.
        </p>

        {/* Bullets */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 animate-fade-up delay-300">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-foreground/80">Clareza de proposta em segundos</span>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-foreground/80">Interface com padrão de produto "grande"</span>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-foreground/80">Decisões guiadas por objetivo</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-400">
          <a href="#cases" className="btn-primary group">
            Ver Cases
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#contato" className="btn-secondary">
            Conversar sobre um projeto
          </a>
        </div>

        {/* Microcopy */}
        <p className="text-sm text-muted-foreground mt-8 animate-fade-up delay-500">
          Sem achismo. Sem estética vazia. Só experiência que funciona.
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
