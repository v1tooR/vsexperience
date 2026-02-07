import { ArrowRight, ExternalLink } from "lucide-react";

const cases = [
  {
    title: "G4 Educação",
    focus: "Experiência, consistência e conversão em páginas e jornadas.",
    deliveries: "Estrutura de navegação/UX, UI e implementação com ajuste fino e responsividade.",
    impact: "Comunicação mais clara e base sólida para aquisição e escala.",
    gridClass: "col-span-12 md:col-span-6",
    featured: true,
  },
  {
    title: "Costa Flores",
    focus: "Elevar percepção premium e guiar o usuário até a ação com menos atrito.",
    deliveries: "Narrativa, organização de seções, UI consistente e CTAs bem posicionados.",
    impact: "Mais autoridade na apresentação e jornada mais objetiva até o contato.",
    gridClass: "col-span-12 md:col-span-6",
    featured: false,
  },
  {
    title: "Casa Floresta",
    focus: "Presença digital memorável, com refinamento e fluidez.",
    deliveries: "Hierarquia de informação, UI premium e experiência focada em confiança.",
    impact: "Site com 'cara de marca forte' e intenção clara de conversão.",
    gridClass: "col-span-12",
    featured: false,
  },
];

const Cases = () => {
  return (
    <section className="section-padding" id="cases">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading md:text-display-sm font-bold mb-4 animate-fade-up">
            Cases em <span className="text-gradient-primary">destaque</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up delay-100">
            Três projetos para mostrar padrão, direção e entrega — não só "print bonito".
          </p>
        </div>

        {/* Cases Grid */}
        <div className="bento-grid">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.title}
              className={`${caseItem.gridClass} group animate-fade-up`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`h-full ${caseItem.featured ? 'liquid-glass' : 'glass-card'} rounded-2xl p-8 md:p-10 transition-all duration-500 hover:scale-[1.01]`}>
                {/* Case image placeholder */}
                <div className="w-full h-48 md:h-64 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 mb-6 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <span className="text-4xl font-bold text-muted-foreground/30">{caseItem.title.charAt(0)}</span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl md:text-2xl font-semibold">{caseItem.title}</h3>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary-light transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-primary-light uppercase tracking-wider">Foco</span>
                      <p className="text-muted-foreground text-sm mt-1">{caseItem.focus}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary-light uppercase tracking-wider">Entregas</span>
                      <p className="text-muted-foreground text-sm mt-1">{caseItem.deliveries}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary-light uppercase tracking-wider">Impacto</span>
                      <p className="text-foreground text-sm mt-1 font-medium">{caseItem.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-up">
          <a href="#portfolio" className="btn-secondary group inline-flex">
            Ver todos os projetos
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Cases;
