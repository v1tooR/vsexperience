// Run: node scripts/catalog/build.cjs. The deployed site remains static HTML.
const fs = require('node:fs');
const path = require('node:path');
const { categories } = require('./categories.cjs');
const root = path.resolve(__dirname, '../..');
const origin = 'https://vsexperience.com.br';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const tr = (en, pt, english) => en ? english : pt;
const label = (c, en) => en ? c.nameEn : c.name;
const url = (c, en) => en ? `/en/services/${c.enSlug}/` : `/servicos/${c.id}/`;
const hub = en => en ? '/en/services/' : '/servicos/';
const home = en => en ? '/en/' : '/';
const write = (file, data) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), data, 'utf8'); };
const serviceSlugs = { 'landing-page': 'landing-page', 'site-institucional': 'institutional-website', 'e-commerce': 'e-commerce', 'sistemas-saas': 'saas-systems' };
const serviceUrl = (s, en) => en ? `/en/services/${serviceSlugs[s] || s}/` : `/servicos/${s}/`;
const wa = message => 'https://wa.me/5512991833641?text=' + encodeURIComponent(message);
const cases = {
  eleva: { name: 'Eleva Isenções', pt: 'Landing page · assessoria PCD', en: 'Landing page · professional services', href: 'https://elevaisencoes.com.br/' },
  costaflores: { name: 'Costa Flores', pt: 'Site institucional · mobiliário', en: 'Company website · furniture', href: 'https://costaflores.com.br/' },
  multivegetal: { name: 'Multi Vegetal', pt: 'E-commerce · fitocosméticos', en: 'E-commerce · plant-based cosmetics', href: 'https://multivegetal.com/' },
  inter: { name: 'Inter Store', pt: 'E-commerce · refinamento de UI e jornada', en: 'E-commerce · UI and journey refinement', href: 'https://www.interstore.com.br/' },
  facilorgapp: { name: 'Fácil Organização', pt: 'Produto próprio · em desenvolvimento', en: 'Our own product · in development', href: '/#cases' }
};

function catalog(c, en) {
  const message = name => tr(en, `Olá, Victor! Quero conversar sobre ${name}, na categoria ${c.name}. Meu objetivo é: `, `Hi Victor! I would like to discuss ${name}, in ${c.nameEn}. My goal is: `);
  const related = c.id === 'branding' || c.id === 'educacao' ? `<p class="category-related">${tr(en, 'Precisa de planejamento e gestão contínua das redes? Conheça a', 'Need ongoing social media planning and management? Explore')} <a class="text-link" href="/servicos/vs-social/">VS Social${en ? ' (Português)' : ''}</a>. ${tr(en, 'Gestão recorrente, sistema visual e templates são escopos diferentes.', 'Ongoing management, a visual system and templates have different scopes.')}</p>` : '';
  return `<section class="section category-catalog" id="especialidades" data-spy="especialidades" aria-labelledby="especialidades-titulo">
    <div class="container"><div class="catalog-intro"><h2 class="section-title reveal" id="especialidades-titulo">${tr(en, 'Encontre a entrega que faz sentido agora.', 'Find the right service for this moment.')}</h2><p class="reveal">${tr(en, 'Explore as especialidades. Podemos trabalhar uma necessidade específica ou conectar etapas no mesmo projeto. O escopo é definido antes de começar.', 'Explore the specialities. We can address a specific need or connect stages within one project. The scope is agreed before work starts.')}</p></div>
    <div class="catalog-list">${c.services.map((s, i) => `<details class="catalog-item" id="${s.id}"${i === 0 ? ' open' : ''}>
      <summary><h3>${esc(en ? s.en : s.pt)}</h3><span class="catalog-toggle" aria-hidden="true"></span></summary>
      <div class="catalog-detail"><p>${esc(en ? s.descriptionEn : s.description)}</p><a href="${s.href ? serviceUrl(s.href, en) : wa(message(en ? s.en : s.pt))}"${s.href ? '' : ' target="_blank" rel="noopener"'}>${tr(en, s.href ? 'Ver serviço e valores' : 'Conversar sobre esta entrega', s.href ? 'View service and pricing' : 'Discuss this service')}${arrow}</a></div>
    </details>`).join('\n')}</div>${related}</div></section>`;
}

function categoryNav(c, en) {
  return `<nav class="category-nav" aria-label="${tr(en, 'Outras categorias', 'Other categories')}">${categories.filter(x => !c || x.id !== c.id).map(x => `<a href="${url(x, en)}">${label(x, en)}${arrow}</a>`).join('')}</nav>`;
}

