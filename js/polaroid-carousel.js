/**
 * <polaroid-carousel src="images/ai-playground/cards.json">
 * Horizontal snap carousel of Polaroid cards; syncs page --playground-bg
 * to the dominant color of the centered card.
 */
class PolaroidCarousel extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  constructor() {
    super();
    this._active = -1;
    this._cards = [];
    this._raf = 0;
    this._io = null;
    this._wheelTimer = 0;
    this._touchStart = null;
    this._onScroll = () => {
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(() => this._syncCenter());
    };
    this._onResize = () => this._syncCenter();
    this._onKey = (e) => this._handleKey(e);
    this._onWheel = (e) => this._handleWheel(e);
    this._onTouchStart = (e) => this._handleTouchStart(e);
    this._onTouchEnd = (e) => this._handleTouchEnd(e);
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    this._load();
    // Page-level input so trackpad / keys / swipe drive the carousel
    window.addEventListener("wheel", this._onWheel, { passive: false });
    window.addEventListener("keydown", this._onKey);
    window.addEventListener("touchstart", this._onTouchStart, { passive: true });
    window.addEventListener("touchend", this._onTouchEnd, { passive: false });
  }

  disconnectedCallback() {
    const track = this.shadowRoot?.querySelector(".track");
    track?.removeEventListener("scroll", this._onScroll);
    track?.removeEventListener("scrollend", this._onScroll);
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("wheel", this._onWheel);
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("touchstart", this._onTouchStart);
    window.removeEventListener("touchend", this._onTouchEnd);
    this.removeEventListener("keydown", this._onKey);
    this._io?.disconnect();
    this._io = null;
    cancelAnimationFrame(this._raf);
    clearTimeout(this._wheelTimer);
    document.documentElement.classList.remove("polaroid-carousel-lock");
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "src" && oldVal !== newVal && this.isConnected) {
      this._load();
    }
  }

  async _load() {
    const src = this.getAttribute("src") || "images/ai-playground/cards.json";
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Failed to load ${src}`);
      this._cards = await res.json();
    } catch (err) {
      console.error(err);
      this._cards = [];
    }
    this._render();
    this._bind();
    // Center first card after layout
    requestAnimationFrame(() => {
      this._scrollToIndex(0, "auto");
      this._syncCenter();
    });
  }

  _tilts() {
    // Alternating physical Polaroid angles (degrees)
    return [-2.4, 1.8, -1.2, 2.2, -1.8, 1.4, -2.0, 1.6, -1.5, 2.0, -1.7, 1.9];
  }

  _media(card) {
    if (card.type === "empty" || (!card.src && !card.poster)) {
      return "";
    }
    const isVideo =
      card.type === "video" || /\.(mp4|webm|mov)(\?|$)/i.test(card.src || "");
    if (isVideo) {
      const poster = card.poster ? ` poster="${card.poster}"` : "";
      return `<video src="${card.src}"${poster} autoplay muted loop playsinline draggable="false"></video>`;
    }
    return `<img src="${card.src}" alt="${card.title || ""}" draggable="false" />`;
  }

  _render() {
    const tilts = this._tilts();
    const items = this._cards
      .map((card, i) => {
        const tilt = tilts[i % tilts.length];
        const emptyClass = card.type === "empty" ? " is-empty" : "";
        const label = card.title || "Blank";
        return `
          <article
            class="polaroid${emptyClass}"
            data-index="${i}"
            data-bg="${card.bg || "#e8e8e8"}"
            style="--tilt: ${tilt}deg"
            tabindex="0"
            role="listitem"
            aria-label="${label}"
          >
            <div class="polaroid__frame">
              <div class="polaroid__photo">
                ${this._media(card)}
              </div>
              <div class="polaroid__caption">
                <p class="polaroid__title">${card.title || ""}</p>
                <p class="polaroid__meta">${card.tools || ""}</p>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    this.shadowRoot.innerHTML = `
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
          ${items}
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
    `;
  }

  _bind() {
    const track = this.shadowRoot.querySelector(".track");
    if (!track) return;

    track.addEventListener("scroll", this._onScroll, { passive: true });
    track.addEventListener("scrollend", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onResize);
    this.tabIndex = 0;

    // Event delegation — survives re-renders and is reliable in Shadow DOM
    if (!this._delegated) {
      this._delegated = true;
      this.shadowRoot.addEventListener("click", (e) => {
        const t = e.target;
        if (!(t instanceof Element)) return;
        if (t.closest(".next")) {
          e.preventDefault();
          this._scrollToIndex(
            Math.min(this._cards.length - 1, this._centerIndex() + 1)
          );
          return;
        }
        if (t.closest(".prev")) {
          e.preventDefault();
          this._scrollToIndex(Math.max(0, this._centerIndex() - 1));
          return;
        }
        const card = t.closest(".polaroid");
        if (card && !this._dragMoved) {
          this._scrollToIndex(Number(card.dataset.index));
        }
      });
    }

    // IntersectionObserver: middle strip of the track
    this._io?.disconnect();
    this._io = new IntersectionObserver(
      () => this._syncCenter(),
      {
        root: track,
        rootMargin: "0px -42% 0px -42%",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    this.shadowRoot.querySelectorAll(".polaroid").forEach((el) => {
      this._io.observe(el);
    });

    // Drag-to-scroll (rebind on each render via property flag on track)
    if (track.dataset.dragBound === "1") return;
    track.dataset.dragBound = "1";

    let dragging = false;
    this._dragMoved = false;
    let startX = 0;
    let startScroll = 0;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target instanceof Element && e.target.closest("button")) return;
      dragging = true;
      this._dragMoved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
    });
    track.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) this._dragMoved = true;
      track.scrollLeft = startScroll - dx;
      this._syncCenter();
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      try {
        track.releasePointerCapture(e.pointerId);
      } catch (_) {}
      const i = this._centerIndex();
      this._scrollToIndex(i, this._dragMoved ? "smooth" : "auto");
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
  }

  _handleKey(e) {
    // Down / Right → forward (next card → footer)
    // Up / Left → back (previous card → top)
    const forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!forward && !back) return;
    if (!this._cards.length) return;

    // Don't steal keys from inputs
    const t = e.target;
    if (
      t instanceof Element &&
      (t.closest("input, textarea, select, [contenteditable='true']") ||
        t.isContentEditable)
    ) {
      return;
    }

    const inView = this._carouselInView();
    const locked = document.documentElement.classList.contains(
      "polaroid-carousel-lock"
    );
    if (!inView && !locked) return;

    e.preventDefault();
    this._step(forward ? 1 : -1);
  }

  _handleTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) {
      this._touchStart = null;
      return;
    }
    const touch = e.touches[0];
    this._touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      t: performance.now(),
    };
  }

  _handleTouchEnd(e) {
    const start = this._touchStart;
    this._touchStart = null;
    if (!start || !e.changedTouches || !e.changedTouches.length) return;
    if (!this._cards.length) return;

    const inView = this._carouselInView();
    const locked = document.documentElement.classList.contains(
      "polaroid-carousel-lock"
    );
    if (!inView && !locked) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const elapsed = performance.now() - start.t;

    // Vertical swipe only (same metaphor as Up/Down keys). Horizontal stays on drag-to-scroll.
    if (absY < 48 || absY < absX * 1.2 || elapsed > 800) return;

    // Finger down (positive dy) → forward; finger up → back
    const forward = dy > 0;
    e.preventDefault();
    this._step(forward ? 1 : -1);
  }

  /** Step one card forward (+1) or back (-1); at ends, release into page scroll. */
  _step(dir) {
    const i = this._centerIndex();
    if (dir > 0) {
      if (this._isAtLastCard()) {
        this._syncPageLock();
        window.scrollBy({
          top: Math.round(window.innerHeight * 0.35),
          behavior: "smooth",
        });
        return;
      }
      this._scrollToIndex(Math.min(this._cards.length - 1, i + 1));
      return;
    }
    if (this._isAtFirstCard()) {
      this._syncPageLock();
      window.scrollBy({
        top: -Math.round(window.innerHeight * 0.35),
        behavior: "smooth",
      });
      return;
    }
    this._scrollToIndex(Math.max(0, i - 1));
  }

  _carouselInView() {
    const rect = this.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    return rect.top < vh * 0.92 && rect.bottom > vh * 0.08;
  }

  _isAtFirstCard() {
    return this._centerIndex() <= 0;
  }

  _isAtLastCard() {
    if (!this._cards.length) return true;
    return this._centerIndex() >= this._cards.length - 1;
  }

  /** Pin page scroll until the last Polaroid is centered — prevents early footer entry. */
  _syncPageLock() {
    const lock = this._cards.length > 0 && !this._isAtLastCard();
    document.documentElement.classList.toggle("polaroid-carousel-lock", lock);
    if (lock && window.scrollY > 2) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  _handleWheel(e) {
    const track = this.shadowRoot?.querySelector(".track");
    if (!track || !this._cards.length) return;

    const inView = this._carouselInView();
    const atFirst = this._isAtFirstCard();
    const atLast = this._isAtLastCard();

    const dx = e.deltaX;
    const dy = e.deltaY;
    const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(dominant) < 0.5) return;

    let delta = dominant;
    if (e.deltaMode === 1) delta *= 16;
    if (e.deltaMode === 2) delta *= track.clientWidth;

    // Only release downward scroll once the LAST card is centered
    if (delta > 0 && atLast && inView) {
      this._syncPageLock();
      return;
    }
    // Only release upward scroll once the FIRST card is centered
    if (delta < 0 && atFirst && inView) {
      this._syncPageLock();
      return;
    }

    // Already past the section toward the footer / top — don't steal the wheel
    if (!inView && atLast && delta > 0) return;
    if (!inView && atFirst && delta < 0) return;

    e.preventDefault();

    if (!atLast && window.scrollY > 2) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    track.style.scrollSnapType = "none";
    track.style.scrollBehavior = "auto";
    track.scrollLeft += delta;
    this._syncCenter();
    this._syncPageLock();

    clearTimeout(this._wheelTimer);
    this._wheelTimer = setTimeout(() => {
      track.style.scrollSnapType = "";
      track.style.scrollBehavior = "";
      this._scrollToIndex(this._centerIndex());
      this._syncPageLock();
    }, 90);
  }

  _centerIndex() {
    const track = this.shadowRoot?.querySelector(".track");
    if (!track) return Math.max(0, this._active);
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    track.querySelectorAll(".polaroid").forEach((el) => {
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = Number(el.dataset.index);
      }
    });
    return best;
  }

  _scrollToIndex(index, behavior = "smooth") {
    const el = this.shadowRoot?.querySelector(`.polaroid[data-index="${index}"]`);
    const track = this.shadowRoot?.querySelector(".track");
    if (!el || !track) return;

    const left = Math.max(
      0,
      el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2
    );
    this._applyCenter(index);

    // Turn off mandatory snap while we move — otherwise the browser
    // often cancels programmatic scrolls and snaps back to the prior card.
    track.style.scrollSnapType = "none";
    track.style.scrollBehavior = "auto";
    track.scrollLeft = left;

    // Restore snap on the next frames so native wheel/trackpad snap works again
    requestAnimationFrame(() => {
      track.style.scrollSnapType = "";
      track.style.scrollBehavior = "";
      // Ensure we landed exactly on the snap point
      track.scrollLeft = left;
      this._syncCenter();
    });
  }

  _applyCenter(best) {
    const track = this.shadowRoot?.querySelector(".track");
    if (!track || !this._cards[best]) return;
    track.querySelectorAll(".polaroid").forEach((el) => {
      el.classList.toggle("is-center", Number(el.dataset.index) === best);
    });
    if (best !== this._active) {
      this._active = best;
      document.documentElement.style.setProperty(
        "--playground-bg",
        this._cards[best].bg
      );
      this.dispatchEvent(
        new CustomEvent("centerchange", {
          detail: { index: best, card: this._cards[best] },
          bubbles: true,
        })
      );
    }
    this._syncPageLock();
  }

  _syncCenter() {
    this._applyCenter(this._centerIndex());
  }
}

if (!customElements.get("polaroid-carousel")) {
  customElements.define("polaroid-carousel", PolaroidCarousel);
}

// Vite HMR: custom elements can't be redefined — reload so the new class mounts.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload();
  });
}
