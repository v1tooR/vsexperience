import { Lightbulb, Shield, TrendingUp } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Clareza",
    description: "O usuário entende rápido e decide com menos fricção.",
  },
  {
    icon: Shield,
    title: "Consistência",
    description: "Padrão visual e funcional que transmite autoridade.",
  },
  {
    icon: TrendingUp,
    title: "Resultado",
    description: "Decisões feitas para melhorar conversão, engajamento e retenção.",
  },
];

const Differentials = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(5_38%_22%_/_0.1)_0%,transparent_50%)]" />
      
      <div className="container-tight relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading md:text-display-sm font-bold mb-6 animate-fade-up">
            Design com lógica de negócio.
            <br />
            <span className="text-gradient-primary">Execução com padrão de engenharia.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-up delay-100">
            O problema de muitos projetos é simples: começam pelo visual e terminam com retrabalho.
            <br className="hidden md:block" />
            Eu começo pela clareza (objetivo + usuário + oferta), traduzo isso em arquitetura e UX, 
            e só então elevo com um UI premium — pronto para ser construído de verdade.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="liquid-glass rounded-2xl p-8 text-center group hover:scale-[1.02] transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <pillar.icon className="w-8 h-8 text-primary-light" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
