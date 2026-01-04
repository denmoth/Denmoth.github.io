---
layout: wiki
title: Structures & Loot
permalink: /cso/structures/
---

<div class="lang-en">
    <h1>Structures & Loot</h1>
    <p class="lead">Complete database with calculated probabilities based on game files (v1.4.0).</p>
</div>
<div class="lang-ru">
    <h1>Структуры и Лут</h1>
    <p class="lead">Полная база данных с рассчитанными вероятностями на основе файлов игры (v1.4.0).</p>
</div>

<hr style="border:0; border-top:1px solid var(--border); margin:20px 0;">

<style>
    .struct-card { background: var(--bg-panel); border: 1px solid var(--border); border-radius: 12px; padding: 30px; margin-bottom: 30px; position: relative; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .struct-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .struct-title { margin: 0; font-size: 1.6rem; display: flex; align-items: center; gap: 12px; font-weight: 700; }
    .biome-tag { font-size: 0.75rem; background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border); color: var(--text-muted); display: inline-block; margin: 0 4px 4px 0; font-family: var(--font-mono); }
    
    .screenshot-placeholder {
        width: 100%; height: 220px; background: #0d1117; border: 2px dashed #30363d; border-radius: 8px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        color: #8b949e; margin: 25px 0; text-align: center; padding: 20px; transition: 0.2s;
    }
    .screenshot-placeholder:hover { border-color: var(--text-muted); }
    
    .loot-details { margin-top: 20px; }
    .loot-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; border-radius: 8px; overflow: hidden; }
    .loot-table th { text-align: left; padding: 12px; background: rgba(255,255,255,0.03); color: var(--text-muted); border-bottom: 2px solid var(--border); }
    .loot-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
    .loot-table tr:last-child td { border-bottom: none; }
    
    .chance-val { font-family: var(--font-mono); font-weight: 600; }
    .chance-high { color: #238636; }
    .chance-med { color: #e9967a; }
    .chance-low { color: #d2a8f9; }
    .chance-ultra { color: #ff5555; text-shadow: 0 0 10px rgba(255, 85, 85, 0.2); }
</style>

<h2 style="margin: 50px 0 25px; border-left: 4px solid #58a6ff; padding-left: 15px;">Exploration</h2>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-tower-observation"></i> <span class="lang-en">Tower</span><span class="lang-ru">Башня</span></h3>
    </div>
    
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Dark Forest</span>
        <span class="biome-tag">Swamp</span>
        <span class="biome-tag">Old Growth Spruce Taiga</span>
        <span class="biome-tag">Flower Forest</span>
    </div>

    <p class="lang-ru">Высокая наблюдательная вышка. Генерируется в густых лесах и болотах.</p>
    <p class="lang-en">Tall observation tower found in dense forests and swamps.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Loot Table (Exact)</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance per Roll</th><th>Rolls</th></tr>
            <tr><td>Create: Precision Mechanism</td><td class="chance-med chance-val">9.43%</td><td rowspan="6">3 - 4</td></tr>
            <tr><td>Create: Brass Funnel</td><td class="chance-med chance-val">7.54%</td></tr>
            <tr><td>Create: Smart Chute</td><td class="chance-low chance-val">5.66%</td></tr>
            <tr><td>Create: Mechanical Arm</td><td class="chance-low chance-val">3.77%</td></tr>
            <tr><td>Minecraft: Totem of Undying</td><td class="chance-ultra chance-val">1.88%</td></tr>
            <tr><td>Minecraft: Ender Pearl</td><td class="chance-med chance-val">9.43%</td></tr>
        </table>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">*Calculated based on total weight of 53 in Pool 1.</p>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-campground"></i> <span class="lang-en">Camp</span><span class="lang-ru">Лагерь</span></h3>
    </div>
    <div style="margin-bottom: 15px;"><span class="biome-tag">Plains</span></div>

    <p class="lang-ru">Небольшая стоянка путешественников.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Loot Table</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Bread</td><td class="chance-high chance-val">36.3%</td><td rowspan="4">1 - 2</td></tr>
            <tr><td>Cooked Beef</td><td class="chance-high chance-val">22.7%</td></tr>
            <tr><td>Stone Axe</td><td class="chance-med chance-val">22.7%</td></tr>
            <tr><td>Explorer Map</td><td class="chance-low chance-val">4.5%</td></tr>
        </table>
    </details>
</div>

<h2 style="margin: 50px 0 25px; border-left: 4px solid #238636; padding-left: 15px;">Industrial</h2>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-fan"></i> <span class="lang-en">Windmills</span><span class="lang-ru">Мельницы</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Oak</span> <span class="biome-tag">Birch</span>
        <span class="biome-tag">Spruce</span> <span class="biome-tag">Acacia</span>
        <span class="biome-tag">Cherry</span>
    </div>

    <p class="lang-ru">Основной источник кинетических компонентов. Содержит сундук под лестницей.</p>
    
    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Loot Table (Spruce Variant)</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance per Roll</th><th>Rolls</th></tr>
            <tr><td>Create: Cogwheel</td><td class="chance-high chance-val">17.76%</td><td rowspan="6">6 - 10<br>(+3 Bonus)</td></tr>
            <tr><td>Create: Large Cogwheel</td><td class="chance-med chance-val">12.69%</td></tr>
            <tr><td>Create: Sail Frame</td><td class="chance-med chance-val">10.15%</td></tr>
            <tr><td>Create: Windmill Bearing</td><td class="chance-med chance-val">9.13%</td></tr>
            <tr><td>Create: White Sail</td><td class="chance-low chance-val">5.07%</td></tr>
            <tr><td>Netherite Hoe (Damaged)</td><td class="chance-ultra chance-val">0.50%</td></tr>
        </table>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">*Probabilities derived from total weight 197.</p>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-bolt"></i> <span class="lang-en">Lightning Tower</span><span class="lang-ru">Громоотвод</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">All Common Biomes</span> <span class="biome-tag">Windswept Hills</span>
    </div>

    <p class="lang-ru">Башня с большим медным шпилем. Хороший источник меди и сплавов.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Loot Table</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Andesite Alloy</td><td class="chance-high chance-val">15.6%</td><td rowspan="5">5 - 9<br>(+2 Bonus)</td></tr>
            <tr><td>Create: Shaft</td><td class="chance-high chance-val">12.5%</td></tr>
            <tr><td>Create: Goggles</td><td class="chance-low chance-val">6.25%</td></tr>
            <tr><td>Lightning Rod</td><td class="chance-low chance-val">5.00%</td></tr>
            <tr><td>Potato Cannon</td><td class="chance-ultra chance-val">3.12%</td></tr>
        </table>
    </details>
</div>

<h2 style="margin: 50px 0 25px; border-left: 4px solid #d73a49; padding-left: 15px;">Dangerous</h2>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-ghost"></i> <span class="lang-en">Spooky House</span><span class="lang-ru">Жуткий дом</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Dark Forest</span> <span class="biome-tag">Taiga</span>
    </div>

    <p class="lang-ru">Заброшенный дом. Охраняется монстрами.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Loot Table (Var 1)</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Enchanted Book</td><td class="chance-high chance-val">36%</td><td rowspan="4">3 - 7</td></tr>
            <tr><td>Echo Shard</td><td class="chance-low chance-val">12%</td></tr>
            <tr><td>Precision Mechanism</td><td class="chance-low chance-val">8%</td></tr>
            <tr><td>Smart Chute</td><td class="chance-low chance-val">8%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-skull"></i> <span class="lang-en">Graveyard</span><span class="lang-ru">Кладбище</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Swamp</span> <span class="biome-tag">Dark Forest</span>
    </div>

    <p class="lang-ru">Место упокоения. Содержит структуру Graveyard Down (склеп) с ценным лутом.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Loot Table</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Experience Bottle</td><td class="chance-high chance-val">32.6%</td><td rowspan="4">4 - 7</td></tr>
            <tr><td>Ender Pearl</td><td class="chance-high chance-val">32.6%</td></tr>
            <tr><td>Precision Mechanism</td><td class="chance-med chance-val">8.69%</td></tr>
            <tr><td>Totem of Undying</td><td class="chance-ultra chance-val">2.17%</td></tr>
        </table>
    </details>
</div>
