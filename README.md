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

The project follows a **component-based architecture** typical for React applications, with Firebase as the backend for data storage and authentication.

### Frontend (React + Vite)
- **Pages / Views**: Organized as separate components under `/src/pages` or `/src/components`.
  - `Posts` – displays all posts feed.
  - `PostDetail` – single post with likes, comments, and repost functionality.
  - `Create` – form to create a new post.
  - `Edit` – form to edit an existing post.
  - `PollsFeed` – displays all polls.
  - `PoolDetails` – single poll view with results.
  - `CreatePollPage` – form to create a new poll.
- **Components**: Reusable UI components:
  - `Post` – individual post in feed.
  - `AddComment` – add comment form.
  - `CommentsList` – list of comments.
- **Hooks**: Custom hooks like `usePostActions` to manage post interactions (like, repost).
- **Routing**: Managed by **React Router v6** with protected routes for authenticated actions.

### Backend (Firebase)
- **Authentication**:
  - Firebase Auth handles login, registration, and user sessions.
  - `AuthContext` provides global access to authentication state.
- **Firestore Database**:
  - `posts` collection:
    - Each post stores title, content, author, likes, likedBy array, hashtags, timestamps.
    - `comments` subcollection for post comments.
  - `polls` collection:
    - Each poll stores question, options, votes, voters, creator, and timestamp.
- **Realtime Updates**:
  - Firestore `onSnapshot` used for posts, comments, and polls to reflect changes in real-time.

### Data Flow
1. **User Action**: User interacts with the UI (create post, like, comment, vote).
2. **Firestore Update**: Frontend updates Firestore using `addDoc`, `updateDoc`, or `deleteDoc`.
3. **Realtime Listener**: Components using `onSnapshot` automatically update state with new data.
4. **Render**: React re-renders UI components to display updated data.

### State Management
- Local component state: `useState`, `useEffect`.
- Global state: `AuthContext` for authentication.
- Derived state: Calculations for likes count, poll percentages, and vote eligibility done inside components.

---

