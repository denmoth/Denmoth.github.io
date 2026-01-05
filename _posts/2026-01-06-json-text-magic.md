---
layout: default
title: "JSON Text: The Magic of Tellraw"
category: Engineering
excerpt: "Unlocking the hidden potential of Minecraft's chat UI framework."
---

<div class="hub-layout">
    <div class="article-content">
        
        <div class="lang-en">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">JSON Text: The Magic of Tellraw</h1>
            <p class="lead" style="color:var(--text-muted);">Why chat is not just strings, but a full UI framework.</p>
        </div>
        <div class="lang-ru">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">JSON Text: Магия Tellraw, о которой молчит Wiki</h1>
            <p class="lead" style="color:var(--text-muted);">Почему чат — это не просто текст, а мощный UI фреймворк.</p>
        </div>

        <div style="color:var(--text-muted); margin-bottom:30px; font-size:0.9rem; border-bottom:1px solid var(--border); padding-bottom:20px;">
            <i class="fa-regular fa-calendar"></i> 06.01.2026 &nbsp;•&nbsp; <i class="fa-regular fa-user"></i> Denmoth
        </div>

        {% lang en %}
        <p>Have you ever wondered why chat in Minecraft is not just strings of text, but a full-fledged interface tool? Most mod developers use simple text components and forget about it. But if you dig deeper, <code>Raw JSON Text</code> allows you to create things in vanilla chat that look like magic.</p>
        <p>In this article, I will analyze the anatomy of JSON text and show why I created my own visual generator.</p>

        <h2>1. It's Not Text, It's a Tree</h2>
        <p>The main misconception of beginners is thinking of a message as a string. In reality, Minecraft sees a message as a hierarchical tree of objects.</p>
        <p>The first element is always the root. Everything that follows are branches. Parent properties (e.g., color or bold font) are inherited by children unless overridden. Understanding this inheritance is key to optimization. Why write color in every word if you can set it for the whole sentence?</p>

        <h2>2. Interactivity: More Than Just Links</h2>
        <p>Everyone knows about clicking to open links. But the real potential is revealed in other actions:</p>
        <ul>
            <li><strong>Run Command:</strong> Allows the player to execute a command on their behalf when clicked. This is ideal for creating menus right in the chat (e.g., <code>/home</code>, <code>/spawn</code>, or custom triggers).</li>
            <li><strong>Insertion:</strong> A little-known feature. Upon Shift+Click, this text is inserted into the player's input line but not sent. This is indispensable for complex syntax that the player is too lazy to type themselves (e.g., coordinates or UUIDs).</li>
        </ul>

        <h2>3. NBT and Selectors: Dynamic Content</h2>
        <p>JSON Text can pull data from the world in real-time. You don't need to hardcode the player's name.</p>
        <ul>
            <li>You can use the <code>@p</code> selector to automatically substitute the name of the nearest player.</li>
            <li>You can display NBT data (e.g., current health or inventory contents) of a specific entity directly in the message text.</li>
        </ul>
        <p>This is exactly how complex adventure maps are built. You can create a book where the text changes depending on what item the player is holding.</p>

        <h2>4. Why Do You Need a Generator?</h2>
        <p>JSON syntax is strict. One missing quote, and you see <em>Invalid JSON syntax</em> error in the chat. When the message structure becomes nested (hover inside a click, inside which is another hover), writing this by hand is torture.</p>
        <p>My tool <strong>JSON Text Builder</strong> solves this problem visually. You assemble components like a constructor, and at the output, you get a valid command. This saves hours of debugging.</p>
        {% endlang %}

        {% lang ru %}
        <p>Вы когда-нибудь задумывались, почему чат в Minecraft — это не просто строки текста, а полноценный инструмент интерфейса? Большинство разработчиков модов используют простые текстовые компоненты и забывают об этом. Но если копнуть глубже, <code>Raw JSON Text</code> позволяет создавать в ванильном чате вещи, которые выглядят как магия.</p>
        <p>В этой статье я разберу анатомию JSON-текста и покажу, почему я создал свой визуальный генератор.</p>

        <h2>1. Это не текст, это Дерево</h2>
        <p>Главное заблуждение новичков: они думают о сообщении как о строке. На самом деле, Minecraft видит сообщение как иерархическое дерево объектов.</p>
        <p>Первый элемент — это всегда корень. Всё, что идет дальше — это ветви. Свойства родителя (например, цвет или жирный шрифт) наследуются детьми, если их не переопределить. Понимание этого наследования — ключ к оптимизации. Зачем писать цвет в каждом слове, если можно задать его всему предложению?</p>

        <h2>2. Интерактивность: Больше, чем просто ссылки</h2>
        <p>Все знают про клик для открытия ссылок. Но настоящий потенциал раскрывается в других действиях:</p>
        <ul>
            <li><strong>Run Command:</strong> Позволяет игроку выполнить команду от своего имени при клике. Это идеально для создания меню прямо в чате (например, <code>/home</code>, <code>/spawn</code> или кастомные триггеры).</li>
            <li><strong>Insertion:</strong> Малоизвестная фича. При Shift+Клике этот текст вставляется в строку ввода игрока, но не отправляется. Это незаменимо для сложного синтаксиса, который игроку лень печатать самому (например, координаты или UUID).</li>
        </ul>

        <h2>3. NBT и Селекторы: Динамический контент</h2>
        <p>JSON Text умеет вытягивать данные из мира в реальном времени. Вам не нужно хардкодить имя игрока.</p>
        <ul>
            <li>Можно использовать селектор <code>@p</code>, чтобы автоматически подставить имя ближайшего игрока.</li>
            <li>Можно вывести NBT данные (например, текущее здоровье или содержимое инвентаря) конкретной сущности прямо в текст сообщения.</li>
        </ul>
        <p>Именно на этом строятся сложные карты на прохождение. Вы можете создать книгу, текст в которой меняется в зависимости от того, какой предмет игрок держит в руке.</p>

        <h2>4. Зачем нужен Генератор?</h2>
        <p>Синтаксис JSON строг. Одна пропущенная кавычка — и вы видите в чате ошибку "Invalid JSON syntax". Когда структура сообщения становится вложенной (ховер внутри клика, внутри которого еще один ховер), писать это руками — настоящая пытка.</p>
        <p>Мой инструмент <strong>JSON Text Builder</strong> решает эту проблему визуально. Вы собираете компоненты как конструктор, а на выходе получаете валидную команду. Это экономит часы отладки.</p>
        {% endlang %}

        <hr style="margin: 40px 0; border-color: var(--border);">
        <div style="text-align:center;">
            <a href="/tools/json-text/" class="btn primary">
                <span class="lang-en">Try Generator</span>
                <span class="lang-ru">Открыть Генератор</span>
            </a>
        </div>
    </div>
</div>
