# SportTalk Project Documentation

## Project Overview
**SportTalk** is a web application built with **React**, **Firebase (Firestore & Auth)**, and **React Router**, designed to allow users to:

- Create, view, edit, and delete posts.
- Add comments and interact with posts (like, repost).
- Create, view, and participate in polls (with optional vote restriction).
- Manage user accounts with registration, login, and profile management.

The project emphasizes user interactivity, content sharing, and a clean, responsive interface.

---

## Features

### Authentication
- Users can **register** and **login** using email and password.
- Firebase Auth manages sessions.
- `AuthContext` provides authentication state globally.
- Profile creation is automatic on first login.
- Users can **logout**.

### Posts
- Users can **create, edit, delete** posts.
- Posts can have:
  - **Title**
  - **Content / Text**
  - **Likes**
  - **Reposts**
- Posts display **time created** and **author**.
- Users can **like/unlike** posts (with real-time updates via Firestore).

### Comments
- Users can **add comments** to posts.
- Comments are stored in a subcollection under each post in Firestore.
- Comments are displayed in real-time.
- Only logged-in users can comment.

### Polls
- Users can **create polls** with multiple options.
- Polls store:
  - Question
  - Options
  - Votes per option
  - List of voters
- Polls can display results **with percentages**.
- Optional restriction on voting (users cannot vote multiple times).

### Routing
- **React Router v6** handles routing.
- Routes are protected for authenticated actions:
  - `/create` – Create a post.
  - `/profile` – View user profile.
- Other routes:
  - `/` – Home page
  - `/posts` – Feed of all posts
  - `/details/:id` – Post detail view
  - `/edit/:id` – Edit post
  - `/polls` – Poll feed
  - `/polls/:id` – Poll details
  - `/polls/create` – Create a new poll

### State Management
- Component-level state using `useState` and `useEffect`.
- Global auth state using `AuthContext`.
- Realtime updates using Firestore `onSnapshot`.

---

## Project Architecture

