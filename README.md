# 🗳️ Task 23 – Polling & Voting App

A professional and responsive **Polling & Voting App** built using HTML5, CSS3, JavaScript, and LocalStorage as part of the Veda Technology Web Development Internship.

The application allows users to create polls with multiple options, vote on available polls, view live percentage-based results, and prevent duplicate voting for each poll.

---

## 🌐 Live Demo

👉 https://silambarasanc199-jpg.github.io/task-23-polling-voting-app/

---

## 📌 Project Information

| Detail | Information |
|---|---|
| **Task** | Task 23 |
| **Day** | Day 23 / 45 |
| **Project** | Polling & Voting App |
| **Domain** | Web Development |
| **Level** | Level 2 |
| **Organization** | Veda Technology |
| **Developer** | Silambarasan C |

---

## 🎯 Objective

The main objective of this project is to develop an interactive polling application that allows users to:

- Create polls with multiple options
- Vote on available polls
- Allow only one vote per poll
- Display live voting results
- Calculate vote percentages dynamically
- Store poll data using LocalStorage
- Support multiple polls
- Provide a responsive and user-friendly interface

---

## ✨ Features

### 🗳️ Poll Creation

Users can create their own polls by entering:

- Poll question
- Multiple answer options

The application supports a minimum of 2 options and allows additional options to be added.

### ➕ Dynamic Poll Options

Users can:

- Add additional options
- Remove options
- Create polls with multiple choices
- Use unique option names

### 🗳️ Voting Interface

Users can select one option from a poll and submit their vote.

### 🔒 Duplicate Vote Prevention

The application uses LocalStorage to maintain a record of polls that the current browser has already voted on.

Once a user votes on a poll:

- The vote is saved
- The poll results are displayed
- The user cannot vote again on the same poll

### 📊 Live Results

After voting, the application dynamically calculates:

- Total votes
- Individual option votes
- Vote percentage
- Leading option

Percentage bars visually represent the voting results.

### 💾 LocalStorage

Polls and voting information are stored in the browser using LocalStorage.

This allows the data to remain available even after refreshing the page.

### 🔄 Multiple Polls

Users can create and manage multiple polls within the same application.

### 🗑️ Delete Poll

Users can delete polls they have created.

### 📱 Responsive Design

The application is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

## 🛠️ Technologies Used

### HTML5

Used to create the structure of the application, including:

- Header
- Poll creation form
- Input fields
- Voting interface
- Results section
- Buttons

### CSS3

Used for:

- Modern user interface
- Responsive layouts
- Cards
- Buttons
- Progress/result bars
- Mobile optimization
- Typography
- Spacing and alignment

### JavaScript

Used to implement:

- Poll creation
- Dynamic option handling
- Voting functionality
- Vote calculation
- Duplicate-vote prevention
- DOM manipulation
- Event handling
- Poll deletion
- UI updates

### LocalStorage

Used to persist:

- Poll information
- Vote counts
- Voting status

### GitHub Pages

Used to deploy the project as a live web application.

---

## 📂 Project Structure

```text
task-23-polling-voting-app/
│
├── index.html
├── style.css
├── script.js
└── README.md
