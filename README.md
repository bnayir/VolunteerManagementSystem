<p align="right">
  <strong>🇬🇧 English</strong> | <a href="README.tr.md">🇹🇷 Türkçe</a>
</p>

#  VolunteerConnect: A Multi-Platform Ecosystem

> **A comprehensive end-to-end management solution** designed to bridge the gap between organizers and volunteers through a modern technological framework.

---

##  Project Overview
VolunteerConnect is an integrated ecosystem consisting of a scalable **Centralized API**, a dynamic **Web Management Panel**, and a user-centric **Mobile Application**. It is designed to simulate a production-grade enterprise environment where multiple platforms interact seamlessly through a core service layer.

##  Key Features
*   **Centralized Command:** A dedicated Web interface for administrators to create events, manage applications, and track real-time statistics.
*   **On-the-Go Access:** A seamless Mobile experience for volunteers to discover location-based activities and apply with a single tap.
*   **Real-time Analytics:** A comprehensive dashboard that calculates participation rates and volunteer engagement directly from the database.
*   **Announcement Module:** A cross-platform notification system ensuring instant information flow from administrators to all users.

---

##  Tech Stack & Architecture
The system is built with a **Decoupled Architecture**, ensuring that each platform operates independently while remaining synchronized through a core service layer.

###  Backend 
*   **Framework:** .NET 8 Web API
*   **Database:** MS SQL Server & Entity Framework Core (Code First)
*   **Security:** JWT-based Authentication & Role-based Authorization (RBAC)
*   **Core Focus:** Data integrity, scalability, and RESTful principles.

###  Mobile App 
*   **Technology:** React Native
*   **State Management:** React Hooks
*   **Networking:** Axios with custom Interceptors for API communication
*   **Storage:** AsyncStorage for secure local session handling.

###  Web Frontend 
*   **Technology:** React.js / Vite
*   **UI/UX:** Responsive Design for desktop administration
*   **Features:** Dashboard analytics and full CRUD operations for event management.

---

##  System Workflow
1.  **Administrative Action (Web):** An organizer creates a new volunteer event via the Web Panel. The request is processed by the .NET API and persisted in the SQL database.
2.  **Volunteer Interaction (Mobile):** The volunteer opens the Mobile App, which fetches the latest events from the API.
3.  **Application Process:** When a volunteer applies, the status is updated in real-time. The admin can then approve or reject the application, which is instantly reflected on the volunteer's device.
4.  **Synchronization:** All platforms share the same database, ensuring a **"Single Source of Truth"** for all data.

---

##  Development Philosophy
I chose this architecture to ensure the system is built for the future:
*   **Scalability:** New platforms (e.g., a Desktop app or Smartwatch integration) can be added without rewriting the business logic.
*   **Maintainability:** Each component can be updated or debugged independently without affecting the entire ecosystem.
*   **Performance:** The API serves only the necessary JSON data, significantly reducing bandwidth for mobile users.



