import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                    */class h extends HTMLElement{static get observedAttributes(){return["src"]}constructor(){super(),this._active=-1,this._cards=[],this._raf=0,this._io=null,this._wheelTimer=0,this._touchStart=null,this._onScroll=()=>{cancelAnimationFrame(this._raf),this._raf=requestAnimationFrame(()=>this._syncCenter())},this._onResize=()=>this._syncCenter(),this._onKey=t=>this._handleKey(t),this._onWheel=t=>this._handleWheel(t),this._onTouchStart=t=>this._handleTouchStart(t),this._onTouchEnd=t=>this._handleTouchEnd(t)}connectedCallback(){this.shadowRoot||this.attachShadow({mode:"open"}),this._load(),window.addEventListener("wheel",this._onWheel,{passive:!1}),window.addEventListener("keydown",this._onKey),window.addEventListener("touchstart",this._onTouchStart,{passive:!0}),window.addEventListener("touchend",this._onTouchEnd,{passive:!1})}disconnectedCallback(){var e,o;const t=(e=this.shadowRoot)==null?void 0:e.querySelector(".track");t==null||t.removeEventListener("scroll",this._onScroll),t==null||t.removeEventListener("scrollend",this._onScroll),window.removeEventListener("resize",this._onResize),window.removeEventListener("wheel",this._onWheel),window.removeEventListener("keydown",this._onKey),window.removeEventListener("touchstart",this._onTouchStart),window.removeEventListener("touchend",this._onTouchEnd),this.removeEventListener("keydown",this._onKey),(o=this._io)==null||o.disconnect(),this._io=null,cancelAnimationFrame(this._raf),clearTimeout(this._wheelTimer),document.documentElement.classList.remove("polaroid-carousel-lock")}attributeChangedCallback(t,e,o){t==="src"&&e!==o&&this.isConnected&&this._load()}async _load(){const t=this.getAttribute("src")||"images/ai-playground/cards.json";try{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to load ${t}`);this._cards=await e.json()}catch(e){console.error(e),this._cards=[]}this._render(),this._bind(),requestAnimationFrame(()=>{this._scrollToIndex(0,"auto"),this._syncCenter()})}_tilts(){return[-2.4,1.8,-1.2,2.2,-1.8,1.4,-2,1.6,-1.5,2,-1.7,1.9]}_media(t){if(t.type==="empty"||!t.src&&!t.poster)return"";if(t.type==="video"||/\.(mp4|webm|mov)(\?|$)/i.test(t.src||"")){const o=t.poster?` poster="${t.poster}"`:"";return`<video src="${t.src}"${o} autoplay muted loop playsinline draggable="false"></video>`}return`<img src="${t.src}" alt="${t.title||""}" draggable="false" />`}_render(){const t=this._tilts(),e=this._cards.map((o,i)=>{const r=t[i%t.length],n=o.type==="empty"?" is-empty":"",s=o.title||"Blank";return`
          <article
            class="polaroid${n}"
            data-index="${i}"
            data-bg="${o.bg||"#e8e8e8"}"
            style="--tilt: ${r}deg"
            tabindex="0"
            role="listitem"
            aria-label="${s}"
          >
            <div class="polaroid__frame">
              <div class="polaroid__photo">
                ${this._media(o)}
              </div>
              <div class="polaroid__caption">
                <p class="polaroid__title">${o.title||""}</p>
                <p class="polaroid__meta">${o.tools||""}</p>
              </div>
            </div>
          </article>
        `}).join("");this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          outline: none;
          --card-w: min(78vw, 420px);
          --gap: clamp(32px, 4.5vw, 56px);
        }

        .viewport {
          position: relative;
          width: 100%;
        }

        .track {
          display: flex;
          align-items: center;
          gap: var(--gap);
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-block: 48px 64px;
          padding-inline: calc(50% - var(--card-w) / 2);
        }
        .track::-webkit-scrollbar { display: none; }

        .polaroid {
          flex: 0 0 var(--card-w);
          scroll-snap-align: center;
          scroll-snap-stop: always;
          margin: 0;
          cursor: grab;
          transform: rotate(var(--tilt, 0deg)) scale(0.96);
          transform-origin: center center;
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 1;
          filter: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .polaroid:active { cursor: grabbing; }
        .polaroid.is-center {
          transform: rotate(calc(var(--tilt, 0deg) * 0.35)) scale(1);
          z-index: 2;
        }

        .polaroid__frame {
          background: #fff;
          padding: 14px 14px 0;
          box-shadow:
            0 18px 40px rgba(40, 30, 20, 0.16),
            0 4px 12px rgba(40, 30, 20, 0.08);
        }

        .polaroid__photo {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #e8e8e8;
        }
        .polaroid.is-empty .polaroid__photo {
          background: #e8e8e8;
        }
        .polaroid.is-empty .polaroid__caption {
          visibility: hidden;
        }
        .polaroid__photo img,
        .polaroid__photo video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
        .polaroid__caption {
          padding: 18px 6px 28px;
          min-height: 72px;
        }
        .polaroid__title {
          margin: 0;
          font-family: Inter, system-ui, sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #3a3a3a;
          line-height: 1.3;
        }
        .polaroid__meta {
          margin: 4px 0 0;
          font-family: Inter, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #9a9a9a;
          line-height: 1.3;
        }

        .fade {
          pointer-events: none;
          position: absolute;
          top: 0;
          bottom: 0;
          width: min(18vw, 160px);
          z-index: 3;
        }
        .fade--left {
          left: 0;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 100%
          );
        }
        .fade--right {
          right: 0;
          background: linear-gradient(
            270deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 100%
          );
        }

        .hint {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: -28px;
          padding-bottom: 8px;
        }
        .hint button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(8px);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: background 0.2s, transform 0.2s;
        }
        .hint button:hover {
          background: rgba(255, 255, 255, 0.75);
          transform: scale(1.05);
        }
        .hint button svg {
          width: 16px;
          height: 16px;
          stroke: #333;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @media (max-width: 640px) {
          :host { --card-w: min(86vw, 360px); }
          .polaroid__caption { padding: 14px 4px 22px; min-height: 64px; }
          .fade { width: 12vw; }
        }
      </style>
      <div class="viewport">
        <div class="fade fade--left" aria-hidden="true"></div>
        <div class="fade fade--right" aria-hidden="true"></div>
        <div class="track" role="list" tabindex="0" aria-label="AI playground Polaroid carousel">
          ${e}
        </div>
        <div class="hint">
          <button type="button" class="prev" aria-label="Previous card">
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button type="button" class="next" aria-label="Next card">
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    `}_bind(){var n;const t=this.shadowRoot.querySelector(".track");if(!t||(t.addEventListener("scroll",this._onScroll,{passive:!0}),t.addEventListener("scrollend",this._onScroll,{passive:!0}),window.addEventListener("resize",this._onResize),this.tabIndex=0,this._delegated||(this._delegated=!0,this.shadowRoot.addEventListener("click",s=>{const a=s.target;if(!(a instanceof Element))return;if(a.closest(".next")){s.preventDefault(),this._scrollToIndex(Math.min(this._cards.length-1,this._centerIndex()+1));return}if(a.closest(".prev")){s.preventDefault(),this._scrollToIndex(Math.max(0,this._centerIndex()-1));return}const l=a.closest(".polaroid");l&&!this._dragMoved&&this._scrollToIndex(Number(l.dataset.index))})),(n=this._io)==null||n.disconnect(),this._io=new IntersectionObserver(()=>this._syncCenter(),{root:t,rootMargin:"0px -42% 0px -42%",threshold:[0,.25,.5,.75,1]}),this.shadowRoot.querySelectorAll(".polaroid").forEach(s=>{this._io.observe(s)}),t.dataset.dragBound==="1"))return;t.dataset.dragBound="1";let e=!1;this._dragMoved=!1;let o=0,i=0;t.addEventListener("pointerdown",s=>{s.pointerType==="mouse"&&s.button!==0||s.target instanceof Element&&s.target.closest("button")||(e=!0,this._dragMoved=!1,o=s.clientX,i=t.scrollLeft,t.setPointerCapture(s.pointerId),t.style.scrollSnapType="none",t.style.scrollBehavior="auto")}),t.addEventListener("pointermove",s=>{if(!e)return;const a=s.clientX-o;Math.abs(a)>4&&(this._dragMoved=!0),t.scrollLeft=i-a,this._syncCenter()});const r=s=>{if(!e)return;e=!1;try{t.releasePointerCapture(s.pointerId)}catch{}const a=this._centerIndex();this._scrollToIndex(a,this._dragMoved?"smooth":"auto")};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r)}_handleKey(t){const e=t.key==="ArrowDown"||t.key==="ArrowRight",o=t.key==="ArrowUp"||t.key==="ArrowLeft";if(!e&&!o||!this._cards.length)return;const i=t.target;if(i instanceof Element&&(i.closest("input, textarea, select, [contenteditable='true']")||i.isContentEditable))return;const r=this._carouselInView(),n=document.documentElement.classList.contains("polaroid-carousel-lock");!r&&!n||(t.preventDefault(),this._step(e?1:-1))}_handleTouchStart(t){if(!t.touches||t.touches.length!==1){this._touchStart=null;return}const e=t.touches[0];this._touchStart={x:e.clientX,y:e.clientY,t:performance.now()}}_handleTouchEnd(t){const e=this._touchStart;if(this._touchStart=null,!e||!t.changedTouches||!t.changedTouches.length||!this._cards.length)return;const o=this._carouselInView(),i=document.documentElement.classList.contains("polaroid-carousel-lock");if(!o&&!i)return;const r=t.changedTouches[0],n=r.clientX-e.x,s=r.clientY-e.y,a=Math.abs(n),l=Math.abs(s),c=performance.now()-e.t;if(l<48||l<a*1.2||c>800)return;const d=s>0;t.preventDefault(),this._step(d?1:-1)}_step(t){const e=this._centerIndex();if(t>0){if(this._isAtLastCard()){this._syncPageLock(),window.scrollBy({top:Math.round(window.innerHeight*.35),behavior:"smooth"});return}this._scrollToIndex(Math.min(this._cards.length-1,e+1));return}if(this._isAtFirstCard()){this._syncPageLock(),window.scrollBy({top:-Math.round(window.innerHeight*.35),behavior:"smooth"});return}this._scrollToIndex(Math.max(0,e-1))}_carouselInView(){const t=this.getBoundingClientRect(),e=window.innerHeight||1;return t.top<e*.92&&t.bottom>e*.08}_isAtFirstCard(){return this._centerIndex()<=0}_isAtLastCard(){return this._cards.length?this._centerIndex()>=this._cards.length-1:!0}_syncPageLock(){const t=this._cards.length>0&&!this._isAtLastCard();document.documentElement.classList.toggle("polaroid-carousel-lock",t),t&&window.scrollY>2&&window.scrollTo({top:0,behavior:"auto"})}_handleWheel(t){var c;const e=(c=this.shadowRoot)==null?void 0:c.querySelector(".track");if(!e||!this._cards.length)return;const o=this._carouselInView(),i=this._isAtFirstCard(),r=this._isAtLastCard(),n=t.deltaX,s=t.deltaY,a=Math.abs(n)>Math.abs(s)?n:s;if(Math.abs(a)<.5)return;let l=a;if(t.deltaMode===1&&(l*=16),t.deltaMode===2&&(l*=e.clientWidth),l>0&&r&&o){this._syncPageLock();return}if(l<0&&i&&o){this._syncPageLock();return}!o&&r&&l>0||!o&&i&&l<0||(t.preventDefault(),!r&&window.scrollY>2&&window.scrollTo({top:0,behavior:"auto"}),e.style.scrollSnapType="none",e.style.scrollBehavior="auto",e.scrollLeft+=l,this._syncCenter(),this._syncPageLock(),clearTimeout(this._wheelTimer),this._wheelTimer=setTimeout(()=>{e.style.scrollSnapType="",e.style.scrollBehavior="",this._scrollToIndex(this._centerIndex()),this._syncPageLock()},90))}_centerIndex(){var r;const t=(r=this.shadowRoot)==null?void 0:r.querySelector(".track");if(!t)return Math.max(0,this._active);const e=t.scrollLeft+t.clientWidth/2;let o=0,i=1/0;return t.querySelectorAll(".polaroid").forEach(n=>{const s=n.offsetLeft+n.offsetWidth/2,a=Math.abs(s-e);a<i&&(i=a,o=Number(n.dataset.index))}),o}_scrollToIndex(t,e="smooth"){var n,s;const o=(n=this.shadowRoot)==null?void 0:n.querySelector(`.polaroid[data-index="${t}"]`),i=(s=this.shadowRoot)==null?void 0:s.querySelector(".track");if(!o||!i)return;const r=Math.max(0,o.offsetLeft-(i.clientWidth-o.offsetWidth)/2);this._applyCenter(t),i.style.scrollSnapType="none",i.style.scrollBehavior="auto",i.scrollLeft=r,requestAnimationFrame(()=>{i.style.scrollSnapType="",i.style.scrollBehavior="",i.scrollLeft=r,this._syncCenter()})}_applyCenter(t){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".track");!e||!this._cards[t]||(e.querySelectorAll(".polaroid").forEach(i=>{i.classList.toggle("is-center",Number(i.dataset.index)===t)}),t!==this._active&&(this._active=t,document.documentElement.style.setProperty("--playground-bg",this._cards[t].bg),this.dispatchEvent(new CustomEvent("centerchange",{detail:{index:t,card:this._cards[t]},bubbles:!0}))),this._syncPageLock())}_syncCenter(){this._applyCenter(this._centerIndex())}}customElements.get("polaroid-carousel")||customElements.define("polaroid-carousel",h);
