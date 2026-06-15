import React, { useState, useEffect, useRef } from 'react';

// --- API generowania obrazu z Gemini (Imagen 4) ---
const generateImage = async (promptText) => {
  const apiKey = ""; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  
  const payload = { instances: { prompt: promptText }, parameters: { sampleCount: 1 } };
  const delays = [1000, 2000, 4000, 8000];

  for (let i = 0; i < delays.length + 1; i++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    } catch (e) {
      if (i < delays.length) await new Promise(r => setTimeout(r, delays[i]));
    }
  }
  return null;
};

// --- DANE (Sekcja 2 - POI) ---
const POI_DATA = [
  { id: 'nature', title: 'Park Krajobrazowy', subtitle: 'Natura i spokój', time: '5 min', distance: '1.2 km', icon: '🌿', description: 'Poranny jogging w otoczeniu stuletnich dębów. Setki kilometrów ścieżek rowerowych zaraz za Twoimi drzwiami.', mapCoords: { x: 20, y: 20 } },
  { id: 'city', title: 'Centrum Łodzi', subtitle: 'Biznes i kultura', time: '18 min', distance: '9.5 km', icon: '🏛️', description: 'Szybki i bezkolizyjny dojazd do serca miasta. Idealny balans między pracą a życiem prywatnym.', mapCoords: { x: 80, y: 85 } },
  { id: 'lifestyle', title: 'Lokalne Delikatesy', subtitle: 'Codzienna wygoda', time: '3 min', distance: '800 m', icon: '🥐', description: 'Świeże pieczywo o poranku i rzemieślnicze produkty. Wszystko, czego potrzebujesz, znajdziesz tuż obok.', mapCoords: { x: 65, y: 40 } }
];

// --- DANE (Sekcja 3 - Domy) ---
const HOUSES_DATA = [
  { id: '3.0.A.01', name: 'Segment A.01', type: 'Skrajny', status: 'Dostępny', area: 86.5, rooms: 4, price: 760000, polygon: '10,50 35,38 45,55 20,68' },
  { id: '3.0.A.02', name: 'Segment A.02', type: 'Środkowy', status: 'Sprzedany', area: 86.5, rooms: 4, price: 760000, polygon: '35,38 60,25 70,42 45,55' },
  { id: '3.0.A.03', name: 'Segment A.03', type: 'Skrajny', status: 'Dostępny', area: 88.0, rooms: 4, price: 785000, polygon: '60,25 85,12 95,30 70,42' },
];

