// Ejemplo de backend con Puppeteer para generar PDFs con texto seleccionable
// Este archivo es solo un ejemplo - necesitarías crear un servidor Node.js separado

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));

app.post('/generate-pdf', async (req, res) => {
  try {
    const { html, filename } = req.body;
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    });
    
    await browser.close();
    
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF' });
  }
});

app.listen(port, () => {
  console.log(`Servidor PDF escuchando en http://localhost:${port}`);
});




