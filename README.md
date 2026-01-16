# Story Management System

## <a name="introduction"></a> Introduction :
A full-stack web application for managing stories and chapters. This system allows users to create, read, update, and delete stories along with their chapters. Built with modern technologies including React 19, TypeScript, Express 5.2.1, Prisma ORM, and PostgreSQL database.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Libraries](#libraries)
- [Project Structure](#project-structures)
- [Website URL](#website-url)

## <a name="features"></a> Features :
- **Story List** - View all stories with pagination, search, and filter by category/status
- **Add Story** - Create new stories with title, author, synopsis, category, tags, cover image, and status
- **Story Detail** - View complete story information with chapter list and view chapter content
- **Edit Story** - Update story details and manage chapters (add, edit, delete)
- **Delete Story** - Remove stories with cascade delete for chapters
- **Add Chapter** - Create new chapters with Quill rich text editor
- **Edit Chapter** - Update chapter title and content with rich text editing
- **View Chapter** - Read chapter details in modal view with formatted content
- **Delete Chapter** - Remove chapters from stories
- **Dashboard** - Statistics overview of stories and chapters
- **Image Upload** - Upload and manage story cover images via Cloudinary
- **Form Validation** - Client and server-side validation with SweetAlert2 notifications
- **Comprehensive Testing** - Unit tests for frontend (32 tests) and backend (22 tests)

## <a name="libraries"></a> Libraries :

### Frontend
- **React** .
- **TypeScript** 
- **Vite** 
- **React Router DOM** 
- **Axios** 
- **Tailwind CSS** 
- **Lucide React** 
- **SweetAlert2** 
- **Quill** 
- **Vitest** S
- **React Testing Library** - 

### Backend
- **Express** 
- **Prisma** 
- **PostgreSQL** 
- **Multer** 
- **Express Validator** 
- **CORS** 
- **Jest** 
- **Supertest** 

## <a name="project-structures"></a> Project Structure :

### Frontend
* `assets` - Static assets and images
* `components` - Reusable React components (common components, loading, error boundaries)
* `hooks` - Custom React hooks (useDebounce, useClickOutside, useStories)
* `layout` - Layout components (AppLayout, Sidebar, Header)
* `pages` - Page components (Dashboard, StoryList, AddStory, EditStory, StoryDetail, AddChapter, EditChapter)
* `services` - API service layer (storyService, chapterService, uploadService)
* `test` - Test utilities and setup files

### Backend
* `__tests__` - Test files for API endpoints
* `config` - Configuration files
* `controllers` - Request handlers (story.controller, chapter.controller)
* `middleware` - Express middleware (validation, error handling)
* `routes` - API route definitions
* `services` - Business logic layer (story.service, chapter.service)
* `types` - TypeScript type definitions
* `utils` - Utility functions (Prisma client)
* `prisma` - Database schema and migrations

## <a name="website-url"></a> Website URL :
Attach the link of your deployed project or youtube link here
