const {
  useState,
  useEffect,
  useRef
} = React;

/* =========================================================
   ZDJĘCIA STOCKOWE (Unsplash) — podmienić na realne od klienta
   Każdy <img> ma onError → tło-fallback, więc strona nigdy się nie "rozsypie".
========================================================= */
const IMG = {
  hero: 'BRZE3/4.png',
  aerial: 'BRZE3/1.png',
  gallery: {
    ext1: 'BRZE3/5.png',
    ext2: 'BRZE3/12.png',
    int1: 'BRZE3/10.png',
    int2: 'BRZE3/11.png',
    int3: 'BRZE3/7.png',
    sur1: 'BRZE3/6.png',
    sur2: 'BRZE3/15.png',
    ext3: 'BRZE3/3.png'
  },
  portfolio: {
    kasprowicza: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80',
    wierzchucino: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80',
    bsdom: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80'
  },
  floorPlanA: 'BRZE3/17.png',
  floorPlanB: 'BRZE3/18.png',
  advisor: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
  agent: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80'
};
const onImgError = e => {
  e.target.style.opacity = 0;
  if (e.target.parentElement) e.target.parentElement.classList.add('img-fallback');
};

/* =========================================================
   DANE
========================================================= */

// Sekcja 2 — Punkty użyteczności (POI). Czasy/odległości orientacyjne — do potwierdzenia.
const POI_DATA = [{
  id: 'nature',
  title: 'Park Krajobrazowy',
  subtitle: 'Wzniesienia Łódzkie',
  time: '3 min',
  distance: '900 m',
  icon: '🌲',
  description: 'Park Krajobrazowy Wzniesień Łódzkich tuż za płotem. Lasy sosnowe, łąki i dolina rzeki Miazgi — kilometry tras spacerowych i rowerowych zaraz za Twoimi drzwiami.',
  mapCoords: {
    x: 18,
    y: 22
  }
}, {
  id: 'local',
  title: 'Centrum Nowosolnej',
  subtitle: 'Sklepy, szkoły, usługi',
  time: '4 min',
  distance: '1.1 km',
  icon: '🥐',
  description: 'Słynne Gwieździste Skrzyżowanie — ośmioramienna gwiazda, jedno z dwóch takich miejsc w Europie. Sklepy, przedszkola i szkoły w zasięgu krótkiego spaceru.',
  mapCoords: {
    x: 68,
    y: 38
  }
}, {
  id: 'highway',
  title: 'Autostrada A1',
  subtitle: 'Węzeł Brzeziny',
  time: '5 min',
  distance: '2.0 km',
  icon: '🛣️',
  description: 'Węzeł autostrady A1 zaledwie 2 km od osiedla, A2 (Stryków) ok. 7 km. Cała Polska w zasięgu ręki, a Ty wracasz do ciszy przedmieść.',
  mapCoords: {
    x: 82,
    y: 72
  }
}, {
  id: 'city',
  title: 'Centrum Łodzi',
  subtitle: 'Praca i kultura',
  time: '~20 min',
  distance: '~12 km',
  icon: '🏛️',
  description: 'Bezkolizyjny dojazd do serca miasta wschodnim wlotem do Łodzi. Idealny balans między pracą w mieście a życiem w zgodzie z naturą.',
  mapCoords: {
    x: 35,
    y: 84
  }
}];

// Sekcja 3/4 — Domy. Ceny ORIENTACYJNE — do potwierdzenia z aktualnym cennikiem dewelopera.
const HOUSES_DATA = [{
  id: '3.0.A.01',
  name: 'Segment A.01',
  type: 'Skrajny',
  status: 'Dostępny',
  area: 86.5,
  rooms: 4,
  plot: 220,
  price: 789000,
  polygon: '8,52 30,42 40,58 18,70',
  variant: 'A'
}, {
  id: '3.0.A.02',
  name: 'Segment A.02',
  type: 'Środkowy',
  status: 'Zarezerwowany',
  area: 84.0,
  rooms: 4,
  plot: 165,
  price: 759000,
  polygon: '30,42 52,32 62,48 40,58',
  variant: 'A'
}, {
  id: '3.0.A.03',
  name: 'Segment A.03',
  type: 'Środkowy',
  status: 'Dostępny',
  area: 84.0,
  rooms: 4,
  plot: 165,
  price: 765000,
  polygon: '52,32 74,22 84,38 62,48',
  variant: 'A'
}, {
  id: '3.0.A.04',
  name: 'Segment A.04',
  type: 'Skrajny',
  status: 'Sprzedany',
  area: 88.0,
  rooms: 5,
  plot: 240,
  price: 815000,
  polygon: '74,22 94,13 99,30 84,38',
  variant: 'A'
}, {
  id: '3.0.B.01',
  name: 'Segment B.01',
  type: 'Skrajny',
  status: 'Dostępny',
  area: 112.0,
  rooms: 5,
  plot: 310,
  price: 985000,
  polygon: '8,78 30,70 40,86 18,96',
  variant: 'B'
}, {
  id: '3.0.B.02',
  name: 'Segment B.02',
  type: 'Środkowy',
  status: 'Dostępny',
  area: 96.5,
  rooms: 4,
  plot: 180,
  price: 869000,
  polygon: '30,70 54,60 64,76 40,86',
  variant: 'B'
}];
const STATUS_META = {
  'Dostępny': {
    dot: '#4A5D4E',
    chip: 'bg-forest/10 text-forest',
    solid: 'bg-forest text-white'
  },
  'Zarezerwowany': {
    dot: '#E3A857',
    chip: 'bg-gold/15 text-bronze',
    solid: 'bg-gold text-ink'
  },
  'Sprzedany': {
    dot: '#7A2E3A',
    chip: 'bg-burgundy/10 text-burgundy',
    solid: 'bg-burgundy text-white'
  }
};

