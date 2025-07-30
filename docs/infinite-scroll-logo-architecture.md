# Infinite Logo Scroller Architecture

This document outlines the technical architecture for a responsive, infinitely looping logo scroller built with modern HTML, CSS, and JavaScript, without external libraries.

## 1. Core Concept

The seamless loop is achieved by duplicating the set of logos and animating the container. When the first set of logos scrolls completely out of view, the animation resets to its starting position, creating an endless marquee effect. The duplication is handled dynamically by JavaScript to ensure there are enough logos to fill the viewport and create a continuous stream.

## 2. HTML Structure

The HTML is composed of a main container, a scroller track that will be animated, and the individual logo items. The `data-animated="true"` attribute will be used as a hook for JavaScript to initialize the scroller.

```html
<div class="scroller" data-animated="true">
  <ul class="scroller__inner">
    <li><img src="logos/logo1.png" alt="Logo 1"></li>
    <li><img src="logos/logo2.png" alt="Logo 2"></li>
    <li><img src="logos/logo3.png" alt="Logo 3"></li>
    <li><img src="logos/logo4.png" alt="Logo 4"></li>
    <li><img src="logos/logo5.png" alt="Logo 5"></li>
    <li><img src="logos/logo6.png" alt="Logo 6"></li>
  </ul>
</div>
```

-   **`.scroller`**: The main container that defines the visible area. It will have `overflow: hidden` to clip the content that moves outside its bounds. A `mask` will be used to create a fade-out effect on the edges.
-   **`.scroller__inner`**: The track that holds the logos. This element will be animated using a CSS transform. It uses `display: flex` to lay out the logos in a row.
-   **`li`**: Each list item contains a logo.

## 3. CSS Styling and Animation

The CSS handles the layout, styling, and the core animation.

### 3.1. Scroller Container

```css
.scroller {
  max-width: 600px; /* Example width */
  margin: auto;
  overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller__inner {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  padding-block: 1rem;
  width: max-content; /* Allow the container to grow to fit all logos */
}
```

-   The `mask` property creates a gradient that makes the logos appear to fade in and out at the edges of the container, enhancing the seamless effect.

### 3.2. Animation

The animation is defined using `@keyframes`. The JavaScript will add the `scroller--running` class to start the animation.

```css
.scroller[data-animated="true"] .scroller__inner {
  animation: scroll 40s linear infinite;
}

@keyframes scroll {
  to {
    transform: translate(calc(-50% - 0.5rem)); /* Move left by half the width of the inner container */
  }
}
```

-   **`animation: scroll 40s linear infinite`**: Applies the `scroll` animation with a 40-second duration, a linear timing function (constant speed), and infinite looping. The duration can be adjusted.
-   **`transform: translate(calc(-50% - 0.5rem))`**: The animation moves the `.scroller__inner` element to the left. It translates by `-50%` of its own width. Since the content is duplicated, moving by 50% brings the cloned set of logos into the exact starting position of the original set. The `-0.5rem` accounts for half of the `gap`.

## 4. JavaScript Logic

The JavaScript is responsible for the dynamic cloning of logos to ensure the loop is seamless.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const scrollers = document.querySelectorAll(".scroller");

  // If a user hasn't opted in for reduced motion, add the animation
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      // add data-animated="true" to every `.scroller` on the page
      scroller.setAttribute("data-animated", "true");

      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // For each item in the scroller, clone it and add it to the end
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true); // Hide from screen readers
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }
});
```

### Logic Explanation:

1.  **`prefers-reduced-motion`**: The script first checks if the user has a preference for reduced motion for accessibility. The animation is only added if they do not.
2.  **Select Scrollers**: It selects all elements with the `.scroller` class.
3.  **Duplicate Content**:
    -   It gets all the direct children (the logo items) of the `.scroller__inner` element.
    -   It iterates through these children and creates a deep clone of each one using `cloneNode(true)`.
    -   Each cloned item is marked with `aria-hidden="true"` to prevent screen readers from announcing the duplicated content.
    -   The cloned items are appended to the end of the `.scroller__inner`.
4.  **Triggering CSS Animation**: By having the `[data-animated="true"]` attribute selector in the CSS, the animation is applied automatically once the JavaScript adds this attribute. No further JS intervention is needed to run the animation itself.

This architecture ensures a responsive, performant, and seamless logo scroller that respects user accessibility preferences.