const list = rows => `<div class="demo-list">${rows.map(([a,b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>`;
function mockContent(c, en, i) {
  if (c.mock === 'product' && i === 2) return `<div class="category-demo product-demo"><div class="demo-bar"><strong>Fácil Organização</strong><span>${tr(en,'Produto próprio · em desenvolvimento','Our own product · in development')}</span></div><div class="demo-content"><h2>${tr(en,'Uma base para cinco módulos.','One foundation for five modules.')}</h2><p>${tr(en,'Uma linguagem compartilhada entre as partes do produto.','A shared language across the product.')}</p>${list(tr(en,[['Tarefas','Rotina e prioridades'],['Projetos','Etapas e entregas'],['Clientes','Contexto e contatos'],['Financeiro','Organização da operação'],['Notas','Informação acessível']],[['Tasks','Routine and priorities'],['Projects','Stages and deliverables'],['Clients','Context and contacts'],['Finances','Organising operations'],['Notes','Accessible information']]))}</div></div>`;
  if (c.images) {
    const key = c.images[i], p = cases[key];
    return `<figure><img src="/assets/images/cases/${key}.webp" alt="${esc(p.name + ' — ' + (en ? p.en : p.pt))}" width="1350" height="808"${i ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async"><figcaption><strong>${p.name}</strong><span>${en ? p.en : p.pt}</span></figcaption></figure>`;
  }
  const bar = (brand, text) => `<div class="demo-bar"><strong>${brand}</strong><span>${text}</span></div>`;
  if (c.mock === 'brand') {
    const top = bar('lume', tr(en, 'Estudo demonstrativo de marca', 'Demonstration brand study'));
    if (i === 0) return top + `<div class="brand-specimen"><div class="demo-overline"><span>${tr(en, 'Identidade essencial', 'Essential identity')}</span><span>${tr(en, 'Presença com intenção', 'Presence with intent')}</span></div><p class="brand-word">lume.</p><p class="demo-foot">${tr(en, 'Espaço para o que faz sentido.', 'Space for what matters.')}</p><div class="brand-palette"><span style="--swatch:#303e2b;--swatch-ink:#e9e4d7">${tr(en,'Floresta','Forest')}</span><span style="--swatch:#e9e4d7;--swatch-ink:#303e2b">${tr(en,'Areia','Sand')}</span><span style="--swatch:#d4b38d;--swatch-ink:#303e2b">${tr(en,'Argila','Clay')}</span></div></div>`;
    if (i === 1) return top + `<div class="demo-content"><h2>${tr(en, 'Uma voz próxima.<br>Uma mensagem clara.', 'An approachable voice.<br>A clear message.')}</h2><p class="brand-message">${tr(en, 'Espaço para o que faz sentido.', 'Space for what matters.')}</p>${list(tr(en, [['Personalidade', 'Clara, humana, atenta'], ['Escrita', 'Direta, com espaço para respirar']], [['Personality', 'Clear, human, thoughtful'], ['Writing', 'Direct, with room to breathe']]))}</div>`;
    return top + `<div class="brand-applications"><div class="brand-cover"><strong>lume.</strong><p>${tr(en,'O essencial encontra seu espaço.','The essential finds its space.')}</p><span>${tr(en, 'Caderno de marca', 'Brand workbook')}</span></div><div class="brand-post"><span>${tr(en, 'Um convite à presença', 'An invitation to be present')}</span><strong>${tr(en, 'Menos ruído.<br>Mais sentido.', 'Less noise.<br>More meaning.')}</strong><span>lume.</span></div></div>`;
  }
  if (c.mock === 'ai') {
    const top = bar(tr(en,'Fluxo criativo','Creative workflow'),tr(en,'Exemplo de processo','Example process'));
    if (i === 0) return top + `<div class="demo-content"><h2>${tr(en,'Onde a IA pode ajudar?','Where can AI help?')}</h2><p>${tr(en,'Partir da tarefa para escolher a ferramenta.','Start with the task to choose the tool.')}</p>${list(tr(en, [['Organizar o briefing', 'Estruturar contexto'], ['Explorar alternativas', 'Ampliar repertório'], ['Revisar a entrega', 'Critério humano']], [['Organise the brief', 'Structure the context'], ['Explore alternatives', 'Broaden possibilities'], ['Review the output', 'Human judgement']]))}<p class="demo-foot">${tr(en,'A oportunidade precisa fazer sentido na rotina.','The opportunity needs to make sense in daily work.')}</p></div>`;
    if (i === 1) return top + `<div class="demo-content"><h2>${tr(en,'Do briefing à revisão.','From brief to review.')}</h2><div class="workflow">${tr(en,[['Briefing','Objetivo e contexto'],['Organização','Estrutura da informação'],['Alternativas','Geração assistida'],['Revisão humana','Avaliação e decisão']],[['Brief','Goal and context'],['Organisation','Information structure'],['Alternatives','Assisted generation'],['Human review','Assessment and decision']]).map(([a,b], j)=>`<div style="--step:${j}"><b>${a}</b><span>${b}</span></div>`).join('')}</div><p class="demo-foot">${tr(en,'Exemplo ilustrativo. Sem envio de dados ou execução real.','Illustrative example. No data is sent or actually processed.')}</p></div>`;
    return top + `<div class="demo-content"><h2>${tr(en,'Um processo que o time entende.','A process the team understands.')}</h2>${list(tr(en,[['Entrada','Contexto e objetivo'],['Critérios','Clareza e adequação'],['Responsável','Pessoa revisora'],['Saída','Material avaliado']],[['Input','Context and goal'],['Criteria','Clarity and suitability'],['Owner','Human reviewer'],['Output','Reviewed material']]))}<p class="demo-foot">${tr(en,'Documentar faz parte de implementar.','Documentation is part of implementation.')}</p></div>`;
  }
  if (c.mock === 'consult') {
    const top = bar(tr(en,'Leitura de experiência','Experience review'),tr(en,'Exemplo de diagnóstico','Example diagnosis'));
    if (i === 0) return top + `<div class="demo-content"><div class="report-title"><h2>${tr(en,'O caminho até o contato.','The path to an enquiry.')}</h2><span class="report-stamp">${tr(en,'Observação','Observation')}</span></div>${list(tr(en,[['Mensagem inicial','A oferta está clara?'],['Jornada','O próximo passo aparece?'],['Confiança','As dúvidas têm resposta?']],[['Opening message','Is the offer clear?'],['Journey','Is the next step visible?'],['Trust','Are questions answered?']]))}<p class="demo-foot">${tr(en,'Perguntas para orientar a leitura de uma experiência.','Questions to guide an experience review.')}</p></div>`;
    if (i === 1) return top + `<div class="demo-content"><h2>${tr(en,'O que merece atenção primeiro?','What needs attention first?')}</h2><div class="priority-note"><b>${tr(en,'Tornar o contato encontrável','Make contact easy to find')}</b><span>${tr(en,'Exemplo de recomendação priorizada','Example prioritised recommendation')}</span></div>${list(tr(en,[['Clareza da oferta','Revisar a mensagem'],['Próxima ação','Explicitar o caminho'],['Conteúdo de apoio','Responder às dúvidas']],[['Offer clarity','Review the message'],['Next action','Make the path explicit'],['Supporting content','Answer questions']]))}</div>`;
    return top + `<div class="demo-content"><h2>${tr(en,'Uma sequência para agir.','A sequence for action.')}</h2><p>${tr(en,'Prioridades com contexto e dependências visíveis.','Priorities with clear context and dependencies.')}</p><div class="roadmap-track">${tr(en,[['Agora','Alinhar objetivo e mensagem.'],['Em seguida','Ajustar os caminhos da jornada.'],['Depois','Avaliar o uso e revisar prioridades.']],[['Now','Align goals and message.'],['Next','Adjust the journey’s paths.'],['Later','Assess usage and revisit priorities.']]).map(([a,b])=>`<div><b>${a}</b><p>${b}</p></div>`).join('')}</div><p class="demo-foot">${tr(en,'Sequência demonstrativa, sem prazo ou resultado prometido.','Example sequence, without promised timelines or results.')}</p></div>`;
  }
  const titles = tr(en, ['IA para<br>designers.', 'Design<br>System.', 'Seu próximo<br>passo.'], ['AI for<br>designers.', 'Design<br>System.', 'Your next<br>step.']);
  const lessons = tr(en,
    [[['Contexto','O problema antes do prompt'],['Prática','Explorar uma tarefa real'],['Revisão','Avaliar a qualidade da saída']],[['Fundamentos','Tokens e linguagem comum'],['Componentes','Estados e comportamento'],['Adoção','Uso e documentação']],[['Desafio','Entender seu momento'],['Direção','Explorar caminhos possíveis'],['Ação','Definir próximos passos']]],
    [[['Context','The problem before the prompt'],['Practice','Explore an actual task'],['Review','Assess output quality']],[['Foundations','Tokens and shared language'],['Components','States and behaviour'],['Adoption','Usage and documentation']],[['Challenge','Understand your situation'],['Direction','Explore possible approaches'],['Action','Define next steps']]]);
  return bar(tr(en,'Caderno de aprendizagem','Learning workbook'),tr(en,'Programa demonstrativo','Example programme')) + `<div class="lesson-layout"><div class="lesson-cover"><span>${tr(en,'Conhecimento em prática','Knowledge in practice')}</span><strong>${titles[i]}</strong><span>Victor Santos · VS</span></div><div class="lesson-content"><h2>${tr(en,'Aprender fazendo.','Learn by doing.')}</h2>${list(lessons[i])}</div></div>`;
}

