---
layout: default
title: "Structure Anatomy: From Simple Box to Procedural Mazes"
category: Game Design
excerpt: "How Jigsaw blocks solve complex generation problems."
---

<div class="hub-layout">
    <div class="article-content">
        
        <div class="lang-en">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Structure Anatomy</h1>
            <p class="lead" style="color:var(--text-muted);">From simple basements to procedural mazes: How Jigsaws work.</p>
        </div>
        <div class="lang-ru">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Анатомия Структур</h1>
            <p class="lead" style="color:var(--text-muted);">От простого подвала до процедурных лабиринтов: Как работают Пазлы.</p>
        </div>

        <div style="color:var(--text-muted); margin-bottom:30px; font-size:0.9rem; border-bottom:1px solid var(--border); padding-bottom:20px;">
            <i class="fa-regular fa-calendar"></i> 07.01.2026 &nbsp;•&nbsp; <i class="fa-regular fa-user"></i> Denmoth
        </div>

        {% lang en %}
        <p>In the world of Minecraft modding, there are two ways to create structures: placing a ready-made "box" (schematic) or using Jigsaw blocks. When I was developing <strong>Create: Structures Overhaul</strong>, I encountered the fact that sometimes simple solutions don't work, while complex ones open doors to infinite variety.</p>
        <p>Today I'll tell you honestly: how my mod works, why I needed Jigsaw blocks for a simple "box," and how giant vanilla dungeons are actually generated.</p>

        <h2>1. The Graveyard Problem: Why Did It Float?</h2>
        <p>One of the structures in my mod is the <strong>Graveyard</strong>. The idea is simple: the player sees graves on the surface, digs them up, and finds loot below.</p>
        <p>The underground part is technically primitive—it's just a hollow box the width of the graveyard and only 3 blocks high, where the chests are. But when I tried to save the Graveyard and the Basement as a single solid schematic, an unexpected problem arose.</p>
        <p>The Minecraft generator determines the "ground level" by the lowest point of the structure. Since I had a basement, the game considered its floor as the reference point. As a result, during generation, the game placed the basement floor on the grass, and the graveyard itself (tombstones and fence) ended up hanging in the air at a height of 3 blocks.</p>
        <p>The solution? Split them via Jigsaw.</p>
        <ul>
            <li><strong>Step 1:</strong> The game spawns only the surface part (Surface). Since it has no bottom, it perfectly "sticks" to the ground surface.</li>
            <li><strong>Step 2:</strong> A single <strong>Jigsaw block</strong> is hidden in the corner of the fence. It works as a port. Immediately after spawning, it summons the "Basement" structure (that same cube) and docks it strictly downwards.</li>
        </ul>
        <p>As a result, visually it looks like a single whole, but technically it is assembled from two parts so as not to break the terrain alignment.</p>

        <h2>2. Jigsaw as a Randomness Tool</h2>
        <p>Although I use this selectively, Jigsaws were created by Mojang for <strong>randomization</strong>. This is a powerful tool that allows you to make buildings "alive".</p>
        <p>Imagine you are building a house. Instead of building it entirely, you place Jigsaw markers:</p>
        <ul>
            <li><strong>Roof:</strong> The block tells the game: "Choose any roof from the <code>roofs/</code> pool". Result: one time the house spawns with a flat roof, another time with a pointed one.</li>
            <li><strong>Details:</strong> In the corner of a room, you can place a marker that chooses from a pool: <code>{Haystack, Barrel, Empty}</code>.</li>
        </ul>
        <p>Ideally, this can also be done for biome adaptation. For example, a "Flower" marker could spawn Orchids in a swamp or Poppies on a plain, simply by changing the pool. In my mod, I currently do this through different structure files, but dynamic substitution via Jigsaw is the "gold standard" to strive for.</p>

        <h2>3. How Giants Work: Stronghold and Ancient City</h2>
        <p>Have you ever wondered why the <strong>Stronghold</strong> or <strong>Ancient City</strong> are always different? This is Jigsaw to the max.</p>
        <p>Generation there works like a tree:</p>
        <ol>
            <li>The "Root" (Start Piece) spawns—for example, the central statue in the Ancient City.</li>
            <li>It has exits (Jigsaw) that scream: "We need a road here!".</li>
            <li>"Rooms" stick to the road, and "Corridors" stick to the rooms.</li>
        </ol>
        <p>This happens until the structure reaches its size limit. That is why you can find dead ends that break off into nowhere—the generator simply got "tired" and closed the passage with a cap.</p>

        <h2>Summary</h2>
        <p>In <strong>Create: Structures Overhaul</strong>, I try to balance between manual detailing (to make it look beautiful) and procedural generation. Sometimes a Jigsaw is needed just to bury a basement underground. And sometimes—to create an entire city. Understanding this tool distinguishes a novice from a pro.</p>
        {% endlang %}

        {% lang ru %}
        <p>В мире модинга Minecraft есть два пути создания структур: поставить готовую "коробку" (схематик) или использовать Jigsaw-блоки. Когда я разрабатывал <strong>Create: Structures Overhaul</strong>, я столкнулся с тем, что иногда простые решения не работают, а сложные — открывают двери к бесконечному разнообразию.</p>
        <p>Сегодня я расскажу честно: как устроен мой мод, зачем мне понадобились Jigsaw-блоки для простой "коробки" и как на самом деле генерируются гигантские ванильные данжи.</p>

        <h2>1. Проблема Кладбища: Почему оно летало?</h2>
        <p>Одной из структур моего мода является <strong>Кладбище (Graveyard)</strong>. Идея проста: игрок видит могилы на поверхности, раскапывает их и находит лут внизу.</p>
        <p>Подземная часть технически примитивна — это просто полая коробка шириной с кладбище и высотой всего 3 блока, где стоят сундуки. Но когда я попытался сохранить Кладбище и Подвал как единый цельный схематик, возникла неожиданная проблема.</p>
        <p>Генератор Minecraft определяет "уровень земли" по самой нижней точке структуры. Так как у меня был подвал, игра считала его пол точкой отсчета. В итоге, при генерации игра ставила пол подвала на траву, а само кладбище (надгробия и забор) оказывалось висящим в воздухе на высоте 3 блоков.</p>
        <p>Решение? Разделить их через Jigsaw.</p>
        <ul>
            <li><strong>Шаг 1:</strong> Игра спавнит только наземную часть (Surface). Так как у неё нет дна, она идеально "прилипает" к поверхности земли.</li>
            <li><strong>Шаг 2:</strong> В углу забора спрятан один **Jigsaw блок**. Он работает как порт. Сразу после спавна он призывает структуру "Подвал" (тот самый куб) и пристыковывает его строго вниз.</li>
        </ul>
        <p>В итоге визуально это выглядит как единое целое, но технически собирается из двух частей, чтобы не ломать привязку к ландшафту.</p>

        <h2>2. Jigsaw как инструмент рандома</h2>
        <p>Хотя я использую это точечно, Jigsaw были созданы Mojang для <strong>рандомизации</strong>. Это мощнейший инструмент, который позволяет делать постройки "живыми".</p>
        <p>Представьте, что вы строите дом. Вместо того чтобы строить его целиком, вы ставите Jigsaw-метки:</p>
        <ul>
            <li><strong>Крыша:</strong> Блок говорит игре: "Выбери любую крышу из пула <code>roofs/</code>". Итог: один раз дом спавнится с плоской крышей, в другой — с остроконечной.</li>
            <li><strong>Детали:</strong> В углу комнаты можно поставить метку, которая выбирает из пула: <code>{Стог сена, Бочка, Пустота}</code>.</li>
        </ul>
        <p>В идеале, так можно делать и адаптацию под биомы. Например, метка "Цветок" могла бы спавнить Орхидеи в болоте или Маки на равнине, просто меняя пул. В своем моде я пока делаю это через разные файлы структур, но динамическая подмена через Jigsaw — это "золотой стандарт", к которому стоит стремиться.</p>

        <h2>3. Как работают гиганты: Stronghold и Ancient City</h2>
        <p>Вы когда-нибудь задумывались, почему <strong>Крепость Края (Stronghold)</strong> или <strong>Древний Город (Deep Dark)</strong> всегда разные? Это и есть Jigsaw на максималках.</p>
        <p>Генерация там работает как дерево:</p>
        <ol>
            <li>Спавнится "Корень" (Start Piece) — например, центральная статуя в Древнем Городе.</li>
            <li>У неё есть выходы (Jigsaw), которые кричат: "Сюда нужна дорога!".</li>
            <li>К дороге лепятся "Комнаты", к комнатам — "Коридоры".</li>
        </ol>
        <p>Это происходит до тех пор, пока структура не достигнет лимита размера. Именно поэтому вы можете найти тупики, обрывающиеся в никуда — генератор просто "устал" и закрыл проход заглушкой.</p>

        <h2>Итог</h2>
        <p>В <strong>Create: Structures Overhaul</strong> я стараюсь балансировать между ручной проработкой (чтобы было красиво) и процедурной генерацией. Иногда Jigsaw нужен просто, чтобы закопать подвал под землю. А иногда — чтобы создать целый город. Понимание этого инструмента отличает новичка от профи.</p>
        {% endlang %}

    </div>
</div>
