# Credit Card Dashboard React App

### So my goals and why I made this app. Since I am in the US I have multiple credit cards which makes it very hectic to see the deadlines and their plan. It is even hard to track the data when you need to make a payment. The only way to get the information is by visiting bank pages on their website, which is very challenging sometimes and time consuming. As a solution I made this website, which is right now a prototype, to add data for you using your SSN or by adding the card manually. It will keep track of the deadlines coming up and notify you on your app through push notifications or email, so there are many methods to do so. Further there is an option to pay once for all or to customize based on the amount you need to pay. By default it will show the minimum payment for all cards and consolidate. After that, when you enter more than the minimum payment for all cards, then it will choose the card which has the maximum overdue and the highest APR. Further there is a method to clear the due like using bank transfer, another credit card, debit card, or Apple Pay. Many more features are coming up stay tuned.
---

## 📋 Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Installation & Setup](#installation--setup)  
5. [Available Scripts](#available-scripts)  
6. [Folder Structure](#folder-structure)  
7. [Branch Naming Conventions](#branch-naming-conventions)  
8. [Commit Message Guidelines](#commit-message-guidelines)  
9. [Contributing](#contributing)  
10. [License](#license)  

---

## 📝 Project Overview

This app provides a centralized dashboard for users to:

- **Add, view, and search** credit cards  
- **Make payments** individually or via consolidated distribution  
- Customize **notification preferences**  
- Secure their account through **password changes** and **two‑factor authentication (2FA)**  
- **Delete** their account with email confirmation  

Built with React, Tailwind CSS, and Context API for state management.

---

## 🚀 Features

- **Card Management**  
  - Add new credit cards with name, bank, number masking, due dates, and color coding  
  - Search and filter cards  

- **Payment Flow**  
  - Choose between **Consolidated Payment** (smart distribution across cards) or **Individual Payment**  
  - Real‑time distribution algorithm: minimum dues first, then highest‑outstanding balances  

- **User Settings**  
  - **Security**  
    - Change password (current & new validation)  
    - Enable/Manage 2FA (SMS code setup & verification)  
  - **Notifications**  
    - Email notification frequency selection  
  - **Card Display**  
    - Toggle full card numbers  
    - Default sorting options  
  - **Account Management**  
    - Sign out  
    - Delete account with email confirmation modal  

---

## 🧰 Tech Stack

- **React** (v18+) with TypeScript  
- **Tailwind CSS** for utility‑first styling  
- **React Router** for navigation  
- **Context API** for global state (cards & auth)  
- **lucide‑react** icons  

---

## 🔧 Installation & Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your‑username/credit‑card‑dashboard.git
   cd credit‑card‑dashboard
