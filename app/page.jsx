"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Sparkles, Building2, FlaskConical, Briefcase, BookMarked, Wallet, Users, ArrowRight, ExternalLink, Search, ArrowLeft, Quote } from "lucide-react";

// Scroll-reveal hook: fades + lifts elements into view as the user scrolls
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}

// 25 niche + iconic luxury houses
const BRANDS = [
  // ============ NICHE ICONS ============
  {
    id: "lelabo", name: "Le Labo", category: "niche", origin: "USA / France · 2006",
    desc: "Founded by Eddie Roschi and Fabrice Penot in NYC's Nolita, Le Labo built a cult around hand-blended fragrances and personalized labels. 'Slow perfumery' philosophy: each bottle mixed in-store, named after its principal ingredient and number of components. Santal 33 became the unofficial scent of urban creatives worldwide.",
    url: "https://www.lelabofragrances.com/",
    perfumes: [],
  },
  {
    id: "mfk", name: "Maison Francis Kurkdjian", category: "niche", origin: "France · 2009",
    desc: "Founded by master perfumer Francis Kurkdjian (creator of Le Male) and Marc Chaya. Modern French luxury perfumery at its finest. Baccarat Rouge 540 became one of the most influential and most-imitated fragrances of the 21st century.",
    url: "https://www.franciskurkdjian.com/",
    perfumes: [],
  },
  {
    id: "byredo", name: "Byredo", category: "niche", origin: "Sweden · 2006",
    desc: "Founded by Ben Gorham in Stockholm. Brought Scandinavian minimalism and emotional storytelling to perfumery. Each fragrance is a personal narrative — restrained, modern, deeply atmospheric. Acquired by Puig in 2022.",
    url: "https://www.byredo.com/",
    perfumes: [],
  },
  {
    id: "diptyque", name: "Diptyque", category: "niche", origin: "France · 1961",
    desc: "Founded by three Parisian artists on Boulevard Saint-Germain. Botanically-inspired narratives and the iconic oval label. Began with home fragrances and candles before moving into wearable perfume. Parisian intellectual aesthetic at its finest.",
    url: "https://www.diptyqueparis.com/",
    perfumes: [],
  },
  {
    id: "fredericmalle", name: "Frédéric Malle", category: "niche", origin: "France · 2000",
    desc: "Editions de Parfums Frédéric Malle revolutionized niche perfumery by crediting perfumers as authors. Each fragrance signed by its creator. A house worshipped by connoisseurs. Founded by Frédéric Malle, grandson of Serge Heftler-Louiche, founder of Parfums Christian Dior.",
    url: "https://www.fredericmalle.com/",
    perfumes: [],
  },
  {
    id: "creed", name: "Creed", category: "niche", origin: "France / UK · 1760",
    desc: "Centuries-old house with bespoke perfumery roots serving European royalty since James Henry Creed delivered scented gloves to King George III. Aventus (2010) became one of the most influential masculine fragrances of the modern era.",
    url: "https://www.creedboutique.com/",
    perfumes: [],
  },
  {
    id: "margiela", name: "Maison Margiela Replica", category: "niche", origin: "France · 2012",
    desc: "The Replica line captures specific memories and moments through scent — a fireplace in winter, a beach walk, a jazz club. Conceptual storytelling meets accessible niche perfumery. Born from Martin Margiela's deconstructive fashion philosophy.",
    url: "https://www.maisonmargiela-fragrances.com/",
    perfumes: [],
  },
  {
    id: "kilian", name: "Kilian Paris", category: "niche", origin: "France · 2007",
    desc: "Founded by Kilian Hennessy, descendant of the cognac dynasty. Opulent fragrances housed in elegant refillable bottles. A dramatic luxury aesthetic. Acquired by Estée Lauder in 2016.",
    url: "https://www.bykilian.com/",
    perfumes: [],
  },
  {
    id: "amouage", name: "Amouage", category: "niche", origin: "Oman · 1983",
    desc: "Founded at the request of Sultan Qaboos bin Said al Said as 'The Gift of Kings.' Omani luxury house creating dense, complex compositions with ultra-rare raw materials. The pinnacle of maximalist Middle Eastern perfumery — opulent, intricate, unapologetic.",
    url: "https://amouage.com/",
    perfumes: [],
  },
  {
    id: "roja", name: "Roja Parfums", category: "niche", origin: "UK · 2011",
    desc: "Founded by master perfumer Roja Dove, often called the 'Professeur de Parfums.' Ultra-luxury British house known for opulent classical compositions with extraordinary longevity. Royal heritage aesthetic with crystal flacons.",
    url: "https://www.rojaparfums.com/",
    perfumes: [],
  },
  {
    id: "xerjoff", name: "Xerjoff", category: "niche", origin: "Italy · 2003",
    desc: "Founded by Sergio Momo in Turin. Italian luxury house with bottles crafted like jewels. Naxos and Erba Pura built cult followings among enthusiasts for their gourmand sophistication and sillage. Now in 125+ countries.",
    url: "https://www.xerjoff.com/",
    perfumes: [],
  },
  {
    id: "parfumsdemarly", name: "Parfums de Marly", category: "niche", origin: "France · 2009",
    desc: "Founded by Julien Sprecher. Inspired by Louis XV's court at Château de Marly. Aristocratic aesthetic with opulent compositions and exceptional longevity. Layton became a niche staple of the 2020s.",
    url: "https://parfums-de-marly.com/",
    perfumes: [],
  },
  {
    id: "initio", name: "Initio Parfums Privés", category: "niche", origin: "France · 2015",
    desc: "Founded by the Sprecher Berrier Group. Modern French house exploring fragrance as emotional 'magnetism' — designed to influence mood and self-perception. Side Effect and Oud for Greatness developed dedicated cult followings quickly.",
    url: "https://www.initioparfums.com/",
    perfumes: [],
  },
  {
    id: "mancera", name: "Mancera", category: "niche", origin: "France · 2008",
    desc: "Founded by Pierre Montale's nephew. Carries the Montale DNA of oud-rich, sillage-monster compositions at slightly more accessible niche prices. Sister brand to Montale, sharing some perfumer talent.",
    url: "https://mancera.com/",
    perfumes: [],
  },
  {
    id: "montale", name: "Montale", category: "niche", origin: "France · 2003",
    desc: "Founded by Pierre Montale, who spent years working in Saudi Arabia for the royal family before bringing oud-heavy compositions to Paris. Distinctive aluminum bottles. Specialist in oud, rose, and oriental statement fragrances.",
    url: "https://www.montaleparfums.com/",
    perfumes: [],
  },
  {
    id: "nishane", name: "Nishane", category: "niche", origin: "Turkey · 2012",
    desc: "Istanbul-based artisan house founded by Mert Güzel and Murat Katran. The first Istanbul niche brand to gain global recognition. Hacivat became cult — a polarizing pineapple-incense Aventus alternative.",
    url: "https://nishane.com/",
    perfumes: [],
  },
  {
    id: "bdk", name: "BDK Parfums", category: "niche", origin: "France · 2016",
    desc: "Founded by David Benedek in Paris. Modern French perfumery with elegant minimalist bottles and complex, narrative-driven compositions. Gris Charnel and Rouge Smoking became modern niche favorites.",
    url: "https://www.bdkparfums.com/",
    perfumes: [],
  },
  {
    id: "tiziana", name: "Tiziana Terenzi", category: "niche", origin: "Italy · 2011",
    desc: "Italian artisan house with brother-and-sister team Paolo and Tiziana Terenzi. Mystical compositions often inspired by celestial bodies and Italian lore. Kirké built a passionate following.",
    url: "https://www.tizianaterenzi.com/",
    perfumes: [],
  },
  {
    id: "clive", name: "Clive Christian", category: "niche", origin: "UK · 1872 / 1999",
    desc: "Originally Crown Perfumery (1872), granted Queen Victoria's crown image. Revived by Clive Christian in 1999 as ultra-luxury British house. Marketed as 'the world's most expensive perfume' — crown-stoppered crystal bottles, no compromise compositions.",
    url: "https://www.clivechristian.com/",
    perfumes: [],
  },
  {
    id: "nasomatto", name: "Nasomatto", category: "niche", origin: "Netherlands · 2007",
    desc: "Founded by perfumer Alessandro Gualtieri. Bold, intense, often divisive compositions in minimalist black bottles. Black Afgano became a niche legend. The name means 'crazy nose' in Italian.",
    url: "https://www.nasomatto.com/",
    perfumes: [],
  },
  {
    id: "ormonde", name: "Ormonde Jayne", category: "niche", origin: "UK · 2002",
    desc: "Founded by Linda Pilkington in London. Artisan British house known for sophisticated, ingredient-driven compositions and the distinctive black hemlock note that runs through the line.",
    url: "https://ormondejayne.com/",
    perfumes: [],
  },
  {
    id: "memo", name: "Memo Paris", category: "niche", origin: "France · 2007",
    desc: "Founded by Clara and John Molloy. Travel-inspired fragrances where each bottle represents a journey to a specific place — Marfa, Lalibela, Italian Leather. Sophisticated wanderlust in scent form.",
    url: "https://www.memoparis.com/",
    perfumes: [],
  },
  {
    id: "atelier", name: "Atelier Cologne", category: "niche", origin: "France · 2009",
    desc: "Founded by Sylvie Ganter and Christophe Cervasel. Reinvented the cologne format with longer-lasting 'Cologne Absolue' compositions. Approachable luxury niche. Acquired by L'Oréal in 2016.",
    url: "https://www.ateliercologne.com/",
    perfumes: [],
  },
  {
    id: "histoires", name: "Histoires de Parfums", category: "niche", origin: "France · 2000",
    desc: "Founded by Gérald Ghislain. Each fragrance named for a year or historical figure — perfumery as literary tribute. 1740 (Marquis de Sade) became a niche cult favorite.",
    url: "https://www.histoiresdeparfums.com/",
    perfumes: [],
  },
  {
    id: "matiere", name: "Matière Première", category: "niche", origin: "France · 2019",
    desc: "Founded by perfumer Aurélien Guichard, son of legendary perfumer Jean Guichard. Built around showcasing single raw materials at extraordinary quality — minimalist concept, maximalist craft.",
    url: "https://matierepremiere.com/",
    perfumes: [],
  },
  // ============ HERITAGE HOUSES ============
  {
    id: "guerlain", name: "Guerlain", category: "heritage", origin: "France · 1828",
    desc: "Founded by Pierre-François-Pascal Guerlain. Created Jicky (1889), the first modern fragrance to blend natural and synthetic ingredients. Shalimar (1925) defined the oriental family. The grand dame of French perfumery — five generations of Guerlain perfumers.",
    url: "https://www.guerlain.com/",
    perfumes: [],
  },
  {
    id: "houbigant", name: "Houbigant", category: "heritage", origin: "France · 1775",
    desc: "Founded by Jean-François Houbigant. The only fragrance house to exist through four centuries. Perfumed Marie Antoinette, Napoleon, Queen Victoria, and the Russian Imperial Court. Created Fougère Royale (1882), establishing the entire fougère family.",
    url: "https://www.houbigant-parfum.com/",
    perfumes: [],
  },
  {
    id: "lubin", name: "Lubin", category: "heritage", origin: "France · 1798",
    desc: "Founded by Pierre-François Lubin, apprentice to Marie-Antoinette's perfumer Fargeon. Became the favored perfumer of Empress Josephine, Napoleon's circle, and 19th-century European royal courts. Black Jade revives a scent created for Marie Antoinette herself.",
    url: "https://www.lubin-parfums.fr/",
    perfumes: [],
  },
  {
    id: "caron", name: "Caron", category: "heritage", origin: "France · 1904",
    desc: "Founded by Ernest Daltroff. Pour un Homme (1934) was the first modern masculine perfume — a lavender-vanilla composition still legendary today. Famous for its perfume fountains in the Paris boutique, where customers fill their own bottles.",
    url: "https://www.parfumscaron.com/",
    perfumes: [],
  },
  {
    id: "lartisan", name: "L'Artisan Parfumeur", category: "heritage", origin: "France · 1976",
    desc: "Founded by Jean Laporte. Set the standard for modern niche perfumery before the term existed. Mûre et Musc (1978) was a game-changer for blackberry-musk gourmands. Timbuktu and Fou d'Absinthe continue the legacy.",
    url: "https://www.artisanparfumeur.com/",
    perfumes: [],
  },
  {
    id: "annicksgoutal", name: "Goutal Paris", category: "heritage", origin: "France · 1981",
    desc: "Founded by Annick Goutal, former pianist and model turned perfumer. Romantic, deeply French compositions inspired by Parisian gardens and travel memories. Eau d'Hadrien and Petite Chérie remain icons.",
    url: "https://www.goutalparis.com/",
    perfumes: [],
  },
  {
    id: "molinard", name: "Molinard", category: "heritage", origin: "France · 1849",
    desc: "Founded in Grasse by Hyacinthe Molinard. One of the original Grasse perfumeries. Habanita (1921) shocked Paris as the first feminine scent to embrace tobacco and leather notes — still produced today.",
    url: "https://www.molinard.com/",
    perfumes: [],
  },
  {
    id: "fragonard", name: "Fragonard", category: "heritage", origin: "France · 1926",
    desc: "Founded in Grasse, named after the painter Jean-Honoré Fragonard. The bridge between traditional Grasse perfumery and tourist-accessible luxury. The Fragonard museums in Paris and Grasse are pilgrimage sites for perfume lovers.",
    url: "https://www.fragonard.com/",
    perfumes: [],
  },
  // ============ BRITISH HERITAGE ============
  {
    id: "penhaligons", name: "Penhaligon's", category: "heritage", origin: "UK · 1870",
    desc: "Founded by William Penhaligon, Court Barber to Queen Victoria. Holds two Royal Warrants. Recent decade brought revival under perfumer Alberto Morillas with the Portraits collection — quirky English aristocratic storytelling at its finest.",
    url: "https://www.penhaligons.com/",
    perfumes: [],
  },
  {
    id: "floris", name: "Floris London", category: "heritage", origin: "UK · 1730",
    desc: "Founded by Juan Famenias Floris from Menorca on Jermyn Street, London. The oldest English perfumer, still family-owned after nine generations. Perfumed Florence Nightingale, Mary Shelley, James Bond (Ian Fleming was a customer), and the British royal family.",
    url: "https://www.florislondon.com/",
    perfumes: [],
  },
  {
    id: "gallivant", name: "Gallivant", category: "niche", origin: "UK · 2017",
    desc: "Founded by Nick Steward, former L'Artisan creative director. City-inspired fragrances each capturing a specific neighborhood's vibe — Tel Aviv, Brooklyn, Tokyo. Contemporary, accessible niche.",
    url: "https://gallivant-perfumes.com/",
    perfumes: [],
  },
  {
    id: "thameen", name: "Thameen London", category: "niche", origin: "UK · 2013",
    desc: "Luxury British house drawing inspiration from British royal heritage and Middle Eastern grandeur. Each fragrance themed around historic royal artifacts. High-performance compositions with crown-detailed bottles.",
    url: "https://www.thameenlondon.com/",
    perfumes: [],
  },
  {
    id: "vilhelm", name: "Vilhelm Parfumerie", category: "niche", origin: "USA / Sweden · 2014",
    desc: "Founded by Jan Ahlgren. Inspired by his grandfather Vilhelm. Contemporary minimalist Scandinavian aesthetic. Mango Skin became viral on TikTok. Now distributed by Inter Parfums.",
    url: "https://www.vilhelmparfumerie.com/",
    perfumes: [],
  },
  // ============ MIDDLE EASTERN LUXURY ============
  {
    id: "ojar", name: "Ojar", category: "niche", origin: "Oman / UK · 2017",
    desc: "Modern Omani-British house bringing Middle Eastern raw materials into contemporary, wearable compositions. Sophisticated bridge between East and West. Independent of Amouage, more contemporary in aesthetic.",
    url: "https://ojar.com/",
    perfumes: [],
  },
  {
    id: "stephane", name: "Stéphane Humbert Lucas 777", category: "niche", origin: "France · 2013",
    desc: "Founded by perfumer Stéphane Humbert Lucas, formerly of SoOud and Nez à Nez. Opulent compositions with Middle Eastern soul. Khôl de Bahreïn and Black Gemstone are contemporary classics.",
    url: "https://www.stephanehumbertlucas777.com/",
    perfumes: [],
  },
  {
    id: "widian", name: "Widian", category: "niche", origin: "UAE · 2014",
    desc: "Founded in Abu Dhabi by Ali Al Ahmed. Originally launched as AJ Arabia. Luxurious oud-forward compositions presented in elegant gold-detailed bottles. Modern Gulf luxury aesthetic.",
    url: "https://widian.com/",
    perfumes: [],
  },
  {
    id: "bortnikoff", name: "Bortnikoff", category: "niche", origin: "Russia / Israel · 2014",
    desc: "Founded by Dmitry Bortnikoff. Independent, ultra-niche house specializing in extreme oud and amber compositions. Cult following among hardcore fragrance enthusiasts seeking the most intense compositions available.",
    url: "https://bortnikoff.com/",
    perfumes: [],
  },
  {
    id: "maha", name: "Maison Sybarite", category: "niche", origin: "Lebanon / UK · 2018",
    desc: "Founded by Lebanese fragrance entrepreneur. Refined Middle Eastern luxury house with minimalist bottle design and sophisticated oud and rose compositions. Underrated gem of contemporary niche.",
    url: "https://maisonsybarite.com/",
    perfumes: [],
  },
  // ============ ITALIAN ARTISANS ============
  {
    id: "acquadiparma", name: "Acqua di Parma", category: "heritage", origin: "Italy · 1916",
    desc: "Founded in Parma by an unnamed nobleman. Colonia (1916) is reference of elegant Mediterranean masculinity. Yellow art-deco bottles. Acquired by LVMH in 2001. Italian sun captured in bottle form.",
    url: "https://www.acquadiparma.com/",
    perfumes: [],
  },
  {
    id: "santamariaNovella", name: "Santa Maria Novella", category: "heritage", origin: "Italy · 1612",
    desc: "Founded by Dominican friars in Florence — possibly the oldest still-operating pharmacy and perfumery in the world. Acqua della Regina was created for Catherine de' Medici when she became Queen of France. Living history.",
    url: "https://www.smnovella.com/",
    perfumes: [],
  },
  {
    id: "officinaprofumo", name: "Officina Profumo-Farmaceutica", category: "heritage", origin: "Italy · 1612",
    desc: "Florentine perfumery from the Santa Maria Novella tradition. Centuries of monastic formulas combined with modern sophistication. Often considered alongside SMN as living perfumery archaeology.",
    url: "https://www.smnovella.com/",
    perfumes: [],
  },
  {
    id: "lorenzovilloresi", name: "Lorenzo Villoresi", category: "niche", origin: "Italy · 1990",
    desc: "Founded by Lorenzo Villoresi, philosophy scholar turned perfumer in Florence. Self-taught master who creates from his Renaissance palazzo studio. Recipient of the Coty Award. Known for his meditative, intellectual approach to perfumery.",
    url: "https://www.lorenzovilloresi.it/",
    perfumes: [],
  },
  {
    id: "carthusia", name: "Carthusia", category: "heritage", origin: "Italy · 1948",
    desc: "Founded on the island of Capri, with formulas dating back to a 14th-century Carthusian monastery. The smallest perfume factory in Italy. Mediterranean island scents in their purest form.",
    url: "https://www.carthusia.it/",
    perfumes: [],
  },
  // ============ FRENCH AVANT-GARDE ============
  {
    id: "sergelutens", name: "Serge Lutens", category: "niche", origin: "France · 1992",
    desc: "Founded by visionary creative director Serge Lutens at Les Salons du Palais Royal Shiseido. Aesthetic radicalism — dark, baroque, sometimes confrontational compositions. Ambre Sultan and Féminité du Bois are landmark works of 1990s niche perfumery.",
    url: "https://www.sergelutens.com/",
    perfumes: [],
  },
  {
    id: "etat", name: "Etat Libre d'Orange", category: "niche", origin: "France · 2006",
    desc: "Founded by Etienne de Swardt. Provocative names ('Sécrétions Magnifiques,' 'Vierges et Toreros'), challenging compositions, irreverent attitude. Niche perfumery as cultural commentary. Defies all conventions deliberately.",
    url: "https://www.etatlibredorange.com/",
    perfumes: [],
  },
  {
    id: "barrois", name: "Marc-Antoine Barrois", category: "niche", origin: "France · 2016",
    desc: "Founded by tailor Marc-Antoine Barrois with perfumer Quentin Bisch. Reached nearly $70M in retail sales by 2024. Ganymede became cult — a saffron-suede masterpiece. 'No limits on time or ingredients' philosophy.",
    url: "https://www.marcantoinebarrois.com/",
    perfumes: [],
  },
  {
    id: "papillon", name: "Papillon Artisan Perfumes", category: "niche", origin: "UK · 2014",
    desc: "Founded by self-taught perfumer Liz Moores in Dorset, England. Vintage-style compositions with extreme natural ingredient concentrations. Salome and Anubis became cult favorites among connoisseurs.",
    url: "https://papillonperfumery.co.uk/",
    perfumes: [],
  },
  {
    id: "crivelli", name: "Maison Crivelli", category: "niche", origin: "France · 2018",
    desc: "Founded by Thibaud Crivelli. Storytelling-driven house where perfumers receive mood boards instead of briefs. Each fragrance born from unexpected encounters with raw materials. Oud Maracujá took TikTok by storm.",
    url: "https://www.maisoncrivelli.com/",
    perfumes: [],
  },
  {
    id: "puredistance", name: "Puredistance", category: "niche", origin: "Netherlands · 2007",
    desc: "Founded by Jan Ewoud Vos. Ultra-pure, ultra-concentrated extrait compositions (32-38% concentration). Each released in limited numbers in elegant Czech crystal flacons. Quality fanaticism made tangible.",
    url: "https://www.puredistance.com/",
    perfumes: [],
  },
  {
    id: "bogue", name: "Bogue Profumo", category: "niche", origin: "Italy · 2013",
    desc: "Founded by Antonio Gardoni in Brescia. Architectural training translated into structured, often dark and animalic compositions. MEM and Maai are legendary in connoisseur circles. Perfume as architectural object.",
    url: "https://www.bogueprofumo.com/",
    perfumes: [],
  },
  {
    id: "miller", name: "Miller Harris", category: "niche", origin: "UK · 2000",
    desc: "Founded by Lyn Harris, trained in Grasse. Botanical, garden-inspired British perfumery. Authentic English countryside translated through French perfumery tradition. Lumière Dorée and Tea Tonique remain favorites.",
    url: "https://www.millerharris.com/",
    perfumes: [],
  },
  {
    id: "fueguia", name: "Fueguia 1833", category: "niche", origin: "Argentina / Italy · 2010",
    desc: "Founded by Julian Bedel in Buenos Aires, now based in Milan. Patagonia-inspired perfumery with focus on rare South American botanicals. Each fragrance accompanies a literary reference. Niche perfumery as natural history museum.",
    url: "https://www.fueguia.com/",
    perfumes: [],
  },
  // ============ INDIE / EMERGING ============
  {
    id: "dsdurga", name: "D.S. & Durga", category: "niche", origin: "USA · 2007",
    desc: "Founded by David Seth Moltz (musician) and Kavi Moltz (architect) in Brooklyn. Storytelling-driven American niche. Each fragrance has detailed liner notes like an album. Debaser, Bowmakers, and Big Sur After Rain became modern classics.",
    url: "https://www.dsanddurga.com/",
    perfumes: [],
  },
  {
    id: "phlur", name: "Phlur", category: "niche", origin: "USA · 2016",
    desc: "Founded by Eric Korman, with creative direction from Chriselle Lim. Brought niche-level quality to accessible price points. Missing Person became viral on TikTok in 2022, defining the 'clean girl' aesthetic of that era.",
    url: "https://www.phlur.com/",
    perfumes: [],
  },
  {
    id: "zoologist", name: "Zoologist Perfumes", category: "niche", origin: "Canada · 2013",
    desc: "Founded by Victor Wong in Toronto. Animal-inspired fragrances (Bat, Squid, Elephant, Bee) created by award-winning perfumers. Vegan and cruelty-free. Multiple Art and Olfaction Award winners. Imaginative perfumery at its boldest.",
    url: "https://zoologistperfumes.com/",
    perfumes: [],
  },
  {
    id: "imaginary", name: "Imaginary Authors", category: "niche", origin: "USA · 2012",
    desc: "Founded by perfumer Josh Meyer in Portland, Oregon. Each fragrance is conceived as the scent of a fictional novel, complete with cover art and synopsis. Falling Into the Sea and Telegrama From My Country are conceptual triumphs.",
    url: "https://www.imaginaryauthors.com/",
    perfumes: [],
  },
  {
    id: "stora", name: "Stora Skuggan", category: "niche", origin: "Sweden · 2015",
    desc: "Swedish indie collective creating fragrances that feel like myths in liquid form. Mythical narratives, hand-illustrated bottles, Scandinavian art-school sensibility. Independent of trends, focused purely on olfactory storytelling.",
    url: "https://storaskuggan.com/",
    perfumes: [],
  },
  {
    id: "fzotic", name: "Fzotic (Bruno Fazzolari)", category: "niche", origin: "USA · 2013",
    desc: "Founded by painter and perfumer Bruno Fazzolari in San Francisco. Synesthesia-driven approach — scents tied to colors and visual art. Lampblack, Cadenet, and Au Delà Narcisse for the connoisseur seeking the avant-garde.",
    url: "https://www.brunofazzolari.com/",
    perfumes: [],
  },
  {
    id: "nez", name: "Nezzira (formerly Nez à Nez)", category: "niche", origin: "France · 2008",
    desc: "Pierre and Sandra Benard's house exploring 'duo' compositions — fragrances that play on contrasts and pairings. Underrated gem of French niche with sophisticated, ingredient-forward work.",
    url: "https://www.nezanez.com/",
    perfumes: [],
  },
  {
    id: "atelierdessens", name: "Atelier des Sens", category: "niche", origin: "France · 2024",
    desc: "Founded by Andrei Vlad in Grasse. Newcomer with serious credentials — 'a sanctuary where immortal emotions come to life.' Three opening extraits (Zino, Rozzo, Spiros) demonstrate haute parfumerie ambitions.",
    url: "https://atelierdessens.com/",
    perfumes: [],
  },
  {
    id: "krigler", name: "Krigler", category: "heritage", origin: "Germany / USA · 1879",
    desc: "Founded by Albert Krigler. The fragrance equivalent of a perfectly tailored Loro Piana suit — timeless, elegant, quietly luxurious. Patrons included JFK, Audrey Hepburn, and Grace Kelly. Old-money signature scents.",
    url: "https://www.krigler.com/",
    perfumes: [],
  },
  {
    id: "argos", name: "Argos", category: "niche", origin: "USA · 2017",
    desc: "Mythology-inspired house with stunningly ornate bottles. Greek and Roman lore translated into modern luxurious compositions. The bottles alone are conversation pieces — but the fragrances hold their own.",
    url: "https://www.argosfragrances.com/",
    perfumes: [],
  },
  {
    id: "maisonviolet", name: "Maison Violet", category: "heritage", origin: "France · 1827",
    desc: "Originally founded by François-Étienne Violet, perfumer to Empress Eugénie. Recently revived. Romantic, opulent compositions with deep French heritage roots. A heritage maison reborn for the modern niche era.",
    url: "https://www.maisonviolet.com/",
    perfumes: [],
  },
  {
    id: "floraiku", name: "Floraïku", category: "niche", origin: "France · 2017",
    desc: "Japanese culture and poetry filtered through French perfumery craftsmanship. Each fragrance presented as a poetic journey. Bento-box-inspired bottles. Subtle, ethereal, deliberately understated.",
    url: "https://www.floraiku.com/",
    perfumes: [],
  },
  {
    id: "aesop", name: "Aesop", category: "niche", origin: "Australia · 1987",
    desc: "Founded by Dennis Paphitis in Melbourne. Best known for skincare, but the fragrance line is a study in restraint. Marrakech Intense and Tacit became modern intellectual signatures. Acquired by L'Oréal in 2023 for $2.5 billion.",
    url: "https://www.aesop.com/",
    perfumes: [],
  },
  {
    id: "ffern", name: "Ffern", category: "niche", origin: "UK · 2013",
    desc: "Subscription-based organic, vegan, all-natural perfumery from Somerset. Four perfumes per year. Cult following waits for each release. Brings perfume back to its artisan roots with the highest quality natural materials.",
    url: "https://ffern.co/",
    perfumes: [],
  },
  // ============ ICONIC LUXURY LINES ============
  {
    id: "tomfordprivate", name: "Tom Ford Private Blend", category: "luxury-line", origin: "USA · 2007",
    desc: "Tom Ford's exclusive Private Blend collection elevated luxury department-store perfumery to niche-quality with bold, sensual compositions. Tobacco Vanille, Oud Wood, and Lost Cherry became modern classics that defined an entire decade of luxury fragrance.",
    url: "https://www.tomfordbeauty.com/",
    perfumes: [],
  },
  {
    id: "chanellesexclusifs", name: "Chanel Les Exclusifs", category: "luxury-line", origin: "France · 2007",
    desc: "Chanel's exclusive collection inaugurated by perfumer Jacques Polge, now stewarded by son Olivier Polge. Refined, often vintage-inspired compositions sold only at Chanel boutiques and select counters. Sycomore and Coromandel are connoisseur favorites.",
    url: "https://www.chanel.com/",
    perfumes: [],
  },
  {
    id: "hermessence", name: "Hermessence", category: "luxury-line", origin: "France · 2004",
    desc: "Hermès's exclusive collection, originally composed by Jean-Claude Ellena. Minimalist haiku-like compositions celebrating individual raw materials — the most refined expression of Hermès's perfumery philosophy.",
    url: "https://www.hermes.com/",
    perfumes: [],
  },
  {
    id: "diorprive", name: "Dior La Collection Privée", category: "luxury-line", origin: "France · 2004",
    desc: "Dior's exclusive boutique collection, originally curated by François Demachy. Heritage Dior reimagined with niche-level craft. Ambre Nuit, Oud Ispahan, and Spice Blend are connoisseur staples.",
    url: "https://www.dior.com/",
    perfumes: [],
  },
  {
    id: "guerlainexclusifs", name: "Guerlain L'Art & La Matière", category: "luxury-line", origin: "France · 2005",
    desc: "Guerlain's exclusive ultra-luxury line. Cuir Beluga, Spiritueuse Double Vanille, and Tonka Impériale showcase Guerlain's master perfumers at their most uncompromising. Ingredient-driven artistry.",
    url: "https://www.guerlain.com/",
    perfumes: [],
  },
  {
    id: "armaniprive", name: "Armani Privé", category: "luxury-line", origin: "Italy · 2004",
    desc: "Armani's exclusive haute couture-inspired fragrance collection. Refined Italian aesthetic through niche-quality compositions. Rose d'Arabie and Oud Royal remain pillars of contemporary luxury masculine perfumery.",
    url: "https://www.armanibeauty.com/",
    perfumes: [],
  },
];


