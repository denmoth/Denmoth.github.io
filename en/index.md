---
layout: home
title: Home
nav_order: 1
has_children: true
permalink: /en/
---

# CubeUI Library

Next-generation GUI engine for Minecraft Forge.
{: .fs-6 .fw-300 }

[Get Started](./cubeui/){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View on GitHub](https://github.com/Denmoth/CubeUI){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Why CubeUI?

### 🎨 Pixel Perfect Rendering
Forget about manual texture slicing. CubeUI handles **9-slice scaling** automatically, ensuring your windows look crisp at any resolution.

### 🧩 Smart Widgets
Includes a suite of ready-to-use components:
* **CuiTextField:** Modern input with placeholders and custom backgrounds.
* **CuiButton:** Resizable 3-slice buttons.
* **CuiSlot:** Decorative slots that match vanilla style.

### ⚡ Seamless Integration
Built to work *with* Minecraft, not against it. extends standard `Screen` and `AbstractContainerMenu` logic, making porting existing GUIs trivial.

---

## Installation

Add to your `build.gradle`:

```groovy
dependencies {
    implementation fg.deobf("com.denmoth:cubeui:0.1.0-beta")
}
```
