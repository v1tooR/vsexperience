import { ArrowRight, BookOpen } from "lucide-react";

const BlogCTA = () => {
  return (
    <section className="section-padding bg-card/50">
      <div className="container-tight">
        <div className="liquid-glass rounded-3xl p-8 md:p-12 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary-light" />
          </div>
          
          <h2 className="text-heading font-bold mb-4">
            Bastidores de produto, <span className="text-gradient-primary">UX e crescimento</span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Eu escrevo sobre decisões reais: estrutura, UX/UI, conversão, performance 
            e evolução de produto — sem teoria vazia.
          </p>
          
          <a href="#blog" className="btn-secondary group inline-flex">
            Ir para o Blog
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
