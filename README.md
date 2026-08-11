<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://doc-dashboard-smoky.vercel.app/">
    <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Doc Dashboard</h1>

  <p align="center">
    <strong>A highly robust, scalable, and modern Document Management Dashboard.</strong>
    <br />
    <br />
    <a href="https://doc-dashboard-smoky.vercel.app/"><strong>View Live Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ashimsarkar1512/doc-backend">Backend Repository</a>
    ·
    <a href="https://github.com/ashimsarkar1512/doc-dashboard/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/ashimsarkar1512/doc-dashboard/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- BADGES -->
<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
</div>

<br />

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary><h2>Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#key-features">Key Features</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#folder-structure">Folder Structure</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->
## 📖 About The Project

**Doc Dashboard** is a comprehensive, enterprise-grade document management frontend built to seamlessly interact with complex backend services. It focuses on providing a highly responsive, intuitive, and visually appealing user interface for managing files, analyzing data, and collaborating in real time.

This project was built with performance and maintainability in mind, utilizing modern React features, stringent TypeScript typing, and state-of-the-art libraries for routing and state management.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🛠️ Built With

This project heavily utilizes the following cutting-edge technologies:

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Vite][Vite]][Vite-url]
* [![TailwindCSS][TailwindCSS]][Tailwind-url]
* [![Redux][Redux]][Redux-url]
* [![ReactQuery][ReactQuery]][ReactQuery-url]
* [![SocketIO][SocketIO]][SocketIO-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- FEATURES -->
## ✨ Key Features

- **🚀 Lightning Fast Routing**: Utilizes `@tanstack/react-router` for fully type-safe, client-side routing.
- **🔄 Intelligent State Management**: Combines `@tanstack/react-query` for server state/caching and `@reduxjs/toolkit` for global client state.
- **📡 Real-time Communication**: Integrated `socket.io-client` enables instant data updates across connected clients.
- **🎨 Modern Aesthetics**: Crafted with `tailwindcss` and customizable `shadcn/ui` components for a sleek, modern look.
- **🔐 Robust Form Handling**: Implements `react-hook-form` paired with `zod` for rigorous, type-safe data validation.
- **📊 Interactive Analytics**: Features beautiful, responsive data visualization using `recharts`.
- **📄 Export & Reporting**: Supports exporting complex data structures to PDF (`jspdf`) and Excel (`xlsx`).
- **🔔 Elegant Notifications**: Provides seamless user feedback through `sonner` toasts and `sweetalert2` modals.
- **📝 Rich Text Editing**: Incorporates `react-quill-new` for advanced document editing capabilities.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->
## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or bun/yarn) installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/ashimsarkar1512/doc-dashboard.git
   ```
2. **Navigate into the directory**
   ```sh
   cd doc-dashboard
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
4. **Configure Environment Variables**
   Create a `.env` file in the root of your project and configure your API endpoints:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
5. **Run the development server**
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- FOLDER STRUCTURE -->
## 📁 Folder Structure

```text
doc-dashboard/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components (shadcn, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layouts (e.g., Sidebar, Navbar)
│   ├── pages/            # Application routes/pages
│   ├── routes/           # Tanstack Router configurations
│   ├── services/         # API calls, Axios instances, Socket handlers
│   ├── store/            # Redux store and slices
│   ├── utils/            # Helper functions, type definitions
│   ├── App.tsx           # Main application entry point
│   └── main.tsx          # React DOM rendering
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
└── vite.config.ts        # Vite configuration
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- USAGE EXAMPLES -->
## 💡 Usage

*(Optional: Add screenshots or GIFs here to demonstrate how your dashboard looks and functions)*

* **Document Management**: Create, edit, and safely store your documents.
* **Analytics**: View trends and statistics through the real-time charts dashboard.
* **Exports**: Easily generate PDF reports with a single click.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTRIBUTING -->
## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTACT -->
## 📫 Contact

Ashim Sarkar - [@AshimSarkar](https://github.com/ashimsarkar1512)

Project Link: [https://github.com/ashimsarkar1512/doc-dashboard](https://github.com/ashimsarkar1512/doc-dashboard)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E
[Vite-url]: https://vitejs.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Redux]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org/
[ReactQuery]: https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white
[ReactQuery-url]: https://tanstack.com/query/latest
[SocketIO]: https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white
[SocketIO-url]: https://socket.io/
