:root {
    --bg-body: #0f1115;
    --bg-panel: #161b22;
    --bg-header: rgba(22, 27, 34, 0.8);
    --text-main: #e6edf3;
    --text-muted: #8b949e;
    --accent: #2f81f7;
    --accent-hover: #58a6ff;
    --border: #30363d;
    --code-bg: #0d1117;
    --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

[data-theme="light"] {
    --bg-body: #ffffff;
    --bg-panel: #f6f8fa;
    --bg-header: rgba(255, 255, 255, 0.8);
    --text-main: #24292f;
    --text-muted: #57606a;
    --accent: #0969da;
    --accent-hover: #218bff;
    --border: #d0d7de;
    --code-bg: #f6f8fa;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-body); color: var(--text-main); font-family: var(--font-main); line-height: 1.6; transition: background 0.3s, color 0.3s; }
a { color: var(--accent); text-decoration: none; transition: 0.2s; }
a:hover { color: var(--accent-hover); }

/* Layout */
.wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; flex-direction: column; min-height: 100vh; }
header { position: sticky; top: 0; z-index: 100; background: var(--bg-header); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); padding: 15px 0; margin-bottom: 40px; }
.header-inner { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.2rem; color: var(--text-main); }
.brand img { height: 32px; width: 32px; border-radius: 6px; }

/* Controls */
.nav-controls { display: flex; gap: 15px; align-items: center; }
.theme-toggle, .lang-select { background: transparent; border: 1px solid var(--border); color: var(--text-main); padding: 5px 10px; border-radius: 6px; cursor: pointer; font-family: inherit; }
.theme-toggle:hover { border-color: var(--text-muted); }

/* Hero */
.hero { text-align: center; padding: 60px 0; }
.hero h1 { font-size: 3rem; margin-bottom: 10px; background: linear-gradient(45deg, var(--accent), #a371f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero p { color: var(--text-muted); font-size: 1.2rem; max-width: 600px; margin: 0 auto; }

/* Grid */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 60px; }
.card { background: var(--bg-panel); border: 1px solid var(--border); border-radius: 8px; padding: 20px; transition: transform 0.2s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-2px); border-color: var(--accent); }
.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; background: rgba(110, 118, 129, 0.4); color: var(--text-main); font-weight: 600; }
.badge.beta { background: rgba(231, 174, 55, 0.2); color: #d29922; }
.badge.release { background: rgba(56, 139, 253, 0.2); color: #58a6ff; }
.card h3 { margin-bottom: 5px; }
.stats { display: flex; gap: 15px; font-size: 0.85rem; color: var(--text-muted); margin-top: auto; padding-top: 15px; }

/* Documentation Layout */
.docs-layout { display: grid; grid-template-columns: 250px 1fr; gap: 40px; }
.sidebar { position: sticky; top: 80px; height: calc(100vh - 100px); overflow-y: auto; border-right: 1px solid var(--border); padding-right: 20px; }
.sidebar ul { list-style: none; }
.sidebar li { margin-bottom: 5px; }
.sidebar a { display: block; padding: 5px 10px; color: var(--text-muted); border-radius: 4px; }
.sidebar a:hover, .sidebar a.active { background: rgba(110, 118, 129, 0.1); color: var(--accent); }
.sidebar h4 { margin: 20px 0 10px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-main); }

/* Content */
article { max-width: 800px; }
article h2 { margin: 40px 0 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
article p { margin-bottom: 15px; color: var(--text-muted); }
.code-block { position: relative; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 6px; margin: 20px 0; overflow: hidden; }
.code-header { display: flex; justify-content: space-between; padding: 8px 15px; background: var(--code-bg); border-bottom: 1px solid var(--border); font-size: 0.8rem; color: var(--text-muted); }
pre { padding: 15px; overflow-x: auto; font-family: var(--font-mono); font-size: 0.9rem; }
.copy-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.copy-btn:hover { color: var(--accent); }

/* Generator */
.dependency-gen { background: var(--bg-panel); border: 1px solid var(--border); padding: 20px; border-radius: 8px; margin-bottom: 30px; }
.gen-controls { display: flex; gap: 10px; margin-bottom: 15px; }
.gen-select { background: var(--bg-body); border: 1px solid var(--border); color: var(--text-main); padding: 8px; border-radius: 4px; font-family: inherit; }

footer { margin-top: auto; padding: 40px 0; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); }
.socials { display: flex; justify-content: center; gap: 20px; margin-top: 10px; }
.socials a { color: var(--text-muted); font-size: 1.5rem; }

@media (max-width: 768px) {
    .docs-layout { grid-template-columns: 1fr; }
    .sidebar { display: none; } /* Mobile menu needed logic later */
}
