# Trade Machine

A fullstack application for simulating and managing sports trades, featuring three frontend displays.

---

## Tech Stack

- **Backend:** FastAPI, Flask, SQLite3
- **Frontend:** React, Vue.js, Vanilla JS

---

## Features

- View, create, update, and delete teams and players
- Simulate trades between teams
- RESTful API with FastAPI
- Three frontend implementations (React, Vue, Vanilla JS)
- CORS enabled for frontend-backend integration

---

## Frontend Previews

<p align="center">
  <img src="react.png" alt="React Frontend" width="400"/>
</p>
<p align="center">
  <img src="vue.png" alt="Vue Frontend" width="200"/>
  <img src="vanilla.png" alt="Vanilla JS Frontend" width="200"/>
</p>

---

## Getting Started

### Backend

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn flask sqlite3
   ```
2. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

#### React Frontend (`/frontend`)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
   The app will run on [http://localhost:3000](http://localhost:3000) by default.

#### Vue Frontend (`/frontend-vue`)

1. **Install dependencies:**
   ```bash
   cd frontend-vue
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run on [http://localhost:8080](http://localhost:8080) by default.

#### Vanilla JS Frontend (`/frontend-vanilla`)

1. **Serve the static files using a simple HTTP server.**  
   You can use Python (built-in), Node.js, or VS Code Live Server.

   **Using Python 3:**
   ```bash
   cd frontend-vanilla
   python3 -m http.server 5500
   ```
   Then open [http://localhost:5500](http://localhost:5500) in your browser.

   **Or using Node.js http-server:**
   ```bash
   npm install -g http-server
   cd frontend-vanilla
   http-server -p 5500
   ```
   Then open [http://localhost:5500](http://localhost:5500) in your browser.

   **Or with VS Code Live Server:**
   - Open the `frontend-vanilla` folder in VS Code.
   - Right-click `index.html` and select **"Open with Live Server"**.

---

## Project Structure

```
trade-machine/
├── main.py
├── models.py
├── db/
│   ├── db.py
│   └── nfl_players.sql
├── react.png
├── vue.png
├── vanilla.png
├── README.md
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── frontend-vue/
│   ├── package.json
│   ├── public/
│   └── src/
├── frontend-vanilla/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── ...
```

---

## License

MIT License

---

## Author

Drew [@ajtw7]