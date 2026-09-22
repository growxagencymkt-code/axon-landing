import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use('/axon', express.static(path.join(__dirname, 'axon'), { maxAge: '7d' }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '7d' }));
app.use('/logos', express.static(path.join(__dirname, 'logos'), { maxAge: '7d' }));
app.use('/fonts', express.static(path.join(__dirname, 'fonts'), { maxAge: '7d' }));
app.use('/vendor', express.static(path.join(__dirname, 'vendor'), { maxAge: '7d' }));

app.get(['/health', '/healthz'], (_req, res) => res.status(200).send('ok'));
app.get(['/app', '/app/*'], (req, res) => {
  const appBase = process.env.AXON_APP_URL || 'https://app.axon.growxagency.info';
  const targetPath = req.originalUrl.replace(/^\/app/, '');
  res.redirect(302, appBase + targetPath);
});
app.get(['/axon', '/axon/'], (_req, res) => res.redirect(301, '/'));
app.get(['/afiliados', '/afiliados.html'], (_req, res) => res.sendFile(path.join(__dirname, 'afiliados.html')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => {
  console.log('AXON landing listening on ' + port);
});