function stage(c, en) {
  const tabs = en ? c.tabsEn : c.tabs;
  return `<div class="stage category-stage ${c.images ? 'case-stage' : ''}" role="group" aria-label="${esc(tr(en, c.images ? 'Projetos relacionados a ' + c.name : 'Demonstração ilustrativa de ' + c.name, c.images ? 'Projects related to ' + c.nameEn : 'Illustrative demonstration of ' + c.nameEn))}">
  <p class="demo-label">${tr(en, c.images ? 'Projetos reais · explore os exemplos' : 'Demonstração ilustrativa · explore as etapas', c.images ? 'Real projects · explore examples' : 'Illustrative demonstration · explore the stages')}</p>
  <div class="stage-inner">${c.images ? '' : `<div class="category-demo ${c.mock}-demo">`}${tabs.map((t,i)=>`<div class="mock-page" id="demo-${i}" role="tabpanel" aria-labelledby="tab-${i}" tabindex="0"${i ? ' hidden' : ''}>${mockContent(c,en,i)}</div>`).join('')}${c.images ? '' : '</div>'}</div>
  <div class="mockup-tabs" role="tablist" aria-label="${tr(en,'Vistas da demonstração','Demonstration views')}">${tabs.map((t,i)=>`<button type="button" class="mockup-tab" role="tab" id="tab-${i}" aria-controls="demo-${i}" aria-selected="${i===0}" tabindex="${i ? -1 : 0}">${t}</button>`).join('')}</div>
  <button type="button" class="stage-pause" data-stage-pause aria-pressed="false" aria-label="${tr(en,'Pausar apresentação automática','Pause automatic presentation')}" data-pause-label="${tr(en,'Pausar apresentação automática','Pause automatic presentation')}" data-play-label="${tr(en,'Retomar apresentação automática','Resume automatic presentation')}"><svg class="pause-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg><svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 4 12 8-12 8Z"/></svg></button></div>`;
}

