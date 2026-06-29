"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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


const FEATURES = [
  { icon: Building2, title: "House Histories", desc: "From founding to iconic creations — discover the soul behind each maison, with links to official boutiques." },
  { icon: FlaskConical, title: "Olfactory Notes Guide", desc: "Understand the difference between bergamot and cedar, fougère and oriental. Build your fragrance vocabulary." },
  { icon: Briefcase, title: "Fragrances by Occasion", desc: "Curation by moment: office, travel, evenings, beach, winter. The right scent always within reach." },
  { icon: BookMarked, title: "My Collection", desc: "Track perfumes you own, want, or have sampled. Your personal fragrance archive, organized." },
  { icon: Wallet, title: "Smart Budgeting", desc: "From entry niche to ultra-luxury: recommendations across all tiers with alternatives and where to find them." },
  { icon: Users, title: "Community", desc: "A space for fragrance lovers to connect, share discoveries, and build this culture together." },
];

const CATEGORY_LABELS = { niche: "Niche", "luxury-line": "Luxury Line", heritage: "Heritage House" };

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

export default function ScentWise() {
  const [userName, setUserName] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [activeBrand, setActiveBrand] = useState(null);
  const router = useRouter();
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
              <button key={b.id} onClick={() => {
  if (b.id === "lelabo" || b.id === "mfk" || b.id === "creed") {
    router.push(`/brands/${b.id}`);
  } else {
    setActiveBrand(b.id);
    window.scrollTo(0, 0);
  }
}} className="text-left p-7 border bg-white hover:-translate-y-1.5 hover:shadow-2xl group" style={{ borderColor: "rgba(196,168,130,0.3)", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.35s ease" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C4A882"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(196,168,130,0.3)"}>
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
