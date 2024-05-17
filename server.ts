import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import helmet from 'helmet';
import { connect } from 'node:http2';

type SourceList = string[];
function getTrustedSources(): SourceList {
  // Example trusted sources, normally this could be dynamic or from a config file
  return ['https://trustedcdn.com', 'https://api.trustedsource.org'];
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}
export default function contentSecurityPolicy(nonce:any){
  const trustedSources = getTrustedSources();

  return helmet.contentSecurityPolicy({
    directives:{
      defaultSrc:[...trustedSources],
      styleSrc:[
        `'nonce-${nonce}'`,
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
        ...trustedSources
      ],
      scriptSrc:[
        `'nonce-${nonce}`,
        'https://cdn.jsdelivr.net',
        ...trustedSources
      ],
      scriptSrcElem:[
        `'nonce-${nonce}'`,
        'https://cdn.jsdelivr.net',
        'https://kit.fontawesome.com',
        ...trustedSources
      ],
      fontSrc:[
        `'nonce-${nonce}'`,
        'https://cdn.jsdelivr.net',
        'https://ka-f.fontawesome.com',
        ...trustedSources
      ],
      connectSrc:[
        `'nonce-${nonce}'`,
        'https://identitytoolkit.googleapis.com',
        'https://ka-f.fontawesome.com',
        'https://fakestoreapi.com/products/',
        ...trustedSources
      ]
    }
  })
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
