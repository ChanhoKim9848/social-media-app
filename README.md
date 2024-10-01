# Social-Media App Project

## Overview

##### Key Features:

### User Authentication:
Users can register and log in using their email or Google accounts.

### Home Page:
Upon logging in, users are greeted with a home page featuring a left-side menu bar with buttons for Home, Notifications, Messages, and Bookmarks.

### Feed:
The central area displays posts from users that the logged-in user is following. Each post includes like and comment counts, allowing users to like/unlike and comment on them.

### Bookmarks:
Users can bookmark posts for easy access later. Bookmarked posts can be viewed by clicking the Bookmarks button in the menu.

### Post Creation:
Users can create posts that include text, images, and videos (up to five files).

### People You May Know:
A section on the right suggests users to follow, based on registered members of the app.

### Trending Topics:
Below the suggestions, there’s a section highlighting trending topics, showcasing the count of certain hashtags used in user posts.

### Search Functionality:
At the top of the page, a search bar allows users to search for posts by keywords.

### User Profiles:
Each user has a personal account with a profile image (avatar) and biography. Users can access their profile pages by clicking on their names or avatars.

### Programming Languages

HTML5, CSS3, JavaScript, TypeScript

#

  ### Technologies (Libraries, Frameworks and platforms)
  
### - React
React is a JavaScript library developed by Facebook that allows us to create dynamic and interactive web applications.

I chose React for my app because it is one of the most widely used web frameworks globally. Popular applications like Netflix, Airbnb, WhatsApp Web, and Discord are built with React. Its features make it ideal for building scalable, responsive, and efficient applications.

1. Component-Based Architecture
React allows developers to break down the UI into small, reusable components, making it easier to manage and maintain the codebase.

2. Efficient Performance
React uses the Virtual DOM, minimizing the performance cost of updating the real DOM. This leads to better performance, especially in dynamic applications, as it updates only the necessary components.

3. Rich Ecosystem and Community Support
React boasts a large ecosystem of libraries, tools, and resources. This makes it easy to find solutions to development challenges through communities and resources like Google or React’s official documentation. State management tools such as Redux and Context API, along with frameworks like Next.js for server-side rendering (SSR), make it easier to build full-stack applications.

4. Supports Both Web and Mobile Development
React's ecosystem includes React Native, which allows developers to build both web and mobile applications with shared code.

5. Seamless Integration with Backend Technologies
React can be combined with backend technologies like Node.js, enabling developers to work with JavaScript on both the front-end and back-end. Frameworks like Next.js enable SSR and API routes, bridging the gap between front-end and back-end development.

6. Simplified File Structure
React allows combining HTML, CSS, and JavaScript into a single file, reducing the need for separate CSS or JavaScript files and making development more streamlined.

### - Next.js
Next.js is a React framework that enables server-side rendering (SSR) and static site generation (SSG). It enhances React by providing key features like SSR, API routes, and automatic routing, allowing for better SEO and performance. It also helps build full-stack applications by enabling you to create both front-end and backend routes within the same project.

### - Vercel
Vercel is a cloud platform that hosts static sites and serverless functions. It is the platform that powers Next.js, making it easy to deploy full-stack applications with minimal configuration. Vercel is optimized for front-end frameworks, making it a seamless choice for deploying Next.js applications.

### - Google OAuth 2.0
Google OAuth 2.0 is a secure authentication method that allows users to log in using their Google accounts. It simplifies user authentication and ensures secure access to protected resources.

### - Uploadthing
Uploadthing is a library that simplifies file uploads in web applications. It integrates with cloud storage solutions, providing a smooth way for users to upload media like images and videos.

### - Stream Chat (GetStream.io)
Stream Chat provides real-time messaging and chat functionality. It is highly scalable and customizable, making it perfect for social media applications. Stream Chat enables features like real-time messaging, threads, and user presence.

### - TanStack React Query
TanStack React Query is a data-fetching library for React that simplifies working with server state. It manages caching, synchronizing, and updating server data in real-time, making it a powerful tool for fetching, caching, and managing API data in React applications.

### - Lucia Auth
Lucia Auth is a simple and modern authentication library for Node.js applications. It provides a clean and flexible way to handle user authentication with support for various strategies, including password-based and OAuth authentication.

### - TailwindCSS
TailwindCSS is a utility-first CSS framework that allows developers to build custom designs quickly. Instead of writing custom CSS, developers can use pre-defined utility classes directly in their HTML or JSX, speeding up the styling process and reducing CSS bloat.

### - Shadcn UI
Shadcn UI is a modern, customizable UI component library. It provides pre-built, accessible components, making it easier to build consistent UIs across an application. It integrates seamlessly with TailwindCSS, offering a flexible design system.

### - PostgreSQL Database with Prisma
PostgreSQL is a powerful, open-source relational database system. I used Prisma as the ORM (Object-Relational Mapping) tool to interact with the PostgreSQL database. Prisma simplifies database operations, making it easier to query, update, and manage database records in a type-safe way.

### - TipTap Editor
TipTap Editor is a rich text editor built on top of ProseMirror. It allows users to write and format text, supporting various customization options like embedding media, links, and more. TipTap is highly extensible and ideal for creating a feature-rich text editor experience.



#
### Project Blog

##### [Project IDE, Database setup (Vercel PostgresDB + Prisma ORM) - 23/08/24](https://blog.naver.com/detol3953/223558463720)
##### [Lucia authentication library, sign up form - 26/08/24](https://blog.naver.com/detol3953/223562031160)
##### [Login and Sign up pages - 28/08/24](https://blog.naver.com/detol3953/223564339699)
##### [Navigation and search Bar, user button dropdown menu - 31/08/24](https://blog.naver.com/detol3953/223567962241)
##### [Dark mode, Responsive side bar - 01/09/24](https://blog.naver.com/detol3953/223568849350)
##### [User posts, post layout - 05/09/24](https://blog.naver.com/detol3953/223573683943)
##### [Sidebar: Trending posts (hashtags), follow suggestion - 05/09/24](https://blog.naver.com/detol3953/223573925470)
##### [Loading new feeds, posts skeleton - 08/09/24](https://blog.naver.com/detol3953/223577203758)
##### [feed update function - (react query cache mutation) - 09/09/24](https://blog.naver.com/detol3953/223577476189)
##### [Delete post - 09/09/24](https://blog.naver.com/detol3953/223578370018)
##### [Follow / Unfollow function - 10/09/24](https://blog.naver.com/detol3953/223579911865)
##### [User profile page (layout, not-found page, the functionalities) - 13/09/24](https://blog.naver.com/detol3953/223583571898)
##### [User tooltip, React linkify - 14/09/24](https://blog.naver.com/detol3953/223584369716)
##### [Edit profile (Crop image, upload image) - 15/09/24](https://blog.naver.com/detol3953/223585524143)
##### [Post image and videos - 16/09/24](https://blog.naver.com/detol3953/223586332662)
##### [Post detail page - 18/09/24](https://blog.naver.com/detol3953/223587728637)
##### [Post likes and bookmarks features - 19/09/24](https://blog.naver.com/detol3953/223589430215)
##### [Comments function - 21/09/24](https://blog.naver.com/detol3953/223591548927)
##### [Notification functionality and page - 23/09/24](https://blog.naver.com/detol3953/223593889166)
##### [Message features (stream chat api & sdk) - 25/09/24](https://blog.naver.com/detol3953/223596568522)
##### [Google authentication (OAuth2) - 26/09/24](https://blog.naver.com/detol3953/223597829975)
##### [Search result function - 26/09/24](https://blog.naver.com/detol3953/223597939059)
