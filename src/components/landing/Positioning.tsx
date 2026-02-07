const Positioning = () => {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(5_38%_22%_/_0.08)_0%,transparent_60%)]" />
      
      <div className="container-tight relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-heading md:text-display-sm font-bold mb-6 animate-fade-up">
            Não é sobre "fazer tela".
            <br />
            <span className="text-gradient-primary">É sobre construir confiança.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up delay-100">
            Quando a experiência é bem desenhada, o usuário entende, acredita e avança.
            <br className="hidden md:block" />
            Meu foco é fazer seu site/app não ser só bonito, mas{" "}
            <span className="text-foreground font-medium">vender, captar e fortalecer sua marca.</span>
          </p>

          {/* Visual element - Liquid glass card */}
          <div className="mt-16 liquid-glass rounded-3xl p-8 md:p-12 animate-fade-up delay-200">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-gradient-primary">VS</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Victor Santos — Product Designer & Full Stack Developer
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Positioning;
