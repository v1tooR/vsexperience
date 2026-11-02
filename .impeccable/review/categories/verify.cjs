const {chromium}=require('C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const {categories}=require('../../../scripts/catalog/categories.cjs');
const base='http://127.0.0.1:5173';
const origin='https://vsexperience.com.br';
const report={routes:[],screenshots:[],interaction:[],preservedPrices:[],sourceCoverage:{},errors:[]};
const names=fs.readFileSync('C:/Users/Usuario/Downloads/Produtos-Variados.md','utf8').split(/\r?\n/).filter(l=>l.startsWith('|')).slice(2).map(l=>l.split('|')[2].trim().replace(/\\/g,''));
const sourceItems=categories.flatMap(c=>c.services.filter(s=>!s.additional).map(s=>s.pt));
assert.equal(names.length,64);assert.equal(sourceItems.length,64);assert.deepEqual(names.filter(n=>!sourceItems.includes(n)),[]);
report.sourceCoverage={source:names.length,catalog:sourceItems.length,extraServices:categories.flatMap(c=>c.services.filter(s=>s.additional).map(s=>s.pt))};
const route=(c,en)=>en?'/en/services/'+c.enSlug+'/':'/servicos/'+c.id+'/';
const money=s=>(s.replace(/<div class="other-grid">[\s\S]*?<\/div>/g,'').match(/(?:R\$|US\$|\$)\s*[\d.,]+/g)||[]);
for(const f of ['servicos/landing-page/index.html','servicos/site-institucional/index.html','servicos/e-commerce/index.html','servicos/sistemas-saas/index.html','servicos/design-system/index.html','en/services/design-system/index.html']){
  const before=execFileSync('git',['show','HEAD:'+f],{cwd:root,encoding:'utf8'});
  assert.deepEqual(money(fs.readFileSync(path.join(root,f),'utf8')),money(before),'Prices changed: '+f);report.preservedPrices.push(f);
}
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({reducedMotion:'reduce'});
    const page=await context.newPage();
    const bad=[];
    page.on('pageerror',e=>bad.push(e.message));
    page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)bad.push(r.status()+' '+r.url());});
    for(const en of [false,true]){
      const routes=[{id:'hub',route:en?'/en/services/':'/servicos/'},...categories.map(c=>({id:c.id,route:route(c,en),c}))];
      for(const p of routes){
        const res=await page.goto(base+p.route,{waitUntil:'networkidle'});assert.equal(res.status(),200,p.route);
        await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async img=>{img.loading='eager';await img.decode();}));});
        assert.equal(await page.locator('h1').count(),1,p.route+' H1');
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),origin+p.route);
        const data=await page.evaluate(()=>({schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent)),ids:[...document.querySelectorAll('[id]')].map(x=>x.id),images:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src)}));
        assert.equal(new Set(data.ids).size,data.ids.length,'Duplicate IDs '+p.route);assert.equal(data.images.length,0,'Missing images '+p.route);
        if(p.c) assert.equal(await page.locator('.catalog-item').count(),p.c.services.length);
        else assert.equal(await page.locator('.hub-category-row').count(),7);
        const anchors=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(s=>s.startsWith('#')));
        for(const a of anchors)assert(await page.locator('[id="'+a.slice(1)+'"]').count(),'Broken anchor '+p.route+a);
        report.routes.push({route:p.route,services:p.c?.services.length||null,status:'pass'});
        if(!en){
          for(const [device,width,height] of [['desktop',1440,960],['mobile',390,844]]){
            await page.setViewportSize({width,height});await page.evaluate(()=>{window.scrollTo(0,0);document.querySelectorAll('.reveal,.compose').forEach(x=>x.classList.add('is-visible'));});await page.waitForTimeout(150);
            const overflow=await page.evaluate(()=>({body:document.documentElement.scrollWidth,inner:innerWidth}));
            assert(overflow.body<=width+1,JSON.stringify({route:p.route,device,overflow}));
            const file=path.join(__dirname,p.id+'-'+device+'.png');await page.screenshot({path:file,fullPage:true,animations:'disabled'});
            report.screenshots.push(file);
            await page.screenshot({path:path.join(__dirname,p.id+'-'+device+'-hero.png'),animations:'disabled'});
            if(device==='desktop')await page.screenshot({path:path.join(__dirname,p.id+'-hero.png'),animations:'disabled'});
            if(device==='mobile'&&p.c&&p.c.id!=='design-system'){
              for(let i=0;i<3;i++){
                await page.locator('[role=tab]').nth(i).click();
                await page.waitForTimeout(100);
                const clipping=await page.locator('.category-demo').evaluateAll(ds=>ds.filter(d=>d.getBoundingClientRect().height&&d.scrollHeight>d.clientHeight+2).map(d=>({scroll:d.scrollHeight,height:d.clientHeight})));
                assert.deepEqual(clipping,[],'Clipped demonstration: '+p.route+' tab '+i);
                if(i)await page.locator('.category-stage').screenshot({path:path.join(__dirname,p.id+'-panel-'+i+'-mobile.png'),animations:'disabled'});
              }
            }
          }
        }
        for(const width of [320,1024,1440]){
          await page.setViewportSize({width,height:900});
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow at '+width+': '+p.route);
        }
      }
    }
    await context.close();
    const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();
    for(const c of categories){await staticPage.goto(base+route(c,false));assert.equal(await staticPage.locator('.catalog-item summary').count(),c.services.length);await staticPage.locator('.catalog-item').nth(1).locator('summary').click();assert(await staticPage.locator('.catalog-item').nth(1).getAttribute('open')!==null);}
    report.interaction.push('All category catalogues work with JavaScript disabled');await nojs.close();
    const live=await browser.newContext({viewport:{width:1440,height:960}});const tab=await live.newPage();
    await tab.goto(base+'/servicos/ia-criativa/',{waitUntil:'networkidle'});
    await tab.locator('[role=tab]').first().focus();await tab.keyboard.press('ArrowRight');assert.equal(await tab.locator('[role=tab]').nth(1).getAttribute('aria-selected'),'true');await tab.keyboard.press('End');assert.equal(await tab.locator('[role=tab]').nth(2).getAttribute('aria-selected'),'true');await tab.keyboard.press('Home');assert.equal(await tab.locator('[role=tab]').first().getAttribute('aria-selected'),'true');
    report.interaction.push('Tabs support ArrowRight, Home and End with focus management');
    await tab.locator('[data-stage-pause]').click();assert.equal(await tab.locator('[data-stage-pause]').getAttribute('aria-pressed'),'true');await tab.mouse.move(10,900);await tab.locator('.hero-title').click();const selected=await tab.locator('[aria-selected=true]').getAttribute('id');await tab.waitForTimeout(5800);assert.equal(await tab.locator('[aria-selected=true]').getAttribute('id'),selected);report.interaction.push('Explicit pause stops automatic tab changes');
    await tab.goto(base+'/servicos/ia-criativa/#governanca-criativa');assert(await tab.locator('#governanca-criativa').getAttribute('open')!==null);report.interaction.push('Direct service anchors open the relevant native disclosure');
    const contact=await tab.locator('#governanca-criativa a').getAttribute('href');assert(decodeURIComponent(contact).includes('Governança criativa'));assert(decodeURIComponent(contact).includes('IA Criativa'));report.interaction.push('WhatsApp carries the chosen service and category');
    await live.close();
    assert.deepEqual(bad,[],'Browser errors and missing local assets');report.errors=bad;
    fs.writeFileSync(path.join(__dirname,'report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({routes:report.routes.length,coverage:report.sourceCoverage,screenshots:report.screenshots.length,interactions:report.interaction,priceFiles:report.preservedPrices.length,errors:report.errors},null,2));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
