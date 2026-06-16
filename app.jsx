const { useState, useEffect, useRef } = React;

    /* =========================================================
       ZDJĘCIA STOCKOWE (Unsplash) — podmienić na realne od klienta
       Każdy <img> ma onError → tło-fallback, więc strona nigdy się nie "rozsypie".
    ========================================================= */
    const IMG = {
      hero:      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      aerial:    'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1600&q=80',
      gallery: {
        ext1:    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
        ext2:    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
        int1:    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        int2:    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        int3:    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
        sur1:    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        sur2:    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        ext3:    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      },
      portfolio: {
        kasprowicza: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80',
        wierzchucino:'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80',
        bsdom:       'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
      },
      advisor:   'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
      agent:     'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
    };
    const onImgError = (e) => {
      e.target.style.opacity = 0;
      if (e.target.parentElement) e.target.parentElement.classList.add('img-fallback');
    };

    /* =========================================================
       DANE
    ========================================================= */

    // Sekcja 2 — Punkty użyteczności (POI). Czasy/odległości orientacyjne — do potwierdzenia.
    const POI_DATA = [
      { id: 'nature',  title: 'Park Krajobrazowy', subtitle: 'Wzniesienia Łódzkie',  time: '3 min',  distance: '900 m',  icon: '🌲', description: 'Park Krajobrazowy Wzniesień Łódzkich tuż za płotem. Lasy sosnowe, łąki i dolina rzeki Miazgi — kilometry tras spacerowych i rowerowych zaraz za Twoimi drzwiami.', mapCoords: { x: 18, y: 22 } },
      { id: 'local',   title: 'Centrum Nowosolnej', subtitle: 'Sklepy, szkoły, usługi', time: '4 min',  distance: '1.1 km', icon: '🥐', description: 'Słynne Gwieździste Skrzyżowanie — ośmioramienna gwiazda, jedno z dwóch takich miejsc w Europie. Sklepy, przedszkola i szkoły w zasięgu krótkiego spaceru.', mapCoords: { x: 68, y: 38 } },
      { id: 'highway', title: 'Autostrada A1',      subtitle: 'Węzeł Brzeziny',        time: '5 min',  distance: '2.0 km', icon: '🛣️', description: 'Węzeł autostrady A1 zaledwie 2 km od osiedla, A2 (Stryków) ok. 7 km. Cała Polska w zasięgu ręki, a Ty wracasz do ciszy przedmieść.', mapCoords: { x: 82, y: 72 } },
      { id: 'city',    title: 'Centrum Łodzi',      subtitle: 'Praca i kultura',        time: '~20 min', distance: '~12 km', icon: '🏛️', description: 'Bezkolizyjny dojazd do serca miasta wschodnim wlotem do Łodzi. Idealny balans między pracą w mieście a życiem w zgodzie z naturą.', mapCoords: { x: 35, y: 84 } },
    ];

    // Sekcja 3/4 — Domy. Ceny ORIENTACYJNE — do potwierdzenia z aktualnym cennikiem dewelopera.
    const HOUSES_DATA = [
      { id: '3.0.A.01', name: 'Segment A.01', type: 'Skrajny',   status: 'Dostępny',      area: 86.5,  rooms: 4, plot: 220, price: 789000, polygon: '8,52 30,42 40,58 18,70' },
      { id: '3.0.A.02', name: 'Segment A.02', type: 'Środkowy',  status: 'Zarezerwowany', area: 84.0,  rooms: 4, plot: 165, price: 759000, polygon: '30,42 52,32 62,48 40,58' },
      { id: '3.0.A.03', name: 'Segment A.03', type: 'Środkowy',  status: 'Dostępny',      area: 84.0,  rooms: 4, plot: 165, price: 765000, polygon: '52,32 74,22 84,38 62,48' },
      { id: '3.0.A.04', name: 'Segment A.04', type: 'Skrajny',   status: 'Sprzedany',     area: 88.0,  rooms: 5, plot: 240, price: 815000, polygon: '74,22 94,13 99,30 84,38' },
      { id: '3.0.B.01', name: 'Segment B.01', type: 'Skrajny',   status: 'Dostępny',      area: 112.0, rooms: 5, plot: 310, price: 985000, polygon: '8,78 30,70 40,86 18,96' },
      { id: '3.0.B.02', name: 'Segment B.02', type: 'Środkowy',  status: 'Dostępny',      area: 96.5,  rooms: 4, plot: 180, price: 869000, polygon: '30,70 54,60 64,76 40,86' },
    ];

    const STATUS_META = {
      'Dostępny':      { dot: '#4A5D4E', chip: 'bg-forest/10 text-forest',  solid: 'bg-forest text-white' },
      'Zarezerwowany': { dot: '#E3A857', chip: 'bg-gold/15 text-bronze',    solid: 'bg-gold text-ink' },
      'Sprzedany':     { dot: '#7A2E3A', chip: 'bg-burgundy/10 text-burgundy', solid: 'bg-burgundy text-white' },
    };

    // Sekcja 4 — Standard
    const STANDARD_FEATURES = [
      { id: 'heat',  title: 'Pompa ciepła',        desc: 'Wysokowydajna pompa ciepła w standardzie. Niskie rachunki za ogrzewanie zimą i komfortowe chłodzenie latem — bez gazu, bez smogu.', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
      { id: 'recup', title: 'Rekuperacja',         desc: 'Wentylacja mechaniczna z odzyskiem ciepła. Zawsze świeże, przefiltrowane powietrze bez utraty energii — ulga dla alergików.', icon: <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3" /> },
      { id: 'fiber', title: 'Światłowód',          desc: 'Szybki internet światłowodowy doprowadzony na całe osiedle. Praca zdalna i streaming bez kompromisów od pierwszego dnia.', icon: <><circle cx="12" cy="12" r="2" /><path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4" /></> },
      { id: 'glass', title: 'Duże przeszklenia',   desc: 'Wielkoformatowe okna i drzwi tarasowe. Zacieramy granicę między salonem a Twoim prywatnym ogrodem.', icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></> },
    ];

    // Sekcja 5 — Galeria
    const GALLERY = [
      { src: IMG.gallery.ext1, cat: 'Architektura', label: 'Bryła w nowoczesnej stodole', span: 'lg:col-span-2 lg:row-span-2' },
      { src: IMG.gallery.int1, cat: 'Wnętrza',      label: 'Salon z otwartą kuchnią',      span: 'lg:col-span-1 lg:row-span-1' },
      { src: IMG.gallery.sur1, cat: 'Otoczenie',    label: 'Las sosnowy za osiedlem',      span: 'lg:col-span-1 lg:row-span-1' },
      { src: IMG.gallery.int2, cat: 'Wnętrza',      label: 'Antresola i światło dzienne',  span: 'lg:col-span-1 lg:row-span-2' },
      { src: IMG.gallery.ext2, cat: 'Architektura', label: 'Elewacja od strony ogrodu',    span: 'lg:col-span-1 lg:row-span-1' },
      { src: IMG.gallery.sur2, cat: 'Otoczenie',    label: 'Wzniesienia Łódzkie',          span: 'lg:col-span-1 lg:row-span-1' },
      { src: IMG.gallery.int3, cat: 'Wnętrza',      label: 'Strefa dzienna wieczorem',     span: 'lg:col-span-2 lg:row-span-1' },
      { src: IMG.gallery.ext3, cat: 'Architektura', label: 'Taras i strefa wejściowa',     span: 'lg:col-span-1 lg:row-span-1' },
    ];
    const GALLERY_FILTERS = ['Wszystkie', 'Architektura', 'Wnętrza', 'Otoczenie'];

    // Sekcja 6 — Portfolio dewelopera (realne inwestycje BS DOM)
    const PORTFOLIO = [
      { title: 'Osiedle Kasprowicza', sub: 'Nowosolna, Łódź — sąsiednia inwestycja', img: IMG.portfolio.kasprowicza, href: 'https://domynowosolna.pl' },
      { title: 'Domy Wierzchucino',   sub: 'Pomorskie — domy nad morzem',           img: IMG.portfolio.wierzchucino, href: 'https://domywierzchucino.pl' },
      { title: 'BS DOM',              sub: 'Wszystkie inwestycje dewelopera',        img: IMG.portfolio.bsdom,        href: 'https://bsdom.pl' },
    ];

    const NAV_LINKS = [
      { id: 'osiedle',     label: 'Osiedle' },
      { id: 'lokalizacja', label: 'Lokalizacja' },
      { id: 'domy',        label: 'Domy' },
      { id: 'standard',    label: 'Standard' },
      { id: 'galeria',     label: 'Galeria' },
      { id: 'deweloper',   label: 'Deweloper' },
      { id: 'kontakt',     label: 'Kontakt' },
    ];

    /* =========================================================
       HOOK: scroll reveal
    ========================================================= */
    const useReveal = () => {
      useEffect(() => {
        const els = document.querySelectorAll('[data-reveal]');
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
        }, { threshold: 0.12 });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
      });
    };

    /* =========================================================
       NAWIGACJA
    ========================================================= */
    const Navbar = () => {
      const [scrolled, setScrolled] = useState(false);
      const [open, setOpen] = useState(false);
      useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
      }, []);
      const go = (id) => { setOpen(false); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
      return (
        <header className={`fixed top-0 inset-x-0 z-[60] transition-all duration-500 ${scrolled ? 'bg-cream/80 backdrop-blur-xl border-b border-ink/5 shadow-sm py-3' : 'bg-transparent py-5'}`}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
            <button onClick={() => go('osiedle')} className="flex items-center gap-3 group">
              <span className="w-9 h-9 rounded-full bg-burgundy flex items-center justify-center text-cream font-serif text-lg leading-none group-hover:bg-ink transition-colors">B</span>
              <span className="leading-tight text-left">
                <span className="block font-medium tracking-tight text-ink">Osiedle Burgundowe</span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-bronze">Nowosolna · Łódź</span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="text-sm text-forest hover:text-burgundy transition-colors tracking-wide">{l.label}</button>
              ))}
              <button onClick={() => go('kontakt')} className="bg-ink text-cream px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy transition-colors">Umów spotkanie</button>
            </nav>

            <button onClick={() => setOpen(!open)} className="lg:hidden w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center text-ink" aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ${open ? 'max-h-[480px]' : 'max-h-0'}`}>
            <div className="px-6 py-6 mt-2 mx-4 bg-cream/95 backdrop-blur-xl rounded-3xl border border-ink/5 shadow-xl flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="text-left py-3 px-4 rounded-xl text-forest hover:bg-ink/5 transition-colors">{l.label}</button>
              ))}
              <button onClick={() => go('kontakt')} className="mt-2 bg-ink text-cream py-3.5 rounded-full font-medium">Umów spotkanie</button>
            </div>
          </div>
        </header>
      );
    };

    /* =========================================================
       APLIKACJA
    ========================================================= */
    const App = () => {
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const [activePoi, setActivePoi] = useState(POI_DATA[0]);
      const [hoveredHouse, setHoveredHouse] = useState(null);
      const [selectedHouse, setSelectedHouse] = useState(null);
      const [filter, setFilter] = useState('Wszystkie');
      const [galFilter, setGalFilter] = useState('Wszystkie');
      const [sent, setSent] = useState(false);

      useReveal();

      useEffect(() => {
        const onMove = (e) => requestAnimationFrame(() => setMousePos({ x: e.clientX, y: e.clientY }));
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
      }, []);

      useEffect(() => {
        if (selectedHouse) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
      }, [selectedHouse]);

      const filteredHouses = HOUSES_DATA.filter((h) => filter === 'Wszystkie' || h.status === filter);
      const filteredGallery = GALLERY.filter((g) => galFilter === 'Wszystkie' || g.cat === galFilter);
      const available = HOUSES_DATA.filter((h) => h.status === 'Dostępny').length;
      const px = window.innerWidth ? (mousePos.x / window.innerWidth - 0.5) : 0;
      const py = window.innerHeight ? (mousePos.y / window.innerHeight - 0.5) : 0;

      return (
        <div className="font-sans text-ink relative overflow-x-hidden">
          <Navbar />

          {/* ============ SEKCJA 1 — HERO ============ */}
          <section id="osiedle" className="relative min-h-screen w-full overflow-hidden flex items-center pt-28 pb-20">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[24vw] font-bold text-[#EFE7E2] opacity-60 whitespace-nowrap pointer-events-none tracking-tighter select-none mix-blend-multiply z-0">
              BURGUNDOWE
            </div>

            <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
              <div className="lg:col-span-5 flex flex-col justify-center relative z-20">
                <div className="flex items-center gap-4 mb-8" data-reveal>
                  <span className="w-12 h-px bg-burgundy"></span>
                  <span className="text-bronze text-sm uppercase tracking-[0.25em] font-medium">Etap II · Przedsprzedaż</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.04] mb-8" data-reveal>
                  Poczuj <br />
                  <span className="italic font-serif text-burgundy">swój azyl.</span>
                </h1>

                <p className="text-lg text-forest max-w-md leading-relaxed mb-10 font-light" data-reveal>
                  Zamykasz oczy i słyszysz szum sosen Wzniesień Łódzkich. Otwierasz je we własnym, energooszczędnym domu. Osiedle Burgundowe to naturalne przedłużenie sprawdzonego Osiedla Kasprowicza — natura i nowoczesność w jednym.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center" data-reveal>
                  <button onClick={() => document.getElementById('domy').scrollIntoView({ behavior: 'smooth' })} className="bg-ink text-cream px-9 py-4 rounded-full font-medium tracking-wide hover:bg-burgundy hover:shadow-xl hover:shadow-ink/15 transition-all duration-300 transform hover:-translate-y-0.5">
                    Wybierz dom
                  </button>
                  <button onClick={() => document.getElementById('lokalizacja').scrollIntoView({ behavior: 'smooth' })} className="px-7 py-4 rounded-full font-medium text-ink border border-ink/15 hover:border-burgundy hover:text-burgundy transition-all">
                    Poznaj okolicę
                  </button>
                </div>

                <div className="flex gap-10 mt-12 pt-8 border-t border-ink/10" data-reveal>
                  <div><div className="text-3xl font-serif text-ink">{available}</div><div className="text-xs uppercase tracking-widest text-bronze mt-1">domy dostępne</div></div>
                  <div><div className="text-3xl font-serif text-ink">2 km</div><div className="text-xs uppercase tracking-widest text-bronze mt-1">do węzła A1</div></div>
                  <div><div className="text-3xl font-serif text-ink">900 m</div><div className="text-xs uppercase tracking-widest text-bronze mt-1">do parku</div></div>
                </div>
              </div>

              <div className="lg:col-span-7 relative h-[58vh] lg:h-[80vh] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-ink/15 bg-[#EAE7DF] group">
                <img src={IMG.hero} onError={onImgError} alt="Nowoczesny dom Osiedle Burgundowe w otoczeniu natury"
                  className="absolute inset-0 w-[112%] h-[112%] object-cover object-center transition-transform duration-700 ease-out"
                  style={{ transform: `translate(${px * 22}px, ${py * 22}px)` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-cream">
                  <div className="backdrop-blur-md bg-ink/30 rounded-2xl px-5 py-3 border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-gold">Nowosolna · Łódź</div>
                    <div className="font-serif text-xl">Domy w zgodzie z naturą</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ SEKCJA 2 — EKOSYSTEM / LOKALIZACJA ============ */}
          <section id="lokalizacja" className="relative w-full bg-ink text-cream overflow-hidden py-28 md:py-32 rounded-t-[3rem] -mt-10 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-burgundy/10 rounded-full blur-[130px] pointer-events-none"></div>
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
              <div className="mb-16 md:mb-24 relative z-10" data-reveal>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Twój nowy <span className="italic font-serif text-gold">ekosystem.</span></h2>
                <p className="text-mist text-lg max-w-xl font-light leading-relaxed">
                  Nie kupujesz tylko metrażu — wybierasz styl życia. Nowosolna to najmodniejsza, najzieleńsza dzielnica Łodzi, a Burgundowe leży dokładnie tam, gdzie dzika natura spotyka się z pulsem miasta.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                <div className="lg:col-span-5 flex flex-col gap-4 relative z-10">
                  {POI_DATA.map((poi) => (
                    <div key={poi.id} onMouseEnter={() => setActivePoi(poi)} onClick={() => setActivePoi(poi)}
                      className={`cursor-pointer p-6 md:p-7 rounded-2xl transition-all duration-500 border ${activePoi.id === poi.id ? 'bg-white/10 border-white/20 backdrop-blur-md shadow-2xl scale-[1.02]' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{poi.icon}</span>
                          <div>
                            <h3 className="text-xl font-medium text-white">{poi.title}</h3>
                            <p className={`text-sm mt-1 transition-colors ${activePoi.id === poi.id ? 'text-gold' : 'text-mist'}`}>{poi.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-serif">{poi.time}</div>
                          <div className="text-xs text-mist uppercase tracking-widest">{poi.distance}</div>
                        </div>
                      </div>
                      <div className={`overflow-hidden transition-all duration-500 ${activePoi.id === poi.id ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <p className="text-mist font-light text-sm leading-relaxed border-t border-white/10 pt-4">{poi.description}</p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-mist/60 mt-2 px-1">Czasy i odległości orientacyjne — prosimy o potwierdzenie w biurze sprzedaży.</p>
                </div>

                <div className="lg:col-span-7 relative h-[460px] lg:h-[640px] w-full bg-[#141D17] rounded-[2rem] border border-white/5 overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-8">
                    <defs>
                      <filter id="glowPath" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.2" fill="none">
                      <path d="M 0 30 Q 20 20, 50 40 T 100 20" /><path d="M 0 50 Q 30 60, 60 30 T 100 50" /><circle cx="20" cy="20" r="15" />
                    </g>
                    {/* Gwieździste skrzyżowanie — symboliczne 8 promieni */}
                    <g transform="translate(50,50)" stroke="#E3A857" strokeOpacity="0.12" strokeWidth="0.25">
                      {[0,45,90,135,180,225,270,315].map((a) => (
                        <line key={a} x1="0" y1="0" x2={Math.cos(a*Math.PI/180)*40} y2={Math.sin(a*Math.PI/180)*40} />
                      ))}
                    </g>
                    <g transform="translate(50, 50)">
                      <circle r="4" fill="rgba(122,46,58,0.18)" className="animate-ping" />
                      <circle r="1.6" fill="#7A2E3A" />
                      <text x="3" y="-3" fill="#E3A857" fontSize="2.4" fontWeight="bold">BURGUNDOWE</text>
                    </g>
                    {POI_DATA.map((poi) => {
                      const isActive = activePoi.id === poi.id;
                      const { x: ex, y: ey } = poi.mapCoords;
                      return (
                        <g key={`m-${poi.id}`}>
                          <path d={`M 50 50 Q ${(50 + ex) / 2 + 5} ${(50 + ey) / 2 - 10}, ${ex} ${ey}`} fill="none" stroke="#E3A857" strokeWidth="0.8" filter="url(#glowPath)"
                            className="transition-all duration-1000" style={{ strokeDasharray: 150, strokeDashoffset: isActive ? 0 : 150, opacity: isActive ? 1 : 0 }} />
                          <g transform={`translate(${ex}, ${ey})`} className={`transition-all duration-500 ${isActive ? 'scale-125' : 'scale-100 opacity-40'}`}>
                            <circle r="1.5" fill={isActive ? '#ffffff' : '#A9B2AD'} />
                            <text x={ex > 50 ? -3 : 3} y="1" fill={isActive ? '#ffffff' : '#A9B2AD'} fontSize="2" textAnchor={ex > 50 ? 'end' : 'start'}>{poi.title}</text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="absolute bottom-5 left-5 text-[11px] text-mist/70 uppercase tracking-widest">Mapa poglądowa</div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ SEKCJA 3 — KATALOG DOMÓW ============ */}
          <section id="domy" className="relative w-full bg-white py-28 md:py-32 z-30 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] -mt-10">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-14 gap-8" data-reveal>
                <div>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Wybierz swój <span className="italic font-serif text-burgundy">nowy dom.</span></h2>
                  <p className="text-forest max-w-xl font-light">Najedź na budynek lub kartę, aby zobaczyć parametry. Kliknij segment, by otworzyć kartę z pełną specyfikacją i rzutami.</p>
                </div>
                <div className="flex bg-cream p-1.5 rounded-full border border-gray-200 shadow-inner self-start">
                  {['Wszystkie', 'Dostępny', 'Zarezerwowany', 'Sprzedany'].map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={`px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${filter === s ? 'bg-ink text-white shadow-md' : 'text-forest hover:text-ink'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 relative rounded-[2rem] overflow-hidden bg-[#EAE7DF] border border-gray-100 shadow-xl aspect-[16/10] group" data-reveal>
                  <img src={IMG.aerial} onError={onImgError} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="Plan osiedla z lotu ptaka" />
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
                    <defs>
                      <filter id="glassGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
                    </defs>
                    {filteredHouses.map((house) => {
                      const isHovered = hoveredHouse === house.id;
                      const sold = house.status === 'Sprzedany';
                      const meta = STATUS_META[house.status];
                      return (
                        <polygon key={house.id} points={house.polygon} className="transition-all duration-500 cursor-pointer"
                          fill={isHovered ? 'rgba(227,168,87,0.45)' : sold ? 'rgba(122,46,58,0.35)' : 'rgba(255,255,255,0.16)'}
                          stroke={isHovered ? '#E3A857' : (meta ? meta.dot : '#fff')} strokeWidth={isHovered ? 0.6 : 0.25} filter={isHovered ? 'url(#glassGlow)' : ''}
                          onMouseEnter={() => setHoveredHouse(house.id)} onMouseLeave={() => setHoveredHouse(null)} onClick={() => setSelectedHouse(house)} />
                      );
                    })}
                  </svg>
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-ink/35 text-cream rounded-xl px-4 py-2 text-xs uppercase tracking-widest border border-white/10 z-20">Etap II · Budynki A & B</div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3 lg:h-[560px] lg:overflow-y-auto pr-1 custom-scrollbar">
                  {filteredHouses.map((house) => {
                    const meta = STATUS_META[house.status];
                    const sold = house.status === 'Sprzedany';
                    return (
                      <div key={house.id} onMouseEnter={() => setHoveredHouse(house.id)} onMouseLeave={() => setHoveredHouse(null)} onClick={() => setSelectedHouse(house)}
                        className={`group flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${hoveredHouse === house.id ? 'bg-cream border-gold shadow-lg scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200'} ${sold ? 'opacity-60' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-[11px] text-gray-400 font-mono mb-1">ID: {house.id}</div>
                            <h3 className="text-lg font-medium group-hover:text-burgundy transition-colors">{house.name}</h3>
                          </div>
                          <span className={`text-[11px] px-3 py-1 rounded-full font-medium ${meta.chip}`}>{house.status}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm border-t border-gray-100 pt-3">
                          <div><div className="text-[11px] text-gray-400">Pow.</div><div className="font-medium">{house.area} m²</div></div>
                          <div><div className="text-[11px] text-gray-400">Pokoje</div><div className="font-medium">{house.rooms}</div></div>
                          <div><div className="text-[11px] text-gray-400">Działka</div><div className="font-medium">{house.plot} m²</div></div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-base font-serif font-medium">od {house.price.toLocaleString('pl-PL')} zł</div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${hoveredHouse === house.id ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredHouses.length === 0 && <div className="text-center text-gray-400 py-12 text-sm">Brak domów w tym statusie.</div>}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-6">Ceny orientacyjne. Aktualny cennik i dostępność potwierdzamy w biurze sprzedaży.</p>
            </div>
          </section>

          {/* ============ SEKCJA 4 — STANDARD + TABELA ============ */}
          <section id="standard" className="relative w-full bg-ink text-cream py-28 md:py-32 z-20">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
              <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto" data-reveal>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Standard <span className="italic font-serif text-gold">premium.</span></h2>
                <p className="text-mist text-lg font-light leading-relaxed">Nie idziemy na kompromisy. To, co inni oferują za dopłatą, u nas znajdziesz w standardzie — bo dom przyszłości powinien być oszczędny, cichy i zdrowy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
                {STANDARD_FEATURES.map((feat) => (
                  <div key={feat.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-gold/50 transition-all duration-300 group" data-reveal>
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold group-hover:text-ink transition-colors duration-300">{feat.icon}</svg>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3">{feat.title}</h3>
                    <p className="text-mist text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-cream rounded-[2.5rem] p-7 md:p-14 shadow-2xl relative overflow-hidden text-ink" data-reveal>
                <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy/10 rounded-bl-[100%] pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 relative z-10 gap-4">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-serif mb-2">Zestawienie lokali</h3>
                    <p className="text-forest font-light">Pełna lista segmentów i specyfikacja do pobrania.</p>
                  </div>
                  <button onClick={() => document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium uppercase tracking-widest text-bronze border-b border-bronze pb-1 hover:text-ink hover:border-ink transition-colors self-start">Pobierz prospekt (PDF)</button>
                </div>
                <div className="w-full overflow-x-auto relative z-10 custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {['ID Lokalu', 'Typ', 'Powierzchnia', 'Działka', 'Pokoje', 'Cena od', 'Status'].map((h) => (
                          <th key={h} className="py-4 px-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HOUSES_DATA.map((house) => {
                        const meta = STATUS_META[house.status];
                        return (
                          <tr key={house.id} className="border-b border-gray-100 hover:bg-white transition-colors cursor-pointer" onClick={() => setSelectedHouse(house)}>
                            <td className="py-4 px-5 font-medium">{house.id}</td>
                            <td className="py-4 px-5 text-gray-500">{house.type}</td>
                            <td className="py-4 px-5">{house.area} m²</td>
                            <td className="py-4 px-5">{house.plot} m²</td>
                            <td className="py-4 px-5">{house.rooms}</td>
                            <td className="py-4 px-5 font-serif font-medium">{house.price.toLocaleString('pl-PL')} zł</td>
                            <td className="py-4 px-5"><span className={`inline-block px-3 py-1 text-[11px] rounded-full font-medium ${meta.chip}`}>{house.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 text-[11px] text-gray-400 font-mono">{'//'} Miejsce na wtyczkę cennika (np. shortcode [bsdom_pricing_table]). Ceny orientacyjne — do potwierdzenia.</p>
              </div>
            </div>
          </section>

          {/* ============ SEKCJA 5 — GALERIA ============ */}
          <section id="galeria" className="relative w-full bg-cream py-28 md:py-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-8" data-reveal>
                <div>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Zobacz, jak tu <span className="italic font-serif text-burgundy">mieszka się.</span></h2>
                  <p className="text-forest max-w-xl font-light">Architektura, wnętrza i otoczenie. Zdjęcia poglądowe — wkrótce zastąpimy je realizacjami z osiedla.</p>
                </div>
                <div className="flex flex-wrap bg-white p-1.5 rounded-full border border-gray-200 shadow-inner self-start">
                  {GALLERY_FILTERS.map((f) => (
                    <button key={f} onClick={() => setGalFilter(f)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${galFilter === f ? 'bg-burgundy text-white shadow-md' : 'text-forest hover:text-ink'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] lg:auto-rows-[230px] gap-4">
                {filteredGallery.map((g, i) => (
                  <div key={i} className={`relative rounded-3xl overflow-hidden group bg-[#EAE7DF] ${galFilter === 'Wszystkie' ? g.span : ''}`} data-reveal>
                    <img src={g.src} onError={onImgError} alt={g.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-cream translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-[10px] uppercase tracking-widest text-gold">{g.cat}</span>
                      <div className="font-serif text-lg leading-tight">{g.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ SEKCJA 6 — O DEWELOPERZE ============ */}
          <section id="deweloper" className="relative w-full bg-white py-28 md:py-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                <div data-reveal>
                  <div className="flex items-center gap-4 mb-6"><span className="w-12 h-px bg-burgundy"></span><span className="text-bronze text-sm uppercase tracking-[0.25em]">O deweloperze</span></div>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Budujemy w Nowosolnej. <span className="italic font-serif text-burgundy">Naprawdę stąd.</span></h2>
                  <p className="text-forest font-light leading-relaxed mb-6">
                    <strong className="font-medium text-ink">BS DOM</strong> to lokalny, łódzki deweloper z biurem w samym sercu Nowosolnej — przy ul. Kasprowicza 1CB. Nie jesteśmy zdalną korporacją: budujemy tam, gdzie sami chcielibyśmy mieszkać.
                  </p>
                  <p className="text-forest font-light leading-relaxed mb-8">
                    Osiedle Burgundowe powstaje jako naturalne przedłużenie zrealizowanego Osiedla Kasprowicza. To dowód ciągłości — sąsiednią inwestycję już dostarczyliśmy, a Ty możesz ją zobaczyć na własne oczy, zanim podejmiesz decyzję.
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div><div className="text-2xl font-serif text-burgundy">Łódzki</div><div className="text-xs text-bronze uppercase tracking-widest mt-1">deweloper</div></div>
                    <div><div className="text-2xl font-serif text-burgundy">Premium</div><div className="text-xs text-bronze uppercase tracking-widest mt-1">standard</div></div>
                    <div><div className="text-2xl font-serif text-burgundy">Etap II</div><div className="text-xs text-bronze uppercase tracking-widest mt-1">Kasprowicza</div></div>
                  </div>
                </div>
                <div className="relative h-[420px] rounded-[2rem] overflow-hidden shadow-2xl bg-[#EAE7DF]" data-reveal>
                  <img src={IMG.portfolio.kasprowicza} onError={onImgError} alt="Osiedle Kasprowicza — sąsiednia inwestycja BS DOM" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-cream"><div className="text-xs uppercase tracking-widest text-gold">Zrealizowane</div><div className="font-serif text-2xl">Osiedle Kasprowicza</div></div>
                </div>
              </div>

              <h3 className="text-2xl font-serif mb-8 text-ink" data-reveal>Nasze inwestycje</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PORTFOLIO.map((p) => (
                  <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" className="relative h-72 rounded-3xl overflow-hidden group block bg-[#EAE7DF]" data-reveal>
                    <img src={p.img} onError={onImgError} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-cream">
                      <div className="font-serif text-2xl mb-1">{p.title}</div>
                      <div className="text-sm text-mist mb-3">{p.sub}</div>
                      <span className="inline-flex items-center gap-2 text-sm text-gold">Zobacz inwestycję <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ============ SEKCJA 7 — FINANSOWANIE ============ */}
          <section id="finansowanie" className="relative w-full bg-ink text-cream py-28 md:py-32 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[130px] pointer-events-none"></div>
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative h-[460px] rounded-[2rem] overflow-hidden shadow-2xl bg-[#141D17] order-2 lg:order-1" data-reveal>
                  <img src={IMG.advisor} onError={onImgError} alt="Doradca kredytowy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 backdrop-blur-md bg-ink/40 rounded-2xl px-5 py-4 border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-gold mb-1">Twój doradca</div>
                    <div className="font-serif text-xl text-white">Bezpłatna konsultacja kredytowa</div>
                  </div>
                </div>
                <div className="order-1 lg:order-2" data-reveal>
                  <div className="flex items-center gap-4 mb-6"><span className="w-12 h-px bg-gold"></span><span className="text-gold text-sm uppercase tracking-[0.25em]">Finansowanie</span></div>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">„A jak ja za to <span className="italic font-serif text-gold">zapłacę?”</span></h2>
                  <p className="text-mist font-light leading-relaxed mb-8">
                    Spokojnie — przeprowadzimy Cię przez to krok po kroku. Współpracujemy z niezależnym doradcą kredytowym, który bezpłatnie porówna oferty banków, policzy zdolność i pomoże skompletować dokumenty. Bez zobowiązań, bez ukrytych kosztów.
                  </p>
                  <ul className="space-y-4 mb-10">
                    {['Bezpłatna analiza zdolności kredytowej', 'Porównanie ofert wielu banków w jednym miejscu', 'Wsparcie w programach dopłat i formalnościach'].map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="mt-1 w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E3A857" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></span>
                        <span className="text-cream/90 font-light">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' })} className="bg-gold text-ink px-9 py-4 rounded-full font-medium hover:bg-cream transition-colors">Umów bezpłatną konsultację</button>
                </div>
              </div>
            </div>
          </section>

          {/* ============ SEKCJA 8 — KONTAKT + FOOTER ============ */}
          <section id="kontakt" className="relative w-full bg-cream pt-28 md:pt-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
              <div className="text-center max-w-2xl mx-auto mb-16" data-reveal>
                <div className="flex items-center justify-center gap-4 mb-6"><span className="w-12 h-px bg-burgundy"></span><span className="text-bronze text-sm uppercase tracking-[0.25em]">Kontakt</span><span className="w-12 h-px bg-burgundy"></span></div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Porozmawiajmy o <span className="italic font-serif text-burgundy">Twoim domu.</span></h2>
                <p className="text-forest font-light">Zostaw kontakt lub zadzwoń — oddzwonimy i umówimy spotkanie na osiedlu.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Formularz */}
                <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100" data-reveal>
                  {sent ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mb-6"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4A5D4E" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg></div>
                      <h3 className="text-2xl font-serif mb-2">Dziękujemy!</h3>
                      <p className="text-forest font-light">Odezwiemy się najszybciej, jak to możliwe.</p>
                      <button onClick={() => setSent(false)} className="mt-6 text-sm text-bronze underline">Wyślij kolejną wiadomość</button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="flex flex-col gap-2"><span className="text-sm text-forest">Imię i nazwisko</span><input required type="text" className="bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors" placeholder="Jan Kowalski" /></label>
                        <label className="flex flex-col gap-2"><span className="text-sm text-forest">Telefon</span><input required type="tel" className="bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors" placeholder="+48 600 000 000" /></label>
                      </div>
                      <label className="flex flex-col gap-2"><span className="text-sm text-forest">E-mail</span><input required type="email" className="bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors" placeholder="jan@example.com" /></label>
                      <label className="flex flex-col gap-2"><span className="text-sm text-forest">Wiadomość</span><textarea rows="4" className="bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors resize-none" placeholder="Interesuje mnie segment B.01..." /></label>
                      <label className="flex items-start gap-3 text-xs text-gray-500"><input required type="checkbox" className="mt-1 accent-burgundy" /><span>Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu zgodnie z polityką prywatności BS DOM sp. z o.o. (RODO).</span></label>
                      <button type="submit" className="bg-ink text-cream py-4 rounded-full font-medium hover:bg-burgundy transition-colors mt-2">Wyślij zapytanie</button>
                    </form>
                  )}
                </div>

                {/* Dane biura + agent */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-ink text-cream rounded-[2rem] p-8 shadow-xl flex items-center gap-5" data-reveal>
                    <img src={IMG.agent} onError={onImgError} alt="Sylwia Kozicka — biuro sprzedaży" className="w-20 h-20 rounded-2xl object-cover bg-[#141D17] shrink-0" />
                    <div>
                      <div className="text-xs uppercase tracking-widest text-gold mb-1">Biuro sprzedaży</div>
                      <div className="font-serif text-2xl leading-tight">Sylwia Kozicka</div>
                      <div className="text-mist text-sm">Doradca ds. sprzedaży</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col gap-5" data-reveal>
                    <a href="tel:+48881766550" className="flex items-center gap-4 group">
                      <span className="w-11 h-11 rounded-full bg-burgundy/10 flex items-center justify-center group-hover:bg-burgundy transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A2E3A" strokeWidth="2" className="group-hover:stroke-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg></span>
                      <div><div className="text-xs text-gray-400">Telefon</div><div className="font-medium">+48 881 766 550</div></div>
                    </a>
                    <a href="mailto:biuro@bsdom.pl" className="flex items-center gap-4 group">
                      <span className="w-11 h-11 rounded-full bg-burgundy/10 flex items-center justify-center group-hover:bg-burgundy transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A2E3A" strokeWidth="2" className="group-hover:stroke-white"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg></span>
                      <div><div className="text-xs text-gray-400">E-mail</div><div className="font-medium">biuro@bsdom.pl</div></div>
                    </a>
                    <div className="flex items-center gap-4">
                      <span className="w-11 h-11 rounded-full bg-burgundy/10 flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A2E3A" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></span>
                      <div><div className="text-xs text-gray-400">Biuro sprzedaży</div><div className="font-medium">ul. Kasprowicza 1CB, 92-781 Łódź</div></div>
                    </div>
                  </div>
                  <div className="rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 h-56 lg:flex-1 min-h-[220px]" data-reveal>
                    <iframe title="Mapa dojazdu" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                      src="https://maps.google.com/maps?q=Kasprowicza%201CB%2C%20Nowosolna%2C%20%C5%81%C3%B3d%C5%BA&z=14&output=embed"></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <footer className="mt-28 bg-ink text-cream">
              <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-9 h-9 rounded-full bg-burgundy flex items-center justify-center text-cream font-serif text-lg">B</span>
                      <span className="font-medium tracking-tight text-lg">Osiedle Burgundowe</span>
                    </div>
                    <p className="text-mist font-light max-w-sm leading-relaxed">Premium domy w zabudowie szeregowej w Nowosolnej — przedłużenie Osiedla Kasprowicza. Natura Wzniesień Łódzkich i nowoczesny, energooszczędny standard w jednym.</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gold mb-4">Nawigacja</div>
                    <ul className="space-y-2.5 text-mist">
                      {NAV_LINKS.map((l) => (<li key={l.id}><button onClick={() => document.getElementById(l.id).scrollIntoView({ behavior: 'smooth' })} className="hover:text-gold transition-colors">{l.label}</button></li>))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gold mb-4">Kontakt</div>
                    <ul className="space-y-2.5 text-mist">
                      <li><a href="tel:+48881766550" className="hover:text-gold transition-colors">+48 881 766 550</a></li>
                      <li><a href="mailto:biuro@bsdom.pl" className="hover:text-gold transition-colors">biuro@bsdom.pl</a></li>
                      <li>ul. Kasprowicza 1CB<br />92-781 Łódź</li>
                      <li className="pt-2"><a href="https://bsdom.pl" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">bsdom.pl</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-mist/70">
                  <span>© {new Date().getFullYear()} BS DOM sp. z o.o. Wszelkie prawa zastrzeżone.</span>
                  <span>Wizualizacje i ceny mają charakter poglądowy i nie stanowią oferty w rozumieniu art. 66 §1 K.C.</span>
                </div>
              </div>
            </footer>
          </section>

          {/* ============ MODAL — KARTA DOMU ============ */}
          <div className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-[80] transition-opacity duration-500 ${selectedHouse ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSelectedHouse(null)}></div>
          <div className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-cream z-[90] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto custom-scrollbar ${selectedHouse ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedHouse && (() => {
              const meta = STATUS_META[selectedHouse.status];
              const sold = selectedHouse.status === 'Sprzedany';
              return (
                <div className="p-8 md:p-12 relative min-h-full flex flex-col">
                  <button onClick={() => setSelectedHouse(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white hover:rotate-90 transition-all duration-300 text-gray-500"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                  <div className="mb-8 mt-2">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 ${meta.solid}`}>{selectedHouse.status}</span>
                    <h2 className="text-4xl font-serif mb-2">{selectedHouse.name}</h2>
                    <p className="text-gray-500 font-mono text-sm">ID LOKALU: {selectedHouse.id}</p>
                  </div>
                  <div className="w-full bg-white rounded-2xl border border-gray-200 aspect-[4/3] flex items-center justify-center mb-8 shadow-sm relative overflow-hidden group">
                    <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 stroke-gray-300 group-hover:stroke-burgundy transition-colors duration-500" fill="none" strokeWidth="1"><rect x="20" y="20" width="60" height="60" /><line x1="50" y1="20" x2="50" y2="80" /><line x1="20" y1="50" x2="80" y2="50" /><circle cx="50" cy="50" r="5" fill="#F9F8F4" /></svg>
                    <span className="absolute bottom-4 text-xs font-bold text-gray-400 tracking-widest uppercase">Podgląd rzutu</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
                    <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Typ budynku</div><div className="font-medium">{selectedHouse.type}</div></div>
                    <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pokoje</div><div className="font-medium">{selectedHouse.rooms}</div></div>
                    <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Powierzchnia użytkowa</div><div className="font-medium">{selectedHouse.area} m²</div></div>
                    <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Działka</div><div className="font-medium">{selectedHouse.plot} m²</div></div>
                  </div>
                  <div className="mt-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-end mb-6">
                      <div><div className="text-sm text-gray-500 mb-1">Cena orientacyjna od</div><div className="text-3xl font-serif font-medium">{selectedHouse.price.toLocaleString('pl-PL')} <span className="text-xl text-gray-400">zł</span></div></div>
                      <div className="text-right"><div className="text-sm text-gray-500 mb-1">Cena za m²</div><div className="text-lg font-medium">{Math.round(selectedHouse.price / selectedHouse.area).toLocaleString('pl-PL')} zł</div></div>
                    </div>
                    <div className="flex gap-4">
                      <button disabled={sold} onClick={() => { setSelectedHouse(null); document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' }); }} className={`flex-1 py-4 rounded-xl font-medium transition-all ${sold ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-ink text-white hover:bg-burgundy'}`}>{sold ? 'Niedostępny' : 'Zapytaj o ten dom'}</button>
                      <button className="flex-1 py-4 bg-white border border-ink/20 rounded-xl font-medium hover:border-burgundy hover:text-burgundy transition-all flex items-center justify-center gap-2 group"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current transition-transform group-hover:-translate-y-1" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Pobierz rzuty</button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      );
    };

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
