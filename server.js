const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const PptxGenJS = require('pptxgenjs');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = 3000;

// ⚠️⚠️⚠️ VLOŽTE SEM VÁŠ OPENAI API KĽÚČ ⚠️⚠️⚠️
// Pre lokálne použitie: Nahraďte 'YOUR-API-KEY-HERE' vaším kľúčom
// Pre server (Render/Railway): Nastavte environment variable OPENAI_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-proj-YOUR-API-KEY-HERE';

// Helper funkcia na kontrolu API kľúča
function isValidApiKey(key) {
    return key && 
           key !== 'sk-proj-YOUR-API-KEY-HERE' && 
           key.startsWith('sk-') && 
           key.length > 20;
}

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
    try {
        if (!isValidApiKey(OPENAI_API_KEY)) {
            return res.status(400).json({ 
                error: { message: '⚠️ Nastavte API kľúč! Pre lokálne použitie: server.js riadok 13. Pre Render: Environment Variables → OPENAI_API_KEY' } 
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
});

app.post('/api/generate-image', async (req, res) => {
    try {
        if (!isValidApiKey(OPENAI_API_KEY)) {
            return res.status(400).json({ 
                error: { message: '⚠️ Nastavte API kľúč! Pre lokálne použitie: server.js riadok 13. Pre Render: Environment Variables → OPENAI_API_KEY' } 
            });
        }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: req.body.prompt,
                n: 1,
                size: req.body.size || "1024x1024",
                quality: req.body.quality || "standard"
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
});

app.post('/api/generate-pptx', async (req, res) => {
    try {
        if (!isValidApiKey(OPENAI_API_KEY)) {
            return res.status(400).json({ 
                error: { message: '⚠️ Nastavte API kľúč! Pre lokálne použitie: server.js riadok 13. Pre Render: Environment Variables → OPENAI_API_KEY' } 
            });
        }

        // Získame obsah prezentácie od AI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Si expert na vytváranie prezentácií. Vytvor obsah pre PowerPoint prezentáciu s 5-7 slajdami. Vráť JSON v tomto formáte:\n{"title": "Názov prezentácie", "subtitle": "Podnadpis", "slides": [{"title": "Nadpis slajdu", "content": ["Bod 1", "Bod 2", "Bod 3"]}]}\n\nVRÁŤ IBA VALIDNÝ JSON!'
                    },
                    {
                        role: 'user',
                        content: 'Vytvor prezentáciu na tému: ' + req.body.topic
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API Error');
        }

        // Parsuj JSON odpoveď od AI
        let presentationData;
        try {
            let jsonText = data.choices[0].message.content.trim();
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            presentationData = JSON.parse(jsonText);
        } catch (e) {
            throw new Error('AI nevrátila validný formát prezentácie.');
        }

        // Vytvor PowerPoint prezentáciu (Beautiful.ai štýl)
        const pptx = new PptxGenJS();
        
        // Nastavenia
        pptx.layout = 'LAYOUT_16x9';
        pptx.author = 'AI Studio';
        pptx.title = presentationData.title || 'Prezentácia';

        // === TITULNÝ SLAJD (Hero Style) ===
        const titleSlide = pptx.addSlide();
        titleSlide.background = { fill: '1a1a2e' };
        
        // Veľký farebný box
        titleSlide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: 10, h: 5.625,
            fill: { type: 'solid', color: '667eea', transparency: 20 }
        });
        
        // Gradient overlay
        titleSlide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 3, w: 10, h: 2.625,
            fill: { 
                type: 'gradient',
                color1: '667eea',
                color2: '764ba2',
                dir: 'toBottom'
            }
        });
        
        // Titulok s tieňom
        titleSlide.addText(presentationData.title || 'Prezentácia', {
            x: 0.5, y: 2, w: 9, h: 1.2,
            fontSize: 54, bold: true, color: 'FFFFFF',
            align: 'center',
            shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, color: '000000', opacity: 0.5 }
        });
        
        if (presentationData.subtitle) {
            titleSlide.addText(presentationData.subtitle, {
                x: 0.5, y: 3.5, w: 9, h: 0.6,
                fontSize: 24, color: 'E0E0E0',
                align: 'center', italic: true
            });
        }
        
        // Dekoratívna čiara
        titleSlide.addShape(pptx.ShapeType.rect, {
            x: 4, y: 4.5, w: 2, h: 0.05,
            fill: { color: 'FFFFFF' }
        });

        // === OBSAHOVÉ SLAJDY (Smart Layouts) ===
        const layouts = [
            { // Layout 1: Dva stĺpce
                colors: { bg: '2d3561', accent: '8b5cf6', text: 'FFFFFF' },
                type: 'twoColumn'
            },
            { // Layout 2: Big Number + Text
                colors: { bg: '2a1a40', accent: 'ec4899', text: 'FFFFFF' },
                type: 'bigNumber'
            },
            { // Layout 3: Centrovaný obsah
                colors: { bg: '1e3a5f', accent: '3b82f6', text: 'FFFFFF' },
                type: 'centered'
            },
            { // Layout 4: Side accent
                colors: { bg: '1a2f23', accent: '10b981', text: 'FFFFFF' },
                type: 'sideAccent'
            },
            { // Layout 5: Cards
                colors: { bg: '3d1f47', accent: 'a855f7', text: 'FFFFFF' },
                type: 'cards'
            }
        ];
        
        presentationData.slides.forEach((slideData, index) => {
            const slide = pptx.addSlide();
            const layout = layouts[index % layouts.length];
            
            // Pozadie
            slide.background = { fill: layout.colors.bg };
            
            // Akcent panel vľavo
            slide.addShape(pptx.ShapeType.rect, {
                x: 0, y: 0, w: 0.15, h: 5.625,
                fill: { color: layout.colors.accent }
            });
            
            // Header box
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.3, y: 0.4, w: 9.4, h: 0.9,
                fill: { color: layout.colors.accent, transparency: 15 }
            });
            
            // Nadpis s číslom slajdu
            slide.addText([
                { text: `${index + 1}  `, options: { fontSize: 32, bold: true, color: layout.colors.accent } },
                { text: slideData.title, options: { fontSize: 32, bold: true, color: layout.colors.text } }
            ], {
                x: 0.5, y: 0.5, w: 9, h: 0.7,
                valign: 'middle'
            });
            
            // Obsah podľa layoutu
            if (layout.type === 'twoColumn' && Array.isArray(slideData.content)) {
                const half = Math.ceil(slideData.content.length / 2);
                const col1 = slideData.content.slice(0, half);
                const col2 = slideData.content.slice(half);
                
                // Ľavý stĺpec
                col1.forEach((item, i) => {
                    slide.addShape(pptx.ShapeType.rect, {
                        x: 0.5, y: 1.8 + (i * 0.6), w: 0.08, h: 0.08,
                        fill: { color: layout.colors.accent }
                    });
                    slide.addText(item, {
                        x: 0.7, y: 1.75 + (i * 0.6), w: 4, h: 0.5,
                        fontSize: 16, color: layout.colors.text
                    });
                });
                
                // Pravý stĺpec
                col2.forEach((item, i) => {
                    slide.addShape(pptx.ShapeType.rect, {
                        x: 5.2, y: 1.8 + (i * 0.6), w: 0.08, h: 0.08,
                        fill: { color: layout.colors.accent }
                    });
                    slide.addText(item, {
                        x: 5.4, y: 1.75 + (i * 0.6), w: 4, h: 0.5,
                        fontSize: 16, color: layout.colors.text
                    });
                });
            } else if (Array.isArray(slideData.content)) {
                // Štandardné odrážky s ikonami
                slideData.content.forEach((item, i) => {
                    // Icon box
                    slide.addShape(pptx.ShapeType.rect, {
                        x: 0.5, y: 1.8 + (i * 0.7), w: 0.4, h: 0.4,
                        fill: { color: layout.colors.accent },
                        line: { type: 'none' }
                    });
                    
                    // Číslo v icone
                    slide.addText(`${i + 1}`, {
                        x: 0.5, y: 1.8 + (i * 0.7), w: 0.4, h: 0.4,
                        fontSize: 18, bold: true, color: 'FFFFFF',
                        align: 'center', valign: 'middle'
                    });
                    
                    // Text
                    slide.addText(item, {
                        x: 1.1, y: 1.85 + (i * 0.7), w: 8.3, h: 0.6,
                        fontSize: 18, color: layout.colors.text,
                        lineSpacing: 24
                    });
                });
            }
            
            // Footer dekorácia
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.3, y: 5.3, w: 9.4, h: 0.02,
                fill: { color: layout.colors.accent, transparency: 50 }
            });
            
            slide.addText(`AI Studio  |  Slide ${index + 1}`, {
                x: 0.5, y: 5.1, w: 9, h: 0.3,
                fontSize: 10, color: layout.colors.accent,
                align: 'right', italic: true
            });
        });

        // === ZÁVEREČNÝ SLAJD (Call to Action) ===
        const finalSlide = pptx.addSlide();
        finalSlide.background = { 
            fill: {
                type: 'gradient',
                color1: '667eea',
                color2: '764ba2',
                dir: 'toBottom'
            }
        };
        
        // Veľký kruh v pozadí
        finalSlide.addShape(pptx.ShapeType.ellipse, {
            x: 2, y: -2, w: 6, h: 6,
            fill: { color: 'FFFFFF', transparency: 90 },
            line: { type: 'none' }
        });
        
        finalSlide.addText('Ďakujem za pozornosť!', {
            x: 0.5, y: 2, w: 9, h: 1,
            fontSize: 48, bold: true, color: 'FFFFFF',
            align: 'center',
            shadow: { type: 'outer', blur: 10, offset: 4, angle: 45, color: '000000', opacity: 0.4 }
        });
        
        finalSlide.addShape(pptx.ShapeType.rect, {
            x: 3.5, y: 3.5, w: 3, h: 0.05,
            fill: { color: 'FFFFFF' }
        });
        
        finalSlide.addText('Vytvorené pomocou AI Studio', {
            x: 0.5, y: 4, w: 9, h: 0.5,
            fontSize: 16, color: 'E0E0E0',
            align: 'center', italic: true
        });

        // Vygeneruj PPTX
        const fileName = `prezentacia-${Date.now()}.pptx`;
        const buffer = await pptx.write({ outputType: 'nodebuffer' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(buffer);

    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
});

