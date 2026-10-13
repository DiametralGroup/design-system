#!/usr/bin/env node
/* Regenerates css/components/*.css from @diametral/ui (incoming is the model,
   docs/absorption/direction.md). For each target stylesheet: incoming's file(s)
   first — slots mapped to --ds-* through incoming's own :root, @layer kept,
   `.dark` widened to the three dark conventions this package supports — then
   the rules incoming does not define, kept as DiametralGroup additions.

   A target-only rule that names only incoming classes restyles incoming's own
   markup, so it is dropped (incoming wins), unless it reaches the 0.x
   plain-HTML grammar incoming never renders. Classes both markups share get a
   zero-specificity :where(:not(:has(> legacy))) guard on incoming's rules.

   A rule directly under a comment containing "fix-forward" is kept even when it
   restyles incoming markup: that is a source defect fixed forward here, and
   docs/absorption/corrections.md says which.

   Idempotent: running it twice changes nothing. Edit the additions block of a
   generated file in place; edits there survive the next run.

   Usage:
     node scripts/sync-incoming-css.mjs <path to diamorval/design-system-diametral checkout> [--dry-run]
*/
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const postcss = require("postcss");
const fs = { readdirSync, readFileSync, writeFileSync, existsSync };
const path = { join: (...p) => resolve(...p), dirname };

const repo = process.argv[2];
if (!repo) {
  console.error("usage: node scripts/sync-incoming-css.mjs <incoming checkout> [--dry-run]");
  process.exit(1);
}
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(repo, "packages/ui/src/styles/components");
const TGT = resolve(ROOT, "css/components");
const GLOBALS = resolve(repo, "packages/ui/src/styles/globals.css");
const mode = process.argv.includes("--dry-run") ? "plan" : "write";
// Incoming's class vocabulary: every ds-* name its components or stylesheets use.
const voc = new Set();
for (const dir of [resolve(repo, "packages/ui/src/components"), SRC])
  for (const f of readdirSync(dir))
    for (const m of readFileSync(resolve(dir, f), "latin1").matchAll(/ds-[a-z0-9-]+/g)) voc.add(m[0]);
