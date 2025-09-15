# Xeno CRM — Frontend

[](https://xeno-crm-frontend-dusky.vercel.app/)

This repository contains the frontend application for the **Xeno CRM System**. It provides a modern, responsive user interface for managing customers, segments, campaigns, and viewing dashboards by consuming APIs from the [Xeno CRM Backend](https://github.com/pranav-deshmukh/xeno-crm-backend).

---

## ✨ Features

- **Dashboard:** At-a-glance overview of key metrics and recent activity.
- **Customer Management:** Create, view, and manage customer profiles.
- **Audience Segmentation:** Build dynamic audience segments using a powerful rule engine.
- **Campaign Orchestration:** Design, launch, and monitor marketing campaigns.
- **AI-Powered Helpers:** Generate campaign message suggestions and translate natural language into segment rules.
- **Responsive Design:** Fully usable on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Context API & Hooks
- **API Communication:** Axios / Fetch API

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- A running instance of the [Xeno CRM Backend](https://github.com/pranav-deshmukh/xeno-crm-backend)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/pranav-deshmukh/xeno-crm-frontend.git
    cd xeno-crm-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the URL for your backend server.

    ```env
    # The base URL for the Xeno CRM backend API
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  **Open the application:**
    Navigate to [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your web browser.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Creates an optimized production build of the application.
- `npm start`: Starts the application from the production build.
- `npm run lint`: Lints the codebase for errors and style issues.

---

## 🔗 Related Repository

This frontend application requires the backend service to be running. You can find the backend repository here:

- **Backend Repo:** [https://github.com/pranav-deshmukh/xeno-crm-backend](https://github.com/pranav-deshmukh/xeno-crm-backend)
