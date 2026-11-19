# Speculari Ótica — site

Next.js 16 + React 19 + TypeScript. Sem dependências além do Next.

## Rodar local
```
npm install
npm run dev
```
Abra http://localhost:3000

## Publicar na Vercel
```
npx vercel --prod
```

## Onde editar
- `lib/site.ts` — número do WhatsApp e Instagram
- `lib/catalog.ts` — categorias e modelos da coleção (fotos em `public/img`)
- `components/Sections.tsx` — textos das seções
- `components/LensScene.tsx` — cena da armação (a animação fica em `components/Effects.tsx`)
- `app/globals.css` — cores e estilos
