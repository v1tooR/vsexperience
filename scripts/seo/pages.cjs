const origin = 'https://vsexperience.com.br';
const pages = [
  { path: '/', file: 'index.html', key: 'home', title: 'Criação de sites e UX/UI | Victor Santos · VS Experience', description: 'Estratégia, UX/UI e desenvolvimento de sites e produtos digitais. Conheça os projetos da VS Experience e a consultoria de Victor Santos.', heading: 'Design e tecnologia\npara o seu negócio.', sub: 'Estratégia · UX/UI · Desenvolvimento', label: 'Victor Santos · VS Experience' },
  { path: '/en/', file: 'en/index.html', key: 'home-en', title: 'Website development & UX/UI | Victor Santos · VS Experience', description: 'Strategy, UX/UI and website development with VS Experience. Explore digital projects, design systems and consulting with Victor Santos.', heading: 'Design and technology\nfor your business.', sub: 'Strategy · UX/UI · Development', label: 'Victor Santos · VS Experience', lang: 'en' },
  { path: '/servicos/', file: 'servicos/index.html', key: 'servicos', title: 'Serviços de design, IA e tecnologia | VS Experience', description: 'Design Digital, IA Criativa, Sites, Design System, Branding, Consultoria e Educação. Explore as categorias e encontre a entrega para seu negócio.', heading: 'Seu próximo projeto\ncomeça aqui.', sub: 'Design · IA · Sites · Marca · Conhecimento', label: 'Serviços de criação' },
  { path: '/servicos/landing-page/', file: 'servicos/landing-page/index.html', key: 'landing-page', title: 'Criação de landing page: preço e prazo | VS Experience', description: 'Criação de landing page com copy, design e desenvolvimento. Conheça o processo, o prazo de 10 a 15 dias úteis e as faixas de investimento da VS Experience.', heading: 'Uma oferta clara.\nUm próximo passo.', sub: 'Copy · Design · Desenvolvimento', label: 'Criação de landing page' },
  { path: '/servicos/site-institucional/', file: 'servicos/site-institucional/index.html', key: 'site-institucional', title: 'Criação de site institucional | VS Experience', description: 'Criação de site institucional para apresentar sua empresa e gerar oportunidades. Veja o processo, os prazos e as faixas de investimento da VS Experience.', heading: 'Sua empresa,\nbem apresentada.', sub: 'Estratégia · Design · Desenvolvimento', label: 'Criação de site institucional' },
  { path: '/servicos/e-commerce/', file: 'servicos/e-commerce/index.html', key: 'e-commerce', title: 'Criação de loja virtual e e-commerce | VS Experience', description: 'Criação de loja virtual com design, desenvolvimento e integrações definidas no escopo. Conheça o processo e as faixas de investimento da VS Experience.', heading: 'Uma loja pensada\npara a compra.', sub: 'Experiência · Design · Integrações', label: 'Criação de e-commerce' },
  { path: '/servicos/sistemas-saas/', file: 'servicos/sistemas-saas/index.html', key: 'sistemas-saas', title: 'Desenvolvimento de sistemas web e SaaS | VS Experience', description: 'Design e desenvolvimento de sistemas web e SaaS, do escopo às interfaces e integrações. Veja o processo e as faixas de investimento da VS Experience.', heading: 'Do fluxo de trabalho\nao produto digital.', sub: 'UX/UI · Desenvolvimento · Integrações', label: 'Sistemas web e SaaS' },
  { path: '/servicos/design-system/', file: 'servicos/design-system/index.html', key: 'design-system', title: 'Criação de design system: Figma e código | VS Experience', description: 'Design system com tokens, componentes e documentação para interfaces consistentes. Conheça as entregas em Figma e código e as faixas de investimento.', heading: 'Consistência para\no produto crescer.', sub: 'Tokens · Componentes · Documentação', label: 'Criação de design system' },
  { path: '/bio.html', file: 'bio.html', key: 'bio', title: 'Victor Santos: projetos e contato | VS Experience', description: 'Conheça Victor Santos, Product Designer e Design Engineer. Acesse projetos, redes sociais e contato para consultoria, UX/UI e desenvolvimento de sites.', heading: 'Victor Santos.', sub: 'Product Designer & Design Engineer', label: 'Projetos e contato' }
];
const { categories } = require('../catalog/categories.cjs');
for (const c of categories.filter(c=>c.id!=='design-system')) {
  for (const en of [false,true]) pages.push({
    path: en?'/en/services/'+c.enSlug+'/':'/servicos/'+c.id+'/',
    file: en?'en/services/'+c.enSlug+'/index.html':'servicos/'+c.id+'/index.html',
    key: 'category-'+c.id+(en?'-en':''), imageKey:'servicos', category:true,
    ...(en?{lang:'en'}:{}),
    title:(en?c.nameEn:c.name)+' · '+(en?'Services & solutions':'Serviços e soluções')+' | VS Experience',
    description:en?c.summaryEn+' Explore the services, process and examples. Discuss a scope for your business.':c.summary+' Conheça os serviços, o processo e os exemplos. Converse sobre o escopo para seu negócio.',
    heading:en?c.titleEn:c.title, sub:en?c.summaryEn:c.summary, label:en?c.nameEn:c.name
  });
}
pages.push({path:'/en/services/',file:'en/services/index.html',key:'servicos-en',imageKey:'servicos',lang:'en',title:'Design, AI and technology services | VS Experience',description:'Digital Design, Creative AI, Websites, Design System, Branding, Consulting and Education. Explore the categories and find the right service for your business.',heading:'Find your next step.',sub:'Design · AI · Websites · Brand · Learning',label:'Services'});
const english = [
  ['landing-page','landing-page','Landing page design: price and timeline | VS Experience',"Landing page design with copy, design and development. See the process, the 10 to 15 business day timeline and VS Experience's investment ranges."],
  ['institutional-website','site-institucional','Company website design | VS Experience',"Company website design to present your business and generate opportunities. See VS Experience's process, timelines and investment ranges."],
  ['e-commerce','e-commerce','Online store and e-commerce design | VS Experience',"Online store design with design, development and the integrations defined in the scope. See VS Experience's process and investment ranges."],
  ['saas-systems','sistemas-saas','Web systems and SaaS development | VS Experience',"Design and development of web systems and SaaS, from scope to interfaces and integrations. See VS Experience's process and investment ranges."],
  ['design-system','design-system','Design system creation: Figma and code | VS Experience','Design system with tokens, components and documentation for consistent interfaces. See the Figma and code deliverables and the investment ranges.']
];
for(const [slug,key,title,description] of english)pages.push({path:'/en/services/'+slug+'/',file:'en/services/'+slug+'/index.html',key:key+'-en',imageKey:key,lang:'en',title,description,heading:title.split(' | ')[0],sub:'Design · Development',label:'Services'});
for (const p of pages) { p.url = origin + p.path; p.image = origin + '/assets/images/og/' + (p.imageKey||p.key) + '-vs.jpg'; p.alt = p.label + ' — ' + p.heading.replace(/\n/g, ' '); }
module.exports = { origin, pages };
