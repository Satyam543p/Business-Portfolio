# Code Captain | Digital Agency Storefront

A premium, dynamic B2B agency portfolio designed to convert local business owners (hotels, premium restaurants, real estate) by demonstrating the financial impact of direct-booking architectures over third-party aggregators.

## 🏗️ System Architecture

This application operates on a headless CMS architecture, completely separating the visual frontend from the data layer. 

*   **Frontend Shell:** React (Vite) + Tailwind CSS
*   **State Management:** Redux Toolkit (Async Thunks for data fetching, Slice for calculator logic)
*   **Animation Engine:** GSAP (Core, ScrollTrigger, React)
*   **Headless Backend:** Appwrite (Database, Storage, Auth, Serverless Functions)

## 🚀 Core Features

*   **Appwrite Data Layer:** Zero hardcoded content. The Hero section, Profile data, and Case Study Bento Grid are fetched dynamically via Redux Async Thunks from Appwrite collections.
*   **Commission Leakage Calculator:** A custom Redux-powered interactive GSAP slider that calculates simulated 20% commission losses in real-time to mathematically prove ROI to business owners.
*   **Awwwards-Caliber UI:** Built with Space Grotesk/Inter typography, glassmorphism, CSS aurora mesh gradients, and strict dark/light section pacing for maximum visual authority.
*   **Serverless Lead Capture:** Form submissions write directly to an Appwrite `Client_Leads` collection with strict create-only guest permissions, triggering automated backend email notifications.

## 🔐 Security & Governance

This repository is kept **Private** as it contains proprietary business logic, client lead database schemas, and custom UI/UX design systems utilized by the agency. 

*Designed and engineered by Satyam Kr. Pandey.*