// ===== LE LABO BRAND DATA — RICH DETAIL =====
const LE_LABO = {
  name: "LE LABO",
  tagline: "Slow perfumery. Hand-blended. Soulful.",
  origin: "New York City · 2006",
  birthplace: "Grasse, France",
  founders: [
    { name: "Eddie Roschi", role: "Co-founder", bio: "French-born, chemical engineering background. Started his career at fragrance giant Firmenich in sales for the North African and Middle Eastern markets, where his technical knowledge met the commercial side of perfumery. Later joined L'Oréal, where he met Fabrice. Famously believes 'creation is an autocracy, not a democracy.'" },
    { name: "Fabrice Penot", role: "Co-founder", bio: "French-born, with a deep love for industrial design inherited from his father, who worked in a French factory. Trained briefly with Hermès master perfumer Jean-Claude Ellena in Grasse — that experience planted the seed for the Le Labo concept. Met Eddie at L'Oréal, working on Armani fragrance launches." },
  ],
  philosophy: {
    headline: "We believe there are too many bottles of perfume and not enough soulful fragrances.",
    body: "Le Labo was born from rebellion against the soulless, mass-marketed fragrances that dominated the early 2000s. Eddie Roschi and Fabrice Penot met at L'Oréal while working on Armani campaigns, and quickly realized they shared a frustration with an industry that had drifted from artistry into spreadsheet-driven sameness. The concept came to Fabrice during a training course with Hermès master perfumer Jean-Claude Ellena in Grasse: what if customers could be part of the laboratory experience? What if perfumes could be hand-blended in front of them, labeled with their name and the date, treated as the personal, slow rituals they once were?",
    body2: "The result is what they call 'slow perfumery' — a deliberate counterweight to the fast-fashion fragrance cycle. No formal investor backing at launch. No advertising. No celebrities given free product. No animal testing. Each bottle is mixed by hand at the moment of purchase. Each label printed in-store with the customer's chosen inscription, the date of compounding, and the location. The brand was acquired by The Estée Lauder Companies in 2014, but Penot and Roschi retained creative control — and the manifesto remains unchanged.",
    quote: "Empathy, silence — they're a big part of our connection with the clients. We give them space to express themselves in a way they usually don't in a traditional retail environment.",
    quoteBy: "Fabrice Penot",
  },
  visualIdentity: {
    description: "Industrial-meets-apothecary. The aesthetic emerged accidentally during the build-out of the first boutique at 233 Elizabeth Street in Nolita, when a metal wall with relief ornamentation was uncovered during renovation. That masculine-industrial detail became the brand signature. Worn leather seating. Cast-iron fixtures. Vintage laboratory glassware. Hand-typed kraft labels. Every store a working laboratory, not a showroom.",
  },
  signaturePerfumer: {
    name: "Frank Voelkl",
    title: "Senior Perfumer at Firmenich · Nose behind Santal 33",
    bio: "Born in Germany, raised in France and the Netherlands. Studied at the prestigious ISIPCA in France. Fabrice Penot first met Voelkl in 2002 — they bonded over a shared belief in 'true' perfumery and creating fragrances that evoke real emotion. Voelkl is responsible for many of Le Labo's most beloved compositions, including Santal 33, Iris 39, Musc 25, Baie Rose 26, and Ylang 49.",
  },
  timeline: [
    { year: "2002", event: "Eddie Roschi and Fabrice Penot meet at L'Oréal, working on Armani launches" },
    { year: "2005", event: "Fabrice trains with Jean-Claude Ellena in Grasse — the 'lab' concept is born" },
    { year: "2006", event: "First Le Labo boutique opens at 233 Elizabeth Street, Nolita NYC. Launch collection of 10 fragrances + Santal 26 candle" },
    { year: "2011", event: "Santal 33 launches as a wearable perfume — the candle's cult demand finally answered" },
    { year: "2014", event: "Acquired by The Estée Lauder Companies. Penot and Roschi retain creative control" },
    { year: "2015", event: "Santal 33 declared by The New York Times as 'the cult secret whispered through wafts of sandalwood'" },
    { year: "Today", event: "150+ international locations · 19 signature scents · 13 City Exclusives · Annual September 'City Exclusives Month'" },
  ],
  signatureIngredients: [
    { name: "Australian Sandalwood", desc: "The smoky, dry sandalwood at the heart of Santal 33 — sourced for its distinctive crackle and depth, far drier than Indian Mysore." },
    { name: "Grasse Rose", desc: "Hand-picked roses from Grasse, France — the historic perfumery capital. Featured prominently in Rose 31, where the centifolia rose is twisted with cumin, olibanum, and cedar into something neither feminine nor masculine." },
    { name: "Ambroxan", desc: "A synthetic animal musk derived from ambergris. The addictive, magnetic core of Another 13 — the 'dirty' molecule that makes a fragrance feel like skin." },
    { name: "Iris (Orris)", desc: "One of the most expensive raw materials in perfumery. Le Labo features it in Iris 39 with cool, powdery sophistication." },
    { name: "Bergamot from Calabria", desc: "The bright, slightly bitter citrus from southern Italy — central to Bergamote 22 and used as opening note across the line." },
    { name: "Cardamom & Pink Pepper", desc: "Spice notes that recur across the collection, providing the 'crackle' Penot famously describes." },
  ],
  namingConvention: "Each Le Labo fragrance is named after its principal ingredient and the total number of components in the formula. SANTAL 33 = sandalwood, 33 ingredients. ROSE 31 = rose, 31 ingredients. ANOTHER 13 = ambrette (the 'other' theme), 13 ingredients. The numbers are not random — they're transparency.",
  retailers: [
    { name: "Le Labo Official", url: "https://www.lelabofragrances.com/", note: "All scents · personalization · sample sets" },
    { name: "Nordstrom", url: "https://www.nordstrom.com/brands/le-labo--16005", note: "Wide selection · loyalty rewards" },
    { name: "Saks Fifth Avenue", url: "https://www.saksfifthavenue.com/", note: "Premium retailer · select fragrances" },
    { name: "Bergdorf Goodman", url: "https://www.bergdorfgoodman.com/", note: "Curated luxury experience" },
    { name: "Costco (US)", url: "https://www.costco.com/", note: "Santal 33 100ml at meaningful discount when in stock" },
  ],
};

