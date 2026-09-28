(function(){
class NNDiagram extends HTMLElement{
  connectedCallback(){
    if(this._init)return; this._init=true;
    const root=this.attachShadow({mode:'open'});
    root.innerHTML=`
<style>
:host{display:block;font-family:Helvetica,Arial,sans-serif;}
.frame{border:1px solid #e5e3de;padding:20px 20px 0;overflow:hidden;background:#fff;}
.svgwrap{overflow-x:auto;}
.svgwrap svg{min-width:760px;width:100%;height:auto;display:block;}
.nn-node{fill:#fff;stroke:#C4C4C4;stroke-width:1.4;transition:stroke .2s,fill .2s;}
.nn-edge{stroke:#EBEBEB;stroke-width:1;fill:none;transition:stroke .2s,stroke-width .2s;}
.nn-edge.flow{stroke-dasharray:4 8;animation:flowdash 1.8s linear infinite;}
@keyframes flowdash{to{stroke-dashoffset:-24;}}
.nn-label{font-family:ui-monospace,monospace;font-size:11px;fill:#8F8F8F;text-anchor:middle;}
.nn-title-label{font-size:11px;font-weight:600;text-anchor:middle;letter-spacing:1.5px;fill:#8F8F8F;}
.nn-layer{cursor:pointer;}
.nn-layer:focus{outline:none;}
.nn-layer.active .nn-node,.nn-layer:hover .nn-node{stroke:#B0603F;fill:#f7ede7;}
.nn-layer.active .nn-label,.nn-layer:hover .nn-label{fill:#1A1A1A;font-weight:600;}
.nn-dot-node{fill:#1A1A1A;stroke:#1A1A1A;}
.info{border-top:1px solid #e5e3de;margin:16px -20px 0;padding:18px 24px;background:#faf8f5;min-height:86px;display:flex;gap:14px;align-items:flex-start;}
.info-icon{width:34px;height:34px;border-radius:99px;background:#f1ece4;color:#1A1A1A;display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;font-weight:500;font-size:12px;flex:none;}
.info-title{font-size:14px;font-weight:600;margin-bottom:2px;color:#1A1A1A;}
.info-text{font-size:14px;color:#6B6B6B;line-height:1.65;max-width:760px;}
</style>
<div class="frame">
  <div class="svgwrap">
  <svg viewBox="0 0 920 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive diagram of a dual neural network recommender">
    <text x="215" y="30" class="nn-title-label">USER NETWORK</text>
    <text x="705" y="30" class="nn-title-label">MOVIE NETWORK</text>
    <g id="edges"></g>
    <g id="layers"></g>
    <g class="nn-layer" id="layer-dot" tabindex="0">
      <circle cx="460" cy="200" r="26" class="nn-dot-node"></circle>
      <text x="460" y="206" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" font-weight="600" fill="#fff">·</text>
      <text x="460" y="252" class="nn-label">dot product</text>
      <text x="460" y="270" class="nn-label" font-weight="600">ŷ = v_u · v_m</text>
    </g>
  </svg>
  </div>
  <div class="info">
    <div class="info-icon" id="nnInfoIcon">?</div>
    <div>
      <div class="info-title" id="nnInfoTitle">Explore the architecture</div>
      <div class="info-text" id="nnInfoText">Hover over any layer of either network to see its role. Two towers learn embeddings for users and movies separately — then a single dot product predicts the rating.</div>
    </div>
  </div>
</div>`;
    const $=id=>root.getElementById(id);
    const svgNS='http://www.w3.org/2000/svg';
    const edgesG=$('edges'),layersG=$('layers');
    const CY=200,GAP=34;
    const layers=[
      ['u-in',70,6,'x_u','user features','user'],
      ['u-h1',180,5,'×256','dense · ReLU','user'],
      ['u-h2',280,4,'×128','dense · ReLU','user'],
      ['u-out',370,3,'v_u','32-d embedding','user'],
      ['m-out',550,3,'v_m','32-d embedding','movie'],
      ['m-h2',640,4,'×128','dense · ReLU','movie'],
      ['m-h1',740,5,'×256','dense · ReLU','movie'],
      ['m-in',850,6,'x_m','movie features','movie'],
    ];
    const info={
      'u-in':['x_u','User features (14)',"The user's average rating per genre — 14 numbers that describe taste. Rated Sci-Fi movies 4.5 on average? That's one of these inputs."],
      'u-h1':['256','User dense layer (256 units)',"The first hidden layer. 256 ReLU units learn broad patterns: which combinations of genre preferences tend to go together."],
      'u-h2':['128','User dense layer (128 units)',"The network compresses its understanding into 128 units, keeping only the strongest signals about this user."],
      'u-out':['v_u','User embedding (32-d)',"The output: one user's entire taste profile, summarised as just 32 numbers (L2-normalised) in a shared embedding space."],
      'm-in':['x_m','Movie features (16)',"The movie's content profile — release year, average rating, and 14 genre flags. No other users needed: this is what makes the system content-based."],
      'm-h1':['256','Movie dense layer (256 units)',"A mirror of the user tower: 256 ReLU units start turning raw content features into something comparable to taste."],
      'm-h2':['128','Movie dense layer (128 units)',"Progressive compression: 128 units distill the movie's content toward the shared embedding space."],
      'm-out':['v_m','Movie embedding (32-d)',"The movie, summarised in the same 32-dimensional space as the user — so the two can be directly compared. These exact vectors power the live demo."],
      'dot':['ŷ','Dot product → prediction',"One multiplication predicts the rating: ŷ = v_u · v_m. Trained by minimising squared error with L2 regularisation, optimised with Adam. Bonus: distances between v_m vectors also give 'similar movies' for free."],
    };
    function nodePositions(x,count){const ys=[];const start=CY-((count-1)*GAP)/2;for(let i=0;i<count;i++)ys.push(start+i*GAP);return ys.map(y=>({x,y}));}
    const pos={};layers.forEach(([id,x,n])=>pos[id]=nodePositions(x,n));
    const chains=[['u-in','u-h1','u-h2','u-out'],['m-in','m-h1','m-h2','m-out']];
    const edgeIndex={};layers.forEach(([id])=>edgeIndex[id]=[]);
    let ec=0;
    chains.forEach(chain=>{for(let i=0;i<chain.length-1;i++){const a=chain[i],b=chain[i+1];
      pos[a].forEach(p1=>pos[b].forEach(p2=>{
        const l=document.createElementNS(svgNS,'line');
        l.setAttribute('x1',p1.x);l.setAttribute('y1',p1.y);l.setAttribute('x2',p2.x);l.setAttribute('y2',p2.y);
        l.setAttribute('class','nn-edge'+((ec%7===0)?' flow':''));
        edgesG.appendChild(l);edgeIndex[a].push(l);edgeIndex[b].push(l);ec++;
      }));}});
    ['u-out','m-out'].forEach(id=>{pos[id].forEach(p=>{
      const l=document.createElementNS(svgNS,'line');
      l.setAttribute('x1',p.x);l.setAttribute('y1',p.y);l.setAttribute('x2',460);l.setAttribute('y2',CY);
      l.setAttribute('class','nn-edge flow');
      edgesG.appendChild(l);edgeIndex[id].push(l);
    });});
    layers.forEach(([id,x,n,top,bottom,tower])=>{
      const g=document.createElementNS(svgNS,'g');
      g.setAttribute('class','nn-layer '+tower);g.setAttribute('id','layer-'+id);g.setAttribute('tabindex','0');
      const hit=document.createElementNS(svgNS,'rect');
      hit.setAttribute('x',x-40);hit.setAttribute('y',40);hit.setAttribute('width',80);hit.setAttribute('height',320);hit.setAttribute('fill','transparent');
      g.appendChild(hit);
      pos[id].forEach(p=>{const c=document.createElementNS(svgNS,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',11);c.setAttribute('class','nn-node');g.appendChild(c);});
      const t1=document.createElementNS(svgNS,'text');
      t1.setAttribute('x',x);t1.setAttribute('y',CY-((n-1)*GAP)/2-26);t1.setAttribute('class','nn-label');t1.setAttribute('font-weight','600');t1.textContent=top;g.appendChild(t1);
      const t2=document.createElementNS(svgNS,'text');
      t2.setAttribute('x',x);t2.setAttribute('y',CY+((n-1)*GAP)/2+30);t2.setAttribute('class','nn-label');t2.textContent=bottom;g.appendChild(t2);
      layersG.appendChild(g);
    });
    const iIcon=$('nnInfoIcon'),iTitle=$('nnInfoTitle'),iText=$('nnInfoText');
    const defaultInfo=['?','Explore the architecture',"Hover over any layer of either network to see its role. Two towers learn embeddings for users and movies separately — then a single dot product predicts the rating."];
    let activeEl=null;
    function setInfo(id){const d=id?info[id]:null;const[icon,title,text]=d||defaultInfo;iIcon.textContent=icon;iTitle.textContent=title;iText.textContent=text;}
    function highlight(id,on){(edgeIndex[id]||[]).forEach(l=>{l.style.stroke=on?'#B0603F':'';l.style.strokeWidth=on?'1.4':'';});}
    function activate(g,id){
      if(activeEl){activeEl.classList.remove('active');const prev=activeEl.dataset.lid;if(prev&&prev!=='dot')highlight(prev,false);}
      activeEl=g;g.classList.add('active');g.dataset.lid=id;
      if(id!=='dot')highlight(id,true);setInfo(id);
    }
    function deactivate(){
      if(activeEl){activeEl.classList.remove('active');const prev=activeEl.dataset.lid;if(prev&&prev!=='dot')highlight(prev,false);activeEl=null;}
      setInfo(null);
    }
    layers.forEach(([id])=>{
      const g=root.getElementById('layer-'+id);
      g.addEventListener('mouseenter',()=>activate(g,id));
      g.addEventListener('mouseleave',deactivate);
      g.addEventListener('focus',()=>activate(g,id));
      g.addEventListener('blur',deactivate);
      g.addEventListener('click',e=>{e.preventDefault();activate(g,id);});
    });
    const dotG=root.getElementById('layer-dot');
    dotG.addEventListener('mouseenter',()=>activate(dotG,'dot'));
    dotG.addEventListener('mouseleave',deactivate);
    dotG.addEventListener('focus',()=>activate(dotG,'dot'));
    dotG.addEventListener('click',e=>{e.preventDefault();activate(dotG,'dot');});
  }
}
customElements.define('nn-diagram',NNDiagram);
})();
