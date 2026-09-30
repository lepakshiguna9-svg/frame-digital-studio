# FRAME — Experimental Digital Studio

## Problem / Concept

Create a frontend portfolio that presents digital work as an exhibition rather than a conventional agency landing page. FRAME needed to feel authored and image-led while remaining easy to navigate and genuinely interactive.

## Design Direction

The visual system pairs warm paper and near-black type with isolated cobalt and vermilion accents. An original generated sculpture image anchors the opening. Oversized sans-serif typography, fine mono labels, asymmetrical spacing, and an intentionally varied project index make the content feel more like a printed art journal than a service pitch.

## Interaction Design

Visitors can filter six concept projects by discipline and open each one in a fullscreen detail overlay. The overlay is rendered from shared JavaScript data and includes each project's title, category, year, description, image, role, and credits. A menu overlay connects the page sections and uses an observer to show the current location. A custom cursor gives desktop project links a clear “view” state, while the open color study follows pointer position and reports coordinates. Scroll reveals add pacing without blocking access to content.

## Technical Implementation

The project is static HTML, CSS, and vanilla JavaScript. Project copy, image paths, role, and credits live in `js/projects.js`; `js/app.js` renders the archive, manages filters, animated dialog state, navigation state, and reveal observers. `js/interactions.js` owns pointer behavior. Native browser APIs keep the dependency footprint at zero.

## Interesting Challenges

The archive needed varied composition without making filtering brittle. Each card receives its position through a repeating CSS sequence, while the same rendered markup can be filtered in any category. The mobile layout changes to staggered full-width entries rather than simply squeezing the desktop columns.

## Performance Decisions

Only the hero image is prioritized; project images use lazy loading and asynchronous decoding. Pointer updates are grouped into animation frames. Motion uses transforms and opacity, reduced-motion preferences remove entrance and reveal movement, and no JavaScript animation loop runs when the study is idle.

## Responsive Strategy

Desktop uses a twelve-column editorial grid. At phone widths the archive becomes one column with alternating indents, the menu fills the viewport, and the cursor is disabled. Typography uses fluid sizing with narrower-screen adjustments.

## What I Learned

Keeping content data separate from presentation made the archive easier to reshape, while native elements such as `<dialog>` removed a large amount of custom accessibility behavior. The visual concept gains impact from a few deliberate interactions, not motion on every element.

## Future Improvements

Replace the remote editorial images with a cohesive, locally optimized set; add individual project pages; run a final pass with real studio contact details; and capture deployment screenshots once the hosting target is chosen.