const LE_LABO_PERFUMES = [
  {
    name: "SANTAL 33",
    number: 33,
    year: "2011",
    perfumer: "Frank Voelkl",
    family: "Woody Aromatic",
    inspiration: "The Marlboro Man. The American West. A solitary cowboy by an open fire under tall blue evening skies — leather saddle, desert wind, smoke drifting upward. An icon of masculinity and freedom that Penot and Voelkl wanted to translate into something universal, sensual, and wearable by anyone.",
    creationStory: "Santal 33 didn't start as a perfume — it started as a candle (Santal 26) that Le Labo nearly threw out. The original sandalwood composition was deemed too weak for the 2006 launch lineup, so it was reformulated into a candle. The candle didn't sell well at first either; remaining stock was unloaded onto the Gramercy Park Hotel. Then the candle quietly became a cult favorite. For four years, beauty editor Jane Larkworthy begged Le Labo to make a wearable version. They refused. Then one night Penot was at a bar, smelled something incredible on a stranger, and asked what he was wearing. The man said: Santal 26 room spray. Penot called Eddie immediately: 'We have our next perfume. It's been there the whole time.' Frank Voelkl, who had been wearing the original formula himself for years, adjusted it slightly — 'a little deeper, a little more comfortable' — and Santal 33 launched in 2011. It became one of the most influential fragrances of the 21st century.",
    notes: {
      top: "Cardamom, Violet Accord, Iris",
      heart: "Australian Sandalwood, Papyrus, Virginia Cedar",
      base: "Ambroxan, Leather, Musk",
    },
    bestFor: "A signature scent. Year-round wear. Understated luxury. The fragrance that says 'I know things' without saying anything. Particularly striking on cool autumn evenings, on cashmere, on someone reading in a café.",
    sillage: "Moderate to strong",
    longevity: "8–12 hours",
    price: "$220 (50ml) · $420 (100ml)",
  },
  {
    name: "ROSE 31",
    number: 31,
    year: "2006",
    perfumer: "Daphné Bugey",
    family: "Woody Floral",
    inspiration: "A protest against the cliché of rose as a feminine cliché. Penot and Roschi wanted to take the most overused note in perfumery — the centifolia rose of Grasse — and twist it into something assertive, almost virile. A rose that walks into a room with shoulders back.",
    creationStory: "Part of the original 2006 launch collection, Rose 31 was conceived as a statement piece: the famous Grasse Rose, hand-picked from the historic fields of southern France, framed not by sweet powders or fruits but by warm spices, woody depths, and a hint of animalism. Daphné Bugey — known for her precise, architectural approach — built a structure where the rose oscillates between feminine softness and masculine cumin-and-cedar grit. It was a quiet rebellion: in 2006, no one was making rose perfumes for men. Rose 31 made it possible.",
    notes: {
      top: "Cumin, Cedarwood, Bourbon Pepper",
      heart: "Centifolia Rose, Olibanum, Guaiac Wood",
      base: "Cistus, Amber, Animal Notes",
    },
    bestFor: "Anyone who finds traditional roses too sweet. Sophisticated unisex wear. Evening dinners. The fragrance for someone who wants the romance of rose without the cliché.",
    sillage: "Moderate",
    longevity: "7–9 hours",
    price: "$220 (50ml) · $420 (100ml)",
  },
  {
    name: "ANOTHER 13",
    number: 13,
    year: "2010",
    perfumer: "Nathalie Lorson",
    family: "Musky Woody",
    inspiration: "The 'other' in the line — a fragrance that doesn't smell like a fragrance. Built around ambroxan, a synthetic animal musk derived from ambergris that mimics the warmth of human skin. Designed to be magnetic, intimate, and slightly disorienting.",
    creationStory: "If Santal 33 is Le Labo's most worn perfume, Another 13 is its most addictive. Nathalie Lorson built it around an unusually high concentration of ambroxan — the molecule that gives skin scents their gravitational pull — and surrounded it with a cloud of ambrette seeds, jasmine, and moss. The result is a fragrance that smells like an idealized version of yourself: clean but never sterile, warm but never sweet, sexual but never explicit. It's the scent that makes strangers ask 'what are you wearing?' and then disbelieve you when you tell them.",
    notes: {
      top: "Ambrette Seeds, Pear, Jasmine Aquatic",
      heart: "Ambroxan, Helvetolide, Moss",
      base: "Cetalox, Ambergris, White Musk",
    },
    bestFor: "Skin-scent obsessives. Daily wear. Layering with other Le Labo fragrances. The hot-but-doesn't-try-too-hard energy.",
    sillage: "Soft to moderate (close to skin)",
    longevity: "8–10 hours",
    price: "$220 (50ml) · $420 (100ml)",
  },
  {
    name: "BERGAMOTE 22",
    number: 22,
    year: "2006",
    perfumer: "Daphné Bugey",
    family: "Citrus Musk",
    inspiration: "Reinventing cologne. Most citrus fragrances evaporate in an hour. Bergamote 22 was designed to make a Calabrian bergamot last all day — bright at the start, but slowly anchored by white musk and vetiver until it becomes warm and skin-like.",
    creationStory: "From the original 2006 lineup, Bergamote 22 was Le Labo's answer to the question: why do citrus fragrances always disappear so fast? Daphné Bugey paired the brightness of Calabrian bergamot and Italian grapefruit with an unusually generous base of musks and vetiver, creating a citrus that doesn't fade — it deepens. It became a cult favorite for warm climates, summer travel, and anyone tired of citrus colognes that vanish before lunch.",
    notes: {
      top: "Bergamot, Grapefruit, Petitgrain",
      heart: "Orange Blossom, Amber",
      base: "Vetiver, Musk, Cedar",
    },
    bestFor: "Summer signature. Hot climates. Office wear in warm seasons. Fresh and sophisticated without being aquatic.",
    sillage: "Moderate",
    longevity: "6–8 hours",
    price: "$220 (50ml) · $420 (100ml)",
  },
  {
    name: "THÉ NOIR 29",
    number: 29,
    year: "2015",
    perfumer: "Frank Voelkl",
    family: "Woody Aromatic",
    inspiration: "The art of tea preparation. The hush of a tea ceremony. Frank Voelkl wanted to capture not just the scent of black tea, but the entire ritual — the dry leaves, the steam, the woods of the room, the lingering smoke of incense.",
    creationStory: "By 2015, Le Labo had earned the right to take risks — and Thé Noir 29 was one of them. Voelkl took distinctive black tea leaf extract and threaded it through bay leaves, fig, bergamot, and cedar. The result oscillates between bright and shadowy: at first a crisp tea-and-citrus, then an unexpected hay-like, tobacco-adjacent dry-down. It's intellectual perfumery — the kind you wear when you want to think, not perform.",
    notes: {
      top: "Bergamot, Bay Leaves, Fig",
      heart: "Black Tea Leaf Extract, Cedar",
      base: "Vetiver, Musk, Tobacco Accord",
    },
    bestFor: "Crisp afternoons. Reading. Cool autumn days. The intellectual signature.",
    sillage: "Moderate",
    longevity: "7–9 hours",
    price: "$220 (50ml) · $420 (100ml)",
  },
];

const FEATURES = [
  { icon: Building2, title: "House Histories", desc: "From founding to iconic creations — discover the soul behind each maison, with links to official boutiques." },
  { icon: FlaskConical, title: "Olfactory Notes Guide", desc: "Understand the difference between bergamot and cedar, fougère and oriental. Build your fragrance vocabulary." },
  { icon: Briefcase, title: "Fragrances by Occasion", desc: "Curation by moment: office, travel, evenings, beach, winter. The right scent always within reach." },
  { icon: BookMarked, title: "My Collection", desc: "Track perfumes you own, want, or have sampled. Your personal fragrance archive, organized." },
  { icon: Wallet, title: "Smart Budgeting", desc: "From entry niche to ultra-luxury: recommendations across all tiers with alternatives and where to find them." },
  { icon: Users, title: "Community", desc: "A space for fragrance lovers to connect, share discoveries, and build this culture together." },
];

const CATEGORY_LABELS = { niche: "Niche", "luxury-line": "Luxury Line", heritage: "Heritage House" };

