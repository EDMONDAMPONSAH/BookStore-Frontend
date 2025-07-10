📚 BookStore Frontend (React)
This is the frontend client of the BookStore platform, developed with React, styled using Bootstrap, and designed to integrate seamlessly with the BookStore API backend. Users can browse books, register or login, make purchases, and manage their vendor dashboard.

🚀 Live URL
📍 Deployed on Amazon S3 (Static Website Hosting)
🔗 https://bookstore-frontend-innorik.s3-website-us-east-1.amazonaws.com

🧩 Features
📖 Public browsing of books

🛒 Vendor book management (Add/Edit/Delete)

🧑‍💼 Admin dashboard (Role-based)

🔐 JWT authentication

🔁 Token auto-refresh handling

💳 Paystack integration (purchase flow)

🌐 Fully responsive design

⚙️ Tech Stack
React (SPA)

React Router v6

Axios (API communication)

Bootstrap (Styling)

LocalStorage (JWT management)

Paystack JavaScript API (Client-side initialization)

Hosted on AWS S3

🔐 Authentication
Users are authenticated via JWT issued by the backend.

The token is stored in localStorage and automatically attached to API requests using Axios interceptors.

If a token expires or the user is unauthorized, the app redirects to login.

