# ActiveIQ - KIST Athletic Portal

ActiveIQ is a modern, AI-powered athletic management platform designed for the Konark Institute of Science and Technology (KIST). It serves as a central hub for students to discover and register for campus events, and for administrators to manage sports activities with the help of advanced AI tools.

## 🚀 Features

### For Students
-   **Event Discovery**: Browse upcoming sports meets, hackathons, and cultural events.
-   **One-Click Registration**: Seamlessly sign up for events with instant confirmation.
-   **Personal Dashboard**: Track your participation history, upcoming schedule, and performance scores.
-   **AI Chat Assistant**: Get instant answers about campus activities from "Core", our Gemini-powered assistant.
-   **Performance Analytics**: Visual insights into your activity levels and participation trends.

### For Administrators & Faculty
-   **Event Management**: Create, edit, and manage comprehensive event details including capacity and location.
-   **AI Event Architect**: Brainstorm and generate detailed event plans using a specialized AI persona.
-   **Smart Participants Manifest**: View real-time registration lists with AI-powered analysis of enrollment trends.
-   **Automated Judging**: Use AI to evaluate creative submissions and suggest scores.
-   **User Management**: Control user roles and permissions via a secure admin console.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 14](https://nextjs.org/) (App Directory), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Convex](https://www.convex.dev/) (Real-time database & serverless functions)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components
-   **AI Integration**: [Google Gemini Pro/Flash](https://deepmind.google/technologies/gemini/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📦 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/activeiq.git
    cd activeiq
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add the following keys:

    ```env
    # Convex
    CONVEX_DEPLOYMENT=your_convex_deployment_name
    NEXT_PUBLIC_CONVEX_URL=your_convex_url

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    # Google Gemini AI (Set this in your Convex Dashboard as well!)
    GEMINI_API_KEY=your_gemini_api_key
    ```
    > **Note:** The `GEMINI_API_KEY` must also be set in your Convex Dashboard under Settings > Environment Variables.

4.  **Run the Development Server**
    Start both the Next.js frontend and Convex backend:

    ```bash
    npm run dev
    ```
    In a separate terminal:
    ```bash
    npx convex dev
    ```

5.  **Access the App**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💎 Design Philosophy

ActiveIQ follows a "Cyber-Physical" aesthetic, blending clean, high-performance athletic vibes with futuristic digital elements.
-   **Glassmorphism**: Translucent cards and overlays for depth.
-   **Dynamic Gradients**: Vibrant primary colors against deep backgrounds.
-   **Motion**: Subtle animations to guide user interactions.
-   **Dark/Light Mode**: Fully responsive theming for any environment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