// Sekcja 4 — Standard
const STANDARD_FEATURES = [{
  id: 'heat',
  title: 'Pompa ciepła',
  desc: 'Wysokowydajna pompa ciepła w standardzie. Niskie rachunki za ogrzewanie zimą i komfortowe chłodzenie latem — bez gazu, bez smogu.',
  icon: /*#__PURE__*/React.createElement("path", {
    d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
  })
}, {
  id: 'recup',
  title: 'Rekuperacja',
  desc: 'Wentylacja mechaniczna z odzyskiem ciepła. Zawsze świeże, przefiltrowane powietrze bez utraty energii — ulga dla alergików.',
  icon: /*#__PURE__*/React.createElement("path", {
    d: "M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3"
  })
}, {
  id: 'fiber',
  title: 'Światłowód',
  desc: 'Szybki internet światłowodowy doprowadzony na całe osiedle. Praca zdalna i streaming bez kompromisów od pierwszego dnia.',
  icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"
  }))
}, {
  id: 'glass',
  title: 'Duże przeszklenia',
  desc: 'Wielkoformatowe okna i drzwi tarasowe. Zacieramy granicę między salonem a Twoim prywatnym ogrodem.',
  icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "9",
    x2: "21",
    y2: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "21",
    x2: "9",
    y2: "9"
  }))
}];

// Sekcja 5 — Galeria
const GALLERY = [{
  src: IMG.gallery.ext1,
  cat: 'Architektura',
  label: 'Osiedle z perspektywy',
  span: 'lg:col-span-2 lg:row-span-2'
}, {
  src: IMG.gallery.int1,
  cat: 'Wnętrza',
  label: 'Gabinet w wieczornym świetle',
  span: 'lg:col-span-1 lg:row-span-1'
}, {
  src: IMG.gallery.sur1,
  cat: 'Otoczenie',
  label: 'Osiedle nocą',
  span: 'lg:col-span-1 lg:row-span-1'
}, {
  src: IMG.gallery.int2,
  cat: 'Wnętrza',
  label: 'Salon z biblioteką',
  span: 'lg:col-span-1 lg:row-span-2'
}, {
  src: IMG.gallery.ext2,
  cat: 'Architektura',
  label: 'Fasada nocna',
  span: 'lg:col-span-1 lg:row-span-1'
}, {
  src: IMG.gallery.sur2,
  cat: 'Otoczenie',
  label: 'Złota jesień w Nowosolnej',
  span: 'lg:col-span-1 lg:row-span-1'
}, {
  src: IMG.gallery.int3,
  cat: 'Wnętrza',
  label: 'Strefa dzienna wieczorem',
  span: 'lg:col-span-2 lg:row-span-1'
}, {
  src: IMG.gallery.ext3,
  cat: 'Architektura',
  label: 'Strefa wejściowa',
  span: 'lg:col-span-1 lg:row-span-1'
}];
const GALLERY_FILTERS = ['Wszystkie', 'Architektura', 'Wnętrza', 'Otoczenie'];

// Sekcja 6 — Portfolio dewelopera (realne inwestycje BS DOM)
const PORTFOLIO = [{
  title: 'Osiedle Kasprowicza',
  sub: 'Nowosolna, Łódź — sąsiednia inwestycja',
  img: IMG.portfolio.kasprowicza,
  href: 'https://domynowosolna.pl'
}, {
  title: 'Domy Wierzchucino',
  sub: 'Pomorskie — domy nad morzem',
  img: IMG.portfolio.wierzchucino,
  href: 'https://domywierzchucino.pl'
}, {
  title: 'BS DOM',
  sub: 'Wszystkie inwestycje dewelopera',
  img: IMG.portfolio.bsdom,
  href: 'https://bsdom.pl'
}];
const NAV_LINKS = [{
  id: 'osiedle',
  label: 'Osiedle'
}, {
  id: 'lokalizacja',
  label: 'Lokalizacja'
}, {
  id: 'domy',
  label: 'Domy'
}, {
  id: 'standard',
  label: 'Standard'
}, {
  id: 'galeria',
  label: 'Galeria'
}, {
  id: 'deweloper',
  label: 'Deweloper'
}, {
  id: 'kontakt',
  label: 'Kontakt'
}];

/* =========================================================
   HOOK: scroll reveal
========================================================= */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, {
      threshold: 0.12
    });
    els.forEach(el => io.observe(el));
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
  const go = id => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement("header", {
    className: `fixed top-0 inset-x-0 z-[60] transition-all duration-500 ${scrolled ? 'bg-cream/80 backdrop-blur-xl border-b border-ink/5 shadow-sm py-3' : 'bg-transparent py-5'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('osiedle'),
    className: "flex items-center gap-3 group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-9 h-9 rounded-full bg-burgundy flex items-center justify-center text-cream font-serif text-lg leading-none group-hover:bg-ink transition-colors"
  }, "B"), /*#__PURE__*/React.createElement("span", {
    className: "leading-tight text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block font-medium tracking-tight text-ink"
  }, "Osiedle Burgundowe"), /*#__PURE__*/React.createElement("span", {
    className: "block text-[10px] uppercase tracking-[0.25em] text-bronze"
  }, "Nowosolna \xB7 \u0141\xF3d\u017A"))), /*#__PURE__*/React.createElement("nav", {
    className: "hidden lg:flex items-center gap-8"
  }, NAV_LINKS.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    onClick: () => go(l.id),
    className: "text-sm text-forest hover:text-burgundy transition-colors tracking-wide"
  }, l.label)), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('kontakt'),
    className: "bg-ink text-cream px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy transition-colors"
  }, "Um\xF3w spotkanie")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    className: "lg:hidden w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center text-ink",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }, open ? /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "7",
    x2: "21",
    y2: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "17",
    x2: "21",
    y2: "17"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: `lg:hidden overflow-hidden transition-all duration-500 ${open ? 'max-h-[480px]' : 'max-h-0'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-6 mt-2 mx-4 bg-cream/95 backdrop-blur-xl rounded-3xl border border-ink/5 shadow-xl flex flex-col gap-1"
  }, NAV_LINKS.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    onClick: () => go(l.id),
    className: "text-left py-3 px-4 rounded-xl text-forest hover:bg-ink/5 transition-colors"
  }, l.label)), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('kontakt'),
    className: "mt-2 bg-ink text-cream py-3.5 rounded-full font-medium"
  }, "Um\xF3w spotkanie"))));
};

