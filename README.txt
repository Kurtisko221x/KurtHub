====================================
  AI Studio - Rodinny Projekt
====================================

FUNKCIE:
--------
💬 CHAT S AI - Konverzácia s GPT-4o-mini modelom
   • Prirodzená konverzácia s AI
   • Textový editor pre dlhé texty

📊 GENEROVANIE GRAFOV - AI vytvorí profesionálny graf z vašich dát
   • Stĺpcové, čiarové, koláčové, prstencové grafy
   • Dve osi Y pre dáta s odlišnými mierkami
   • Kombinácia typov (stĺpce + čiara)
   • Farebné zladenie osí s dátami
   • Sťahovanie ako PNG pre prezentácie
   
🎨 GENEROVANIE OBRÁZKOV - DALL-E 3 AI generátor
   • Rôzne veľkosti: 1024x1024, 1024x1792, 1792x1024
   • Standard alebo HD kvalita
   • Sťahovanie vygenerovaných obrázkov

🖼️ ANALÝZA OBRÁZKOV - GPT Vision
   • Nahratie obrázka na analýzu
   • Detekcia objektov, textu, scény
   • Vysvetlenie obsahu obrázka

💻 POMOC S KÓDOM - Code Review & Debugging
   • Analýza kódu
   • Detekcia chýb a bezpečnostných problémov
   • Návrhy na vylepšenie
   • Best practices

✨ HUMANIZÁTOR - Prepisovač textov
   • Prepis AI textu na prirodzený ľudský text
   • Odstránenie AI fráz
   • Pridanie osobnosti a emócií

📽️ POWERPOINT PREZENTÁCIE - Skutočné .pptx súbory
   • Generovanie 5-7 slajdov
   • Profesionálny dizajn s farebným pozadím
   • Sťahovanie ako .pptx súbor
   • Otvoriteľné v PowerPoint, Google Slides, LibreOffice

📝 SUMMARIZER - Zhrnutie textov
   • Zhrnúť dlhé články a texty
   • 5-10x kratšie zhrnutie
   • Zachová kľúčové informácie
   • Ideálne pre školu a prácu

📄 PDF GENERATOR - Profesionálne dokumenty
   • Faktúry, životopisy, správy
   • Profesionálny dizajn
   • Automatické číslovanie strán
   • Sťahovanie ako PDF

❓ QUIZ GENERATOR - Vzdelávacie testy
   • 10 otázok z učebného materiálu
   • 4 možnosti na otázku (A, B, C, D)
   • Správne odpovede na konci
   • Perfektné na učenie


INŠTALÁCIA A SPUSTENIE:
-----------------------

1. Uistite sa, že máte nainštalovaný Node.js
   Stiahnite z: https://nodejs.org/

2. Otvorte server.js a na riadku 9 vložte váš OpenAI API kľúč:
   const OPENAI_API_KEY = 'sk-proj-VAS-API-KLUC';

3. Spustite START.bat (dvojklik na súbor)
   
   ALEBO spustite manuálne:
   - Otvorte príkazový riadok v tejto zložke
   - Spustite: npm install
   - Potom spustite: npm start

4. Otvorte prehliadač a prejdite na:
   http://localhost:3000/index.html

5. Hotovo! Môžete chatovať s AI alebo generovať obrázky! 🎉


POUŽITIE:
---------
• Prepínanie režimov: Kliknite na tlačidlá v headeri alebo na kartičky
• Textový editor: Kliknite "Prepnúť na editor" pre dlhšie texty

💬 CHAT:
  - Píšte správy a komunikujte s AI
  - Kliknite "Prepnúť na editor" pre dlhé texty

📊 GRAFY:
  - Príklady:
    * "Stĺpcový graf populácie Bratislava 475000, Košice 229000"
    * "Koláčový graf predaj: jablká 150, hrušky 80, banány 120"
    * "Graf s dvoma osami Y: tržby 10000, 12000, 15000 a zákazníci 50, 65, 80"
  
🎨 OBRÁZKY:
  - Popíšte čo chcete vidieť a AI vygeneruje obrázok
  
🖼️ ANALÝZA OBRÁZKOV:
  - Nahrajte obrázok (tlačidlo "Choose File")
  - Opýtajte sa čo chcete vedieť o obrázku
  
💻 KÓD:
  - Vložte kód (použite textový editor)
  - AI analyzuje a navrhne vylepšenia
  
✨ HUMANIZÁTOR:
  - Vložte text (použite textový editor)
  - AI prepíše text prirodzenejšie
  
📽️ PREZENTÁCIE:
  - Zadajte tému prezentácie
  - AI vytvorí PowerPoint prezentáciu s 5-7 slajdami
  - Automaticky sa stiahne .pptx súbor
  - Otvorte v PowerPoint, Google Slides alebo LibreOffice
  
📝 SUMMARIZER:
  - Vložte dlhý text (článok, dokument)
  - AI vytvorí krátke zhrnutie
  - Použite textový editor pre dlhé texty
  
📄 PDF GENERATOR:
  - Napíšte čo potrebujete (faktúra, životopis...)
  - AI vytvorí profesionálny PDF dokument
  - Automaticky sa stiahne
  
❓ QUIZ GENERATOR:
  - Vložte učebný materiál
  - AI vytvorí 10 testových otázok
  - 4 možnosti + správne odpovede


POZNÁMKY:
---------
- Server beží na porte 3000
- API kľúč je bezpečne uložený na serveri
- Pre zastavenie servera stlačte Ctrl+C v príkazovom riadku
- Generovanie obrázkov: 10-30 sekúnd
- HD kvalita obrázkov je drahšia ako štandard
- Grafy sú generované lokálne (rýchle)
- Všetky výstupy (grafy, prezentácie) sú stiahnuteľné
- Pre dlhé texty použite textový editor
- Analýza obrázkov funguje s GPT-4o-mini Vision


PROBLÉMY?
---------
Ak sa objaví chyba že API kľúč nie je nastavený:
1. Skontrolujte server.js riadok 9
2. Uistite sa, že ste nahradili 'sk-proj-YOUR-API-KEY-HERE' 
   vaším skutočným API kľúčom z platform.openai.com/api-keys
3. Reštartujte server (Ctrl+C a potom spustite znova)

