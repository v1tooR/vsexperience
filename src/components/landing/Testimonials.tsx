import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Victor entregou exatamente o que precisávamos: clareza na proposta e execução impecável. O resultado foi um produto que nossos usuários amam.",
    name: "Cliente G4",
    segment: "Educação",
  },
  {
    quote: "Profissionalismo e atenção aos detalhes impressionantes. Cada entrega superou as expectativas e o impacto na conversão foi imediato.",
    name: "Cliente Costa Flores",
    segment: "Paisagismo",
  },
  {
    quote: "Finalmente encontrei alguém que entende de negócio e de design. Victor transformou nossa ideia em um produto real com qualidade premium.",
    name: "Cliente Casa Floresta",
    segment: "Arquitetura",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-card/30">
      <div className="container-tight">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading md:text-display-sm font-bold mb-4 animate-fade-up">
            O que clientes dizem <span className="text-gradient-primary">(na prática)</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card p-8 group hover:scale-[1.02] transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-light">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.segment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Microcopy */}
        <p className="text-center text-muted-foreground mt-12 text-sm animate-fade-up">
          Sem texto genérico — preferencialmente prints reais.
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