app.post('/api/generate-pdf', async (req, res) => {
    try {
        if (!isValidApiKey(OPENAI_API_KEY)) {
            return res.status(400).json({ 
                error: { message: '⚠️ Nastavte API kľúč! Pre lokálne použitie: server.js riadok 13. Pre Render: Environment Variables → OPENAI_API_KEY' } 
            });
        }

        // Získame obsah od AI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Si expert na vytváranie dokumentov. Vytvor obsah pre PDF dokument na základe požiadavky. Vráť JSON v tomto formáte:\n{"title": "Názov dokumentu", "subtitle": "Podnadpis", "sections": [{"heading": "Nadpis sekcie", "content": "Text obsahu", "items": ["Bod 1", "Bod 2"]}]}\n\nVRÁŤ IBA VALIDNÝ JSON!'
                    },
                    {
                        role: 'user',
                        content: 'Vytvor PDF dokument: ' + req.body.request
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API Error');
        }

        // Parsuj JSON odpoveď
        let pdfData;
        try {
            let jsonText = data.choices[0].message.content.trim();
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            pdfData = JSON.parse(jsonText);
        } catch (e) {
            throw new Error('AI nevrátila validný formát dokumentu.');
        }

        // Vytvor PDF dokument
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunks.push.bind(chunks));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="dokument-${Date.now()}.pdf"`);
            res.send(pdfBuffer);
        });

        // === HEADER ===
        doc.rect(0, 0, doc.page.width, 100).fill('#667eea');
        doc.fillColor('#FFFFFF')
           .fontSize(28)
           .font('Helvetica-Bold')
           .text(pdfData.title || 'Dokument', 50, 35, { align: 'center' });
        
        if (pdfData.subtitle) {
            doc.fontSize(14)
               .font('Helvetica')
               .text(pdfData.subtitle, 50, 70, { align: 'center' });
        }

        // === OBSAH ===
        let y = 150;

        if (pdfData.sections && Array.isArray(pdfData.sections)) {
            pdfData.sections.forEach((section, index) => {
                // Kontrola stránky
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }

                // Nadpis sekcie
                doc.fillColor('#667eea')
                   .fontSize(18)
                   .font('Helvetica-Bold')
                   .text(section.heading || `Sekcia ${index + 1}`, 50, y);
                y += 30;

                // Dekoratívna čiara
                doc.moveTo(50, y).lineTo(550, y).stroke('#667eea');
                y += 20;

                // Obsah
                if (section.content) {
                    doc.fillColor('#000000')
                       .fontSize(12)
                       .font('Helvetica')
                       .text(section.content, 50, y, { width: 500, align: 'justify' });
                    y += doc.heightOfString(section.content, { width: 500 }) + 20;
                }

                // Zoznam položiek
                if (section.items && Array.isArray(section.items)) {
                    section.items.forEach(item => {
                        if (y > 720) {
                            doc.addPage();
                            y = 50;
                        }
                        
                        doc.fillColor('#667eea')
                           .circle(58, y + 5, 3)
                           .fill();
                        
                        doc.fillColor('#000000')
                           .fontSize(11)
                           .font('Helvetica')
                           .text(item, 70, y, { width: 480 });
                        y += doc.heightOfString(item, { width: 480 }) + 8;
                    });
                }

                y += 20;
            });
        }

        // === FOOTER ===
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.fillColor('#999999')
               .fontSize(9)
               .text(`Strana ${i + 1} z ${pages.count}`, 50, doc.page.height - 50, {
                   align: 'center'
               });
            doc.text('Vytvorené pomocou AI Studio', 50, doc.page.height - 35, {
                align: 'center'
            });
        }

        doc.end();

    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
});

app.listen(PORT, () => {
    console.log(`\n✅ Server beží na http://localhost:${PORT}`);
    console.log(`📂 Otvorte http://localhost:${PORT}/index.html v prehliadači\n`);
});

