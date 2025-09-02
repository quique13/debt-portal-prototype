
# Portal de Autogestión de Deuda (Demo React + Vite)

Demo para presentar a dirección: búsqueda por DPI/NIT, slider 1–12 con descuentos por cuota, cálculo de totales y **previsualización de Carta de Convenio**.

## Requisitos
- Node.js 18+
- npm (o pnpm/yarn)

## Ejecutar en local
```bash
npm install
npm run dev
```
Abre http://localhost:5173

## Descuentos por cuota
- 1 → 40% (máximo por defecto)
- 2 → 45%
- 3 → 40%
- 4 → 35%
- 5 → 30%
- 6 → 25%
- 7–12 → 0%

## Deploy rápido (Vercel)
1. Sube este proyecto a un repositorio en GitHub (o importa el ZIP en GitHub).
2. Entra a **Vercel** → Add New… → Project → Import from GitHub.
3. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
4. Deploy → te dará una URL pública para compartir con gerencia.

## Alternativas
- **Netlify**: arrastra la carpeta o conecta el repo.
- **GitHub Pages**: `npm run build` y publica `/dist` (requiere configuración adicional).
- **StackBlitz/CodeSandbox**: crea un proyecto “Vite + React” y pega los archivos (link público inmediato).
