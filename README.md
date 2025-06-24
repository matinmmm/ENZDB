# Material Database 3D Plot Application

This project is a full-stack web application built with **Node.js/Express** (backend) and **Vue 3 + Vite** (frontend). It loads an Excel sheet of optical properties for various materials and displays an interactive 3-D plot where:

* **X-axis** – Wavelength (nm)
* **Y-axis** – Material name
* **Z-axis** – Metric selectable by the user (`n`, `k`, `Re_e`, `Im_e`, `Q`, `PL`, `Con`, `Q_PL`, `Q_con`)

`plotly.js` is used for rich 3-D visualisation.

## Project structure

```
.
├── server            # Express backend
│   ├── app.js        # Entry point
│   ├── package.json  # Backend dependencies
│   ├── routes/
│   │   └── data.js   # /api/data endpoint
│   └── services/
│       └── dataService.js # Excel loader
├── client            # Vue 3 frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json  # Frontend dependencies
│   └── src
│       ├── main.js
│       ├── App.vue
│       ├── services/api.js
│       └── components/Plot3D.vue
└── data.xlsx         # Your Excel data (add this file!)
```

## Prerequisites

* **Node.js ≥ 16**

## Getting started

1. **Clone** / copy the repository and place your Excel file as `data.xlsx` in the project root. Only the **first sheet** is read.

2. Install all dependencies (root and workspaces) in one go:

```bash
npm install       # installs root + server + client + concurrently
```

3. Start both dev servers concurrently:

```bash
npm run dev       # backend :3001, frontend :5173
```

4. Visit `http://localhost:5173` in your browser.

## Extending / scaling

* Add new endpoints in `server/routes` and supporting services in `server/services`.
* Front-end follows the Composition API; add new views and components under `client/src`.
* Vite proxy keeps the dev servers isolated; production builds can be served by the backend or any static host.

## License

MIT 