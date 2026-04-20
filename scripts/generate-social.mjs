import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

// 1) Square 512x512 logo PNG (for JSON-LD Organization.logo)
const logoSvg = readFileSync(resolve(publicDir, 'favicon.svg'), 'utf-8');
const logo512 = new Resvg(logoSvg, {
  fitTo: { mode: 'width', value: 512 },
  background: '#0f1a2e',
}).render().asPng();
writeFileSync(resolve(publicDir, 'logo-512.png'), logo512);

// 2) Open Graph banner 1200x630 (LinkedIn / Facebook / Slack)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f1a2e"/>
      <stop offset="1" stop-color="#1a2b4a"/>
    </linearGradient>
    <linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6fe37e"/>
      <stop offset="1" stop-color="#3fb052"/>
    </linearGradient>
    <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9a7548"/>
      <stop offset="1" stop-color="#5e4528"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Grid dots -->
  <g fill="#2d4068" opacity="0.4">
    ${Array.from({ length: 30 }, (_, i) =>
      Array.from({ length: 16 }, (_, j) =>
        `<circle cx="${40 + i * 40}" cy="${40 + j * 40}" r="1.5"/>`
      ).join('')
    ).join('')}
  </g>

  <!-- Tree logo (left side, scaled) -->
  <g transform="translate(120, 175) scale(2.8)">
    <path d="M50 6 L14 70 Q10 76 18 76 L82 76 Q90 76 86 70 Z" fill="url(#leaf)" opacity="0.22"/>
    <g stroke="#4bbf5a" stroke-width="3" stroke-linecap="round" fill="none">
      <path d="M50 14 L28 42"/>
      <path d="M50 14 L72 42"/>
      <path d="M28 42 L18 68"/>
      <path d="M28 42 L40 68"/>
      <path d="M72 42 L60 68"/>
      <path d="M72 42 L82 68"/>
    </g>
    <circle cx="50" cy="14" r="8" fill="url(#leaf)"/>
    <circle cx="28" cy="42" r="6.5" fill="url(#leaf)"/>
    <circle cx="72" cy="42" r="6.5" fill="url(#leaf)"/>
    <circle cx="18" cy="68" r="5.5" fill="url(#leaf)"/>
    <circle cx="40" cy="68" r="5.5" fill="url(#leaf)"/>
    <circle cx="60" cy="68" r="5.5" fill="url(#leaf)"/>
    <circle cx="82" cy="68" r="5.5" fill="url(#leaf)"/>
    <rect x="44" y="72" width="12" height="22" rx="3" fill="url(#trunk)"/>
  </g>

  <!-- Text block (right side) -->
  <g font-family="Inter, Arial, sans-serif">
    <!-- Badge -->
    <rect x="500" y="140" width="380" height="34" rx="4" fill="#1a3050" stroke="#3fb052" stroke-width="1"/>
    <circle cx="520" cy="157" r="5" fill="#3fb052"/>
    <text x="536" y="163" font-size="15" font-weight="700" fill="#a2c9ff" letter-spacing="1.5">16 REAL-WORLD SCENARIOS</text>

    <!-- Brand -->
    <text x="500" y="240" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-1">TreeDap</text>

    <!-- Headline -->
    <text x="500" y="320" font-size="42" font-weight="700" fill="#ffffff" letter-spacing="-0.5">LDAP doesn't tell you</text>
    <text x="500" y="370" font-size="42" font-weight="700" fill="#ffffff" letter-spacing="-0.5">when you're <tspan fill="#6fe37e" font-style="italic">wrong.</tspan></text>

    <!-- Subtitle -->
    <text x="500" y="440" font-size="22" font-weight="500" fill="#a2c9ff">Hands-on troubleshooting for sysadmins,</text>
    <text x="500" y="470" font-size="22" font-weight="500" fill="#a2c9ff">IAM engineers &amp; security pros.</text>

    <!-- URL -->
    <text x="500" y="540" font-size="18" font-weight="600" fill="#6fe37e" letter-spacing="0.5">treedap.com</text>
  </g>
</svg>`;

const ogPng = new Resvg(ogSvg, { font: { loadSystemFonts: true } }).render().asPng();
writeFileSync(resolve(publicDir, 'og-image.png'), ogPng);

console.log('Generated:');
console.log('  - public/logo-512.png (512x512)');
console.log('  - public/og-image.png (1200x630)');
