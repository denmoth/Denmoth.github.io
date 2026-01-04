---
layout: wiki
title: Structures & Loot
permalink: /cso/structures/
---

<div class="lang-en">
    <h1>Structures & Loot</h1>
    <p class="lead">Complete database of all world generation features added by the mod.</p>
</div>
<div class="lang-ru">
    <h1>Структуры и Лут</h1>
    <p class="lead">Полная база данных всех генерируемых структур мода.</p>
</div>

<hr style="border:0; border-top:1px solid var(--border); margin:20px 0;">

<style>
    .struct-card {
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        transition: 0.2s;
    }
    .struct-card:hover { border-color: #58a6ff; }
    .struct-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .struct-title { margin: 0; font-size: 1.2rem; }
    .loot-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.9rem; }
    .loot-table th { text-align: left; color: var(--text-muted); padding: 5px; border-bottom: 1px solid var(--border); }
    .loot-table td { padding: 8px 5px; border-bottom: 1px solid var(--border); }
    .loot-table tr:last-child td { border-bottom: none; }
    
    /* Цвета редкости */
    .rare { color: #d2a8f9; font-weight: bold; }
    .uncommon { color: #58a6ff; }
</style>

<h3 id="exploration" style="margin: 40px 0 20px; color: var(--text-muted);">Exploration (Исследование)</h3>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-tower-observation"></i> Tower (Башня)</h3>
        <span class="badge">Forests / Swamp</span>
    </div>
    <p class="lang-ru">Высокая наблюдательная вышка. Отличное место для поиска начальных механизмов.</p>
    
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot (Лут)</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th></tr>
            <tr><td class="rare">Precision Mechanism</td><td>~10%</td></tr>
            <tr><td class="uncommon">Brass Funnel</td><td>~15%</td></tr>
            <tr><td>Create: Smart Chute</td><td>~12%</td></tr>
            <tr><td>Create: Cogwheels</td><td>Common</td></tr>
            <tr><td>Enchanted Book</td><td>25%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-tents"></i> Camp (Лагерь)</h3>
        <span class="badge">Plains / Taiga</span>
    </div>
    <p class="lang-ru">Небольшая стоянка путешественников.</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td>Andesite Alloy</td><td>30%</td></tr>
            <tr><td>Bread / Apple</td><td>50%</td></tr>
            <tr><td>Torches</td><td>100%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-sign-hanging"></i> Post (Указатель)</h3>
        <span class="badge">Roads</span>
    </div>
    <p class="lang-ru">Декоративный дорожный указатель. Без лута.</p>
</div>

<h3 id="industrial" style="margin: 40px 0 20px; color: var(--text-muted);">Industrial (Индустриальные)</h3>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-fan"></i> Windmills (Мельницы)</h3>
        <span class="badge">Overworld</span>
    </div>
    <p class="lang-ru">Генерируют кинетическую энергию. Материал зависит от биома (Дуб, Ель, Береза, Акация, Вишня).</p>
    
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><th>Item</th><th>Chance</th></tr>
            <tr><td>White Sail (Парус)</td><td>~40%</td></tr>
            <tr><td class="uncommon">Windmill Bearing</td><td>~15%</td></tr>
            <tr><td>Shaft</td><td>50%</td></tr>
            <tr><td>Wheat Seeds</td><td>80%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-leaf"></i> Greenhouse (Теплица)</h3>
        <span class="badge">Forests</span>
    </div>
    <p class="lang-ru">Стеклянная структура с растениями. Бывает обычной, медной (Copper) и искаженной (Warped).</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td>Saplings (Various)</td><td>50%</td></tr>
            <tr><td>Bone Meal</td><td>40%</td></tr>
            <tr><td class="uncommon">Copper Block (Copper Var.)</td><td>20%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-bolt"></i> Lightning Tower (Громоотвод)</h3>
        <span class="badge">Mountains</span>
    </div>
    <p class="lang-ru">Башня с большим медным шпилем.</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td>Lightning Rod</td><td>100% (Block)</td></tr>
            <tr><td>Copper Ingot</td><td>40%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-dungeon"></i> Miner Hut (Хижина Шахтера)</h3>
        <span class="badge">Underground / Mountains</span>
    </div>
    <p class="lang-ru">Вход в шахту с механизмами.</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td class="uncommon">Create: Drill</td><td>5%</td></tr>
            <tr><td>Iron / Gold Ore</td><td>40%</td></tr>
            <tr><td>Raw Zinc</td><td>30%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-boxes-stacked"></i> Storage (Склад)</h3>
        <span class="badge">Plains</span>
    </div>
    <p class="lang-ru">Небольшой склад с ресурсами. Есть медная версия.</p>
</div>

<h3 id="spooky" style="margin: 40px 0 20px; color: var(--text-muted);">Spooky & Dangerous (Опасные)</h3>

<div class="struct-card" style="border-left: 3px solid #d73a49;">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-ghost"></i> Spooky House (Жуткий дом)</h3>
        <span class="badge">Dark Forest</span>
    </div>
    <p class="lang-ru">Заброшенный дом с паутиной. Варианты: 1, 2, Dark.</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td class="rare">Music Disc 13</td><td>~2%</td></tr>
            <tr><td>Echo Shard</td><td>~5%</td></tr>
            <tr><td>Pumpkin Pie</td><td>25%</td></tr>
            <tr><td>Cobweb</td><td>Common</td></tr>
        </table>
    </details>
</div>

<div class="struct-card" style="border-left: 3px solid #d73a49;">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-wheat-awn-circle-exclamation"></i> Spooky Farm (Жуткая Ферма)</h3>
        <span class="badge">Plains</span>
    </div>
    <p class="lang-ru">Заброшенная ферма с пугалом.</p>
</div>

<div class="struct-card" style="border-left: 3px solid #d73a49;">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-skull"></i> Graveyard (Кладбище)</h3>
        <span class="badge">Soul Sand Valley (Nether) / Dark Forest</span>
    </div>
    <p class="lang-ru">Место упокоения. Содержит структуру Graveyard Down (склеп).</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td>Bones / Rotten Flesh</td><td>80%</td></tr>
            <tr><td class="uncommon">Golden Nuggets</td><td>15%</td></tr>
            <tr><td class="rare">Diamond</td><td>~1%</td></tr>
        </table>
    </details>
</div>

<h3 id="nether" style="margin: 40px 0 20px; color: var(--text-muted);">Nether & Other (Незер)</h3>

<div class="struct-card" style="border-left: 3px solid #d73a49;">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-brands fa-fort-awesome"></i> Nether Outpost (Адский Пост)</h3>
        <span class="badge">Savanna / Nether</span>
    </div>
    <p class="lang-ru">Опасный аванпост пиглинов.</p>
    <details>
        <summary class="btn" style="width:100%; text-align:left; font-size:0.9rem;">Show Loot</summary>
        <table class="loot-table">
            <tr><td>Blaze Powder</td><td>20%</td></tr>
            <tr><td>Nether Wart</td><td>30%</td></tr>
            <tr><td class="uncommon">Mechanical Press</td><td>~2%</td></tr>
        </table>
    </details>
</div>

<div class="struct-card" style="border-left: 3px solid #b80c09;">
    <div class="struct-header">
        <h3 class="struct-title"><i class="fa-solid fa-door-open"></i> Crimson Portal (Багровый Портал)</h3>
        <span class="badge">Nether</span>
    </div>
    <p class="lang-ru">Разрушенный портал в стиле Crimson Forest.</p>
</div>
