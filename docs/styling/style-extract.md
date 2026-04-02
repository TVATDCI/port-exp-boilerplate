## Role

You are a senior frontend engineer and design systems specialist.

You have deep expertise in:

- CSS architecture (BEM, utility-first, modular CSS)
- Design systems (tokens, spacing scales, typography systems)
- Responsive design
- Maintainable styling patterns

---

## Context

This project contains a styling system inside:

/styles (multiple CSS files)

These styles were originally built for a frontend project ("framer-port").

Your task is to reverse-engineer and extract the **implicit design system** from these files.

---

## Task

### Step 1: Analyze the Styling System

Read ALL CSS files inside `/styles`.

Identify and extract:

#### 1. Structure

- How files are organized (by feature, layout, utilities, etc.)
- Separation of concerns

#### 2. Naming Conventions

- Class naming patterns (BEM, utility, hybrid, etc.)
- Consistency and readability

#### 3. Design Tokens

- Colors (primary, secondary, neutral, etc.)
- Spacing scale (margin, padding patterns)
- Typography (font sizes, weights, line heights)
- Border radius, shadows, etc.

#### 4. Layout System

- Flexbox / Grid usage
- Container patterns
- Section spacing
- Alignment strategies

#### 5. Responsiveness

- Media query usage
- Breakpoints
- Mobile-first or desktop-first approach

#### 6. Reusability Patterns

- Utility classes vs component styles
- Repeated patterns that could be abstracted

---

### Step 2: Create `design-system.md`

Generate a structured file that explains the styling system:

Include:

## Overview

- General philosophy of the styling approach

## File Structure

- What each CSS file is responsible for

## Design Tokens

- Colors
- Spacing scale
- Typography system

## Layout Rules

- Containers, grids, flex usage

## Naming Conventions

- Pattern explanation + examples

## Reusable Patterns

- Buttons, cards, sections, etc.

---

### Step 3: Evaluate the System

Create a section:

## Strengths

- What is well designed

## Weaknesses

- Inconsistencies
- Duplication
- Scalability issues

## Improvements

- How to evolve into a stronger system

---

### Step 4: Knowledge Transfer (CRITICAL)

Now translate this styling system into guidelines for another project:

👉 port-exp-boilerplate

Create a section:

## How to Apply This System to Another Project

Include:

- Which parts should be reused as-is
- Which parts should be simplified
- How to adapt it for scalability
- Suggested folder structure for styles
- Whether to use plain CSS, CSS modules, or a framework

---

### Step 5: Output Rules

- Be structured and concise
- Use bullet points where possible
- Think in systems, not individual classes
- Do NOT rewrite CSS — focus on analysis and abstraction

---

### Step 6: Final Check

- Verify all CSS files were analyzed
- Confirm the design system is comprehensive
- Ensure the knowledge transfer section is actionable
- All those files should be kept in @framer-port/docs/styling/
