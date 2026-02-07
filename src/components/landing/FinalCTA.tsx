import { ArrowRight, MessageCircle } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="section-padding relative overflow-hidden" id="contato">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(5_38%_22%_/_0.2)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(5_38%_22%_/_0.15)_0%,transparent_70%)]" />
      
      <div className="container-tight relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-heading md:text-display-sm font-bold mb-6 animate-fade-up">
            Quer elevar o padrão do seu produto
            <br />
            <span className="text-gradient-primary">e transformar isso em resultado?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-4 animate-fade-up delay-100">
            Me mande: <span className="text-foreground">o que você vende, pra quem e qual o objetivo.</span>
          </p>
          
          <p className="text-muted-foreground mb-10 animate-fade-up delay-200">
            Eu te respondo com um caminho claro do que faria primeiro — e como conduziria a construção.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <a href="#" className="btn-primary group animate-pulse-glow">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversar agora
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#portfolio" className="btn-secondary">
              Ver todos os projetos
            </a>
          </div>

          {/* Final microcopy */}
          <p className="text-sm text-muted-foreground mt-12 animate-fade-up delay-400">
            Sem achismo. Sem enrolação. Decisão bem feita + execução de verdade.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
