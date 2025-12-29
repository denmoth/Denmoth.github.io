---
layout: default
title: Виджеты
parent: Документация CubeUI
nav_order: 2
permalink: /ru/cubeui/widgets/
---

# Справочник Виджетов
{: .no_toc }

Полное описание компонентов UI.
{: .fs-6 .fw-300 }

1. TOC
{:toc}

---

## CuiPanel (Фон)
Базовый контейнер для окон. Использует 9-slice масштабирование.

```java
// x, y, ширина, высота
CuiPanel panel = new CuiPanel(x, y, 200, 150);
this.addRenderableWidget(panel);
```

---

## CuiButton (Кнопка)
Кнопка с поддержкой изменения ширины. Текст центрируется автоматически.

```java
// x, y, ширина, высота, текст, действие
CuiButton btn = new CuiButton(x, y, 100, 20, Component.literal("Сохранить"), btn -> {
    System.out.println("Клик!");
});
this.addRenderableWidget(btn);
```

---

## CuiTextField (Поле Ввода)
Модернизированное поле ввода. В отличие от ванильного, поддерживает плейсхолдеры и кастомный рендер фона.

```java
// font, x, y, ширина, высота, текст_по_умолчанию
CuiTextField input = new CuiTextField(this.font, x, y, 150, 20, Component.empty());

// Текст-подсказка (серый, когда поле пустое)
input.setPlaceholder(Component.literal("Поиск предметов..."));

// Логика при вводе
input.setResponder(val -> {
    // Делаем что-то с val
});

this.addRenderableWidget(input);
```

---

## CuiSlot (Декоративный Слот)
Рисует фон слота и предмет внутри.
{: .note }
> **Важно:** Этот виджет чисто визуальный. Если вам нужен функциональный слот инвентаря (чтобы брать предметы), используйте `CuiContainerScreen`.

```java
CuiSlot slot = new CuiSlot(x, y);
slot.setItem(new ItemStack(Items.DIAMOND));
this.addRenderableWidget(slot);
```