function schema(c, en) {
  const current = origin + url(c,en);
  return { '@context':'https://schema.org', '@graph':[
    { '@type':'CollectionPage', '@id':current+'#page', url:current, name:label(c,en)+' | VS Experience', description:en?c.summaryEn:c.summary, inLanguage:en?'en':'pt-BR', mainEntity:{'@id':current+'#catalog'} },
    { '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'VS Experience', item:origin+home(en) },{ '@type':'ListItem', position:2, name:tr(en,'Serviços','Services'), item:origin+hub(en) },{ '@type':'ListItem', position:3, name:label(c,en), item:current }] },
    { '@type':'OfferCatalog', '@id':current+'#catalog', name:label(c,en), itemListElement:c.services.map(s=>({ '@type':'Service', name:en?s.en:s.pt, description:en?s.descriptionEn:s.description, url:current+'#'+s.id })) }
  ]};
}

function page(c,en) {
  const asset = en ? '../../../' : '../../';
  const shared = asset+'servicos/assets/';
  const title = label(c,en)+' · '+tr(en,'Serviços e soluções','Services & solutions')+' | VS Experience';
  const description = en?c.summaryEn+' Explore the services, process and examples. Discuss a scope for your business.':c.summary+' Conheça os serviços, o processo e os exemplos. Converse sobre o escopo para seu negócio.';
  const message = tr(en,`Olá, Victor! Vi a categoria ${c.name} e quero conversar sobre meu projeto. Meu objetivo é: `,`Hi Victor! I explored ${c.nameEn} and would like to discuss my project. My goal is: `);
  const proofImage = c.images ? `<figure class="case-media reveal" style="margin:0"><img src="${asset}assets/images/cases/${c.images[0]}.webp" width="1350" height="808" alt="${esc(cases[c.images[0]].name+' — '+(en?cases[c.images[0]].en:cases[c.images[0]].pt))}" loading="lazy" decoding="async"></figure>` : `<div class="reveal"><h3>${tr(en,'Veja o raciocínio, não só a entrega.','See the thinking behind the work.')}</h3><p>${tr(en,'Entender as etapas ajuda a escolher o escopo. Explore a demonstração no início da página e converse sobre o contexto da sua equipe.', 'Understanding the stages helps you choose a scope. Explore the demonstration at the top of the page and discuss your team’s context.')}</p><a class="text-link" href="#inicio">${tr(en,'Explorar a demonstração','Explore the demonstration')}</a></div>`;
  return `<!DOCTYPE html>
<html lang="${en?'en':'pt-BR'}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#efefef"><meta name="author" content="Victor Santos"><meta name="robots" content="index, follow, max-image-preview:large">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${origin+url(c,en)}"><link rel="alternate" hreflang="pt-BR" href="${origin+url(c,false)}"><link rel="alternate" hreflang="en" href="${origin+url(c,true)}"><link rel="alternate" hreflang="x-default" href="${origin+url(c,false)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="VS Experience"><meta property="og:locale" content="${en?'en_US':'pt_BR'}"><meta property="og:url" content="${origin+url(c,en)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${origin}/assets/images/og/servicos-vs.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="VS Experience · ${tr(en,'Serviços de design e tecnologia','Design and technology services')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/assets/images/og/servicos-vs.jpg">
<link rel="icon" href="${asset}assets/images/brand/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${asset}assets/images/brand/apple-touch-icon.png">
<link rel="preload" href="${asset}assets/fonts/roboto-flex-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${asset}assets/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>@font-face{font-family:'Roboto Flex';font-style:normal;font-weight:100 1000;font-stretch:25% 151%;font-display:swap;src:url(${asset}assets/fonts/roboto-flex-latin.woff2) format('woff2')}@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 700;font-display:swap;src:url(${asset}assets/fonts/plus-jakarta-sans-latin.woff2) format('woff2')}</style>
<script>if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ready');</script>
<link rel="stylesheet" href="${shared}servicos.css?v=dd113124"><link rel="stylesheet" href="${shared}categorias.css?v=20261023">
<script type="application/ld+json">${JSON.stringify(schema(c,en),null,2)}</script></head>
<body class="category-page" data-whatsapp="${esc(message)}">
<a class="skip-link" href="#conteudo">${tr(en,'Pular para o conteúdo','Skip to content')}</a><div class="read-progress" id="readProgress" aria-hidden="true"></div>
<header class="site-header" id="siteHeader"><div class="container nav-wrap"><a class="brand" href="${home(en)}" aria-label="VS Experience · ${tr(en,'Página inicial','Home')}"><img src="${asset}assets/images/brand/logotipo-grafite.svg" alt="Victor Santos" width="198" height="24"></a><nav class="client-chip" aria-label="${tr(en,'Trilha de navegação','Breadcrumb')}"><a href="${hub(en)}">${tr(en,'Serviços','Services')}</a> · <span aria-current="page">${label(c,en)}</span></nav>
<div class="lang-switch" role="group" aria-label="${tr(en,'Idioma','Language')}"><a href="${url(c,false)}" lang="pt-BR" hreflang="pt-BR"${en?'':' aria-current="true"'}>PT</a><a href="${url(c,true)}" lang="en" hreflang="en"${en?' aria-current="true"':''}>EN</a></div>
<nav class="nav-links" aria-label="${tr(en,'Navegação da página','Page navigation')}"><a href="#especialidades" data-spy-link="especialidades">${tr(en,'Serviços','Services')}</a><a href="#processo" data-spy-link="processo">${tr(en,'Processo','Process')}</a><a href="#escopo" data-spy-link="escopo">${tr(en,'Escopo','Scope')}</a><a class="nav-cta" href="#contato">${tr(en,'Conversar','Let’s talk')}${arrow}</a></nav></div></header>
<main id="conteudo">
<section class="hero" id="inicio"><div class="container"><p class="svc-word" data-svc-word>${label(c,en)}</p></div><div class="container hero-layout"><div class="hero-copy"><h1 class="hero-title"><span class="context-line">${label(c,en)} · VS Experience</span><span class="display">${esc(en?c.titleEn:c.title)}</span></h1><p class="hero-lead">${en?c.leadEn:c.lead}</p><div class="hero-actions"><a class="button button-primary" href="#especialidades">${tr(en,'Explorar os serviços','Explore the services')}${arrow}</a><a class="button button-secondary" href="${wa(message)}" data-whatsapp target="_blank" rel="noopener">${tr(en,'Conversar sobre meu projeto','Discuss my project')}</a></div><div class="hero-note">${check}<span>${en?c.noteEn:c.note}</span></div></div>${stage(c,en)}</div></section>
${catalog(c,en)}
<section class="section anatomy" id="processo" data-spy="processo" aria-labelledby="processo-titulo"><div class="container"><div class="anatomy-head"><h2 class="section-title reveal" id="processo-titulo">${en?c.questionEn:c.question}</h2><p class="reveal">${en?c.fitEn:c.fit}</p></div><ol class="category-method">${(en?c.stepsEn:c.steps).map(([a,b])=>`<li class="reveal"><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol></div></section>
<section class="section category-proof" id="exemplos" aria-labelledby="exemplos-titulo"><div class="container"><div class="section-head"><h2 class="section-title reveal" id="exemplos-titulo">${en?c.proofTitleEn:c.proofTitle}</h2></div><div class="case-grid">${proofImage}<div class="case-copy reveal"><h3>${tr(en,c.images?'O contexto faz parte do projeto.':'Uma demonstração para entender o formato.',c.images?'Context is part of the project.':'A demonstration to understand the format.')}</h3><p>${en?c.proofEn:c.proof}</p>${c.cases.length?`<div class="proof-links">${c.cases.map(k=>`<a href="${k==='facilorgapp'?home(en)+'#cases':cases[k].href}"${k==='facilorgapp'?'':' target="_blank" rel="noopener"'}>${cases[k].name}${arrow}</a>`).join('')}</div>`:''}</div></div></div></section>
<section class="section" id="escopo" data-spy="escopo" aria-labelledby="escopo-titulo"><div class="container scope-panel"><div><h2 class="section-title reveal" id="escopo-titulo">${tr(en,'O escopo acompanha a necessidade.','The scope follows the need.')}</h2><p>${tr(en,'Você não precisa contratar tudo. A conversa inicial ajuda a escolher as entregas, o formato de trabalho e as dependências do projeto. Prazo e investimento são definidos na proposta.', 'You do not need to commission everything. The initial conversation helps choose deliverables, working format and project dependencies. Timeline and investment are defined in the proposal.')}</p></div><div class="pay-rows"><div class="pay-row"><span>${tr(en,'Entregas','Deliverables')}</span><strong>${tr(en,'Uma especialidade ou etapas conectadas','One speciality or connected stages')}</strong></div><div class="pay-row"><span>${tr(en,'Investimento','Investment')}</span><strong>${tr(en,'Conforme escopo e proposta','Based on scope and proposal')}</strong></div><div class="pay-row"><span>${tr(en,'Prazo','Timeline')}</span><strong>${tr(en,'Combinado antes de começar','Agreed before work starts')}</strong></div><div class="pay-row"><span>${tr(en,'Responsabilidades','Responsibilities')}</span><strong>${tr(en,'Participação do time e de parceiros definida no projeto','Team and partner involvement defined per project')}</strong></div>${c.id==='sites'?`<div class="pay-row"><span>${tr(en,'Referências atuais','Current references')}</span><strong><a class="text-link" href="${serviceUrl('landing-page',en)}#investimento">${tr(en,'Landing page','Landing page')}</a> · <a class="text-link" href="${serviceUrl('site-institucional',en)}#investimento">${tr(en,'Institucional','Company site')}</a> · <a class="text-link" href="${serviceUrl('e-commerce',en)}#investimento">E-commerce</a></strong></div>`:''}</div></div></section>
<section class="closing" id="contato" aria-labelledby="contato-titulo"><canvas class="closing-canvas" data-gradient="cortina" data-curtain="300" aria-hidden="true"></canvas><div class="grain" aria-hidden="true"></div><div class="container"><div class="closing-grid"><div class="closing-copy reveal"><h2 class="closing-title" id="contato-titulo">${tr(en,'Qual é o seu próximo passo?','What is your next step?')} <span>${tr(en,'Vamos encontrar o caminho.','Let’s find the way forward.')}</span></h2><p>${tr(en,'Me conte seu contexto e o que você quer alcançar. A partir disso, definimos as entregas que fazem sentido para este momento.', 'Tell me about your context and what you want to achieve. We will define the services that make sense for this moment.')}</p><div class="closing-actions"><a class="button button-primary" href="${wa(message)}" data-whatsapp target="_blank" rel="noopener">${tr(en,'Conversar no WhatsApp','Chat on WhatsApp')}${arrow}</a><button class="button button-secondary" type="button" id="copyLink">${tr(en,'Copiar link','Copy link')}</button></div></div><div class="proposal-meta reveal"><div class="meta-row"><span>${tr(en,'Categoria','Category')}</span><strong>${label(c,en)}</strong></div><div class="meta-row"><span>WhatsApp</span><strong>(12) 99183-3641</strong></div><div class="meta-row"><span>${tr(en,'Portfólio','Portfolio')}</span><strong><a class="text-link" href="${home(en)}#cases">${tr(en,'Conhecer os projetos','Explore the projects')}</a></strong></div></div></div>
<a class="category-return" href="${hub(en)}">${tr(en,'Ver todas as categorias','Explore all categories')}${arrow}</a>${categoryNav(c,en)}<div class="signature"><img src="${asset}assets/images/brand/logotipo-linho.svg" alt="Victor Santos · VS Experience" width="198" height="24" loading="lazy"><span>${tr(en,'Estratégia, design e tecnologia.','Strategy, design and technology.')}</span><span>${tr(en,'Escopo definido com você.','Scope defined together.')}</span></div></div></section>
</main><div class="toast" id="toast" role="status" aria-live="polite">${check}${tr(en,'Link copiado','Link copied')}</div>
<script src="${asset}assets/js/vendor/lenis.min.js?v=06586536"></script><script src="${asset}assets/js/vs-gradient.js?v=ccf7558b"></script><script src="${shared}servicos.js?v=20261023"></script><script src="${shared}categorias.js?v=20261023"></script></body></html>`;
}

function editHead(source, title, description) {
  return source.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(">)/g, (_,a,b)=>a+esc(description)+b)
    .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(">)/g,(_,a,b)=>a+esc(title)+b);
}

function enhanceDS(en) {
  const c = categories.find(c=>c.id==='design-system');
  const file = en?'en/services/design-system/index.html':'servicos/design-system/index.html';
  let source = fs.readFileSync(path.join(root,file),'utf8');
  source = source.replace(/<body(?![^>]*class=)/, '<body class="category-ds"');
  if (en) source = source.replace(/(<a class="nav-cta" href="#contato"><span>)[\s\S]*?(<\/span>)/, '$1Let’s talk$2');
  source = source.replace(/\s*<section class="section category-catalog"[\s\S]*?<\/section>/g,'');
  source = source.replace(/(\s*<section[^>]*id="servico")/, '\n'+catalog(c,en)+'$1');
  if (!source.includes('id="especialidades"')) throw new Error('DS insertion point missing: '+file);
  if (!source.includes('categorias.css')) source = source.replace('</head>',`<link rel="stylesheet" href="${en?'../../../servicos':'..'}/assets/categorias.css?v=20261023"></head>`);
  if (!source.includes('categorias.js')) source = source.replace('</body>',`<script src="${en?'../../../servicos':'..'}/assets/categorias.js?v=20261023"></script></body>`);
  source = source.replace(/(<a href=")#servico(" data-spy-link=")servico(">)[\s\S]*?<\/a>/,`$1#especialidades$2especialidades$3${tr(en,'Serviços','Services')}</a>`);
  source = source.includes('<nav class="category-nav"')
    ? source.replace(/<nav class="category-nav"[\s\S]*?<\/nav>/, categoryNav(c,en))
    : source.replace(/<div class="other-grid">[\s\S]*?<\/div>/, categoryNav(c,en));
  source = source.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(_,a,json,b)=>{
    const graph=JSON.parse(json); const nodes=graph['@graph']||[graph];
    const existing=nodes.find(x=>x['@type']==='Service');
    if(existing) existing.hasOfferCatalog=schema(c,en)['@graph'][2];
    return a+'\n'+JSON.stringify(graph,null,2)+'\n'+b;
  });
  write(file,source);
}

