## 🧠 LetsCode Frontend Rebuild – Agent Prompt

### 🎯 Objective

Rebuild the LetsCode web application frontend from scratch using the **latest Next.js version**, ensuring a clean, scalable, and production-ready architecture.

---

### ⚠️ Important Context

* This project uses a **new version of Next.js with breaking changes**.
* APIs, routing, and structure may differ from previous versions.
* Always consult:

  ```
  node_modules/next/dist/docs/
  ```

  before implementing features.
* Follow modern Next.js conventions strictly.

---

### 🧩 Scope of Work

* Focus **ONLY on frontend development**
* Use **mock data** for all dynamic content
* Do **NOT** implement backend, APIs, or database connections for now

---

### 🏗️ Project Structure (MUST MATCH OLD PROJECT)

Maintain the same architectural pattern as the previous project:

```
/app
  /about
  /services
  /products
  /blog
  /team
  /contact
  /layout.tsx
  /page.tsx

/components
  /layout
    Navbar.tsx
    Footer.tsx
    SiteChrome.tsx
  /home
    Hero.tsx
    Services.tsx
    (other sections)

/components/providers
  Providers.tsx

/styles
  globals.css
```

👉 Keep components modular, reusable, and well-organized.

---

### 🎨 Design & UI Guidelines

* Use **Tailwind CSS** for styling
* Follow a **modern SaaS design system**
* Implement:

  * Glassmorphism where appropriate
  * Clean spacing system (consistent padding/margins)
  * Responsive design (mobile-first)
  * Smooth animations and transitions
* Use CSS variables for theme consistency:

  * `--background`
  * `--foreground`
  * `--primary`
  * `--muted`

---

### 🧱 Layout Rules

* Use a global layout (`RootLayout`) with:

  * Navbar (fixed)
  * Main content (with proper top spacing)
  * Footer
* Ensure no content overlaps with the navbar
* Maintain consistent section spacing (`py-24`, `py-28`)

---

### 📦 Data Handling (Mock Only)

* Use static arrays or local mock files (e.g. `/lib/mockData.ts`)
* Simulate real-world structures (services, blog posts, products, etc.)
* Keep data clean and reusable

---

### ⚙️ Component Standards

* Use functional components
* Keep components small and reusable
* Separate concerns:

  * Layout components
  * UI components
  * Section components
* Use clear naming conventions

---

### 🚀 Expected Outcome

* A clean, scalable frontend architecture
* Visually polished UI (modern SaaS quality)
* Fully responsive pages
* Ready for backend integration later

---

### 🧭 Development Approach

1. Set up layout and global styles
2. Build shared components (Navbar, Footer)
3. Implement homepage sections (Hero, Services, etc.)
4. Build individual pages using mock data
5. Refine UI/UX and responsiveness

---

### 🛑 Do NOT:

* Add backend logic
* Connect to APIs or databases
* Deviate from the defined structure
* Use outdated Next.js patterns

---

### ✅ Goal

Deliver a **clean, maintainable, and production-ready frontend foundation** that can easily integrate backend services later.