const HTML_GRAMMAR=/> ?input\b|:has\(input|input\[type=|\.ds-field (select|textarea|input|:is)|select\.ds-input|:not\(svg\)|:not\(:has\(|\b(th|td|tr):|\.ds-table input|\.ds-table-container > \.ds-table|\[hidden\]|^:root$|\[class\*=/;
const dropped_restyles=[];
// Classes two markups share: incoming's React part, and the 0.x plain-HTML wrapper recognised by a legacy child.
// Incoming's rules get a zero-specificity guard so they skip the HTML wrapper; DiametralGroup's
// X:not(:has(> legacy)) restyles of incoming's markup are dropped.
const GUARD={
 'checkbox.css':[['ds-checkbox','.ds-checkbox__box']],
 'switch.css':[['ds-switch','.ds-switch__track']],
 'input-group.css':[['ds-input-group','.ds-input-group__addon']],
 'drawer.css':[['ds-drawer-overlay','.ds-drawer']],
 'card.css':[['ds-card',':is(.ds-card__header, .ds-card__body, .ds-card__media, .ds-card__footer, .ds-card__block)']],
 'panel.css':[['ds-panel',':is(.ds-panel__header, .ds-panel__content, .ds-panel__title, .ds-panel__row, .ds-panel__footer)']],
 'stepper.css':[['ds-stepper','.ds-stepper__step']],
 'tabs.css':[['ds-tabs','.ds-tabs__tab']],
 'status-panel.css':[['ds-status',':is(.ds-status__head, .ds-status__body)']],
 'field.css':[['ds-field',':is(.ds-field__label, .ds-field__hint)']],
 'phone-input.css':[['ds-phone-input','.ds-phone-input__country']],
 'wordmark.css':[['ds-wordmark','.ds-wordmark__mark']],
};
function guard(t,sel){for(const [c,m] of GUARD[t]||[])sel=sel.replace(new RegExp('\\.'+c+'(?![\\w-])','g'),`.${c}:where(:not(:has(> ${m})))`);return sel}
function isRestyle(t,s){if((GUARD[t]||[]).some(([c,m])=>s.includes(':not(:has(> '+m+'))'))){dropped_restyles.push(t+'  '+s);return true}const cls=[...s.matchAll(/\.(ds-[a-zA-Z0-9_-]+)/g)].map(m=>m[1]);const incOnly=cls.every(c=>voc.has(c));if(!incOnly)return false;if(HTML_GRAMMAR.test(s))return false;dropped_restyles.push(t+'  '+s);return true}
const MAP={'alert-dialog':'modal','dialog':'modal','calendar':'calendar-view','command':'command-palette','data-table':'datagrid','date-range-picker':'date-range','date-time-picker':'date-time','dropdown-menu':'menu','empty':'empty-state','number-field':'number-input','radio-group':'form-controls','split-button':'button-extras','status':'status-panel','tags-input':'tag-input','toggle-group':'segmented'};
// incoming's own slot definitions (:root) -> what they point at
const slots={};postcss.parse(fs.readFileSync(GLOBALS,'utf8')).walkRules(r=>{if(r.selector.trim()===':root')r.each(d=>{if(d.type==='decl'&&!d.prop.startsWith('--ds-'))slots[d.prop]=d.value.trim()})});
for(let i=1;i<=5;i++)slots['--chart-'+i]=`var(--ds-chart-${i})`;
slots['--font-heading']='var(--ds-font-title)';
const LIT={'var(--font-mono)':'"Geist Mono Variable", "Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace','var(--font-sans)':'var(--ds-font-sans)','var(--spacing)':'0.25rem'};
const KEEP_UNPREFIXED=/^--sidebar/; // scoped in sidebar.css
function mapValue(v){for(const [k,x] of Object.entries(LIT))v=v.split(k).join(x);
 return v.replace(/var\((--[a-z0-9-]+)\)/g,(m,n)=>{if(n.startsWith('--ds-')||KEEP_UNPREFIXED.test(n))return m;const s=slots[n]??(n.startsWith('--color-')?slots['--'+n.slice(8)]:undefined);return s&&/^var\(--ds-[a-z0-9-]+\)$/.test(s)?s:m})}
const DARK=':is([data-theme="dark"], .dark, .dark-theme)';
function mapSel(s){return s.replace(/(^|,\s*)\.dark(?=[\s:])/g,(m,p)=>p+DARK)}
function codemod(css){const root=postcss.parse(css);
 root.walkDecls(d=>{d.value=mapValue(d.value)});
 root.walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;r.selector=mapSel(r.selector)});
 return root}
const norm=s=>s.replace(/:where\(:not\(:has\(> (?::is\([^)]*\)|[^)]+)\)\)\)/g,'').replace(/\s+/g,' ').trim();
function ctx(r){const c=[];let p=r.parent;while(p&&p.type!=='root'){if(p.type==='atrule'&&p.name!=='layer')c.unshift('@'+p.name+' '+norm(p.params));p=p.parent}return c.join(' ')}
const groups={};for(const f of fs.readdirSync(SRC)){const b=f.replace(/\.css$/,'');const t=(MAP[b]||b)+'.css';if(!fs.existsSync(path.join(TGT,t))){console.error('no target for',f);continue}(groups[t]??=[]).push(f)}
const report=[];
// Keyframes incoming gets from outside its component files (shadcn/tailwind.css, its own globals.css).
const EXTRA_KEYFRAMES={'accordion.css':`/* From shadcn/tailwind.css, which incoming's globals.css imports. */
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height, var(--accordion-panel-height, auto)); }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height, var(--accordion-panel-height, auto)); }
  to { height: 0; }
}`,'sparkline.css':`/* From incoming's globals.css. */
@keyframes ds-sparkline-draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}`};
for(const [t,srcs] of Object.entries(groups)){
 const inc=srcs.map(f=>({f,root:codemod(fs.readFileSync(path.join(SRC,f),'utf8'))}));
 const keysPre=new Set();for(const {root} of inc)root.walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;for(const s of r.selectors)keysPre.add(ctx(r)+'|'+norm(s))});
 const applyGuard=()=>{for(const {root} of inc)root.walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;r.selectors=r.selectors.map(x=>guard(t,x))})};
 const keys=new Set(),kf=new Set();
 for(const {root} of inc){root.walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;for(const s of r.selectors)keys.add(ctx(r)+'|'+norm(s))});root.walkAtRules(/keyframes/,a=>kf.add(a.params.trim()))}
 if(EXTRA_KEYFRAMES[t])for(const m of EXTRA_KEYFRAMES[t].matchAll(/@keyframes ([\w-]+)/g))kf.add(m[1]);
 const tgt=postcss.parse(fs.readFileSync(path.join(TGT,t),'utf8'));
 tgt.walkAtRules('layer',a=>{if(a.nodes)a.replaceWith(a.nodes)});
 const extra=postcss.root();let kept=0,dropped=0;const keptSel=[];
 let pending=null;
 tgt.each(node=>{
  const clone=node.clone();
  if(node.type==='comment'){pending=/generated from @diametral\/ui|DiametralGroup additions/.test(node.text)?null:clone;return}
  const before=extra.nodes.length;
  if(node.type==='atrule'&&/keyframes/.test(node.name)){if(!kf.has(node.params.trim())){extra.append(clone);kept++}return}
  // walk rules inside clone; drop selectors incoming defines
  const visit=n=>{n.walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;const c=ctx(r);const sels=r.selectors.filter(s=>!keys.has(c+'|'+norm(mapSel(s)))&&!isRestyle(t,norm(s)));dropped+=r.selectors.length-sels.length;if(!sels.length)r.remove();else{r.selectors=sels;keptSel.push(sels.join(', '))}})};
  if(clone.type==='rule'){const c='';const ff=pending&&/fix-forward/.test(pending.text);const sels=clone.selectors.filter(s=>!keys.has('|'+norm(mapSel(s)))&&(ff||!isRestyle(t,norm(s))));dropped+=clone.selectors.length-sels.length;if(sels.length){clone.selectors=sels;if(pending)extra.append(pending);extra.append(clone);kept++;keptSel.push(sels.join(', '))}pending=null;return}
  else{visit(clone);let empty=true;clone.walkRules(()=>{empty=false});clone.walkDecls(()=>{empty=false});if(!empty){extra.append(clone);kept++}}
 });
 // cleanup empty at-rules
 extra.walkAtRules(a=>{if(a.nodes&&!a.nodes.some(n=>n.type!=='comment'))a.remove()});
 report.push({t,srcs,dropped,kept,keptSel});
 applyGuard();
 if(mode==='write'){
  let out=`/* ${t} — generated from @diametral/ui (diamorval/design-system-diametral, main):\n   ${srcs.map(s=>'packages/ui/src/styles/components/'+s).join('\n   ')}\n   Incoming is the model: its rules come first, verbatim but for the slot\n   mapping (shadcn slots -> --ds-* as incoming's own :root resolves them),\n   @layer blocks kept (bare rules in components, qualified ones in\n   utilities, as incoming orders them), and .dark widened to this package's three dark\n   conventions. Regenerate with scripts/sync-incoming-css.mjs rather than\n   editing the incoming half by hand. */\n\n`;
  if(EXTRA_KEYFRAMES[t])out+=EXTRA_KEYFRAMES[t]+'\n\n';
  for(const {f,root} of inc)out+=(inc.length>1?`/* ---- ${f} ---- */\n`:'')+root.toString().trim()+'\n\n';
  const comp=postcss.root(),util=postcss.root(),other=postcss.root();
  let pc=null;
  extra.each(n=>{if(n.type==='comment'){pc=n.clone();return}if(n.type==='rule'){const tgtRoot=n.selectors.some(x=>/^\.[\w-]+$/.test(x.trim()))?comp:util;if(pc){tgtRoot.append(pc);pc=null}const bare=n.selectors.filter(x=>/^\.[\w-]+$/.test(x.trim())),q=n.selectors.filter(x=>!/^\.[\w-]+$/.test(x.trim()));if(bare.length){const c=n.clone();c.selectors=bare;comp.append(c)}if(q.length){const c=n.clone();c.selectors=q;util.append(c)}}else if(n.type==='atrule'&&/keyframes|font-face|property/.test(n.name))other.append(n.clone());else util.append(n.clone())});
  const dedent=str=>{const ls=str.split('\n');const L=(ls[ls.length-1].match(/^ */)[0]).length;return ls.map((l,i)=>i===0?l:l.replace(new RegExp('^ {0,'+L+'}'),'')).join('\n')};
  const ind=r=>r.nodes.map(n=>{const c=n.clone();c.raws.before='';return dedent(c.toString().trim())}).join('\n').split('\n').map(l=>l?'  '+l:l).join('\n');
  let ex=(other.nodes.length?other.toString().trim()+'\n':'')+(comp.nodes.length?'@layer components {\n'+ind(comp)+'\n}\n':'')+(util.nodes.length?'@layer utilities {\n'+ind(util)+'\n}\n':'');
  ex=ex.trim();
  if(ex)out+=`/* ============================================================================\n   DiametralGroup additions — rules incoming does not define: the 0.x class\n   grammar that <ds-*> web components, Streamlit/Keycloak HTML and the\n   additive variants still write. Bare rules in @layer components, qualified ones in\n   @layer utilities, the same split incoming uses.\n   ============================================================================ */\n${ex}\n`;
  fs.writeFileSync(path.join(TGT,t),out)}
}
for(const r of report)console.log(`${r.t.padEnd(22)} <- ${r.srcs.join(',').padEnd(30)} replaced:${String(r.dropped).padStart(3)} kept:${String(r.kept).padStart(3)}`);
