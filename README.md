
# OS Visualizer

> Visualize and interact with key Operating System concepts.

A web-based learning tool that helps undergraduate students “feel” how OS algorithms work by stepping through animations and adjusting inputs in real time.

⚠️ **Work in Progress** — core scheduling visuals are complete; memory management, deadlock handling, and file‑system modules coming soon!

---

## 🚀 Live Demo

[https://osvisualizer.netlify.app/](https://osvisualizer.netlify.app/)

---

## ✨ Features

### ✅ Implemented

* **Introduction module**: overview of OS fundamentals
* **CPU Scheduling visualizations**

  * FCFS
  * Non‑preemptive SJF
  * Preemptive SJF
  * Round‑Robin
* Interactive timeline: step forward/backward through scheduling decisions
* Adjustable inputs: process burst times & arrival times

### 🚧 Planned

* **Memory management** (paging, segmentation)
* **Deadlock handling** (resource‑allocation graph, detection & recovery)
* **File system operations** (create/delete files, block allocation)

---

## 🛠️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Plain CSS (modular CSS files)
* **Deployment:** Netlify

---

## 🏁 Getting Started

### Prerequisites

* Node.js ≥ 14
* npm ≥ 6

### Installation & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/SANKETH-CHANDRA-SHETTY/osvisualizer.git

# 2. Change directory
cd osvisualizer

# 3. Install dependencies
npm install
npm install react-router-dom


# 4. Start the development server (Vite)
npm run dev
```

Open your browser at `http://localhost:5173` to view the app.

---

## 📂 Project Structure

```
osvisualizer/
├── public/                # Static assets & HTML template
├── src/
│   ├── assets/            # Images, icons, etc.        
│   ├── pages/             # Page‑level components or routes           
|   ├── App.css
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point (Vite)
├── .gitignore
├── package.json
├── ROADMAP.md             # Project roadmap (optional)
└── README.md
```

---

## 🤝 Contributing

Contributions are very welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "feat: add YourFeature"`)
4. Push branch (`git push origin feature/YourFeature`)
5. Open a Pull Request to `main`

Please open an issue first if you plan a large feature or major refactor.

---

## 📬 Contact

**Sanketh Chandra Shetty**
✉️ [shettysankethshetty1@gmail.com](mailto:shettysankethshetty1@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/sanketh-chandra-shetty/)
