# Widgets API

All widgets extend the base `CuiWidget` or vanilla components and support the standardized theming system.

## CuiPanel
Renders a background panel using 9-slice scaling.

```java
// x, y, width, height
this.addRenderableWidget(new CuiPanel(x, y, 200, 150));

```

CuiButton
A resizable button with 3-slice rendering (left cap, tiled center, right cap).
```

```Java

this.addRenderableWidget(new CuiButton(x, y, 100, 20, Component.literal("Action"), btn -> {
    // Logic
}));
```

CuiTextField
Input field replacing the vanilla edit box. Supports placeholders and custom styling.

```Java

CuiTextField input = new CuiTextField(font, x, y, 120, 20, Component.empty());
input.setPlaceholder(Component.literal("Search..."));
this.addRenderableWidget(input);
CuiSlot
Decorative item slot. For interactive containers, use CuiContainerScreen.

```

```Java

CuiSlot slot = new CuiSlot(x, y);
slot.setItem(new ItemStack(Items.DIAMOND));
