---
layout: default
title: Справочник Виджетов
parent: Документация CubeUI
nav_order: 2
permalink: /ru/cubeui/widgets/
---

# Справочник Виджетов

Полное описание стандартных виджетов библиотеки.

## CuiPanel (Панель)
Отрисовывает фон окна, используя 9-slice масштабирование (углы остаются четкими при растягивании).

```java
// x, y, ширина, высота
CuiPanel panel = new CuiPanel(x, y, 200, 150);
this.addRenderableWidget(panel);
```

---

## CuiButton (Кнопка)
Кнопка с поддержкой изменения размера по ширине (3-slice рендер).

```java
// x, y, ширина, высота, текст, действие
CuiButton btn = new CuiButton(x, y, 100, 20, Component.literal("Сохранить"), button -> {
    System.out.println("Нажато!");
});
this.addRenderableWidget(btn);
```

---

## CuiTextField (Поле ввода)
Замена ванильному EditBox. Поддерживает кастомные текстуры и плейсхолдеры.

```java
// font, x, y, ширина, высота, текст_по_умолчанию
CuiTextField input = new CuiTextField(this.font, x, y, 150, 20, Component.empty());

// Установить текст-подсказку (виден, когда поле пустое)
input.setPlaceholder(Component.literal("Введите значение..."));

// Обработчик изменений
input.setResponder(value -> {
    // Логика при вводе
});

this.addRenderableWidget(input);
```

---

## CuiSlot (Слот)
Декоративный слот для предмета.
**Важно:** Для интерактивных слотов инвентаря используйте `CuiContainerScreen`. Этот виджет только для визуализации.

```java
CuiSlot slot = new CuiSlot(x, y);

// Установить предмет для отображения
slot.setItem(new ItemStack(Items.DIAMOND_SWORD));

this.addRenderableWidget(slot);
```

---

## CuiArrow (Стрелка)
Стрелка прогресса (как в печи).

```java
CuiArrow arrow = new CuiArrow(x, y);

// 0.0f = пустая, 1.0f = полная
arrow.setProgress(0.5f);

this.addRenderableWidget(arrow);
```
