---
layout: wiki
title: Structures & Loot
permalink: /cso/structures/
---

<div class="lang-en">
    <h1>Structures & Loot</h1>
    <p class="lead">Complete database with exact loot chances and spawn biomes.</p>
</div>
<div class="lang-ru">
    <h1>Структуры и Лут</h1>
    <p class="lead">Полная база данных с точными шансами лута и биомами спавна.</p>
</div>

<hr style="border:0; border-top:1px solid var(--border); margin:20px 0;">

<style>
    .struct-card { background: var(--bg-panel); border: 1px solid var(--border); border-radius: 8px; padding: 25px; margin-bottom: 30px; }
    .struct-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
    .struct-title { margin: 0; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; }
    .biome-tag { font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border); color: var(--text-muted); display: inline-block; margin: 2px; }
    
    .screenshot-placeholder {
        width: 100%; height: 200px; background: #0d1117; border: 2px dashed #30363d; border-radius: 6px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        color: #8b949e; margin: 20px 0; text-align: center; padding: 20px;
    }
    .loot-details { margin-top: 15px; }
    .loot-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .loot-table th { text-align: left; padding: 8px; color: var(--text-muted); border-bottom: 2px solid var(--border); }
    .loot-table td { padding: 8px; border-bottom: 1px solid var(--border); }
    
    .chance-high { color: #238636; font-weight: bold; }
    .chance-med { color: #e9967a; }
    .chance-low { color: #d2a8f9; font-weight: bold; }
    .chance-ultra { color: #ff5555; font-weight: bold; text-shadow: 0 0 5px rgba(255, 85, 85, 0.3); }
</style>

<h2 style="margin: 40px 0 20px; border-bottom: 2px solid #58a6ff; padding-bottom: 10px; display: inline-block;">Exploration</h2>

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

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. Send yours to: <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. Если есть красивый, отправьте на: <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Высокая наблюдательная вышка. Отличное место для старта.</p>
    <p class="lang-en">Tall observation tower. Great early game structure.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot (Лут)</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Create: Precision Mechanism</td><td class="chance-med">9.4%</td><td rowspan="5">3-4 Rolls</td></tr>
            <tr><td>Create: Brass Funnel</td><td class="chance-med">7.5%</td></tr>
            <tr><td>Create: Smart Chute</td><td class="chance-med">5.6%</td></tr>
            <tr><td>Create: Mechanical Arm</td><td class="chance-low">3.7%</td></tr>
            <tr><td>Minecraft: Totem of Undying</td><td class="chance-ultra">1.8%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-campground"></i> <span class="lang-en">Camp</span><span class="lang-ru">Лагерь</span></h3>
    </div>
    <div style="margin-bottom: 15px;"><span class="biome-tag">Plains</span></div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Небольшая стоянка путешественников.</p>
    <p class="lang-en">Small traveler's campsite.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Iron / Stone Axe</td><td class="chance-med">~36%</td><td rowspan="3">1-2 Rolls</td></tr>
            <tr><td>Cooked Beef / Bread</td><td class="chance-high">~59%</td></tr>
            <tr><td>Explorer Map</td><td class="chance-low">4.5%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-envelope"></i> <span class="lang-en">Post</span><span class="lang-ru">Почта</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Plains</span> <span class="biome-tag">Forest</span>
        <span class="biome-tag">Taiga</span> <span class="biome-tag">Savanna</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Небольшое почтовое отделение. Декоративная структура.</p>
    <p class="lang-en">Small post office. Decorative structure.</p>
</div>

<h2 style="margin: 40px 0 20px; border-bottom: 2px solid #238636; padding-bottom: 10px; display: inline-block;">Industrial</h2>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-fan"></i> <span class="lang-en">Windmills</span><span class="lang-ru">Мельницы</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Forest (Oak/Birch)</span> <span class="biome-tag">Taiga (Spruce)</span>
        <span class="biome-tag">Savanna (Acacia)</span> <span class="biome-tag">Plains</span>
        <span class="biome-tag">Cherry Grove</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Генерируют кинетическую энергию. Материал постройки зависит от биома.</p>
    
    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Create: Cogwheels</td><td class="chance-high">~30%</td><td rowspan="5">6-10 Rolls<br>+3 Bonus</td></tr>
            <tr><td>Create: Sail Frame</td><td class="chance-med">10%</td></tr>
            <tr><td>Create: Windmill Bearing</td><td class="chance-med">9.1%</td></tr>
            <tr><td>Create: White Sail</td><td class="chance-med">5%</td></tr>
            <tr><td>Netherite Hoe</td><td class="chance-ultra">0.5%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-leaf"></i> <span class="lang-en">Greenhouse</span><span class="lang-ru">Теплица</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Plains</span> <span class="biome-tag">Forest</span> <span class="biome-tag">Taiga</span>
        <span class="biome-tag">Savanna</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Стеклянная структура для выращивания растений. Бывает обычной, медной и искаженной.</p>
    
    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Tree Saplings (Various)</td><td class="chance-high">50%</td><td rowspan="3">2-4 Rolls</td></tr>
            <tr><td>Bone Meal</td><td class="chance-med">40%</td></tr>
            <tr><td>Copper Block</td><td class="chance-low">~10% (Copper Var.)</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-bolt"></i> <span class="lang-en">Lightning Tower</span><span class="lang-ru">Громоотвод</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">All Common Biomes</span> <span class="biome-tag">Windswept Hills</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Башня с большим медным шпилем и механизмами.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Create: Goggles (Очки)</td><td class="chance-low">6.2%</td><td rowspan="4">5-9 Rolls<br>+2 Bonus</td></tr>
            <tr><td>Create: Potato Cannon</td><td class="chance-low">3.1%</td></tr>
            <tr><td>Lightning Rod</td><td class="chance-med">5%</td></tr>
            <tr><td>Andesite Alloy / Shafts</td><td class="chance-high">~28%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-dungeon"></i> <span class="lang-en">Miner Hut</span><span class="lang-ru">Хижина Шахтера</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Windswept Hills</span> <span class="biome-tag">Plains</span> <span class="biome-tag">Meadow</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Вход в шахту, оборудованный механизмами.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Diamond / Emerald</td><td class="chance-low">3% each</td><td rowspan="2">1-3 Rolls</td></tr>
            <tr><td>Coal / Iron / Gold</td><td class="chance-high">High</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-boxes-stacked"></i> <span class="lang-en">Storage</span><span class="lang-ru">Склад</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Plains</span> <span class="biome-tag">Forest</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Заброшенный склад с ресурсами. Есть вариант из Меди.</p>
    <p class="lang-en">Abandoned resource storage. Has a Copper variant.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Copper Ingot</td><td class="chance-high">~40%</td><td rowspan="3">2-5 Rolls</td></tr>
            <tr><td>Create: Andesite Alloy</td><td class="chance-med">25%</td></tr>
            <tr><td>Iron Nugget</td><td class="chance-high">35%</td></tr>
        </table>
    </details>
</div>

<h2 style="margin: 40px 0 20px; border-bottom: 2px solid #d73a49; padding-bottom: 10px; display: inline-block;">Dangerous</h2>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-ghost"></i> <span class="lang-en">Spooky House</span><span class="lang-ru">Жуткий дом</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Dark Forest</span> <span class="biome-tag">Taiga</span>
        <span class="biome-tag">Savanna Plateau</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Заброшенный дом с паутиной. Варианты: 1, 2, Dark.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Echo Shard</td><td class="chance-med">12%</td><td rowspan="3">3-7 Rolls</td></tr>
            <tr><td>Create: Precision Mechanism</td><td class="chance-low">8%</td></tr>
            <tr><td>Music Disc 13</td><td class="chance-low">4.8%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-wheat-awn-circle-exclamation"></i> <span class="lang-en">Spooky Farm</span><span class="lang-ru">Жуткая ферма</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Plains</span> <span class="biome-tag">Swamp</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Заброшенная ферма с пугалом.</p>
    <p class="lang-en">Abandoned farm with a scarecrow.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th></tr>
            <tr><td>Pumpkin Pie</td><td class="chance-high">High</td></tr>
            <tr><td>Rotten Flesh</td><td class="chance-high">High</td></tr>
            <tr><td>Carved Pumpkin</td><td class="chance-med">Medium</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-skull"></i> <span class="lang-en">Graveyard</span><span class="lang-ru">Кладбище</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Swamp</span> <span class="biome-tag">Dark Forest</span>
        <span class="biome-tag">Plains</span> <span class="biome-tag">Taiga</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Место упокоения. Содержит структуру Graveyard Down (склеп).</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Create: Precision Mechanism</td><td class="chance-med">8.7%</td><td rowspan="3">4-7 Rolls</td></tr>
            <tr><td>Minecraft: Totem of Undying</td><td class="chance-low">2.2%</td></tr>
            <tr><td>Create: Mechanical Arm</td><td class="chance-low">2.2%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-brands fa-fort-awesome"></i> <span class="lang-en">Nether Outpost</span><span class="lang-ru">Адский Пост</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Savanna</span> <span class="biome-tag">Windswept Hills</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Опасный аванпост, содержащий ресурсы Незера в обычном мире.</p>

    <details class="loot-details">
        <summary class="btn" style="width:100%; text-align:left;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th><th>Rolls</th></tr>
            <tr><td>Create: Mechanical Press</td><td class="chance-ultra">0.8%</td><td rowspan="4">3-6 Rolls</td></tr>
            <tr><td>Create: Copper Sheet</td><td class="chance-low">3.1%</td></tr>
            <tr><td>Blaze Powder</td><td class="chance-med">4.7%</td></tr>
            <tr><td>Nether Wart / Soul Sand</td><td class="chance-med">~4%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-door-open"></i> <span class="lang-en">Crimson Portal</span><span class="lang-ru">Багровый Портал</span></h3>
    </div>
    <div style="margin-bottom: 15px;">
        <span class="biome-tag">Badlands</span> <span class="biome-tag">Desert</span>
        <span class="biome-tag">Swamp</span> <span class="biome-tag">Dark Forest</span>
    </div>

    <div class="screenshot-placeholder">
        <i class="fa-regular fa-image" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <div class="lang-en">Screenshot missing. <br><code>denmoth8871top@gmail.com</code></div>
        <div class="lang-ru">Скриншот отсутствует. <br><code>denmoth8871top@gmail.com</code></div>
    </div>

    <p class="lang-ru">Разрушенный портал в стиле Багрового леса. Содержит золото и обсидиан.</p>
    <p class="lang-en">Ruined portal in Crimson Forest style.</p>
</div>
