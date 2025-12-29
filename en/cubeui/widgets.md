---
layout: default
title: Widgets Reference
parent: CubeUI Docs
nav_order: 2
permalink: /en/cubeui/widgets/
---

# Widgets Reference

Complete guide to standard CubeUI widgets.

## CuiPanel
Renders a background window using 9-slice scaling.

```java
// x, y, width, height
CuiPanel panel = new CuiPanel(x, y, 200, 150);
this.addRenderableWidget(panel);
```

---

## CuiButton
A resizable button that uses 3-slice rendering (left cap, tiled center, right cap).

```java
// x, y, width, height, text, callback
CuiButton btn = new CuiButton(x, y, 100, 20, Component.literal("Save"), button -> {
    System.out.println("Clicked!");
});
this.addRenderableWidget(btn);
```

---

## CuiTextField
A replacement for the vanilla EditBox. Supports custom textures and placeholders.

```java
// font, x, y, width, height, default_text
CuiTextField input = new CuiTextField(this.font, x, y, 150, 20, Component.empty());

// Set placeholder text (shown when empty)
input.setPlaceholder(Component.literal("Enter value..."));

// Set event handler
input.setResponder(value -> {
    // Handle input change
});

this.addRenderableWidget(input);
```

---

## CuiSlot
A decorative item slot.
**Note:** For interactive inventory slots, use `CuiContainerScreen`. This widget is for visual display only.

```java
CuiSlot slot = new CuiSlot(x, y);

// Display an item
slot.setItem(new ItemStack(Items.DIAMOND_SWORD));

this.addRenderableWidget(slot);
```

---

## CuiArrow
A progress arrow (commonly used in furnaces).

```java
CuiArrow arrow = new CuiArrow(x, y);

// 0.0f = empty, 1.0f = full
arrow.setProgress(0.5f);

this.addRenderableWidget(arrow);
```
