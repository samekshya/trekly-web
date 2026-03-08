# Trekly Web Application (Frontend)

## Description

Trekly Web Application is a **React Single Page Application (SPA)** that interacts with the Trekly RESTful backend API.
The frontend allows users to register, login, and manage application data through an interactive user interface.

This project was developed as part of the **Web API Development (ST6003CEM)** coursework.

---

## Tech Stack

* React.js
* React Router
* JavaScript / TypeScript
* Axios / Fetch API
* CSS / Tailwind / Bootstrap
* Jest & React Testing Library

---

## Features

* User registration and login interface
* Authentication with protected routes
* Create, view, update and delete application data
* Responsive UI design
* API integration with backend server
* Component-based architecture
* Automated frontend testing

---

## Project Structure

src/

components/ → reusable UI components
pages/ → application pages
services/ → API request logic
routes/ → application routing
hooks/ → custom hooks
utils/ → helper utilities
tests/ → frontend tests

App.js / App.tsx → main application component
main.js / index.js → application entry point

---

## Installation

Clone the repository

git clone https://github.com/yourusername/trekly-frontend.git

Install dependencies

npm install

---

## Running the Application

Run development server

npm run dev

or

npm start

The application will run at:

http://localhost:3000

---

## Backend API

The frontend communicates with the Trekly backend API.

Example API base URL:

http://localhost:5000/api

Make sure the backend server is running before starting the frontend application.

---

## Running Tests

Run frontend tests

npm run test

Tests are implemented using **React Testing Library and Jest**.

---

## Application Pages

The application includes the following main pages:

* Login page
* Registration page
* Dashboard / Home
* Resource list page
* Create resource page
* Edit resource page
* Profile page

All pages interact with backend APIs to retrieve and update data.

---

## Author

Samikshya Baniya
Web API Development Coursework
