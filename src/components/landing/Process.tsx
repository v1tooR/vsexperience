import { Search, Layers, Palette, Code, RefreshCw } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Diagnóstico",
    subtitle: "Objetivo e contexto real",
    description: "O que precisa acontecer: leads? vendas? ativação? retenção? confiança?",
  },
  {
    number: "02",
    icon: Layers,
    title: "Arquitetura e narrativa",
    subtitle: "UX Strategy",
    description: "Hierarquia, fluxos, estrutura e 'história' que guia o usuário.",
  },
  {
    number: "03",
    icon: Palette,
    title: "UI premium",
    subtitle: "Sistema de componentes",
    description: "Visual consistente, microdecisões e componentes reaproveitáveis.",
  },
  {
    number: "04",
    icon: Code,
    title: "Construção",
    subtitle: "Refinamento técnico",
    description: "Implementação com padrão, performance e fidelidade ao design.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "Ajustes e validação",
    subtitle: "Evolução contínua",
    description: "Evolução orientada por uso real: cliques, funil, feedback e melhoria contínua.",
  },
];

const Process = () => {
  return (
    <section className="section-padding bg-card/50" id="processo">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading md:text-display-sm font-bold mb-4 animate-fade-up">
            Processo enxuto, profundo <span className="text-gradient-primary">e sem surpresa</span>
          </h2>
        </div>

        {/* Process steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />
          
          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col md:flex-row items-start gap-6 animate-fade-up ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                  <div className="glass-card p-6 md:p-8 inline-block">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className="text-sm font-medium text-primary-light">{step.number}</span>
                      <span className="text-xs text-muted-foreground">{step.subtitle}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Center icon */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full liquid-glass flex items-center justify-center z-10">
                  <step.icon className="w-6 h-6 text-primary-light" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Microcopy */}
        <p className="text-center text-muted-foreground mt-16 animate-fade-up">
          Checkpoints claros do início ao fim. Você sabe o que está acontecendo.
        </p>
      </div>
    </section>
  );
};

export default Process;