// --- DANE (Sekcja 4 - Standard) ---
const STANDARD_FEATURES = [
  { id: 'heat', title: 'Pompa Ciepła', desc: 'Wysokowydajna pompa ciepła najnowszej generacji. Gwarancja minimalnych rachunków za ogrzewanie zimą i chłodzenia latem.', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
  { id: 'smart', title: 'Smart Home Ready', desc: 'Infrastruktura przygotowana pod pełną automatykę budynkową. Steruj światłem i roletami ze smartfona.', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></> },
  { id: 'glass', title: 'Aluminiowe Przeszklenia', desc: 'Wielkogabarytowe okna przesuwne typu HS. Zacieramy granicę między salonem a Twoim prywatnym ogrodem.', icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></> },
  { id: 'recup', title: 'Rekuperacja z jonizacją', desc: 'Zawsze świeże, przefiltrowane powietrze w domu, bez utraty ciepła. Idealne rozwiązanie dla alergików.', icon: <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3"/> }
];

const App = () => {
  // --- STANY GLOBALNE I SEKCJI ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroImg, setHeroImg] = useState(null);
  const [isHeroGenerating, setIsHeroGenerating] = useState(true);
  const [activePoi, setActivePoi] = useState(POI_DATA[0]);
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [estateImg, setEstateImg] = useState(null);
  const [isEstateGenerating, setIsEstateGenerating] = useState(true);
  const [hoveredHouse, setHoveredHouse] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [filter, setFilter] = useState('Wszystkie');

  // --- EFEKTY POBIERANIA ZDJĘĆ AI ---
  useEffect(() => {
    let isMounted = true;
    const fetchImages = async () => {
      setIsHeroGenerating(true);
      const heroPrompt = "A highly realistic, cinematic, wide-angle shot of a beautiful modern luxury house nestled in a lush, green forest at golden hour. Warm sunlight filtering through trees. Inviting, peaceful, high-end real estate, architectural photography, soft warm glowing light.";
      const img1 = await generateImage(heroPrompt);
      if (isMounted && img1) { setHeroImg(img1); setIsHeroGenerating(false); }

      setIsEstateGenerating(true);
      const estatePrompt = "Aerial top-down drone view of a modern luxury housing estate, three row houses connected, minimalist architecture, dark roofs, bright facades, surrounded by green lawns and trees. Realistic architectural rendering, soft daylight.";
      const img2 = await generateImage(estatePrompt);
      if (isMounted && img2) { setEstateImg(img2); setIsEstateGenerating(false); }
    };
    fetchImages();
    return () => { isMounted = false; };
  }, []);

  // --- EFEKT PARALAKSY ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const filteredHouses = HOUSES_DATA.filter(h => filter === 'Wszystkie' || h.status === filter);

  return (
    <div className="bg-[#F9F8F4] font-sans selection:bg-[#E3A857] selection:text-white relative">
      
      {/* ========================================== */}
      {/* SEKCJA 1: THE DREAM (HERO)                   */}
      {/* ========================================== */}
      <section className="relative min-h-screen w-full text-[#1A251E] overflow-hidden flex items-center pt-10 pb-20">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[25vw] font-bold text-[#EBE8E0] opacity-50 whitespace-nowrap pointer-events-none tracking-tighter select-none mix-blend-multiply z-0">
          N.SOLNA
        </div>

        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen">
          
          <div className="lg:col-span-5 flex flex-col justify-center relative z-20 mt-10 lg:mt-0">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-[#E3A857]"></span>
              <span className="text-[#8B7355] text-sm uppercase tracking-[0.25em] font-medium">Etap Drugi • Przedsprzedaż</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05] text-[#1A251E] mb-8">
              Poczuj <br />
              <span className="italic font-serif text-[#4A5D4E]">swój azyl.</span>
            </h1>
            
            <p className="text-lg text-[#5A605B] max-w-md leading-relaxed mb-12 font-light">
              Zamykasz oczy i słyszysz szum drzew. Otwierasz je we własnym, inteligentnym domu. Stworzyliśmy przestrzeń, w której natura przenika się z technologią jutra.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <button className="w-full sm:w-auto bg-[#1A251E] text-[#F9F8F4] px-10 py-5 rounded-full font-medium tracking-wide hover:bg-[#2C3E35] hover:shadow-xl hover:shadow-[#1A251E]/20 transition-all duration-400 transform hover:-translate-y-1">
                Poznaj Osiedle
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[60vh] lg:h-[80vh] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-[#1A251E]/10 flex items-center justify-center bg-[#EAE7DF] group">
            {isHeroGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#EAE7DF] to-[#DFDCD2]">
                <div className="w-16 h-16 border-4 border-[#E3A857]/20 border-t-[#E3A857] rounded-full animate-spin mb-4"></div>
                <p className="text-[#8B7355] text-sm tracking-widest uppercase animate-pulse">Projektowanie marzeń...</p>
              </div>
            ) : (
              <img 
                src={heroImg} 
                alt="Luksusowy dom Nowosolna" 
                className="absolute inset-0 w-[110%] h-[110%] object-cover object-center transition-all duration-[2000ms] ease-out opacity-100 scale-100"
                style={{ transform: `translate(${(mousePos.x / window.innerWidth - 0.5) * 20}px, ${(mousePos.y / window.innerHeight - 0.5) * 20}px)` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A251E]/50 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-70"></div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SEKCJA 2: LIFESTYLE EXPLORER (MAPA POI)      */}
      {/* ========================================== */}
      <section className="relative w-full bg-[#1A251E] text-[#F9F8F4] overflow-hidden py-32 rounded-t-[3rem] -mt-10 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E3A857]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="mb-16 md:mb-24 relative z-10">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">
              Twój nowy <span className="italic font-serif text-[#E3A857]">ekosystem.</span>
            </h2>
            <p className="text-[#A9B2AD] text-lg max-w-xl font-light leading-relaxed">
              Nie kupujesz tylko metrażu. Wybierasz styl życia. Zobacz, jak idealnie zaprojektowaliśmy Twoje otoczenie, łącząc dziką naturę z pulsem miasta.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="lg:col-span-5 flex flex-col gap-4 relative z-10">
              {POI_DATA.map((poi) => (
                <div 
                  key={poi.id}
                  onMouseEnter={() => setActivePoi(poi)}
                  className={`cursor-pointer p-6 md:p-8 rounded-2xl transition-all duration-500 border ${
                    activePoi.id === poi.id 
                    ? 'bg-white/10 border-white/20 backdrop-blur-md shadow-2xl scale-[1.02]' 
                    : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{poi.icon}</span>
                      <div>
                        <h3 className="text-xl font-medium text-white">{poi.title}</h3>
                        <p className={`text-sm mt-1 transition-colors ${activePoi.id === poi.id ? 'text-[#E3A857]' : 'text-[#A9B2AD]'}`}>{poi.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-serif">{poi.time}</div>
                      <div className="text-xs text-[#A9B2AD] uppercase tracking-widest">{poi.distance}</div>
                    </div>
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activePoi.id === poi.id ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#A9B2AD] font-light text-sm leading-relaxed border-t border-white/10 pt-4">{poi.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7 relative h-[500px] lg:h-[700px] w-full bg-[#141D17] rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full p-8" onMouseEnter={() => setIsMapHovered(true)} onMouseLeave={() => setIsMapHovered(false)}>
                <defs>
                  <filter id="glowPath" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                <g stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.2" fill="none">
                  <path d="M 0 30 Q 20 20, 50 40 T 100 20" />
                  <path d="M 0 50 Q 30 60, 60 30 T 100 50" />
                  <circle cx="20" cy="20" r="15" />
                </g>

                <g transform="translate(50, 50)">
                  <circle r="4" fill="rgba(227, 168, 87, 0.1)" className="animate-ping" />
                  <circle r="1.5" fill="#E3A857" />
                  <text x="3" y="-3" fill="#E3A857" fontSize="2.5" fontWeight="bold">NOWOSOLNA</text>
                </g>

                {POI_DATA.map((poi) => {
                  const isActive = activePoi.id === poi.id;
                  const endX = poi.mapCoords.x; const endY = poi.mapCoords.y;
                  return (
                    <g key={`map-${poi.id}`}>
                      <path 
                        d={`M 50 50 Q ${(50 + endX)/2 + 5} ${(50 + endY)/2 - 10}, ${endX} ${endY}`}
                        fill="none" stroke="#E3A857" strokeWidth="0.8" filter="url(#glowPath)"
                        className={`transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        style={{ strokeDasharray: '150', strokeDashoffset: isActive ? '0' : '150' }}
                      />
                      <g transform={`translate(${endX}, ${endY})`} className={`transition-all duration-500 ${isActive ? 'scale-125' : 'scale-100 opacity-40'}`}>
                        <circle r="1.5" fill={isActive ? '#ffffff' : '#A9B2AD'} />
                        <text x={endX > 50 ? -3 : 3} y="1" fill={isActive ? '#ffffff' : '#A9B2AD'} fontSize="2" textAnchor={endX > 50 ? 'end' : 'start'}>{poi.title}</text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SEKCJA 3: INTERAKTYWNA MAPA I LISTA DOMÓW    */}
      {/* ========================================== */}
      <section className="relative w-full bg-white text-[#1A251E] py-32 z-30 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] -mt-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
                Wybierz swój <span className="italic font-serif text-[#E3A857]">nowy dom.</span>
              </h2>
              <p className="text-[#5A605B] max-w-xl font-light">
                Najedź na budynek, aby sprawdzić jego parametry. Kliknij wybraną sekcję, by otworzyć kartę informacyjną i pobrać rzuty architektoniczne.
              </p>
            </div>
            
            <div className="flex bg-[#F9F8F4] p-1.5 rounded-full border border-gray-200 shadow-inner">
              {['Wszystkie', 'Dostępny', 'Sprzedany'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === status ? 'bg-[#1A251E] text-white shadow-md' : 'text-[#5A605B] hover:text-[#1A251E]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Lewa strona - Obraz i SVG Poligony */}
            <div className="lg:col-span-8 relative rounded-[2rem] overflow-hidden bg-[#EAE7DF] border border-gray-100 shadow-xl aspect-[16/10] group">
              {isEstateGenerating ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-2 border-[#E3A857]/20 border-t-[#E3A857] rounded-full animate-spin mb-4"></div>
                    <span className="text-[#8B7355] text-xs uppercase tracking-widest">Generowanie mapy satelitarnej...</span>
                 </div>
              ) : (
                <>
                  <img src={estateImg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="Mapa Osiedla" />
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
                    <defs>
                      <filter id="glassGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    {filteredHouses.map((house) => {
                      const isHovered = hoveredHouse === house.id;
                      const isSold = house.status === 'Sprzedany';
                      return (
                        <polygon
                          key={house.id} points={house.polygon}
                          className="transition-all duration-500 ease-out cursor-pointer"
                          fill={isSold ? "rgba(0, 0, 0, 0.4)" : isHovered ? "rgba(227, 168, 87, 0.4)" : "rgba(255, 255, 255, 0.15)"}
                          stroke={isSold ? "rgba(255, 255, 255, 0.2)" : (isHovered ? "#E3A857" : "rgba(255, 255, 255, 0.8)")}
                          strokeWidth={isHovered && !isSold ? "0.5" : "0.2"} filter={isHovered && !isSold ? "url(#glassGlow)" : ""}
                          onMouseEnter={() => setHoveredHouse(house.id)} onMouseLeave={() => setHoveredHouse(null)} onClick={() => setSelectedHouse(house)}
                        />
                      );
                    })}
                  </svg>
                </>
              )}
            </div>

            {/* Prawa strona - Lista Kart */}
            <div className="lg:col-span-4 flex flex-col gap-3 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredHouses.map((house) => (
                <div 
                  key={house.id}
                  onMouseEnter={() => setHoveredHouse(house.id)} onMouseLeave={() => setHoveredHouse(null)} onClick={() => setSelectedHouse(house)}
                  className={`group flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    hoveredHouse === house.id ? 'bg-[#F9F8F4] border-[#E3A857] shadow-lg transform scale-[1.02]' : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  } ${house.status === 'Sprzedany' ? 'opacity-60 grayscale hover:grayscale-0' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-gray-400 font-mono mb-1">ID: {house.id}</div>
                      <h3 className="text-xl font-medium text-[#1A251E] group-hover:text-[#8B7355] transition-colors">{house.name}</h3>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${house.status === 'Dostępny' ? 'bg-[#4A5D4E]/10 text-[#4A5D4E]' : 'bg-red-50 text-red-500'}`}>{house.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-[#5A605B] border-t border-gray-100 pt-4">
                    <div><div className="text-xs text-gray-400 mb-0.5">Powierzchnia</div><div className="font-medium text-[#1A251E]">{house.area} m²</div></div>
                    <div><div className="text-xs text-gray-400 mb-0.5">Pokoje</div><div className="font-medium text-[#1A251E]">{house.rooms}</div></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                     <div className="text-lg font-serif font-medium text-[#1A251E]">{house.price.toLocaleString('pl-PL')} PLN</div>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${hoveredHouse === house.id ? 'bg-[#E3A857] text-white' : 'bg-gray-100 text-gray-400'}`}>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SEKCJA 4 (NOWA): STANDARD I TABELA CENNIKA     */}
      {/* ========================================== */}
      <section className="relative w-full bg-[#1A251E] text-[#F9F8F4] py-32 z-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          
          {/* Nagłówek standardu */}
          <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              Standard <span className="italic font-serif text-[#E3A857]">Ultra-Premium.</span>
            </h2>
            <p className="text-[#A9B2AD] text-lg font-light leading-relaxed">
              Nie uznajemy kompromisów. Każdy dom w Nowosolnej jest wyposażony w technologie, które inni deweloperzy oferują wyłącznie za dodatkową opłatą.
            </p>
          </div>

          {/* Karty Standardu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {STANDARD_FEATURES.map((feat) => (
              <div key={feat.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#E3A857]/50 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-full bg-[#E3A857]/10 flex items-center justify-center mb-6 group-hover:bg-[#E3A857] transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#E3A857] group-hover:text-white transition-colors duration-300">
                    {feat.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{feat.title}</h3>
                <p className="text-[#A9B2AD] text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* ZESTAWIENIE OFERTOWE - WRAPPER NA WTYCZKĘ */}
          <div className="bg-[#F9F8F4] rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Subtelny ozdobnik */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3A857]/10 rounded-bl-[100%] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#1A251E] mb-2">Szczegółowe Zestawienie</h2>
                <p className="text-[#5A605B] font-light">Pełna lista lokali i specyfikacja do pobrania.</p>
              </div>
              <button className="text-sm font-medium uppercase tracking-widest text-[#8B7355] border-b border-[#8B7355] pb-1 hover:text-[#1A251E] hover:border-[#1A251E] transition-colors mt-6 md:mt-0">
                Pobierz cały prospekt (PDF)
              </button>
            </div>

            {/* MIEJSCE NA WASZĄ WTYCZKĘ (Stylowa alternatywa / szkielet) */}
            <div className="w-full overflow-x-auto relative z-10 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400">ID Lokalu</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400">Kondygnacje</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400">Powierzchnia</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400">Działka</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400">Cena PLN</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[#1A251E]">
                  {/* Przykładowe dane wewnątrz designu wtyczki */}
                  {HOUSES_DATA.map((house, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="py-5 px-6 font-medium">{house.id}</td>
                      <td className="py-5 px-6 text-gray-500">2 + Poddasze</td>
                      <td className="py-5 px-6">{house.area} m²</td>
                      <td className="py-5 px-6">~150 m²</td>
                      <td className="py-5 px-6 font-serif font-medium">{house.price.toLocaleString('pl-PL')} zł</td>
                      <td className="py-5 px-6">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                          house.status === 'Dostępny' ? 'bg-[#4A5D4E]/10 text-[#4A5D4E]' : 'bg-red-50 text-red-500'
                        }`}>
                          {house.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Info dla Waszych programistów */}
            <div className="mt-8 text-center border-t border-gray-200 pt-8">
              <p className="text-xs text-gray-400 font-mono">
                {"//"} Tutaj można wkleić shortcode wtyczki cennika np. [bsdom_pricing_table id="2"]
                <br/>
                {"//"} Powyższa tabela to tylko propozycja stylowania dla Waszego dewelopera, aby utrzymać czysty design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* KARTA DOMU (MODAL "BRIEF") ZE ZWIJANYM TŁEM  */}
      {/* ========================================== */}
      <div className={`fixed inset-0 bg-[#1A251E]/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${selectedHouse ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSelectedHouse(null)}></div>

      <div className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#F9F8F4] z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${selectedHouse ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedHouse && (
          <div className="p-8 md:p-12 relative h-full flex flex-col text-[#1A251E]">
            <button onClick={() => setSelectedHouse(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white hover:rotate-90 transition-all duration-300 text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="mb-8 mt-4">
              <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 ${selectedHouse.status === 'Dostępny' ? 'bg-[#4A5D4E] text-white' : 'bg-red-500 text-white'}`}>
                {selectedHouse.status}
              </span>
              <h2 className="text-4xl font-serif mb-2">{selectedHouse.name}</h2>
              <p className="text-gray-500 font-mono text-sm">ID LOKALU: {selectedHouse.id}</p>
            </div>

            <div className="w-full bg-white rounded-2xl border border-gray-200 aspect-[4/3] flex items-center justify-center mb-10 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-5"></div>
              <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 stroke-gray-300 group-hover:stroke-[#E3A857] transition-colors duration-500" fill="none" strokeWidth="1">
                <rect x="20" y="20" width="60" height="60" /><line x1="50" y1="20" x2="50" y2="80" /><line x1="20" y1="50" x2="80" y2="50" /><circle cx="50" cy="50" r="5" fill="#F9F8F4" />
              </svg>
              <span className="absolute bottom-4 text-xs font-bold text-gray-400 tracking-widest uppercase">Podgląd Rzutu</span>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12">
              <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Typ budynku</div><div className="font-medium">{selectedHouse.type}</div></div>
              <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pokoje</div><div className="font-medium">{selectedHouse.rooms}</div></div>
              <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Powierzchnia użytkowa</div><div className="font-medium">{selectedHouse.area} m²</div></div>
              <div className="border-b border-gray-200 pb-3"><div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Działka</div><div className="font-medium">~150 m²</div></div>
            </div>

            <div className="mt-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Cena całkowita</div>
                  <div className="text-3xl font-serif font-medium">{selectedHouse.price.toLocaleString('pl-PL')} <span className="text-xl text-gray-400">PLN</span></div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Cena za m²</div>
                  <div className="text-lg font-medium">{Math.round(selectedHouse.price / selectedHouse.area).toLocaleString('pl-PL')} PLN</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button disabled={selectedHouse.status === 'Sprzedany'} className={`flex-1 py-4 rounded-xl font-medium transition-all ${selectedHouse.status === 'Sprzedany' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1A251E] text-white hover:bg-[#2C3E35] hover:shadow-lg'}`}>
                  {selectedHouse.status === 'Sprzedany' ? 'Niedostępny' : 'Zapytaj o dom'}
                </button>
                <button className="flex-1 py-4 bg-white border border-[#1A251E]/20 rounded-xl font-medium text-[#1A251E] hover:border-[#E3A857] hover:text-[#E3A857] transition-all flex items-center justify-center gap-2 group">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current transition-transform group-hover:-translate-y-1" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  Pobierz rzuty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default App;