function LeLaboPage({ onBack }) {
  const [activePerfume, setActivePerfume] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6", fontFamily: "'Inter', system-ui, sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out; }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }
        .label-line {
          background-image: repeating-linear-gradient(90deg, #1A1A1A 0, #1A1A1A 4px, transparent 4px, transparent 8px);
          height: 1px;
        }
      `}</style>

      {/* TOP BAR — back button */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between" style={{ background: "rgba(244,239,230,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:opacity-60 transition mono">
          <ArrowLeft size={14} /> back to scentwise
        </button>
        <span className="mono text-xs uppercase tracking-[0.2em] opacity-50">brand · le labo · slow perfumery</span>
      </div>

      {/* HERO SECTION — kraft label aesthetic */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-24 px-6 md:px-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto fade-up">
          {/* Le Labo style "label" */}
          <div className="border-2 inline-block px-8 py-6 mb-10" style={{ borderColor: "#1A1A1A", background: "#F4EFE6" }}>
            <p className="mono text-[10px] uppercase tracking-[0.3em] mb-2 opacity-60">le laboratoire / new york</p>
            <h1 className="serif font-light leading-none mb-3" style={{ fontSize: "clamp(3rem, 9vw, 7rem)", letterSpacing: "0.02em" }}>LE LABO</h1>
            <div className="label-line mb-3"></div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] opacity-70">est. 2006 · soul of grasse · 233 elizabeth st nolita</p>
          </div>

          <p className="serif italic font-light max-w-3xl mb-12" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.4, color: "#3A3A3A" }}>
            "{LE_LABO.philosophy.headline}"
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
            <div className="border-l-2 pl-4" style={{ borderColor: "#1A1A1A" }}>
              <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2">founded</p>
              <p className="text-base">{LE_LABO.origin}</p>
            </div>
            <div className="border-l-2 pl-4" style={{ borderColor: "#1A1A1A" }}>
              <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2">spirit of</p>
              <p className="text-base">{LE_LABO.birthplace}</p>
            </div>
            <div className="border-l-2 pl-4" style={{ borderColor: "#1A1A1A" }}>
              <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2">collection</p>
              <p className="text-base">19 signature scents</p>
            </div>
          </div>

          <a href="https://www.lelabofragrances.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-12 mono text-xs uppercase tracking-[0.2em] border-b pb-1 hover:opacity-60 transition" style={{ borderColor: "#1A1A1A" }}>
            visit lelabofragrances.com <ExternalLink size={12} />
          </a>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#1A1A1A", color: "#F4EFE6" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— philosophy</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.2 }}>
            Slow perfumery, unbothered by hype.
          </h2>

          <div className="space-y-6 text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(244,239,230,0.85)" }}>
            <p>{LE_LABO.philosophy.body}</p>
            <p>{LE_LABO.philosophy.body2}</p>
          </div>

          <blockquote className="mt-16 pl-8 border-l-2" style={{ borderColor: "#A67C52" }}>
            <Quote size={20} style={{ color: "#A67C52" }} className="mb-3" />
            <p className="serif italic font-light text-xl md:text-2xl mb-3" style={{ color: "#F4EFE6", lineHeight: 1.5 }}>
              "{LE_LABO.philosophy.quote}"
            </p>
            <p className="mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(244,239,230,0.5)" }}>— {LE_LABO.philosophy.quoteBy}, co-founder</p>
          </blockquote>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-6xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— the founders</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Two French rebels in New York.</h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {LE_LABO.founders.map((f, i) => (
              <div key={i}>
                <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">{String(i + 1).padStart(2, "0")} / 02</p>
                <h3 className="serif text-3xl md:text-4xl mb-2 font-light">{f.name}</h3>
                <p className="mono text-xs uppercase tracking-[0.15em] mb-6 opacity-70">{f.role}</p>
                <div className="label-line mb-6"></div>
                <p className="text-base font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#E8DFD0" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— timeline</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Two decades of slow.</h2>

          <div className="space-y-10">
            {LE_LABO.timeline.map((t, i) => (
              <div key={i} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-10 items-start">
                <p className="mono text-base md:text-lg font-medium" style={{ color: "#1A1A1A" }}>{t.year}</p>
                <div className="border-l-2 pl-6" style={{ borderColor: "#1A1A1A" }}>
                  <p className="text-base md:text-lg font-light leading-relaxed">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFUMER */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-5xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— principal nose</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The perfumer behind the cult.</h2>

          <div className="border-2 p-8 md:p-12" style={{ borderColor: "#1A1A1A" }}>
            <div className="flex items-start gap-4 mb-6">
              <FlaskConical size={32} style={{ color: "#1A1A1A" }} />
              <div>
                <h3 className="serif text-3xl md:text-4xl font-light mb-2">{LE_LABO.signaturePerfumer.name}</h3>
                <p className="mono text-xs uppercase tracking-[0.15em] opacity-70">{LE_LABO.signaturePerfumer.title}</p>
              </div>
            </div>
            <div className="label-line mb-6"></div>
            <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{LE_LABO.signaturePerfumer.bio}</p>
          </div>
        </div>
      </section>

      {/* SIGNATURE INGREDIENTS */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#1A1A1A", color: "#F4EFE6" }}>
        <div className="max-w-6xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(244,239,230,0.5)" }}>— signature ingredients</p>
          <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The materials that define a Le Labo.</h2>
          <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: "rgba(244,239,230,0.65)" }}>
            Every Le Labo fragrance is named after its principal raw material and the total number of components in the formula. The numbers aren't aesthetic — they're transparency.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {LE_LABO.signatureIngredients.map((ing, i) => (
              <div key={i}>
                <p className="mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(244,239,230,0.4)" }}>0{i + 1}</p>
                <h4 className="serif text-2xl mb-3 font-light" style={{ color: "#F4EFE6" }}>{ing.name}</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(244,239,230,0.7)" }}>{ing.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t" style={{ borderColor: "rgba(244,239,230,0.15)" }}>
            <p className="mono text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(244,239,230,0.5)" }}>— naming convention</p>
            <p className="text-base md:text-lg font-light leading-relaxed max-w-3xl" style={{ color: "rgba(244,239,230,0.85)" }}>
              {LE_LABO.namingConvention}
            </p>
          </div>
        </div>
      </section>

      {/* PERFUMES — DETAILED */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-6xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— five iconic fragrances</p>
          <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The compositions.</h2>
          <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: "#3A3A3A" }}>
            Each fragrance is a story. Click any composition to read its origin, its perfumer's intent, and the full pyramid breakdown.
          </p>

          <div className="space-y-3">
            {LE_LABO_PERFUMES.map((p, i) => (
              <div key={i}>
                <button
                  onClick={() => setActivePerfume(activePerfume === i ? null : i)}
                  className="w-full text-left border-2 p-6 md:p-8 transition hover:bg-white/40 group"
                  style={{ borderColor: "#1A1A1A", background: activePerfume === i ? "white" : "transparent" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4 md:gap-8 flex-wrap">
                      <span className="mono text-xs md:text-sm opacity-50">0{i + 1}</span>
                      <h3 className="serif text-2xl md:text-4xl font-light tracking-wide">{p.name}</h3>
                      <span className="mono text-xs uppercase tracking-[0.15em] opacity-60 hidden md:inline">{p.family} · {p.year}</span>
                    </div>
                    <span className="mono text-xs">{activePerfume === i ? "—" : "+"}</span>
                  </div>
                  <p className="mono text-xs uppercase tracking-[0.15em] opacity-60 md:hidden mt-2">{p.family} · {p.year}</p>
                </button>

                {activePerfume === i && (
                  <div className="border-2 border-t-0 p-6 md:p-10 fade-up" style={{ borderColor: "#1A1A1A", background: "white" }}>
                    {/* Meta row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 pb-8 border-b" style={{ borderColor: "rgba(26,26,26,0.15)" }}>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1">perfumer</p>
                        <p className="text-sm font-medium">{p.perfumer}</p>
                      </div>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1">launched</p>
                        <p className="text-sm font-medium">{p.year}</p>
                      </div>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1">sillage</p>
                        <p className="text-sm font-medium">{p.sillage}</p>
                      </div>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1">longevity</p>
                        <p className="text-sm font-medium">{p.longevity}</p>
                      </div>
                    </div>

                    {/* Inspiration */}
                    <div className="mb-10">
                      <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">— inspiration</p>
                      <p className="serif italic text-lg md:text-xl font-light leading-relaxed" style={{ color: "#3A3A3A" }}>
                        {p.inspiration}
                      </p>
                    </div>

                    {/* Creation Story */}
                    <div className="mb-10">
                      <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">— the creation</p>
                      <p className="text-base font-light leading-relaxed" style={{ color: "#3A3A3A" }}>
                        {p.creationStory}
                      </p>
                    </div>

                    {/* Pyramid */}
                    <div className="mb-10">
                      <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-4">— olfactive pyramid</p>
                      <div className="border-l-2 pl-6 space-y-5" style={{ borderColor: "#1A1A1A" }}>
                        <div>
                          <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-60 mb-1">top notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.top}</p>
                        </div>
                        <div>
                          <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-60 mb-1">heart notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.heart}</p>
                        </div>
                        <div>
                          <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-60 mb-1">base notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.base}</p>
                        </div>
                      </div>
                    </div>

                    {/* Best for + price */}
                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: "rgba(26,26,26,0.15)" }}>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">— best for</p>
                        <p className="text-base font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{p.bestFor}</p>
                      </div>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">— price</p>
                        <p className="serif text-2xl font-light">{p.price}</p>
                        <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-50 mt-2">eau de parfum</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL IDENTITY */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#E8DFD0" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— visual identity</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The aesthetic of an accidental wall.</h2>
          <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{LE_LABO.visualIdentity.description}</p>
        </div>
      </section>

      {/* WHERE TO BUY */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6">— where to find it</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Authorized retailers.</h2>

          <div className="space-y-2">
            {LE_LABO.retailers.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-5 border-2 transition hover:bg-white group" style={{ borderColor: "#1A1A1A" }}>
                <div className="flex-1">
                  <p className="serif text-xl font-light mb-1">{r.name}</p>
                  <p className="mono text-xs uppercase tracking-[0.15em] opacity-60">{r.note}</p>
                </div>
                <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition" />
              </a>
            ))}
          </div>

          <p className="mono text-[10px] uppercase tracking-[0.15em] opacity-50 mt-8 leading-relaxed">
            * city exclusives are only available in their respective cities, except during september's annual "city exclusives month" when all are available globally.
          </p>
        </div>
      </section>

      {/* FOOTER LABEL */}
      <footer className="px-6 md:px-10 py-12 text-center" style={{ background: "#1A1A1A", color: "#F4EFE6" }}>
        <div className="max-w-4xl mx-auto">
          <div className="border-2 inline-block px-8 py-4" style={{ borderColor: "#F4EFE6" }}>
            <p className="mono text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1">le labo · brand profile</p>
            <p className="serif text-xl font-light">curated by ScentWise</p>
          </div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-40 mt-6">all prices in usd · reference only · check official retailers for current pricing</p>
        </div>
      </footer>
    </div>
  );
}

function DemoConsultant() {
  const [liveMessages, setLiveMessages] = React.useState([
    { role: "bot", text: "Hello — I'm your ScentWise consultant. Tell me what you're looking for: an occasion, a scent you're chasing, a feeling you want to wear, or a budget in mind. Where shall we begin?" },
  ]);
  const [liveInput, setLiveInput] = React.useState("");
  const [liveLoading, setLiveLoading] = React.useState(false);
  const [apiHistory, setApiHistory] = React.useState([]);
  const liveEndRef = React.useRef(null);

  React.useEffect(() => {
    liveEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [liveMessages, liveLoading]);

  async function sendLive(text) {
    if (!text.trim() || liveLoading) return;
    const userText = text.trim();
    const newApiHistory = [...apiHistory, { role: "user", content: userText }];
    setApiHistory(newApiHistory);
    setLiveMessages(prev => [...prev, { role: "user", text: userText }]);
    setLiveInput("");
    setLiveLoading(true);

    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newApiHistory }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply;
      if (!reply) throw new Error("Empty response");
      setLiveMessages(prev => [...prev, { role: "bot", text: reply }]);
      setApiHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setLiveMessages(prev => [...prev, {
        role: "bot",
        text: "I'm having trouble connecting right now. Please try again in a moment, or explore the houses below in the meantime.",
      }]);
    }
    setLiveLoading(false);
  }

  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden" style={{ border: "1px solid rgba(196,168,130,0.3)", boxShadow: "0 20px 60px rgba(92,74,50,0.08)" }}>
        <div className="flex items-center gap-4 px-7 py-5" style={{ background: "#5C4A32" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center serif text-xl text-white" style={{ background: "#C4A882" }}>S</div>
          <div className="flex-1">
            <h4 className="serif text-lg" style={{ color: "#F5F0E8" }}>ScentWise Consultant</h4>
            <p className="text-xs" style={{ color: "rgba(245,240,232,0.65)" }}>Live · Ask anything about fragrance</p>
          </div>
          <div className="w-2 h-2 rounded-full" style={{ background: "#7DBD8A", boxShadow: "0 0 0 4px rgba(125,189,138,0.3)" }}></div>
        </div>

        <div className="chat-scroll overflow-y-auto px-5 md:px-7 py-7 flex flex-col gap-5" style={{ background: "#FDFAF7", height: "520px" }}>
          {liveMessages.map((m, i) => (
            <div key={i} className={`flex gap-3 max-w-[88%] fade-up ${m.role === "user" ? "self-end flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm" style={m.role === "user" ? { background: "#E8DCC8", color: "#5C4A32" } : { background: "#5C4A32", color: "#F5F0E8", fontFamily: "'Cormorant Garamond', serif" }}>
                {m.role === "user" ? "U" : "S"}
              </div>
              <div className="px-4 py-3 text-sm leading-relaxed font-light whitespace-pre-wrap" style={m.role === "user" ? { background: "#5C4A32", color: "#F5F0E8", borderRadius: "4px 4px 0 4px" } : { background: "white", color: "#2C1F0F", border: "1px solid rgba(196,168,130,0.25)", borderRadius: "4px 4px 4px 0" }}>
                {m.text}
              </div>
            </div>
          ))}
          {liveLoading && (
            <div className="flex gap-3 fade-up">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "#5C4A32", color: "#F5F0E8", fontFamily: "'Cormorant Garamond', serif" }}>S</div>
              <div className="px-4 py-3 bg-white border flex items-center gap-1.5" style={{ borderColor: "rgba(196,168,130,0.25)", borderRadius: "4px 4px 4px 0" }}>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#C4A882" }}></span>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#C4A882" }}></span>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#C4A882" }}></span>
              </div>
            </div>
          )}
          <div ref={liveEndRef} />
        </div>

        {liveMessages.length <= 1 && (
          <div className="px-5 md:px-7 py-4 flex flex-wrap gap-2 border-t" style={{ background: "#FDFAF7", borderColor: "rgba(196,168,130,0.15)" }}>
            {[
              "Something elegant for the office",
              "My first niche fragrance",
              "A fresh scent for summer",
              "Something for a winter evening",
            ].map((s, i) => (
              <button key={i} onClick={() => sendLive(s)} disabled={liveLoading} className="px-4 py-2 border rounded-full text-xs transition disabled:opacity-50" style={{ borderColor: "#C4A882", color: "#8B6F47", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#8B6F47"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B6F47"; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex border-t bg-white" style={{ borderColor: "rgba(196,168,130,0.2)" }}>
          <input
            type="text"
            value={liveInput}
            onChange={(e) => setLiveInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendLive(liveInput); }}
            placeholder="Describe what you're looking for..."
            disabled={liveLoading}
            maxLength={500}
            className="flex-1 px-6 py-5 outline-none text-sm font-light bg-transparent disabled:opacity-50"
            style={{ color: "#2C1F0F" }}
          />
          <button onClick={() => sendLive(liveInput)} disabled={liveLoading || !liveInput.trim()} className="px-6 py-5 text-white flex items-center gap-2 text-xs uppercase tracking-widest transition disabled:opacity-50" style={{ background: "#5C4A32" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const MFK = {
  name: "Maison Francis Kurkdjian",
  tagline: "A fragrance wardrobe.",
  origin: "Paris, France · 2009",
  philosophy: {
    headline: "I want to free women from the dictate of one signature perfume.",
    body: "Maison Francis Kurkdjian was founded in 2009 near Place Vendôme by master perfumer Francis Kurkdjian and Lebanese-French entrepreneur Marc Chaya — a former Ernst & Young partner. The two met in 2003 at a dinner after a Jean Paul Gaultier fashion show. Chaya was wearing Le Mâle, the fragrance Kurkdjian had created at age 26 that became one of the world's best-selling masculine perfumes. Chaya was struck that someone had created so many beloved fragrances yet remained virtually unknown to the public. They became friends, traveled the world together in 2005 to refine their shared vision, and four years later opened the Maison.",
    body2: "Their concept was radical: rather than selling a single 'signature scent,' MFK offers a fragrance wardrobe — a curated portfolio for different moods, occasions, and emotions. Every detail is engineered for excellence: the carton thickness, the cap proportion, the bottle weight, the texture of every cream. In March 2017, LVMH acquired the house. In October 2021, Kurkdjian was appointed Perfume Creation Director at Christian Dior — overseeing both his own Maison and the historic Dior fragrance heritage simultaneously.",
    quote: "A great perfume does not smell good. It smells beautiful.",
    quoteBy: "Francis Kurkdjian",
  },
  founders: [
    {
      name: "Francis Kurkdjian",
      role: "Co-founder · Master Perfumer",
      bio: "Born May 14, 1969 near Paris to a French-Armenian family whose ancestors fled the Armenian Genocide and resettled in France via Aleppo. Originally aspired to be a ballet dancer; failed entry to the Paris Opera Ballet School in 1983. Decided at age 15 to become a perfumer. Graduated from ISIPCA (Versailles) in 1993, then earned a master's in luxury marketing. At 26, created Le Mâle for Jean Paul Gaultier — instant global success. Has since composed over 40 fragrances for Dior, Burberry, Narciso Rodriguez, Elie Saab, Acqua di Parma, and others. Created Marie Antoinette's lost perfume for the Palace of Versailles. Honored 'Chevalier des Arts et des Lettres' by the French government in 2008. Won the Prix François Coty in 2001.",
    },
    {
      name: "Marc Chaya",
      role: "Co-founder · CEO",
      bio: "Lebanese-French businessman, former partner at Ernst & Young. Met Kurkdjian in 2003 over a shared appreciation for Le Mâle and a long conversation about how the fragrance industry undervalues its artists. Together they engineered the strategy that would bring Kurkdjian to the front of the stage — Chaya leading operations, Kurkdjian leading creative. Their partnership turned MFK from a Place Vendôme atelier into a global luxury house with over 300 boutiques and points of sale worldwide.",
    },
  ],
  signaturePerfumer: {
    name: "Francis Kurkdjian",
    title: "Master Perfumer · Co-founder · Perfume Creation Director at Dior",
    bio: "Kurkdjian's hallmark is precision married to emotion. His training under the masters at ISIPCA in the early 1990s, combined with his early-career success at Quest International, gave him an unusual command of synthetic molecules — particularly Ambroxan and saffronal — that he uses with the elegance of natural materials. He calls perfumery 'a bit like being a magician — realizing your vision of someone else's emotions.' Among his most celebrated creations: Jean Paul Gaultier Le Mâle (1995), Narciso Rodriguez For Her (2003, with Christine Nagel), Burberry Her, Elie Saab Le Parfum, and Dior Cologne Blanche.",
  },
  timeline: [
    { year: "1995", event: "Francis Kurkdjian, age 26, creates Le Mâle for Jean Paul Gaultier — becomes one of the best-selling men's fragrances ever" },
    { year: "2001", event: "Opens his bespoke fragrance atelier in Paris — radical move during the era of perfume democratization. Wins the Prix François Coty" },
    { year: "2003", event: "Meets Marc Chaya at a dinner after a Jean Paul Gaultier show. Begins what becomes the foundational partnership of MFK" },
    { year: "2008", event: "Honored 'Chevalier des Arts et des Lettres' by the French government for contributions to perfumery and the arts" },
    { year: "2009", event: "Maison Francis Kurkdjian officially launches near Place Vendôme. Opening collection includes APOM, Aqua Universalis, Lumière Noire, Absolue Pour Le Soir" },
    { year: "2014", event: "Baccarat commissions Kurkdjian to create Rouge 540 for Baccarat's 250th anniversary. Limited edition crystal flacons priced at €3,000 each — instantly sold out" },
    { year: "2015", event: "Baccarat Rouge 540 launches as MFK's signature in standard flacons after Neiman Marcus VP Kelly St. John insists on a wider release" },
    { year: "2017", event: "LVMH acquires Maison Francis Kurkdjian for an undisclosed sum, joining the Comité Colbert" },
    { year: "2021", event: "Francis Kurkdjian appointed Perfume Creation Director at Christian Dior, while continuing to lead MFK" },
    { year: "Today", event: "300+ boutiques and authorized retailers worldwide · 30+ fragrances across the wardrobe collection" },
  ],
  signatureIngredients: [
    { name: "Ambroxan", desc: "Synthesized in the 1950s from sclareol (a clary sage compound), Ambroxan replaced ambergris and became Kurkdjian's signature molecule. Powerful, dry, mineral, woody — it gives Baccarat Rouge 540 its addictive radiance and underpins much of his work." },
    { name: "Saffronal", desc: "Synthetic derivative of saffron (the world's most expensive spice). Bitter, slightly metallic, leathery. Kurkdjian uses it to break the sweetness of citrus or anchor amber compositions. The radiant 'red' character of Baccarat Rouge 540." },
    { name: "Hedione", desc: "Kurkdjian calls it 'a breeze of petals.' Naturally found in tea and jasmine. Adds transparency, lightness, freshness, and diffusion to compositions — the molecule that makes a fragrance feel airborne." },
    { name: "Bulgarian & Turkish Rose", desc: "Two of the most important rose varieties in perfumery. Bulgarian Damascena (from the Valley of Roses) brings honeyed, jammy depth; Turkish Damascena brings spicier, more complex character. Both star in Oud Satin Mood and L'Homme à la Rose." },
    { name: "Sustainable Oud", desc: "MFK uses oud produced under fair-trade and sustainable principles — addressing oud poaching, which has become a serious environmental concern. The OUD collection (six fragrances) is built around this commitment." },
    { name: "Ethyl Maltol", desc: "Gourmand molecule with a sugar-cotton-candy character. Kurkdjian uses it sparingly as the 'aura of fire' in Baccarat Rouge 540 — never overwhelming, just a hint of addictive sweetness." },
  ],
  visualIdentity: {
    description: "Place Vendôme refinement made tangible. Black-and-gold flacons with a horizontal grip. Square minimalist bottles. The packaging quality is famously obsessive — Kurkdjian discusses cardboard thickness and cap proportion with the same attention as his perfume formulas. The boutiques (Paris Marais, Place Vendôme, Saint-Germain) feature pale walls, brushed gold detailing, and museum-like display cases. Quiet luxury without ostentation.",
  },
  retailers: [
    { name: "Maison Francis Kurkdjian Official", url: "https://www.franciskurkdjian.com/", note: "Full collection · samples · personalized engraving" },
    { name: "Neiman Marcus", url: "https://www.neimanmarcus.com/", note: "Where Baccarat Rouge 540's wider release was negotiated" },
    { name: "Bloomingdale's", url: "https://www.bloomingdales.com/", note: "Wide MFK availability · loyalty program" },
    { name: "Bergdorf Goodman", url: "https://www.bergdorfgoodman.com/", note: "Curated luxury experience" },
    { name: "Saks Fifth Avenue", url: "https://www.saksfifthavenue.com/", note: "Premium retailer · select fragrances" },
    { name: "Sephora (US)", url: "https://www.sephora.com/", note: "Carries select MFK fragrances · Beauty Insider rewards" },
  ],
};

const MFK_PERFUMES = [
  {
    name: "BACCARAT ROUGE 540",
    year: "2015",
    perfumer: "Francis Kurkdjian",
    family: "Amber Floral",
    inspiration: "The poetic alchemy of crystal-making. The number 540 is the precise temperature in Celsius at which Baccarat crystal achieves its signature red color. Kurkdjian wanted to translate that transformation — sand becoming light — into a fragrance built around three 'auras': air (jasmine, saffron), mineral (ambergris-like dry woods), and fire (a whisper of gourmand sweetness through ethyl maltol).",
    creationStory: "In 2014, Baccarat commissioned Kurkdjian to create a perfume for the crystal house's 250th anniversary. The original release was a limited edition — 250 hand-crafted Baccarat crystal flacons priced at €3,000 each. They sold out instantly. Kurkdjian gave one as a gift to Kelly St. John, then VP of Beauty at Neiman Marcus. She received so many compliments that she pleaded with Kurkdjian to release it for sale at department stores. He and Baccarat negotiated a deal allowing him to bottle it in his standard square flacon for the wider market. The 2015 release became one of the most influential fragrances of the 21st century — and from 2020 onward, TikTok turned it into a global phenomenon, propelling sales to unprecedented levels for a niche house.",
    notes: {
      top: "Saffron, Jasmine",
      heart: "Amberwood, Ambergris, Hedione",
      base: "Fir Resin, Cedar, Sugar (Ethyl Maltol), Ambroxan, Oakmoss",
    },
    bestFor: "A signature for those who want to be remembered. Versatile across day and night. Particularly striking on cool evenings, on cashmere, in low-humidity climates where its radiance shines. People will stop you to ask what you're wearing — be ready to answer.",
    sillage: "Heavy",
    longevity: "8–12 hours (EDP) · 12+ hours (Extrait)",
    price: "$240 (35ml) · $325 (70ml) · $435 (200ml) · Extrait: $435 (70ml)",
  },
  {
    name: "GRAND SOIR",
    year: "2016",
    perfumer: "Francis Kurkdjian",
    family: "Amber",
    inspiration: "Paris at night. The streetlights of the Place Vendôme reflected on wet cobblestones after dinner. A fragrance built to evoke the warmth of a room that has just closed for the evening — the lingering trace of perfume, leather banquettes, and benzoin resin from a candle long since extinguished.",
    creationStory: "Released after the global success of Baccarat Rouge 540, Grand Soir was Kurkdjian's answer to people seeking the warmth of an oriental amber without the polarizing nature of BR540. He stripped the saffron and synthetic radiance, dialed up benzoin and tonka bean, and created what many consider his most romantic composition. It became a cult favorite among connoisseurs who found Baccarat too divisive but still wanted that golden MFK soul. Often described as 'Tobacco Vanille's more sophisticated French cousin' — though Kurkdjian himself dislikes such comparisons.",
    notes: {
      top: "Levantine Benzoin, Tonka Bean, Vanilla",
      heart: "Honey accord, Amber",
      base: "Cistus Labdanum, Sandalwood",
    },
    bestFor: "Cold-weather evenings. Intimate dinners. Fall and winter signature for anyone who wants warmth without smoke. Perfect with wool, cashmere, and leather. Universally complimented by partners. The opposite of an office fragrance — pure evening register.",
    sillage: "Moderate to heavy",
    longevity: "8–10 hours",
    price: "$245 (70ml) · $345 (200ml)",
  },
  {
    name: "AQUA UNIVERSALIS",
    year: "2009",
    perfumer: "Francis Kurkdjian",
    family: "Citrus Floral",
    inspiration: "The smell of perfectly clean linen on a sunny morning. Freshly pressed sheets. The exact moment of stepping out of a hot shower into cool air. Kurkdjian wanted to bottle the universal feeling of being cleaner, brighter, more composed — without any synthetic 'fresh' chemical signature.",
    creationStory: "Part of the 2009 launch collection of MFK, Aqua Universalis was Kurkdjian's manifesto piece. While the rest of the niche world was racing toward heavier, more 'statement' compositions, he insisted that a truly luxurious clean scent was harder to make than any oud or amber. He built it around an unusual combination: Calabrian bergamot bright as morning sun, Sicilian sweet lime, lily of the valley (one of the most difficult florals in perfumery), and white musk for skin-like softness. The result became MFK's quiet bestseller — preferred by professionals, refined men and women who don't want their fragrance announcing itself before they enter a room. The reference 'office signature' in luxury circles.",
    notes: {
      top: "Calabrian Bergamot, Sicilian Sweet Lime",
      heart: "Lily of the Valley, White Flowers",
      base: "Musk, Sweet Mock Orange",
    },
    bestFor: "Office signature. Daily wear. Hot weather. Conservative environments where you want quality without statement. Travel — pairs with everything, suits any climate. The fragrance to grab when you don't want to think about fragrance.",
    sillage: "Soft to moderate",
    longevity: "5–7 hours",
    price: "$215 (70ml) · $325 (200ml)",
  },
  {
    name: "OUD SATIN MOOD",
    year: "2015",
    perfumer: "Francis Kurkdjian",
    family: "Oriental Woody",
    inspiration: "The shimmering surface of multicolored raw silk fabric. Kurkdjian wanted oud to feel like fabric — flowing, draping, never aggressive. A French interpretation of the Middle Eastern oud tradition: instead of dark and animalic, oud as something delicate, vaporous, almost romantic.",
    creationStory: "Part of the OUD collection launched in 2015 (which now includes six fragrances), Oud Satin Mood was Kurkdjian's response to the wave of heavy oud compositions that dominated the early 2010s. He sourced oud through fair-trade and sustainable channels — addressing the environmental concern of oud poaching from diseased Aquilaria trees in Southeast Asia. The composition wraps oud in Bulgarian and Turkish Damask rose, lifted by violet and elevated with a vanilla-amber-benzoin base that gives it the 'satin' character of its name. It became a connoisseur's favorite — beloved by those who found Baccarat Rouge 540 too overexposed, who preferred something equally luxurious but more discreetly identifying.",
    notes: {
      top: "Bulgarian Rose, Violet, Strawberry",
      heart: "Turkish Damascena Rose",
      base: "Agarwood (Oud), Vanilla, Amber, Benzoin, Caramel, Cedar",
    },
    bestFor: "Special occasions. Evenings out. Confident floral-oud signature for those who want presence without aggression. Excellent in cooler weather. A 'second perfume' for someone who already loves Baccarat Rouge but wants something more distinctive in social settings.",
    sillage: "Heavy",
    longevity: "10–12 hours",
    price: "$325 (70ml) · $435 (200ml) · Extrait: $440 (70ml)",
  },
  {
    name: "L'HOMME À LA ROSE",
    year: "2020",
    perfumer: "Francis Kurkdjian",
    family: "Woody Floral",
    inspiration: "Reclaiming rose for men. Throughout 20th-century perfumery, rose was coded almost exclusively feminine. Kurkdjian wanted to reintroduce rose to masculine wardrobes the way it had existed in the 18th century — as a noble, virile, aristocratic note. The 'man with the rose' is a French dandy, but the rose is sharp, peppery, paired with crisp pear and dry amber wood, never sweet.",
    creationStory: "Released in 2020 alongside its feminine counterpart À la Rose, L'Homme à la Rose was Kurkdjian's deliberate intervention in the gendered perception of rose in fragrance. He selected Damascena rose (sharper, more peppery than Centifolia), threaded it with Italian bergamot and crisp pear at the top, and grounded it in amber wood and a bright, almost grapefruit-like quality. The composition won the 2021 Marie Claire International Perfume Award for Best Masculine Perfume, vindicating the artistic gamble. Many consider it Kurkdjian's most refined recent work — a reminder that even after global commercial success, his commitment to perfumery as art remains intact.",
    notes: {
      top: "Bergamot, Italian Mandarin, Pear",
      heart: "Bulgarian Rose Absolute, Damascena Rose Essence",
      base: "Amber Wood, Papyrus",
    },
    bestFor: "Sophisticated daytime. Refined office wear for those who've already done Aqua Universalis. A masculine rose signature for the confident — pairs especially well with tailored clothing and warm-weather European travel.",
    sillage: "Moderate",
    longevity: "7–9 hours",
    price: "$245 (70ml) · $345 (200ml)",
  },
];

const CREED = {
  name: "Creed",
  origin: "London / Paris · 1760",
  philosophy: {
    headline: "Seven generations. One family. The last great independent house.",
    body: "The House of Creed traces its origins to 1760, when — as the house tells it — James Henry Creed opened a tailoring establishment on Conduit Street in London, dressing the city's elegant elite. The firm's first royal commission came in 1781: Royal English Leather, created for King George III, inspired by his favorite leather gloves. In an era before department stores, fragrance was a true luxury that had to be commissioned, and Creed scented the gloves, hemlines, and leather goods of European aristocracy. (Historians note the documented evidence of Creed's perfumery activity is clearest from the mid-19th century onward — but the family's royal tailoring heritage and its pivot to scent are well attested.)",
    body2: "In 1854, Creed relocated to Paris at the request of Empress Eugénie of France, for whom the house created Jasmin Impératrice Eugénie — still sold today. The client list across the 19th century reads like a map of European power: Napoleon III, Emperor Franz-Josef of Austria-Hungary, Empress Elisabeth 'Sisi,' Czar Nicholas II of Russia. In 1885, Queen Victoria appointed Creed an official supplier to the British royal court. For seven generations the house remained family-led, culminating in Olivier Creed — the sixth-generation master perfumer who built the modern Creed — and his son Erwin, the seventh. Creed was acquired by Kering in 2023, and Olivier Creed passed away in May 2026, closing an extraordinary chapter in perfumery history.",
    quote: "We are the keepers of a craft that cannot be rushed. Time is an ingredient.",
    quoteBy: "The House of Creed",
  },
  founders: [
    {
      name: "James Henry Creed",
      role: "Founder · 1760",
      bio: "Founded the House of Creed in London, originally as a bespoke tailoring establishment serving the British aristocracy. Specialized in scented leather goods — gloves, belts, sword scabbards — at a time when perfuming fine leather was a mark of wealth and status. His 1781 creation Royal English Leather, made for King George III, established the house's royal connection that would define its identity for centuries.",
    },
    {
      name: "Olivier Creed",
      role: "6th Generation · Créateur Parfumeur (1942–2026)",
      bio: "The visionary who transformed Creed from a heritage curiosity into the most coveted niche house in the world. A sixth-generation direct descendant of the founder, Olivier devoted his life to Haute Perfumery — traveling the globe to source the rarest raw materials and forging direct relationships with growers. He championed the ancient Millésime infusion technique and created the house's modern legends: Green Irish Tweed (1985), Silver Mountain Water (1995), and, with his son, Aventus (2010). He passed away in May 2026.",
    },
  ],
  signaturePerfumer: {
    name: "Olivier & Erwin Creed",
    title: "Sixth & Seventh Generation Master Perfumers",
    bio: "The father-son partnership defined modern Creed. Olivier, the sixth generation, was the creative force behind the house's most beloved fragrances and its global revival. Erwin, the seventh generation, trained at his father's side and co-created Aventus — working alongside perfumer Jean-Christophe Hérault. Together they upheld the house's commitment to the Millésime technique: a 4,000-year-old infusion method using the highest concentration of natural essential oils, where ingredients are sourced personally and macerated rather than processed industrially. Olivier's daughter Olivia Creed has also been involved in the house's affairs.",
  },
  timeline: [
    { year: "1760", event: "James Henry Creed founds the House of Creed in London as a bespoke tailoring establishment on Conduit Street" },
    { year: "1781", event: "Creates Royal English Leather for King George III, inspired by his favorite leather gloves — the first royal commission" },
    { year: "1854", event: "Relocates to Paris at the request of Empress Eugénie, creating Jasmin Impératrice Eugénie (still sold today)" },
    { year: "1885", event: "Queen Victoria appoints Creed an official supplier to the British royal court; receives Fleurs de Bulgarie" },
    { year: "1948", event: "Creates Vetiver, later worn by President John F. Kennedy" },
    { year: "1985", event: "Olivier Creed creates Green Irish Tweed — a timeless aromatic that becomes a benchmark of refined masculinity" },
    { year: "2010", event: "Aventus launches for the 250th anniversary. Becomes the best-selling fragrance in Creed's history and the most-imitated masculine scent of the modern era" },
    { year: "2023", event: "Kering acquires the House of Creed, ending 263 years of family ownership" },
    { year: "2026", event: "Olivier Creed, the sixth-generation master perfumer, passes away in May — closing an era" },
  ],
  signatureIngredients: [
    { name: "The Millésime Technique", desc: "A 4,000-year-old infusion method at the heart of Creed's identity. Instead of industrial processing, natural ingredients are hand-macerated to extract the highest concentration of essential oils. It's slow, expensive, and produces the rich, natural character that distinguishes a Creed from mass-market fragrance." },
    { name: "Birch (Aventus)", desc: "The smoky, dry birch at the heart of Aventus — sourced to evoke Louisiana, which Napoleon ruled before selling it to the United States. It gives Aventus its signature 'smoky pineapple' character that launched a thousand imitations." },
    { name: "Royal Pineapple", desc: "Napoleon's favorite palace dessert and the most distinctive top note in Aventus. Bright, juicy, and unexpectedly refined — it became the single most recognizable opening in modern niche perfumery." },
    { name: "Florentine Iris", desc: "One of the most expensive raw materials in perfumery. Used in Green Irish Tweed and Silver Mountain Water to add cool, powdery elegance and structural sophistication." },
    { name: "Ambergris", desc: "A rare marine material that adds warmth, salinity, and extraordinary longevity. Used in Silver Mountain Water and Aventus to evoke the reach of Napoleon's navy and to anchor compositions with skin-like depth." },
    { name: "Hand-Sourced Naturals", desc: "Olivier and Erwin Creed traveled the world personally to research, inspect, and commission the rarest raw materials — forging direct relationships with growers that few houses maintain. This sourcing philosophy is central to the Creed mystique." },
  ],
  visualIdentity: {
    description: "British aristocratic heritage meets French perfumery refinement. The Aventus bottle is emblazoned with a silver emblem of a horse and rider — a nod to Napoleon. Deep racing greens, antique golds, and heavy glass flacons evoke a London gentlemen's club and a Parisian salon at once. The Royal Warrant granted by Queen Victoria still hangs in the Serbie store in Paris. Everything signals lineage, permanence, and quiet old-money confidence rather than trend.",
  },
  retailers: [
    { name: "Creed Official Boutique", url: "https://www.creedboutique.com/", note: "Full collection · samples · heritage fragrances" },
    { name: "Neiman Marcus", url: "https://www.neimanmarcus.com/", note: "Wide Creed selection · loyalty rewards" },
    { name: "Saks Fifth Avenue", url: "https://www.saksfifthavenue.com/", note: "Premium retailer · the Aventus range" },
    { name: "Bloomingdale's", url: "https://www.bloomingdales.com/", note: "Major department store availability" },
    { name: "Nordstrom", url: "https://www.nordstrom.com/", note: "Reliable authentic source · easy returns" },
  ],
};

const CREED_PERFUMES = [
  {
    name: "AVENTUS",
    year: "2010",
    perfumer: "Olivier Creed, Erwin Creed & Jean-Christophe Hérault",
    family: "Fruity Chypre",
    inspiration: "The dramatic life of Napoleon Bonaparte — war, peace, romance, and the relentless pursuit of greatness. Every note maps to a moment in his life: blackcurrant from Corsica where he was born, bergamot from Italy where his first victories made him famous, apples from France where he rose to emperor, royal pineapple (his favorite palace dessert), birch from Louisiana which he ruled, ambergris for the reach of his navy.",
    creationStory: "Aventus launched in 2010 as part of Creed's 250th anniversary celebration — and changed the fragrance industry permanently. Created by Olivier Creed with his son Erwin and perfumer Jean-Christophe Hérault, it was conceived as a tribute to strength, vision, and success. The name derives from the Latin 'ventus' (wind), evoking movement and freedom. What made it revolutionary was its 'smoky pineapple' accord — a fruity-chypre structure that smelled like nothing before it. It became the best-selling fragrance in Creed's history, the number-one luxury men's fragrance in markets worldwide, and the single most-cloned fragrance of the 2010s. Erwin Creed later said that without Aventus, Creed would never have opened its Madison Avenue boutique. A famous quirk: Aventus is produced in batches, and enthusiasts obsessively track 'batch codes' because natural ingredient variation makes each batch subtly different — the most beloved being the legendary early batches.",
    notes: {
      top: "Pineapple, Bergamot, Black Currant, Apple",
      heart: "Birch, Patchouli, Moroccan Jasmine, Rose",
      base: "Oakmoss, Musk, Ambergris, Vanilla",
    },
    bestFor: "The statement fragrance for ambitious moments — important meetings, presentations, occasions where you want to project success. Versatile across seasons but shines in spring and autumn. The fragrance equivalent of a perfectly tailored suit. Be aware: it's so popular you will smell it on others.",
    sillage: "Heavy",
    longevity: "8–10 hours",
    price: "$370 (50ml) · $470 (100ml) · $595 (250ml)",
  },
  {
    name: "GREEN IRISH TWEED",
    year: "1985",
    perfumer: "Olivier Creed & Pierre Bourdon",
    family: "Aromatic Green Floral",
    inspiration: "The rolling green hills of Ireland, tweed jackets, and the timeless elegance of the British-Irish countryside gentleman. A fragrance built to evoke fresh-cut grass after rain, violet leaves, and the quiet confidence of inherited style.",
    creationStory: "Created in 1985 by Olivier Creed with the legendary perfumer Pierre Bourdon, Green Irish Tweed became an instant benchmark of refined masculinity and one of the most influential men's fragrances of the 20th century. Its violet-leaf-and-iris structure over a sandalwood-ambergris base defined an entire genre of 'fresh sophisticated' masculine scent — and was reportedly the favorite of Cary Grant and worn by countless statesmen and leading men. It remains a timeless alternative to louder modern compositions: the fragrance of someone with nothing to prove.",
    notes: {
      top: "Lemon Verbena, Iris, Peppermint",
      heart: "Violet Leaves, Iris",
      base: "Sandalwood, Ambergris",
    },
    bestFor: "Timeless daily elegance. Spring and summer. The office, the country club, the understated gentleman. A 'grown-up' signature that never reads as trendy — ideal for someone who wants classic refinement over contemporary flash.",
    sillage: "Moderate",
    longevity: "6–8 hours",
    price: "$370 (50ml) · $470 (100ml) · $595 (250ml)",
  },
  {
    name: "SILVER MOUNTAIN WATER",
    year: "1995",
    perfumer: "Olivier Creed & Pierre Bourdon",
    family: "Aromatic Aquatic",
    inspiration: "Olivier Creed's memories of skiing in the Swiss Alps — the crisp, mineral freshness of mountain air, melting snow over rock, and cold streams running down the slopes. An attempt to bottle altitude and clarity.",
    creationStory: "Created in 1995 by Olivier Creed and Pierre Bourdon, Silver Mountain Water captured the sensation of alpine freshness through an innovative combination of green tea, blackcurrant, bergamot, and a musky-mineral base built around ambergris. It was years ahead of its time — anticipating the 'clean fresh' trend that would dominate the 2000s, but executing it with natural materials and a refinement mass-market aquatics never matched. It remains a cult favorite for warm weather and a reference point for sophisticated freshness.",
    notes: {
      top: "Bergamot, Mandarin Orange, Green Tea",
      heart: "Blackcurrant, Green Notes",
      base: "Musk, Petitgrain, Sandalwood, Galbanum",
    },
    bestFor: "Hot weather and summer. Clean, fresh daily wear with a luxury edge. The fragrance for someone who finds typical aquatics too synthetic and wants freshness with depth and natural character.",
    sillage: "Moderate",
    longevity: "6–8 hours",
    price: "$370 (50ml) · $470 (100ml) · $595 (250ml)",
  },
  {
    name: "AVENTUS FOR HER",
    year: "2016",
    perfumer: "Olivier Creed & Erwin Creed",
    family: "Fruity Chypre Floral",
    inspiration: "A riding habit that Henry Creed created for Queen Victoria in 1885 — the campaign inspiration — translated into a feminine counterpart to the iconic Aventus. Strength and femininity together: a woman who commands a room without raising her voice.",
    creationStory: "Released in 2016, Aventus for Her was not simply a feminine flanker but its own composition, inspired by the house's own royal heritage — specifically the riding habit Henry Creed tailored for Queen Victoria, now preserved in the Kyoto Museum. It pairs green apple, pink pepper, and bergamot at the top with a rose-and-musk heart over a sandalwood-styrax base. It became Creed's best-selling feminine fragrance, beloved for combining the confident DNA of Aventus with elegant floral femininity.",
    notes: {
      top: "Green Apple, Pink Pepper, Bergamot, Lemon",
      heart: "Rose, Sambac Jasmine, Styrax",
      base: "Sandalwood, Peach, Musk, Amber",
    },
    bestFor: "Sophisticated feminine signature for confident occasions. Versatile across seasons. For someone who wants presence and elegance together — the boardroom and the dinner party alike.",
    sillage: "Moderate to heavy",
    longevity: "7–9 hours",
    price: "$370 (50ml) · $470 (75ml)",
  },
  {
    name: "ROYAL OUD",
    year: "2011",
    perfumer: "Olivier Creed & Erwin Creed",
    family: "Woody Spicy",
    inspiration: "The grandeur of the Middle East filtered through Creed's European refinement — oud not as a heavy, dark statement but as a regal, polished material fit for royalty. A bridge between Creed's Western heritage and the Eastern oud tradition.",
    creationStory: "Created in 2011 by Olivier and Erwin Creed, Royal Oud was the house's elegant entry into the oud category that was sweeping luxury perfumery. Rather than the dense, animalic ouds of Middle Eastern houses, Creed crafted a refined, crystalline interpretation — pink pepper and lemon at the top, a heart of cedar and galbanum, and a smooth oud-sandalwood base. It became a year-round signature for those who wanted the prestige of oud with the wearable polish of a Creed.",
    notes: {
      top: "Pink Pepper, Lemon, Bergamot, Cardamom",
      heart: "Cedar, Galbanum, Angelica",
      base: "Oud, Sandalwood, Tonka Bean",
    },
    bestFor: "A sophisticated, refined oud signature for year-round wear. Office-appropriate unlike heavier ouds. For someone who wants to explore oud without committing to its more intense, traditional forms.",
    sillage: "Moderate",
    longevity: "7–9 hours",
    price: "$430 (50ml) · $540 (100ml)",
  },
];

function MFKPage({ onBack }) {
  const [activePerfume, setActivePerfume] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#F8F4ED", fontFamily: "'Inter', system-ui, sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&family=Cormorant:ital,wght@0,300;0,400;1,300&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono-luxury { font-family: 'Cormorant', serif; letter-spacing: 0.15em; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out; }
        .gold-line {
          background: linear-gradient(90deg, transparent, #B8954A 20%, #B8954A 80%, transparent);
          height: 1px;
        }
        .gold-text { color: #B8954A; }
        .deep-bg { background: #1F1611; }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between" style={{ background: "rgba(248,244,237,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(184,149,74,0.2)" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:opacity-60 transition" style={{ fontFamily: "'Cormorant', serif" }}>
          <ArrowLeft size={14} /> Back to ScentWise
        </button>
        <span className="text-xs uppercase tracking-[0.25em] opacity-50 hidden md:block" style={{ fontFamily: "'Cormorant', serif" }}>Maison · Place Vendôme · Paris</span>
      </div>

      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F8F4ED 0%, #F2EBDD 100%)" }}>
        <div className="max-w-5xl mx-auto fade-up text-center">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Established 2009 ·  Place Vendôme, Paris —</p>

          <h1 className="serif font-light leading-[0.95] mb-2" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "0.01em", color: "#1A1A1A" }}>
            Maison Francis
          </h1>
          <h1 className="serif italic font-light leading-[0.95] mb-10" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "0.01em", color: "#1A1A1A" }}>
            Kurkdjian
          </h1>

          <div className="gold-line w-32 mx-auto mb-10"></div>

          <p className="serif italic font-light max-w-2xl mx-auto" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", lineHeight: 1.5, color: "#3A3026" }}>
            "{MFK.philosophy.headline}"
          </p>

          <a href={MFK.retailers[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-12 text-xs uppercase tracking-[0.25em] border-b pb-1 hover:opacity-60 transition gold-text" style={{ borderColor: "#B8954A", fontFamily: "'Cormorant', serif" }}>
            Visit franciskurkdjian.com <ExternalLink size={12} />
          </a>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 md:px-10 py-24 md:py-32 deep-bg" style={{ color: "#F8F4ED" }}>
        <div className="max-w-3xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— The Maison —</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.2 }}>
            A wardrobe, not a signature.
          </h2>

          <div className="space-y-6 text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(248,244,237,0.85)" }}>
            <p>{MFK.philosophy.body}</p>
            <p>{MFK.philosophy.body2}</p>
          </div>

          <blockquote className="mt-16 pl-8 border-l-2" style={{ borderColor: "#B8954A" }}>
            <Quote size={20} className="gold-text mb-3" />
            <p className="serif italic font-light text-xl md:text-2xl mb-3" style={{ color: "#F8F4ED", lineHeight: 1.5 }}>
              "{MFK.philosophy.quote}"
            </p>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(248,244,237,0.5)", fontFamily: "'Cormorant', serif" }}>— {MFK.philosophy.quoteBy}</p>
          </blockquote>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F8F4ED" }}>
        <div className="max-w-5xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— The Co-Founders —</p>
          <h2 className="serif font-light mb-20" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The friendship behind the Maison.</h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {MFK.founders.map((f, i) => (
              <div key={i}>
                <p className="mono-luxury text-xs uppercase mb-3 gold-text">{String(i + 1).padStart(2, "0")} / 02</p>
                <h3 className="serif text-3xl md:text-4xl mb-2 font-light">{f.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] mb-6 opacity-70" style={{ fontFamily: "'Cormorant', serif" }}>{f.role}</p>
                <div className="gold-line mb-6"></div>
                <p className="text-base font-light leading-relaxed" style={{ color: "#3A3026" }}>{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F2EBDD" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Timeline —</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>From Le Mâle to LVMH.</h2>

          <div className="space-y-10">
            {MFK.timeline.map((t, i) => (
              <div key={i} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-10 items-start">
                <p className="serif text-xl md:text-2xl gold-text">{t.year}</p>
                <div className="border-l-2 pl-6" style={{ borderColor: "#B8954A" }}>
                  <p className="text-base md:text-lg font-light leading-relaxed">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE INGREDIENTS */}
      <section className="px-6 md:px-10 py-24 md:py-32 deep-bg" style={{ color: "#F8F4ED" }}>
        <div className="max-w-6xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Signature Ingredients —</p>
          <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The materials that define an MFK.</h2>
          <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: "rgba(248,244,237,0.65)" }}>
            Kurkdjian's command of synthetic molecules — particularly Ambroxan and saffronal — alongside the most refined natural materials, defines the modern MFK signature.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {MFK.signatureIngredients.map((ing, i) => (
              <div key={i}>
                <p className="mono-luxury text-xs uppercase mb-2 gold-text">0{i + 1}</p>
                <h4 className="serif text-2xl mb-3 font-light" style={{ color: "#F8F4ED" }}>{ing.name}</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(248,244,237,0.7)" }}>{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFUMES — DETAILED */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F8F4ED" }}>
        <div className="max-w-5xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Five Iconic Compositions —</p>
          <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The wardrobe.</h2>
          <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: "#3A3026" }}>
            Click any composition to read its inspiration, the creation story, and the full olfactive pyramid.
          </p>

          <div className="space-y-3">
            {MFK_PERFUMES.map((p, i) => (
              <div key={i}>
                <button
                  onClick={() => setActivePerfume(activePerfume === i ? null : i)}
                  className="w-full text-left p-6 md:p-8 transition group border-2"
                  style={{ borderColor: activePerfume === i ? "#B8954A" : "rgba(184,149,74,0.3)", background: activePerfume === i ? "#FFFFFF" : "transparent" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4 md:gap-8 flex-wrap">
                      <span className="mono-luxury text-xs gold-text">0{i + 1}</span>
                      <h3 className="serif text-2xl md:text-3xl font-light tracking-wide">{p.name}</h3>
                      <span className="text-xs uppercase tracking-[0.2em] opacity-60 hidden md:inline" style={{ fontFamily: "'Cormorant', serif" }}>{p.family} · {p.year}</span>
                    </div>
                    <span className="text-lg gold-text">{activePerfume === i ? "—" : "+"}</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60 md:hidden mt-2" style={{ fontFamily: "'Cormorant', serif" }}>{p.family} · {p.year}</p>
                </button>

                {activePerfume === i && (
                  <div className="border-2 border-t-0 p-6 md:p-10 fade-up" style={{ borderColor: "#B8954A", background: "#FFFFFF" }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 pb-8 border-b" style={{ borderColor: "rgba(184,149,74,0.25)" }}>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Perfumer</p>
                        <p className="text-sm font-medium">{p.perfumer}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Launched</p>
                        <p className="text-sm font-medium">{p.year}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Sillage</p>
                        <p className="text-sm font-medium">{p.sillage}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Longevity</p>
                        <p className="text-sm font-medium">{p.longevity}</p>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— Inspiration</p>
                      <p className="serif italic text-lg md:text-xl font-light leading-relaxed" style={{ color: "#3A3026" }}>
                        {p.inspiration}
                      </p>
                    </div>

                    <div className="mb-10">
                      <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— The creation</p>
                      <p className="text-base font-light leading-relaxed" style={{ color: "#3A3026" }}>
                        {p.creationStory}
                      </p>
                    </div>

                    <div className="mb-10">
                      <p className="mono-luxury text-xs uppercase opacity-50 mb-4 gold-text">— Olfactive pyramid</p>
                      <div className="border-l-2 pl-6 space-y-5" style={{ borderColor: "#B8954A" }}>
                        <div>
                          <p className="mono-luxury text-[11px] uppercase opacity-60 mb-1">Top notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.top}</p>
                        </div>
                        <div>
                          <p className="mono-luxury text-[11px] uppercase opacity-60 mb-1">Heart notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.heart}</p>
                        </div>
                        <div>
                          <p className="mono-luxury text-[11px] uppercase opacity-60 mb-1">Base notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.base}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: "rgba(184,149,74,0.25)" }}>
                      <div>
                        <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— Best for</p>
                        <p className="text-base font-light leading-relaxed" style={{ color: "#3A3026" }}>{p.bestFor}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— Price (USD)</p>
                        <p className="serif text-lg font-light leading-relaxed">{p.price}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL IDENTITY */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F2EBDD" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Visual identity —</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Black, gold, and obsessive precision.</h2>
          <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: "#3A3026" }}>{MFK.visualIdentity.description}</p>
        </div>
      </section>

      {/* RETAILERS */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F8F4ED" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Where to find it —</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Authorized retailers.</h2>

          <div className="space-y-2">
            {MFK.retailers.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-5 border-2 transition hover:bg-white group" style={{ borderColor: "rgba(184,149,74,0.3)" }}>
                <div className="flex-1">
                  <p className="serif text-xl font-light mb-1">{r.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: "'Cormorant', serif" }}>{r.note}</p>
                </div>
                <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition gold-text" />
              </a>
            ))}
          </div>

          <p className="text-xs uppercase tracking-[0.2em] opacity-50 mt-8 leading-relaxed" style={{ fontFamily: "'Cormorant', serif" }}>
            * MFK offers complimentary 5ml samples of any fragrance for $40, credited toward any future full bottle purchase via the official site.
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-12 text-center deep-bg" style={{ color: "#F8F4ED" }}>
        <div className="max-w-4xl mx-auto">
          <div className="border-2 inline-block px-8 py-4" style={{ borderColor: "#B8954A" }}>
            <p className="mono-luxury text-xs uppercase opacity-50 mb-1 gold-text">Maison Francis Kurkdjian · Brand Profile</p>
            <p className="serif text-xl font-light">Curated by ScentWise</p>
          </div>
          <p className="mono-luxury text-xs uppercase opacity-40 mt-6">All prices in USD · Reference only · Check official retailers for current pricing</p>
        </div>
      </footer>
    </div>
  );
}

function CreedPage({ onBack }) {
  const [activePerfume, setActivePerfume] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#F4F1E8", fontFamily: "'Inter', system-ui, sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&family=Cormorant:ital,wght@0,300;0,400;1,300&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono-luxury { font-family: 'Cormorant', serif; letter-spacing: 0.15em; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out; }
        .gold-line {
          background: linear-gradient(90deg, transparent, #9A7B3A 20%, #9A7B3A 80%, transparent);
          height: 1px;
        }
        .gold-text { color: #9A7B3A; }
        .deep-bg { background: #1A2A1F; }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between" style={{ background: "rgba(248,244,237,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(184,149,74,0.2)" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:opacity-60 transition" style={{ fontFamily: "'Cormorant', serif" }}>
          <ArrowLeft size={14} /> Back to ScentWise
        </button>
        <span className="text-xs uppercase tracking-[0.25em] opacity-50 hidden md:block" style={{ fontFamily: "'Cormorant', serif" }}>Maison · London · Paris · Since 1760</span>
      </div>

      {/* HERO */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F4F1E8 0%, #E8E4D5 100%)" }}>
        <div className="max-w-5xl mx-auto fade-up text-center">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Established 2009 ·  Place Vendôme, Paris —</p>

          <h1 className="serif font-light leading-[0.95] mb-2" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "0.01em", color: "#1A1A1A" }}>
            Maison Francis
          </h1>
          <h1 className="serif italic font-light leading-[0.95] mb-10" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "0.01em", color: "#1A1A1A" }}>
            Kurkdjian
          </h1>

          <div className="gold-line w-32 mx-auto mb-10"></div>

          <p className="serif italic font-light max-w-2xl mx-auto" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", lineHeight: 1.5, color: "#2E3A30" }}>
            "{CREED.philosophy.headline}"
          </p>

          <a href={CREED.retailers[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-12 text-xs uppercase tracking-[0.25em] border-b pb-1 hover:opacity-60 transition gold-text" style={{ borderColor: "#9A7B3A", fontFamily: "'Cormorant', serif" }}>
            Visit franciskurkdjian.com <ExternalLink size={12} />
          </a>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 md:px-10 py-24 md:py-32 deep-bg" style={{ color: "#F4F1E8" }}>
        <div className="max-w-3xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— The Maison —</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.2 }}>
            A wardrobe, not a signature.
          </h2>

          <div className="space-y-6 text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(248,244,237,0.85)" }}>
            <p>{CREED.philosophy.body}</p>
            <p>{CREED.philosophy.body2}</p>
          </div>

          <blockquote className="mt-16 pl-8 border-l-2" style={{ borderColor: "#9A7B3A" }}>
            <Quote size={20} className="gold-text mb-3" />
            <p className="serif italic font-light text-xl md:text-2xl mb-3" style={{ color: "#F4F1E8", lineHeight: 1.5 }}>
              "{CREED.philosophy.quote}"
            </p>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(248,244,237,0.5)", fontFamily: "'Cormorant', serif" }}>— {CREED.philosophy.quoteBy}</p>
          </blockquote>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F4F1E8" }}>
        <div className="max-w-5xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— The Co-Founders —</p>
          <h2 className="serif font-light mb-20" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The friendship behind the Maison.</h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {CREED.founders.map((f, i) => (
              <div key={i}>
                <p className="mono-luxury text-xs uppercase mb-3 gold-text">{String(i + 1).padStart(2, "0")} / 02</p>
                <h3 className="serif text-3xl md:text-4xl mb-2 font-light">{f.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] mb-6 opacity-70" style={{ fontFamily: "'Cormorant', serif" }}>{f.role}</p>
                <div className="gold-line mb-6"></div>
                <p className="text-base font-light leading-relaxed" style={{ color: "#2E3A30" }}>{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#E8E4D5" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Timeline —</p>
          <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>From Le Mâle to LVMH.</h2>

          <div className="space-y-10">
            {CREED.timeline.map((t, i) => (
              <div key={i} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-10 items-start">
                <p className="serif text-xl md:text-2xl gold-text">{t.year}</p>
                <div className="border-l-2 pl-6" style={{ borderColor: "#9A7B3A" }}>
                  <p className="text-base md:text-lg font-light leading-relaxed">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE INGREDIENTS */}
      <section className="px-6 md:px-10 py-24 md:py-32 deep-bg" style={{ color: "#F4F1E8" }}>
        <div className="max-w-6xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Signature Ingredients —</p>
          <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The materials that define an CREED.</h2>
          <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: "rgba(248,244,237,0.65)" }}>
            Kurkdjian's command of synthetic molecules — particularly Ambroxan and saffronal — alongside the most refined natural materials, defines the modern MFK signature.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {CREED.signatureIngredients.map((ing, i) => (
              <div key={i}>
                <p className="mono-luxury text-xs uppercase mb-2 gold-text">0{i + 1}</p>
                <h4 className="serif text-2xl mb-3 font-light" style={{ color: "#F4F1E8" }}>{ing.name}</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(248,244,237,0.7)" }}>{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFUMES — DETAILED */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F4F1E8" }}>
        <div className="max-w-5xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Five Iconic Compositions —</p>
          <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The wardrobe.</h2>
          <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: "#2E3A30" }}>
            Click any composition to read its inspiration, the creation story, and the full olfactive pyramid.
          </p>

          <div className="space-y-3">
            {CREED_PERFUMES.map((p, i) => (
              <div key={i}>
                <button
                  onClick={() => setActivePerfume(activePerfume === i ? null : i)}
                  className="w-full text-left p-6 md:p-8 transition group border-2"
                  style={{ borderColor: activePerfume === i ? "#9A7B3A" : "rgba(184,149,74,0.3)", background: activePerfume === i ? "#FFFFFF" : "transparent" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-4 md:gap-8 flex-wrap">
                      <span className="mono-luxury text-xs gold-text">0{i + 1}</span>
                      <h3 className="serif text-2xl md:text-3xl font-light tracking-wide">{p.name}</h3>
                      <span className="text-xs uppercase tracking-[0.2em] opacity-60 hidden md:inline" style={{ fontFamily: "'Cormorant', serif" }}>{p.family} · {p.year}</span>
                    </div>
                    <span className="text-lg gold-text">{activePerfume === i ? "—" : "+"}</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60 md:hidden mt-2" style={{ fontFamily: "'Cormorant', serif" }}>{p.family} · {p.year}</p>
                </button>

                {activePerfume === i && (
                  <div className="border-2 border-t-0 p-6 md:p-10 fade-up" style={{ borderColor: "#9A7B3A", background: "#FFFFFF" }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 pb-8 border-b" style={{ borderColor: "rgba(184,149,74,0.25)" }}>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Perfumer</p>
                        <p className="text-sm font-medium">{p.perfumer}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Launched</p>
                        <p className="text-sm font-medium">{p.year}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Sillage</p>
                        <p className="text-sm font-medium">{p.sillage}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-[11px] uppercase opacity-50 mb-1">Longevity</p>
                        <p className="text-sm font-medium">{p.longevity}</p>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— Inspiration</p>
                      <p className="serif italic text-lg md:text-xl font-light leading-relaxed" style={{ color: "#2E3A30" }}>
                        {p.inspiration}
                      </p>
                    </div>

                    <div className="mb-10">
                      <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— The creation</p>
                      <p className="text-base font-light leading-relaxed" style={{ color: "#2E3A30" }}>
                        {p.creationStory}
                      </p>
                    </div>

                    <div className="mb-10">
                      <p className="mono-luxury text-xs uppercase opacity-50 mb-4 gold-text">— Olfactive pyramid</p>
                      <div className="border-l-2 pl-6 space-y-5" style={{ borderColor: "#9A7B3A" }}>
                        <div>
                          <p className="mono-luxury text-[11px] uppercase opacity-60 mb-1">Top notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.top}</p>
                        </div>
                        <div>
                          <p className="mono-luxury text-[11px] uppercase opacity-60 mb-1">Heart notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.heart}</p>
                        </div>
                        <div>
                          <p className="mono-luxury text-[11px] uppercase opacity-60 mb-1">Base notes</p>
                          <p className="serif text-lg font-light italic">{p.notes.base}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: "rgba(184,149,74,0.25)" }}>
                      <div>
                        <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— Best for</p>
                        <p className="text-base font-light leading-relaxed" style={{ color: "#2E3A30" }}>{p.bestFor}</p>
                      </div>
                      <div>
                        <p className="mono-luxury text-xs uppercase opacity-50 mb-3 gold-text">— Price (USD)</p>
                        <p className="serif text-lg font-light leading-relaxed">{p.price}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL IDENTITY */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#E8E4D5" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Visual identity —</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Black, gold, and obsessive precision.</h2>
          <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: "#2E3A30" }}>{CREED.visualIdentity.description}</p>
        </div>
      </section>

      {/* RETAILERS */}
      <section className="px-6 md:px-10 py-24 md:py-32" style={{ background: "#F4F1E8" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mono-luxury text-xs uppercase mb-8 gold-text">— Where to find it —</p>
          <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Authorized retailers.</h2>

          <div className="space-y-2">
            {CREED.retailers.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-5 border-2 transition hover:bg-white group" style={{ borderColor: "rgba(184,149,74,0.3)" }}>
                <div className="flex-1">
                  <p className="serif text-xl font-light mb-1">{r.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: "'Cormorant', serif" }}>{r.note}</p>
                </div>
                <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition gold-text" />
              </a>
            ))}
          </div>

          <p className="text-xs uppercase tracking-[0.2em] opacity-50 mt-8 leading-relaxed" style={{ fontFamily: "'Cormorant', serif" }}>
            * MFK offers complimentary 5ml samples of any fragrance for $40, credited toward any future full bottle purchase via the official site.
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-12 text-center deep-bg" style={{ color: "#F4F1E8" }}>
        <div className="max-w-4xl mx-auto">
          <div className="border-2 inline-block px-8 py-4" style={{ borderColor: "#9A7B3A" }}>
            <p className="mono-luxury text-xs uppercase opacity-50 mb-1 gold-text">Maison Francis Kurkdjian · Brand Profile</p>
            <p className="serif text-xl font-light">Curated by ScentWise</p>
          </div>
          <p className="mono-luxury text-xs uppercase opacity-40 mt-6">All prices in USD · Reference only · Check official retailers for current pricing</p>
        </div>
      </footer>
    </div>
  );
}

export default function ScentWise() {
  const [userName, setUserName] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [activeBrand, setActiveBrand] = useState(null);
  const [brandSearch, setBrandSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const nameRes = await window.storage.get("user:name");
        if (nameRes?.value) setUserName(nameRes.value);
        else setShowNamePrompt(true);
      } catch (e) {
        setShowNamePrompt(true);
      }
    })();
  }, []);

  async function saveName() {
    const name = nameInput.trim();
    if (!name) return;
    try { await window.storage.set("user:name", name); } catch (e) {}
    setUserName(name);
    setShowNamePrompt(false);
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useScrollReveal();

  // Always open the page at the top (hero section) on load,
  // overriding the browser's scroll-restoration behavior.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const filteredBrands = BRANDS.filter((b) => {
    const q = brandSearch.toLowerCase();
    const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.perfumes.some((p) => p.name.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ===== BRAND DETAIL VIEW =====
  if (activeBrand === "lelabo") {
    return <LeLaboPage onBack={() => setActiveBrand(null)} />;
  }

  if (activeBrand === "mfk") {
    return <MFKPage onBack={() => setActiveBrand(null)} />;
  }

  if (activeBrand === "creed") {
    return <CreedPage onBack={() => setActiveBrand(null)} />;
  }

  if (activeBrand) {
    const brand = BRANDS.find((b) => b.id === activeBrand);
    return (
      <div className="min-h-screen" style={{ background: "#F9F6F1", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
          .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .fade-up { animation: fadeUp 0.5s ease-out; }
        `}</style>

        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 fade-up">
          <button onClick={() => setActiveBrand(null)} className="flex items-center gap-2 text-xs uppercase tracking-widest mb-12 transition" style={{ color: "#7A6650" }}>
            <ArrowLeft size={14} /> Back to all houses
          </button>

          <div className="mb-12 pb-10 border-b" style={{ borderColor: "rgba(196,168,130,0.3)" }}>
            <p className="text-xs uppercase tracking-[0.3em] font-medium mb-3" style={{ color: "#A67C52" }}>{CATEGORY_LABELS[brand.category]} · {brand.origin}</p>
            <h1 className="serif font-light mb-6" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "#2C1F0F" }}>{brand.name}</h1>
            <p className="text-base md:text-lg leading-relaxed font-light max-w-2xl mb-6" style={{ color: "#5C4A32" }}>{brand.desc}</p>
            <a href={brand.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b pb-1 transition" style={{ color: "#8B6F47", borderColor: "#C4A882" }}>
              Visit official boutique <ExternalLink size={12} />
            </a>
          </div>

          {brand.perfumes && brand.perfumes.length > 0 ? (
            <>
              <p className="text-xs uppercase tracking-[0.3em] font-medium mb-8" style={{ color: "#A67C52" }}>Iconic fragrances</p>

              <div className="space-y-4">
                {brand.perfumes.map((p, i) => (
                  <div key={i} className="bg-white border p-7 transition hover:shadow-lg" style={{ borderColor: "rgba(196,168,130,0.3)" }}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="serif text-2xl mb-1" style={{ color: "#2C1F0F" }}>{p.name}</h3>
                        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: "#A67C52" }}>{p.family}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#A89880" }}>Retail</p>
                        <p className="serif text-xl" style={{ color: "#5C4A32" }}>{p.price}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: "rgba(196,168,130,0.2)" }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "#A89880" }}>Key notes</p>
                        <p className="text-sm font-light italic" style={{ color: "#5C4A32" }}>{p.notes}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "#A89880" }}>Best for</p>
                        <p className="text-sm font-light" style={{ color: "#5C4A32" }}>{p.occasion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center text-xs font-light" style={{ color: "#A89880" }}>
                Reference USD pricing. Check the official boutique or authorized retailers for current pricing.
              </div>
            </>
          ) : (
            <div className="border-2 border-dashed p-10 text-center" style={{ borderColor: "rgba(196,168,130,0.4)", background: "rgba(255,255,255,0.5)" }}>
              <FlaskConical size={32} className="mx-auto mb-4 opacity-40" style={{ color: "#8B6F47" }} />
              <h3 className="serif text-2xl mb-3 font-light" style={{ color: "#2C1F0F" }}>Deep dive coming soon</h3>
              <p className="text-sm font-light leading-relaxed max-w-md mx-auto mb-6" style={{ color: "#7A6650" }}>
                We're building a rich, detailed page for {brand.name} — with founder stories, perfumer credits, signature ingredients, full olfactive pyramids, and the history behind each iconic fragrance. The same depth you'll find on our Le Labo page.
              </p>
              <p className="text-xs font-light leading-relaxed max-w-md mx-auto mb-6" style={{ color: "#A89880" }}>
                In the meantime, talk to the consultant for personalized recommendations from {brand.name}, or visit their official site below.
              </p>
              <a href={brand.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b pb-1 transition" style={{ color: "#8B6F47", borderColor: "#C4A882" }}>
                Visit {brand.name} <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== MAIN VIEW =====
  return (
    <div className="min-h-screen" style={{ background: "#F9F6F1", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes blink { 0%,60%,100% { opacity:0.2; transform:scale(1); } 30% { opacity:1; transform:scale(1.3); } }
        .dot { animation: blink 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #d6c4a8; border-radius: 2px; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out; }
      `}</style>

      {showNamePrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "rgba(44,31,15,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-10 fade-up" style={{ border: "1px solid rgba(196,168,130,0.3)" }}>
            <Sparkles size={28} style={{ color: "#A67C52" }} className="mb-5" />
            <h3 className="serif text-3xl mb-3 font-light" style={{ color: "#2C1F0F" }}>Welcome to ScentWise</h3>
            <p className="text-sm font-light mb-6 leading-relaxed" style={{ color: "#7A6650" }}>
              For a more personal experience, what should I call you? Your conversations are saved so you can pick up where you left off.
            </p>
            <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} placeholder="Your first name" className="w-full px-4 py-3 border outline-none text-sm font-light mb-4 rounded" style={{ borderColor: "#C4A882", color: "#2C1F0F" }} autoFocus />
            <div className="flex gap-3">
              <button onClick={saveName} disabled={!nameInput.trim()} className="flex-1 py-3 text-xs uppercase tracking-widest transition disabled:opacity-50" style={{ background: "#5C4A32", color: "#F5F0E8" }}>Begin</button>
              <button onClick={() => { setUserName("guest"); setShowNamePrompt(false); }} className="px-5 py-3 text-xs uppercase tracking-widest border" style={{ borderColor: "#C4A882", color: "#7A6650" }}>Skip</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-md border-b" style={{ background: "rgba(249,246,241,0.92)", borderColor: "rgba(196,168,130,0.2)" }}>
        <a href="#" className="serif text-2xl font-semibold tracking-widest" style={{ color: "#5C4A32" }}>
          Scent<span style={{ color: "#A67C52" }}>Wise</span>
        </a>
        <div className="hidden md:flex gap-7 items-center">
          <button onClick={() => scrollTo("how")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>How it works</button>
          <button onClick={() => scrollTo("consultor")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>Consultant</button>
          <button onClick={() => scrollTo("brands")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>Houses</button>
          <button onClick={() => scrollTo("features")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>Features</button>
          <button onClick={() => scrollTo("consultor")} className="text-xs uppercase tracking-widest px-5 py-2.5" style={{ background: "#5C4A32", color: "#F5F0E8" }}>Explore</button>
        </div>
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F9F6F1 0%, #F5F0E8 50%, #E8DCC8 100%)" }}>
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, #C4A882 0%, transparent 70%)" }}></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #8B6F47 0%, transparent 70%)" }}></div>

        <p className="text-xs tracking-[0.3em] uppercase mb-5 font-medium relative z-10" style={{ color: "#A67C52" }}>
          {userName && userName !== "guest" ? `Welcome back, ${userName}` : "Niche fragrance, curated"}
        </p>
        <h1 className="serif font-light leading-tight mb-6 max-w-4xl relative z-10" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "#2C1F0F" }}>
          The right fragrance for <em style={{ color: "#8B6F47" }}>every moment</em> of your life
        </h1>
        <p className="text-base md:text-lg leading-relaxed font-light max-w-xl mb-10 relative z-10" style={{ color: "#7A6650" }}>
          A personal AI consultant trained in niche perfumery, paired with a curated encyclopedia of the world's most respected houses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button onClick={() => scrollTo("consultor")} className="inline-flex items-center gap-3 text-xs uppercase tracking-widest px-9 py-4 transition hover:-translate-y-0.5" style={{ background: "#5C4A32", color: "#F5F0E8" }}>
            <MessageCircle size={16} /> Talk to the consultant
          </button>
          <button onClick={() => scrollTo("brands")} className="inline-flex items-center gap-3 text-xs uppercase tracking-widest px-9 py-4 border transition" style={{ borderColor: "#5C4A32", color: "#5C4A32" }}>
            <Building2 size={16} /> Explore {BRANDS.length} houses
          </button>
        </div>
        <div className="mt-16 flex flex-col items-center gap-2 relative z-10">
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, #C4A882, transparent)" }}></div>
          <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#A89880" }}>Explore</span>
        </div>
      </section>

      <section id="how" className="px-6 md:px-12 py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A67C52" }}>Simple as that</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#2C1F0F" }}>How ScentWise works</h2>
            <p className="text-base font-light max-w-lg mx-auto" style={{ color: "#7A6650" }}>You don't need to be an expert. You just need to know what you want to feel.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              { n: "01", t: "Tell us the moment", d: "Important meeting, beach trip, black-tie wedding, quiet day at home. Speak freely — no jargon required." },
              { n: "02", t: "Build your profile", d: "The consultant learns your preferences, what you already wear, what draws you, and your investment range." },
              { n: "03", t: "Get your recommendation", d: "Personalized suggestions with notes, houses, where to buy, and budget alternatives at every tier." },
            ].map((s, i) => (
              <div key={i} className="p-10 border transition hover:-translate-y-1 hover:shadow-xl" style={{ background: "#F9F6F1", borderColor: "rgba(196,168,130,0.3)" }}>
                <div className="serif font-light leading-none mb-5" style={{ fontSize: "3.25rem", color: "#E8DCC8" }}>{s.n}</div>
                <h3 className="serif text-2xl mb-3" style={{ color: "#5C4A32" }}>{s.t}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: "#7A6650" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consultor" className="px-6 md:px-12 py-24" style={{ background: "#F9F6F1" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A67C52" }}>Olfactory intelligence</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#2C1F0F" }}>Your personal fragrance consultant</h2>
            <p className="text-base font-light max-w-xl mx-auto" style={{ color: "#7A6650" }}>
              Tell the consultant what you're looking for — an occasion, a scent you love, a feeling, or a budget — and get personalized recommendations from the world's finest houses.
            </p>
          </div>

          <DemoConsultant />
        </div>
      </section>

      <section id="brands" className="px-6 md:px-12 py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A67C52" }}>Encyclopedia</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#2C1F0F" }}>{BRANDS.length} curated houses</h2>
            <p className="text-base font-light max-w-lg mx-auto" style={{ color: "#7A6650" }}>
              From house history to iconic compositions — click any maison to explore its world.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-10 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#A89880" }} />
              <input type="text" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} placeholder="Search house or fragrance..." className="w-full pl-11 pr-4 py-3 border bg-white outline-none text-sm font-light" style={{ borderColor: "rgba(196,168,130,0.4)", color: "#2C1F0F" }} />
            </div>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All" },
                { id: "niche", label: "Niche" },
                { id: "luxury-line", label: "Luxury Lines" },
                { id: "heritage", label: "Heritage" },
              ].map((cat) => (
                <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className="px-5 py-3 text-xs uppercase tracking-widest transition" style={categoryFilter === cat.id ? { background: "#5C4A32", color: "#F5F0E8" } : { background: "white", color: "#7A6650", border: "1px solid rgba(196,168,130,0.4)" }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((b) => (
              <button key={b.id} onClick={() => { setActiveBrand(b.id); window.scrollTo(0, 0); }} className="text-left p-7 border bg-white hover:-translate-y-1.5 hover:shadow-2xl group" style={{ borderColor: "rgba(196,168,130,0.3)", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.35s ease" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C4A882"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(196,168,130,0.3)"}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium px-2 py-1 rounded" style={{ color: "#A67C52", background: "#F5F0E8" }}>{CATEGORY_LABELS[b.category]}</p>
                    {(b.id === "lelabo" || b.id === "mfk" || b.id === "creed") && (
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium px-2 py-1 rounded" style={{ color: "#F5F0E8", background: "#5C4A32" }}>Featured</p>
                    )}
                  </div>
                  <ArrowRight size={16} className="opacity-30 group-hover:opacity-100 transition" style={{ color: "#8B6F47" }} />
                </div>
                <h3 className="serif text-2xl font-light mb-2" style={{ color: "#2C1F0F" }}>{b.name}</h3>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#A89880" }}>{b.origin}</p>
                <p className="text-sm leading-relaxed font-light" style={{ color: "#5C4A32", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.desc}</p>
                <p className="text-xs mt-4 italic" style={{ color: "#8B6F47" }}>
                  {(b.id === "lelabo" || b.id === "mfk" || b.id === "creed") ? "Full deep-dive page available" : "Brand profile · Deep dive coming soon"}
                </p>
              </button>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-16" style={{ color: "#A89880" }}>
              <p className="serif text-2xl mb-2">No houses found</p>
              <p className="text-sm font-light">Try a different term or category</p>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-sm font-light" style={{ color: "#7A6650" }}>
              Coming soon: more houses, individual fragrance pages, and search by olfactory notes.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 md:px-12 py-24" style={{ background: "#2C1F0F" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#C4A882" }}>What's coming</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#F5F0E8" }}>More than recommendations</h2>
            <p className="text-base font-light max-w-xl" style={{ color: "rgba(245,240,232,0.6)" }}>ScentWise is being built to be the most thoughtful niche fragrance resource on the web.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(196,168,130,0.1)" }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-10 transition" style={{ background: "rgba(44,31,15,0.5)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,111,71,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(44,31,15,0.5)")}>
                  <Icon size={28} style={{ color: "#C4A882" }} className="mb-5" />
                  <h3 className="serif text-xl mb-3" style={{ color: "#F5F0E8" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "rgba(245,240,232,0.55)" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 text-center" style={{ background: "#5C4A32" }}>
        <Sparkles size={28} style={{ color: "#C4A882" }} className="mx-auto mb-5" />
        <h3 className="serif font-light mb-5" style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "#F5F0E8" }}>Ready to find your next signature?</h3>
        <p className="text-sm font-light mb-8 max-w-md mx-auto" style={{ color: "rgba(245,240,232,0.65)" }}>The consultant is waiting. No signup, no friction.</p>
        <button onClick={() => scrollTo("consultor")} className="inline-flex items-center gap-3 text-xs uppercase tracking-widest px-9 py-4 transition" style={{ background: "#F5F0E8", color: "#2C1F0F" }}>
          Start the conversation <ArrowRight size={16} />
        </button>
      </section>

      <footer className="text-center py-12 px-6 border-t" style={{ background: "#2C1F0F", borderColor: "rgba(196,168,130,0.15)" }}>
        <div className="serif text-3xl tracking-[0.2em] mb-4" style={{ color: "#F5F0E8" }}>
          Scent<span style={{ color: "#C4A882" }}>Wise</span>
        </div>
        <p className="text-xs tracking-widest mb-2" style={{ color: "rgba(245,240,232,0.3)" }}>Niche fragrance, intelligently curated</p>
        <p className="text-[10px] tracking-widest" style={{ color: "rgba(245,240,232,0.2)" }}>Prototype · Content in development · Reference USD pricing</p>
      </footer>
    </div>
  );
}