function enhanceHub(en) {
  const file = en?'en/services/index.html':'servicos/index.html';
  let source=fs.readFileSync(path.join(root,file),'utf8');
  const title=tr(en,'Serviços de design, IA e tecnologia | VS Experience','Design, AI and technology services | VS Experience');
  const description=tr(en,'Design Digital, IA Criativa, Sites, Design System, Branding, Consultoria e Educação. Explore as categorias e encontre a entrega para seu negócio.','Digital Design, Creative AI, Websites, Design System, Branding, Consulting and Education. Explore the categories and find the right service for your business.');
  source=editHead(source,title,description);
  if(!source.includes('categorias.css')) source=source.replace('</head>',`<link rel="stylesheet" href="${en?'../../servicos/':'assets/'}${en?'assets/':''}categorias.css?v=20261023"></head>`);
  if(!source.includes('categorias.js')) source=source.replace('</body>',`<script src="${en?'../../servicos/assets/':'assets/'}categorias.js?v=20261023"></script></body>`);
  source=source.replace(/(<span class="client-chip">)[\s\S]*?(<\/span>)/,`$1${tr(en,'Serviços · sete categorias','Services · seven categories')}$2`);
  source=source.replace(/(<p class="hero-lead">)[\s\S]*?(<\/p>)/,`$1${tr(en,'Da estratégia à execução, encontre o caminho para sua marca, seu produto ou sua equipe. Explore as categorias, conheça as especialidades e converse sobre o escopo do seu projeto.','From strategy to implementation, find the right approach for your brand, product or team. Explore the categories and specialities, then discuss your project’s scope.')}$2`);
  source=source.replace(/(<div class="hero-note">[\s\S]*?<span>)[\s\S]*?(<\/span>)/,`$1${tr(en,'Uma entrega específica ou etapas conectadas no mesmo projeto.','A specific service or connected stages in one project.')}$2`);
  source=source.replace(/(<div class="hub-note"[^>]*>)[\s\S]*?(<\/div>)/,`$1<strong>${tr(en,'7 categorias','7 categories')}</strong><span>${tr(en,'encontre seu próximo passo','find your next step')}</span>$2`);
  source=source.replace(/(<p class="section-lead reveal delay-1">)[\s\S]*?(<\/p>)/,`$1${tr(en,'Fortalecer sua marca, desenhar um produto, aplicar IA ou desenvolver seu time? Escolha uma categoria para conhecer os serviços, as possibilidades e o processo.','Strengthen your brand, design a product, apply AI or develop your team? Choose a category to explore the services, possibilities and process.')}$2`);
  source=source.replace(/<ol class="svc-list">[\s\S]*?<\/ol>/,`<ol class="svc-list">${categories.map(c=>`<li class="reveal"><a class="svc-row hub-category-row" href="${url(c,en)}" data-glow data-category-name="${label(c,en)}"${c.images?` data-preview="/assets/images/cases/peek/${c.images[0]}.webp"`:''}><span class="svc-name"><strong>${label(c,en)}</strong><small>${en?c.summaryEn:c.summary}</small></span><span class="svc-meta"><small>${tr(en,'Especialidades','Specialities')}</small>${c.services.map(s=>en?s.en:s.pt).slice(0,3).join(' · ')}</span><span class="svc-arrow">${arrow}</span></a></li>`).join('')}</ol>`);
  source=source.replace(/(<p class="section-lead reveal delay-2">)[\s\S]*?(<\/p>)/,`$1${tr(en,'As páginas de Landing Page, Site Institucional, E-commerce e Sistemas e SaaS mantêm as referências atuais de propostas. Em Design System, a referência é uma estimativa de horas. Nas demais especialidades, prazo e investimento são definidos conforme o escopo.','The Landing Page, Company Website, E-commerce and Systems & SaaS pages retain their current proposal-based references. Design System uses an hourly estimate. For other specialities, timeline and investment are scoped individually.')}$2`);
  source=source.replace(/(<div class="meta-row"><span>(?:Serviços|Services)<\/span><strong>)[\s\S]*?(<\/strong>)/,`$1${tr(en,'7 categorias, da estratégia à execução','7 categories, from strategy to implementation')}$2`);
  if(!source.includes('category-preview-label')) source=source.replace('<div class="preview-tokens">',`<p class="category-preview-label" aria-hidden="true"></p><div class="preview-tokens">`);
  source=source.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'CollectionPage','@id':origin+hub(en)+'#page',url:origin+hub(en),name:title,description,inLanguage:en?'en':'pt-BR',mainEntity:{'@type':'ItemList',itemListElement:categories.map((c,i)=>({'@type':'ListItem',position:i+1,name:label(c,en),url:origin+url(c,en)}))}}]},null,2)}</script>`);
  write(file,source);
}

function enhanceHome(en) {
  const file=en?'en/index.html':'index.html';
  let source=fs.readFileSync(path.join(root,file),'utf8');
  source=source.replace(/<ul class="front__services">[\s\S]*?<\/ul>/,`<ul class="front__services">${categories.map(c=>`<li><a href="${url(c,en)}"><span class="front__service-copy"><span>${label(c,en)}</span><small>${en?c.summaryEn:c.summary}</small></span><svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.75 4.5h5.75v5.75"/></svg></a></li>`).join('')}</ul>`);
  source=source.replace(/(<p class="front__role" data-i18n="fronts.b.role">)[\s\S]*?(<\/p>)/,`$1${tr(en,'Design, tecnologia e conhecimento','Design, technology and knowledge')}$2`);
  source=source.replace(/(<p class="front__lede" data-i18n="fronts.b.lede">)[\s\S]*?(<\/p>)/,`$1${tr(en,'Da estratégia à execução, conecto design e tecnologia ao objetivo do seu negócio. Explore as categorias para encontrar uma entrega específica ou combinar etapas no mesmo projeto.','From strategy to implementation, I connect design and technology to your business goal. Explore the categories to find a specific service or combine stages within one project.')}$2`);
  write(file,source);
}

for(const en of [false,true]) {
  for(const c of categories) {
    if(c.id==='design-system') enhanceDS(en);
    else write(url(c,en).slice(1)+'index.html',page(c,en));
  }
  enhanceHub(en);
  enhanceHome(en);
}

// Existing English pages had local font URLs resolving under /en/assets/.
for (const file of ['en/services/index.html', 'en/services/design-system/index.html', ...Object.values(serviceSlugs).map(s=>'en/services/'+s+'/index.html')]) {
  const source = fs.readFileSync(path.join(root,file),'utf8');
  write(file, source.replace(/url\((?:\.\.\/)+assets\/fonts\//g, 'url(/assets/fonts/'));
}

// Register all ready category routes and existing English service routes without dropping old URLs.
const sitemapFile=path.join(root,'sitemap.xml');
let sitemap=fs.readFileSync(sitemapFile,'utf8');
const ready = [...categories.flatMap(c=>[url(c,false),url(c,true)]), hub(true), ...Object.values(serviceSlugs).map(s=>'/en/services/'+s+'/')];
for(const route of ready) {
  if(sitemap.includes('<loc>'+origin+route+'</loc>')) continue;
  const c=categories.find(c=>url(c,false)===route||url(c,true)===route);
  const alternate=c?`<xhtml:link rel="alternate" hreflang="pt-BR" href="${origin+url(c,false)}"/><xhtml:link rel="alternate" hreflang="en" href="${origin+url(c,true)}"/>`:'';
  sitemap=sitemap.replace('</urlset>',`  <url><loc>${origin+route}</loc><lastmod>2026-10-23</lastmod>${alternate}</url>\n</urlset>`);
}
const changedRoutes = new Set([home(false),home(true),hub(false),hub(true),...categories.flatMap(c=>[url(c,false),url(c,true)])].map(route=>origin+route));
sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/g, block => {
  const location = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  if(!changedRoutes.has(location)) return block;
  block = block.replace(/<lastmod>.*?<\/lastmod>/, '<lastmod>2026-10-23</lastmod>');
  const c = categories.find(c=>origin+url(c,false)===location||origin+url(c,true)===location);
  if(c&&!block.includes('hreflang=')) block=block.replace('</url>',`<xhtml:link rel="alternate" hreflang="pt-BR" href="${origin+url(c,false)}"/><xhtml:link rel="alternate" hreflang="en" href="${origin+url(c,true)}"/></url>`);
  return block;
});
write('sitemap.xml',sitemap);
write('config/sitemap.xml',sitemap);
console.log('Built 7 categories in PT/EN; updated the hubs, home links and sitemap. Existing service prices preserved.');

module.exports = { catalog, categories };
