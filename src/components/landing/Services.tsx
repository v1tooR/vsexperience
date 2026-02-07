import { Layout, BarChart3, Target, Layers, Code2 } from "lucide-react";

const services = [
  {
    icon: Layout,
    title: "Produto digital (SaaS / MVP / Plataforma)",
    description: "Fluxos, UI e estrutura para lançar com clareza e evoluir com consistência.",
    gridClass: "col-span-12 md:col-span-7",
  },
  {
    icon: BarChart3,
    title: "Dashboards e sistemas internos",
    description: "Interfaces que organizam dados, reduzem atrito e aceleram decisões.",
    gridClass: "col-span-12 md:col-span-5",
  },
  {
    icon: Target,
    title: "Experiências de conversão",
    description: "Narrativa + prova + CTA no timing certo — sem 'página bonita que não move'.",
    gridClass: "col-span-12 md:col-span-5",
  },
  {
    icon: Layers,
    title: "Design system leve + componentes",
    description: "Padrões reaproveitáveis para manter velocidade e coerência no crescimento.",
    gridClass: "col-span-12 md:col-span-4",
  },
  {
    icon: Code2,
    title: "Execução técnica com padrão",
    description: "Do protótipo ao produto real — sem perder intenção no caminho.",
    gridClass: "col-span-12 md:col-span-3",
  },
];

const Services = () => {
  return (
    <section className="section-padding" id="servicos">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading md:text-display-sm font-bold mb-4 animate-fade-up">
            O que eu entrego <span className="text-gradient-primary">na prática</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`bento-item ${service.gridClass} animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary-light" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