/* =========================================================
   APLIKACJA
========================================================= */
const App = () => {
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0
  });
  const [activePoi, setActivePoi] = useState(POI_DATA[0]);
  const [hoveredHouse, setHoveredHouse] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [filter, setFilter] = useState('Wszystkie');
  const [galFilter, setGalFilter] = useState('Wszystkie');
  const [sent, setSent] = useState(false);
  useReveal();
  useEffect(() => {
    const onMove = e => requestAnimationFrame(() => setMousePos({
      x: e.clientX,
      y: e.clientY
    }));
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  useEffect(() => {
    if (selectedHouse) document.body.style.overflow = 'hidden';else document.body.style.overflow = '';
  }, [selectedHouse]);
  const filteredHouses = HOUSES_DATA.filter(h => filter === 'Wszystkie' || h.status === filter);
  const filteredGallery = GALLERY.filter(g => galFilter === 'Wszystkie' || g.cat === galFilter);
  const available = HOUSES_DATA.filter(h => h.status === 'Dostępny').length;
  const px = window.innerWidth ? mousePos.x / window.innerWidth - 0.5 : 0;
  const py = window.innerHeight ? mousePos.y / window.innerHeight - 0.5 : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "font-sans text-ink relative overflow-x-hidden"
  }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("section", {
    id: "osiedle",
    className: "relative min-h-screen w-full overflow-hidden flex items-center pt-28 pb-20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute -left-10 top-1/2 -translate-y-1/2 text-[24vw] font-bold text-[#EFE7E2] opacity-60 whitespace-nowrap pointer-events-none tracking-tighter select-none mix-blend-multiply z-0"
  }, "BURGUNDOWE"), /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 flex flex-col justify-center relative z-20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-8",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 h-px bg-burgundy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-bronze text-sm uppercase tracking-[0.25em] font-medium"
  }, "Etap II \xB7 Przedsprzeda\u017C")), /*#__PURE__*/React.createElement("h1", {
    className: "text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.04] mb-8",
    "data-reveal": true
  }, "Poczuj ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-burgundy"
  }, "sw\xF3j azyl.")), /*#__PURE__*/React.createElement("p", {
    className: "text-lg text-forest max-w-md leading-relaxed mb-10 font-light",
    "data-reveal": true
  }, "Zamykasz oczy i s\u0142yszysz szum sosen Wzniesie\u0144 \u0141\xF3dzkich. Otwierasz je we w\u0142asnym, energooszcz\u0119dnym domu. Osiedle Burgundowe to naturalne przed\u0142u\u017Cenie sprawdzonego Osiedla Kasprowicza \u2014 natura i nowoczesno\u015B\u0107 w jednym."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => document.getElementById('domy').scrollIntoView({
      behavior: 'smooth'
    }),
    className: "bg-ink text-cream px-9 py-4 rounded-full font-medium tracking-wide hover:bg-burgundy hover:shadow-xl hover:shadow-ink/15 transition-all duration-300 transform hover:-translate-y-0.5"
  }, "Wybierz dom"), /*#__PURE__*/React.createElement("button", {
    onClick: () => document.getElementById('lokalizacja').scrollIntoView({
      behavior: 'smooth'
    }),
    className: "px-7 py-4 rounded-full font-medium text-ink border border-ink/15 hover:border-burgundy hover:text-burgundy transition-all"
  }, "Poznaj okolic\u0119")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-10 mt-12 pt-8 border-t border-ink/10",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-serif text-ink"
  }, available), /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-bronze mt-1"
  }, "domy dost\u0119pne")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-serif text-ink"
  }, "2 km"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-bronze mt-1"
  }, "do w\u0119z\u0142a A1")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-serif text-ink"
  }, "900 m"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-bronze mt-1"
  }, "do parku")))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 relative h-[58vh] lg:h-[80vh] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-ink/15 bg-[#EAE7DF] group"
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.hero,
    onError: onImgError,
    alt: "Nowoczesny dom Osiedle Burgundowe w otoczeniu natury",
    className: "absolute inset-0 w-[112%] h-[112%] object-cover object-center transition-transform duration-700 ease-out",
    style: {
      transform: `translate(${px * 22}px, ${py * 22}px)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-6 left-6 right-6 flex items-end justify-between text-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "backdrop-blur-md bg-ink/30 rounded-2xl px-5 py-3 border border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-gold"
  }, "Nowosolna \xB7 \u0141\xF3d\u017A"), /*#__PURE__*/React.createElement("div", {
    className: "font-serif text-xl"
  }, "Domy w zgodzie z natur\u0105")))))), /*#__PURE__*/React.createElement("section", {
    id: "lokalizacja",
    className: "relative w-full bg-ink text-cream overflow-hidden py-28 md:py-32 rounded-t-[3rem] -mt-10 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-[800px] h-[800px] bg-burgundy/10 rounded-full blur-[130px] pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-16 md:mb-24 relative z-10",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-6xl font-medium tracking-tight mb-6"
  }, "Tw\xF3j nowy ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-gold"
  }, "ekosystem.")), /*#__PURE__*/React.createElement("p", {
    className: "text-mist text-lg max-w-xl font-light leading-relaxed"
  }, "Nie kupujesz tylko metra\u017Cu \u2014 wybierasz styl \u017Cycia. Nowosolna to najmodniejsza, najziele\u0144sza dzielnica \u0141odzi, a Burgundowe le\u017Cy dok\u0142adnie tam, gdzie dzika natura spotyka si\u0119 z pulsem miasta.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 flex flex-col gap-4 relative z-10"
  }, POI_DATA.map(poi => /*#__PURE__*/React.createElement("div", {
    key: poi.id,
    onMouseEnter: () => setActivePoi(poi),
    onClick: () => setActivePoi(poi),
    className: `cursor-pointer p-6 md:p-7 rounded-2xl transition-all duration-500 border ${activePoi.id === poi.id ? 'bg-white/10 border-white/20 backdrop-blur-md shadow-2xl scale-[1.02]' : 'bg-transparent border-white/5 hover:bg-white/5'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, poi.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium text-white"
  }, poi.title), /*#__PURE__*/React.createElement("p", {
    className: `text-sm mt-1 transition-colors ${activePoi.id === poi.id ? 'text-gold' : 'text-mist'}`
  }, poi.subtitle))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-serif"
  }, poi.time), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-mist uppercase tracking-widest"
  }, poi.distance))), /*#__PURE__*/React.createElement("div", {
    className: `overflow-hidden transition-all duration-500 ${activePoi.id === poi.id ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-mist font-light text-sm leading-relaxed border-t border-white/10 pt-4"
  }, poi.description)))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-mist/60 mt-2 px-1"
  }, "Czasy i odleg\u0142o\u015Bci orientacyjne \u2014 prosimy o potwierdzenie w biurze sprzeda\u017Cy.")), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 relative h-[460px] lg:h-[640px] w-full bg-[#141D17] rounded-[2rem] border border-white/5 overflow-hidden"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: "w-full h-full p-8"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "glowPath",
    x: "-20%",
    y: "-20%",
    width: "140%",
    height: "140%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "1.5",
    result: "blur"
  }), /*#__PURE__*/React.createElement("feComposite", {
    in: "SourceGraphic",
    in2: "blur",
    operator: "over"
  }))), /*#__PURE__*/React.createElement("g", {
    stroke: "#ffffff",
    strokeOpacity: "0.04",
    strokeWidth: "0.2",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 30 Q 20 20, 50 40 T 100 20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 0 50 Q 30 60, 60 30 T 100 50"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "20",
    r: "15"
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(50,50)",
    stroke: "#E3A857",
    strokeOpacity: "0.12",
    strokeWidth: "0.25"
  }, [0, 45, 90, 135, 180, 225, 270, 315].map(a => /*#__PURE__*/React.createElement("line", {
    key: a,
    x1: "0",
    y1: "0",
    x2: Math.cos(a * Math.PI / 180) * 40,
    y2: Math.sin(a * Math.PI / 180) * 40
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(50, 50)"
  }, /*#__PURE__*/React.createElement("circle", {
    r: "4",
    fill: "rgba(122,46,58,0.18)",
    className: "animate-ping"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "1.6",
    fill: "#7A2E3A"
  }), /*#__PURE__*/React.createElement("text", {
    x: "3",
    y: "-3",
    fill: "#E3A857",
    fontSize: "2.4",
    fontWeight: "bold"
  }, "BURGUNDOWE")), POI_DATA.map(poi => {
    const isActive = activePoi.id === poi.id;
    const {
      x: ex,
      y: ey
    } = poi.mapCoords;
    return /*#__PURE__*/React.createElement("g", {
      key: `m-${poi.id}`
    }, /*#__PURE__*/React.createElement("path", {
      d: `M 50 50 Q ${(50 + ex) / 2 + 5} ${(50 + ey) / 2 - 10}, ${ex} ${ey}`,
      fill: "none",
      stroke: "#E3A857",
      strokeWidth: "0.8",
      filter: "url(#glowPath)",
      className: "transition-all duration-1000",
      style: {
        strokeDasharray: 150,
        strokeDashoffset: isActive ? 0 : 150,
        opacity: isActive ? 1 : 0
      }
    }), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${ex}, ${ey})`,
      className: `transition-all duration-500 ${isActive ? 'scale-125' : 'scale-100 opacity-40'}`
    }, /*#__PURE__*/React.createElement("circle", {
      r: "1.5",
      fill: isActive ? '#ffffff' : '#A9B2AD'
    }), /*#__PURE__*/React.createElement("text", {
      x: ex > 50 ? -3 : 3,
      y: "1",
      fill: isActive ? '#ffffff' : '#A9B2AD',
      fontSize: "2",
      textAnchor: ex > 50 ? 'end' : 'start'
    }, poi.title)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-5 left-5 text-[11px] text-mist/70 uppercase tracking-widest"
  }, "Mapa pogl\u0105dowa"))))), /*#__PURE__*/React.createElement("section", {
    id: "domy",
    className: "relative w-full bg-white py-28 md:py-32 z-30 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] -mt-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row justify-between md:items-end mb-14 gap-8",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-5xl font-medium tracking-tight mb-4"
  }, "Wybierz sw\xF3j ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-burgundy"
  }, "nowy dom.")), /*#__PURE__*/React.createElement("p", {
    className: "text-forest max-w-xl font-light"
  }, "Najed\u017A na budynek lub kart\u0119, aby zobaczy\u0107 parametry. Kliknij segment, by otworzy\u0107 kart\u0119 z pe\u0142n\u0105 specyfikacj\u0105 i rzutami.")), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-cream p-1.5 rounded-full border border-gray-200 shadow-inner self-start"
  }, ['Wszystkie', 'Dostępny', 'Zarezerwowany', 'Sprzedany'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setFilter(s),
    className: `px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${filter === s ? 'bg-ink text-white shadow-md' : 'text-forest hover:text-ink'}`
  }, s)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-8 relative rounded-[2rem] overflow-hidden bg-[#EAE7DF] border border-gray-100 shadow-xl aspect-[16/10] group",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.aerial,
    onError: onImgError,
    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105",
    alt: "Plan osiedla z lotu ptaka"
  }), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    className: "absolute inset-0 w-full h-full z-10"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "glassGlow",
    x: "-20%",
    y: "-20%",
    width: "140%",
    height: "140%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "1.5",
    result: "blur"
  }), /*#__PURE__*/React.createElement("feComposite", {
    in: "SourceGraphic",
    in2: "blur",
    operator: "over"
  }))), filteredHouses.map(house => {
    const isHovered = hoveredHouse === house.id;
    const sold = house.status === 'Sprzedany';
    const meta = STATUS_META[house.status];
    return /*#__PURE__*/React.createElement("polygon", {
      key: house.id,
      points: house.polygon,
      className: "transition-all duration-500 cursor-pointer",
      fill: isHovered ? 'rgba(227,168,87,0.45)' : sold ? 'rgba(122,46,58,0.35)' : 'rgba(255,255,255,0.16)',
      stroke: isHovered ? '#E3A857' : meta ? meta.dot : '#fff',
      strokeWidth: isHovered ? 0.6 : 0.25,
      filter: isHovered ? 'url(#glassGlow)' : '',
      onMouseEnter: () => setHoveredHouse(house.id),
      onMouseLeave: () => setHoveredHouse(null),
      onClick: () => setSelectedHouse(house)
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-4 left-4 backdrop-blur-md bg-ink/35 text-cream rounded-xl px-4 py-2 text-xs uppercase tracking-widest border border-white/10 z-20"
  }, "Etap II \xB7 Budynki A & B")), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-4 flex flex-col gap-3 lg:h-[560px] lg:overflow-y-auto pr-1 custom-scrollbar"
  }, filteredHouses.map(house => {
    const meta = STATUS_META[house.status];
    const sold = house.status === 'Sprzedany';
    return /*#__PURE__*/React.createElement("div", {
      key: house.id,
      onMouseEnter: () => setHoveredHouse(house.id),
      onMouseLeave: () => setHoveredHouse(null),
      onClick: () => setSelectedHouse(house),
      className: `group flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${hoveredHouse === house.id ? 'bg-cream border-gold shadow-lg scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200'} ${sold ? 'opacity-60' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start mb-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-gray-400 font-mono mb-1"
    }, "ID: ", house.id), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-medium group-hover:text-burgundy transition-colors"
    }, house.name)), /*#__PURE__*/React.createElement("span", {
      className: `text-[11px] px-3 py-1 rounded-full font-medium ${meta.chip}`
    }, house.status)), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2 text-sm border-t border-gray-100 pt-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-gray-400"
    }, "Pow."), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, house.area, " m\xB2")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-gray-400"
    }, "Pokoje"), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, house.rooms)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-gray-400"
    }, "Dzia\u0142ka"), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, house.plot, " m\xB2"))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 flex justify-between items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-serif font-medium"
    }, "od ", house.price.toLocaleString('pl-PL'), " z\u0142"), /*#__PURE__*/React.createElement("div", {
      className: `w-8 h-8 rounded-full flex items-center justify-center transition-colors ${hoveredHouse === house.id ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-400'}`
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14M12 5l7 7-7 7"
    })))));
  }), filteredHouses.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center text-gray-400 py-12 text-sm"
  }, "Brak dom\xF3w w tym statusie."))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 mt-6"
  }, "Ceny orientacyjne. Aktualny cennik i dost\u0119pno\u015B\u0107 potwierdzamy w biurze sprzeda\u017Cy."))), /*#__PURE__*/React.createElement("section", {
    id: "standard",
    className: "relative w-full bg-ink text-cream py-28 md:py-32 z-20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-16 md:mb-24 text-center max-w-3xl mx-auto",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-5xl font-medium tracking-tight mb-6"
  }, "Standard ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-gold"
  }, "premium.")), /*#__PURE__*/React.createElement("p", {
    className: "text-mist text-lg font-light leading-relaxed"
  }, "Nie idziemy na kompromisy. To, co inni oferuj\u0105 za dop\u0142at\u0105, u nas znajdziesz w standardzie \u2014 bo dom przysz\u0142o\u015Bci powinien by\u0107 oszcz\u0119dny, cichy i zdrowy.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28"
  }, STANDARD_FEATURES.map(feat => /*#__PURE__*/React.createElement("div", {
    key: feat.id,
    className: "bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-gold/50 transition-all duration-300 group",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-300"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    className: "text-gold group-hover:text-ink transition-colors duration-300"
  }, feat.icon)), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium text-white mb-3"
  }, feat.title), /*#__PURE__*/React.createElement("p", {
    className: "text-mist text-sm leading-relaxed"
  }, feat.desc)))), /*#__PURE__*/React.createElement("div", {
    className: "bg-cream rounded-[2.5rem] p-7 md:p-14 shadow-2xl relative overflow-hidden text-ink",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-64 h-64 bg-burgundy/10 rounded-bl-[100%] pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row justify-between md:items-end mb-10 relative z-10 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-3xl md:text-4xl font-serif mb-2"
  }, "Zestawienie lokali"), /*#__PURE__*/React.createElement("p", {
    className: "text-forest font-light"
  }, "Pe\u0142na lista segment\xF3w i specyfikacja do pobrania.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => document.getElementById('kontakt').scrollIntoView({
      behavior: 'smooth'
    }),
    className: "text-sm font-medium uppercase tracking-widest text-bronze border-b border-bronze pb-1 hover:text-ink hover:border-ink transition-colors self-start"
  }, "Pobierz prospekt (PDF)")), /*#__PURE__*/React.createElement("div", {
    className: "w-full overflow-x-auto relative z-10 custom-scrollbar"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse min-w-[760px]"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-gray-200"
  }, ['ID Lokalu', 'Typ', 'Powierzchnia', 'Działka', 'Pokoje', 'Cena od', 'Status'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    className: "py-4 px-5 text-[11px] font-bold uppercase tracking-widest text-gray-400"
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, HOUSES_DATA.map(house => {
    const meta = STATUS_META[house.status];
    return /*#__PURE__*/React.createElement("tr", {
      key: house.id,
      className: "border-b border-gray-100 hover:bg-white transition-colors cursor-pointer",
      onClick: () => setSelectedHouse(house)
    }, /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5 font-medium"
    }, house.id), /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5 text-gray-500"
    }, house.type), /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5"
    }, house.area, " m\xB2"), /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5"
    }, house.plot, " m\xB2"), /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5"
    }, house.rooms), /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5 font-serif font-medium"
    }, house.price.toLocaleString('pl-PL'), " z\u0142"), /*#__PURE__*/React.createElement("td", {
      className: "py-4 px-5"
    }, /*#__PURE__*/React.createElement("span", {
      className: `inline-block px-3 py-1 text-[11px] rounded-full font-medium ${meta.chip}`
    }, house.status)));
  })))), /*#__PURE__*/React.createElement("p", {
    className: "mt-6 text-[11px] text-gray-400 font-mono"
  }, '//', " Miejsce na wtyczk\u0119 cennika (np. shortcode [bsdom_pricing_table]). Ceny orientacyjne \u2014 do potwierdzenia.")))), /*#__PURE__*/React.createElement("section", {
    id: "galeria",
    className: "relative w-full bg-cream py-28 md:py-32"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row justify-between md:items-end mb-12 gap-8",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-5xl font-medium tracking-tight mb-4"
  }, "Zobacz, jak tu ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-burgundy"
  }, "mieszka si\u0119.")), /*#__PURE__*/React.createElement("p", {
    className: "text-forest max-w-xl font-light"
  }, "Architektura, wn\u0119trza i otoczenie. Wizualizacje Osiedla Burgundowe.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap bg-white p-1.5 rounded-full border border-gray-200 shadow-inner self-start"
  }, GALLERY_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setGalFilter(f),
    className: `px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${galFilter === f ? 'bg-burgundy text-white shadow-md' : 'text-forest hover:text-ink'}`
  }, f)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] lg:auto-rows-[230px] gap-4"
  }, filteredGallery.map((g, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `relative rounded-3xl overflow-hidden group bg-[#EAE7DF] ${galFilter === 'Wszystkie' ? g.span : ''}`,
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("img", {
    src: g.src,
    onError: onImgError,
    alt: g.label,
    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-4 left-4 right-4 text-cream translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] uppercase tracking-widest text-gold"
  }, g.cat), /*#__PURE__*/React.createElement("div", {
    className: "font-serif text-lg leading-tight"
  }, g.label))))))), /*#__PURE__*/React.createElement("section", {
    id: "deweloper",
    className: "relative w-full bg-white py-28 md:py-32"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 h-px bg-burgundy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-bronze text-sm uppercase tracking-[0.25em]"
  }, "O deweloperze")), /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-5xl font-medium tracking-tight mb-6"
  }, "Budujemy w Nowosolnej. ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-burgundy"
  }, "Naprawd\u0119 st\u0105d.")), /*#__PURE__*/React.createElement("p", {
    className: "text-forest font-light leading-relaxed mb-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "font-medium text-ink"
  }, "BS DOM"), " to lokalny, \u0142\xF3dzki deweloper z biurem w samym sercu Nowosolnej \u2014 przy ul. Kasprowicza 1CB. Nie jeste\u015Bmy zdaln\u0105 korporacj\u0105: budujemy tam, gdzie sami chcieliby\u015Bmy mieszka\u0107."), /*#__PURE__*/React.createElement("p", {
    className: "text-forest font-light leading-relaxed mb-8"
  }, "Osiedle Burgundowe powstaje jako naturalne przed\u0142u\u017Cenie zrealizowanego Osiedla Kasprowicza. To dow\xF3d ci\u0105g\u0142o\u015Bci \u2014 s\u0105siedni\u0105 inwestycj\u0119 ju\u017C dostarczyli\u015Bmy, a Ty mo\u017Cesz j\u0105 zobaczy\u0107 na w\u0142asne oczy, zanim podejmiesz decyzj\u0119."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-serif text-burgundy"
  }, "\u0141\xF3dzki"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bronze uppercase tracking-widest mt-1"
  }, "deweloper")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-serif text-burgundy"
  }, "Premium"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bronze uppercase tracking-widest mt-1"
  }, "standard")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-serif text-burgundy"
  }, "Etap II"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bronze uppercase tracking-widest mt-1"
  }, "Kasprowicza")))), /*#__PURE__*/React.createElement("div", {
    className: "relative h-[420px] rounded-[2rem] overflow-hidden shadow-2xl bg-[#EAE7DF]",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.portfolio.kasprowicza,
    onError: onImgError,
    alt: "Osiedle Kasprowicza \u2014 s\u0105siednia inwestycja BS DOM",
    className: "absolute inset-0 w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-6 left-6 text-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-gold"
  }, "Zrealizowane"), /*#__PURE__*/React.createElement("div", {
    className: "font-serif text-2xl"
  }, "Osiedle Kasprowicza")))), /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-serif mb-8 text-ink",
    "data-reveal": true
  }, "Nasze inwestycje"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6"
  }, PORTFOLIO.map(p => /*#__PURE__*/React.createElement("a", {
    key: p.title,
    href: p.href,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "relative h-72 rounded-3xl overflow-hidden group block bg-[#EAE7DF]",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    onError: onImgError,
    alt: p.title,
    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-6 left-6 right-6 text-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-serif text-2xl mb-1"
  }, p.title), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-mist mb-3"
  }, p.sub), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-2 text-sm text-gold"
  }, "Zobacz inwestycj\u0119 ", /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: "transition-transform group-hover:translate-x-1"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M12 5l7 7-7 7"
  }))))))))), /*#__PURE__*/React.createElement("section", {
    id: "finansowanie",
    className: "relative w-full bg-ink text-cream py-28 md:py-32 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-0 left-0 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[130px] pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 relative z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative h-[460px] rounded-[2rem] overflow-hidden shadow-2xl bg-[#141D17] order-2 lg:order-1",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.advisor,
    onError: onImgError,
    alt: "Doradca kredytowy",
    className: "absolute inset-0 w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-6 left-6 backdrop-blur-md bg-ink/40 rounded-2xl px-5 py-4 border border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-gold mb-1"
  }, "Tw\xF3j doradca"), /*#__PURE__*/React.createElement("div", {
    className: "font-serif text-xl text-white"
  }, "Bezp\u0142atna konsultacja kredytowa"))), /*#__PURE__*/React.createElement("div", {
    className: "order-1 lg:order-2",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 h-px bg-gold"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gold text-sm uppercase tracking-[0.25em]"
  }, "Finansowanie")), /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-5xl font-medium tracking-tight mb-6"
  }, "\u201EA jak ja za to ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-gold"
  }, "zap\u0142ac\u0119?\u201D")), /*#__PURE__*/React.createElement("p", {
    className: "text-mist font-light leading-relaxed mb-8"
  }, "Spokojnie \u2014 przeprowadzimy Ci\u0119 przez to krok po kroku. Wsp\xF3\u0142pracujemy z niezale\u017Cnym doradc\u0105 kredytowym, kt\xF3ry bezp\u0142atnie por\xF3wna oferty bank\xF3w, policzy zdolno\u015B\u0107 i pomo\u017Ce skompletowa\u0107 dokumenty. Bez zobowi\u0105za\u0144, bez ukrytych koszt\xF3w."), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-4 mb-10"
  }, ['Bezpłatna analiza zdolności kredytowej', 'Porównanie ofert wielu banków w jednym miejscu', 'Wsparcie w programach dopłat i formalnościach'].map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-1 w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#E3A857",
    strokeWidth: "3"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "text-cream/90 font-light"
  }, t)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => document.getElementById('kontakt').scrollIntoView({
      behavior: 'smooth'
    }),
    className: "bg-gold text-ink px-9 py-4 rounded-full font-medium hover:bg-cream transition-colors"
  }, "Um\xF3w bezp\u0142atn\u0105 konsultacj\u0119"))))), /*#__PURE__*/React.createElement("section", {
    id: "kontakt",
    className: "relative w-full bg-cream pt-28 md:pt-32"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center max-w-2xl mx-auto mb-16",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 h-px bg-burgundy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-bronze text-sm uppercase tracking-[0.25em]"
  }, "Kontakt"), /*#__PURE__*/React.createElement("span", {
    className: "w-12 h-px bg-burgundy"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl md:text-5xl font-medium tracking-tight mb-4"
  }, "Porozmawiajmy o ", /*#__PURE__*/React.createElement("span", {
    className: "italic font-serif text-burgundy"
  }, "Twoim domu.")), /*#__PURE__*/React.createElement("p", {
    className: "text-forest font-light"
  }, "Zostaw kontakt lub zadzwo\u0144 \u2014 oddzwonimy i um\xF3wimy spotkanie na osiedlu.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100",
    "data-reveal": true
  }, sent ? /*#__PURE__*/React.createElement("div", {
    className: "h-full flex flex-col items-center justify-center text-center py-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mb-6"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#4A5D4E",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-serif mb-2"
  }, "Dzi\u0119kujemy!"), /*#__PURE__*/React.createElement("p", {
    className: "text-forest font-light"
  }, "Odezwiemy si\u0119 najszybciej, jak to mo\u017Cliwe."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSent(false),
    className: "mt-6 text-sm text-bronze underline"
  }, "Wy\u015Blij kolejn\u0105 wiadomo\u015B\u0107")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    className: "flex flex-col gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-forest"
  }, "Imi\u0119 i nazwisko"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "text",
    className: "bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors",
    placeholder: "Jan Kowalski"
  })), /*#__PURE__*/React.createElement("label", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-forest"
  }, "Telefon"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "tel",
    className: "bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors",
    placeholder: "+48 600 000 000"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-forest"
  }, "E-mail"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "email",
    className: "bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors",
    placeholder: "jan@example.com"
  })), /*#__PURE__*/React.createElement("label", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-forest"
  }, "Wiadomo\u015B\u0107"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    className: "bg-cream border border-gray-200 rounded-xl px-4 py-3 focus:border-burgundy focus:outline-none transition-colors resize-none",
    placeholder: "Interesuje mnie segment B.01..."
  })), /*#__PURE__*/React.createElement("label", {
    className: "flex items-start gap-3 text-xs text-gray-500"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "checkbox",
    className: "mt-1 accent-burgundy"
  }), /*#__PURE__*/React.createElement("span", null, "Wyra\u017Cam zgod\u0119 na przetwarzanie moich danych osobowych w celu kontaktu zgodnie z polityk\u0105 prywatno\u015Bci BS DOM sp. z o.o. (RODO).")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "bg-ink text-cream py-4 rounded-full font-medium hover:bg-burgundy transition-colors mt-2"
  }, "Wy\u015Blij zapytanie"))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 flex flex-col gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-ink text-cream rounded-[2rem] p-8 shadow-xl flex items-center gap-5",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.agent,
    onError: onImgError,
    alt: "Sylwia Kozicka \u2014 biuro sprzeda\u017Cy",
    className: "w-20 h-20 rounded-2xl object-cover bg-[#141D17] shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-gold mb-1"
  }, "Biuro sprzeda\u017Cy"), /*#__PURE__*/React.createElement("div", {
    className: "font-serif text-2xl leading-tight"
  }, "Sylwia Kozicka"), /*#__PURE__*/React.createElement("div", {
    className: "text-mist text-sm"
  }, "Doradca ds. sprzeda\u017Cy"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col gap-5",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("a", {
    href: "tel:+48881766550",
    className: "flex items-center gap-4 group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-11 h-11 rounded-full bg-burgundy/10 flex items-center justify-center group-hover:bg-burgundy transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#7A2E3A",
    strokeWidth: "2",
    className: "group-hover:stroke-white"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "Telefon"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, "+48 881 766 550"))), /*#__PURE__*/React.createElement("a", {
    href: "mailto:biuro@bsdom.pl",
    className: "flex items-center gap-4 group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-11 h-11 rounded-full bg-burgundy/10 flex items-center justify-center group-hover:bg-burgundy transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#7A2E3A",
    strokeWidth: "2",
    className: "group-hover:stroke-white"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-10 6L2 7"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "E-mail"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, "biuro@bsdom.pl"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-11 h-11 rounded-full bg-burgundy/10 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#7A2E3A",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "Biuro sprzeda\u017Cy"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, "ul. Kasprowicza 1CB, 92-781 \u0141\xF3d\u017A")))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 h-56 lg:flex-1 min-h-[220px]",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("iframe", {
    title: "Mapa dojazdu",
    className: "w-full h-full",
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade",
    src: "https://maps.google.com/maps?q=Kasprowicza%201CB%2C%20Nowosolna%2C%20%C5%81%C3%B3d%C5%BA&z=14&output=embed"
  }))))), /*#__PURE__*/React.createElement("footer", {
    className: "mt-28 bg-ink text-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-9 h-9 rounded-full bg-burgundy flex items-center justify-center text-cream font-serif text-lg"
  }, "B"), /*#__PURE__*/React.createElement("span", {
    className: "font-medium tracking-tight text-lg"
  }, "Osiedle Burgundowe")), /*#__PURE__*/React.createElement("p", {
    className: "text-mist font-light max-w-sm leading-relaxed"
  }, "Premium domy w zabudowie szeregowej w Nowosolnej \u2014 przed\u0142u\u017Cenie Osiedla Kasprowicza. Natura Wzniesie\u0144 \u0141\xF3dzkich i nowoczesny, energooszcz\u0119dny standard w jednym.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-gold mb-4"
  }, "Nawigacja"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2.5 text-mist"
  }, NAV_LINKS.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.id
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => document.getElementById(l.id).scrollIntoView({
      behavior: 'smooth'
    }),
    className: "hover:text-gold transition-colors"
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-widest text-gold mb-4"
  }, "Kontakt"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2.5 text-mist"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "tel:+48881766550",
    className: "hover:text-gold transition-colors"
  }, "+48 881 766 550")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:biuro@bsdom.pl",
    className: "hover:text-gold transition-colors"
  }, "biuro@bsdom.pl")), /*#__PURE__*/React.createElement("li", null, "ul. Kasprowicza 1CB", /*#__PURE__*/React.createElement("br", null), "92-781 \u0141\xF3d\u017A"), /*#__PURE__*/React.createElement("li", {
    className: "pt-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://bsdom.pl",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "hover:text-gold transition-colors"
  }, "bsdom.pl"))))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-mist/70"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " BS DOM sp. z o.o. Wszelkie prawa zastrze\u017Cone."), /*#__PURE__*/React.createElement("span", null, "Wizualizacje i ceny maj\u0105 charakter pogl\u0105dowy i nie stanowi\u0105 oferty w rozumieniu art. 66 \xA71 K.C."))))), /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 bg-ink/40 backdrop-blur-sm z-[80] transition-opacity duration-500 ${selectedHouse ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
    onClick: () => setSelectedHouse(null)
  }), /*#__PURE__*/React.createElement("div", {
    className: `fixed top-0 right-0 h-full w-full md:w-[600px] bg-cream z-[90] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto custom-scrollbar ${selectedHouse ? 'translate-x-0' : 'translate-x-full'}`
  }, selectedHouse && (() => {
    const meta = STATUS_META[selectedHouse.status];
    const sold = selectedHouse.status === 'Sprzedany';
    return /*#__PURE__*/React.createElement("div", {
      className: "p-8 md:p-12 relative min-h-full flex flex-col"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelectedHouse(null),
      className: "absolute top-8 right-8 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white hover:rotate-90 transition-all duration-300 text-gray-500"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 6L6 18M6 6l12 12"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mb-8 mt-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 ${meta.solid}`
    }, selectedHouse.status), /*#__PURE__*/React.createElement("h2", {
      className: "text-4xl font-serif mb-2"
    }, selectedHouse.name), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 font-mono text-sm"
    }, "ID LOKALU: ", selectedHouse.id)), /*#__PURE__*/React.createElement("div", {
      className: "w-full bg-white rounded-2xl border border-gray-200 mb-8 shadow-sm relative overflow-hidden"
    }, /*#__PURE__*/React.createElement("img", {
      src: IMG[`floorPlan${selectedHouse.variant}`],
      onError: onImgError,
      alt: `Rzut Wariant ${selectedHouse.variant}`,
      className: "w-full h-auto object-contain"
    }), /*#__PURE__*/React.createElement("span", {
      className: "absolute bottom-3 left-4 text-xs font-bold text-gray-400 tracking-widest uppercase"
    }, "Schemat funkcjonalny \xB7 Wariant ", selectedHouse.variant)), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-y-6 gap-x-12 mb-10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "border-b border-gray-200 pb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-400 uppercase tracking-wider mb-1"
    }, "Typ budynku"), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, selectedHouse.type)), /*#__PURE__*/React.createElement("div", {
      className: "border-b border-gray-200 pb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-400 uppercase tracking-wider mb-1"
    }, "Pokoje"), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, selectedHouse.rooms)), /*#__PURE__*/React.createElement("div", {
      className: "border-b border-gray-200 pb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-400 uppercase tracking-wider mb-1"
    }, "Powierzchnia u\u017Cytkowa"), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, selectedHouse.area, " m\xB2")), /*#__PURE__*/React.createElement("div", {
      className: "border-b border-gray-200 pb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-400 uppercase tracking-wider mb-1"
    }, "Dzia\u0142ka"), /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, selectedHouse.plot, " m\xB2"))), /*#__PURE__*/React.createElement("div", {
      className: "mt-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-end mb-6"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-gray-500 mb-1"
    }, "Cena orientacyjna od"), /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-serif font-medium"
    }, selectedHouse.price.toLocaleString('pl-PL'), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-xl text-gray-400"
    }, "z\u0142"))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-gray-500 mb-1"
    }, "Cena za m\xB2"), /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-medium"
    }, Math.round(selectedHouse.price / selectedHouse.area).toLocaleString('pl-PL'), " z\u0142"))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-4"
    }, /*#__PURE__*/React.createElement("button", {
      disabled: sold,
      onClick: () => {
        setSelectedHouse(null);
        document.getElementById('kontakt').scrollIntoView({
          behavior: 'smooth'
        });
      },
      className: `flex-1 py-4 rounded-xl font-medium transition-all ${sold ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-ink text-white hover:bg-burgundy'}`
    }, sold ? 'Niedostępny' : 'Zapytaj o ten dom'), /*#__PURE__*/React.createElement("button", {
      className: "flex-1 py-4 bg-white border border-ink/20 rounded-xl font-medium hover:border-burgundy hover:text-burgundy transition-all flex items-center justify-center gap-2 group"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      className: "stroke-current transition-transform group-hover:-translate-y-1",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
    })), "Pobierz rzuty"))));
  })()));
};
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));