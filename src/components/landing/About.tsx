import { Award, Building2, Code2 } from "lucide-react";

const highlights = [
  {
    icon: Award,
    text: "1º lugar em UI/UX Design (SPSKILLS) — interface para app bancário.",
  },
  {
    icon: Building2,
    text: "Experiência em projetos para G4 Educação e Banco Inter, incluindo páginas e iniciativas digitais.",
  },
  {
    icon: Code2,
    text: "Base técnica e de produto: HTML/CSS/JS, Tailwind, React/Next, Figma, MySQL e servidores.",
  },
];

const About = () => {
  return (
    <section className="section-padding" id="sobre">
      <div className="container-tight">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image/Visual */}
          <div className="relative animate-fade-up">
            <div className="liquid-glass rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-5xl font-bold text-gradient-primary">VS</span>
                </div>
                <p className="text-xl font-semibold">Victor Santos</p>
                <p className="text-muted-foreground">CEO @ VS Experience</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full liquid-glass opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full liquid-glass opacity-30" />
          </div>

          {/* Content */}
          <div className="animate-fade-up delay-100">
            <h2 className="text-heading md:text-display-sm font-bold mb-6">
              Quem é o <span className="text-gradient-primary">Victor</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                Sou Product Designer focado em Web e Apps, com atuação ponta a ponta: discovery, 
                protótipo e entrega. Meu objetivo é simples: construir experiências que vendem, 
                captam e fortalecem marca — com <span className="text-foreground">clareza, consistência e execução técnica.</span>
              </p>
              <p>
                Hoje atuo como CEO na VS Experience, e também como Desenvolvedor Full Stack, 
                trabalhando com evolução de páginas, performance, SEO técnico e integrações 
                orientadas à conversão quando aplicável.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 glass-card rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <p className="text-sm text-foreground/80">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
