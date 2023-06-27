# CookLink

This is the README.md file for the CookLink homemade food delivery website and API. The purpose of this website is to connect customers with local cooks who offer homemade food. The website aims to support local cooks and provide a platform for customers who are looking for homemade food options.

## Website

### Objective

The objective of this website is to facilitate the connection between customers who have limited time availability to cook, such as students, and local cooks who can offer a variety of homemade dishes. The website will provide a range of features including food choices, user accounts, filtering options for different dishes and locations, food images and descriptions, and support for specific allergies and preferences.

### Target Audience

The target audience for this website includes individuals who have limited time availability to cook, such as students, as well as local chefs. The website will cater to users of various age groups and genders, primarily located within a specific geographical area. Language support should be considered based on the target audience's preferred language.

### Functionality

The website will include the following functionality:

- Home page: Introduce the website and provide a search/filter option, as well as simple navigation options.
- About page: Provide information about the project and its mission.
- Contact page: Allow users to get in touch with the website admins.
- Login/Signup with authentication: Enable users to create accounts and log in using Google or Facebook.
- User profile page: Allow users to view and edit their personal information and upload a profile picture.
- Cart page: Enable users to add dishes to their cart and proceed with the ordering process.
- Admin dashboard: Provide local cooks with access to an admin dashboard where they can post dishes, images, and descriptions. They should also be able to manage orders and track their past orders.

## API

### Objective

The objective of the backend development is to build a robust and scalable server-side infrastructure that supports the CookLink website. The backend will handle user authentication, user profiles, dish management, order processing, and other essential functionalities.

### Technologies Used

The API will be developed using the following technologies:

- Programming Language: Node.js
- Framework: Express.js?
- Database: MongoDB/Mongoose
- Authentication: [To be determined]

### Functionality

The API will include the following key functionality:

- User Authentication: Implement a secure authentication system that allows users to register, log in, and log out, with integration with external authentication providers like Google and Facebook for convenience.
- User Profiles: Design a database schema and controllers to handle user profiles, including personal information, profile pictures, and saved preferences.
- Dish Management: Develop controllers and database models to handle the creation, retrieval, updating, and deletion of dishes by the registered cooks. Include functionalities such as uploading images and descriptions for each dish.
- Order Processing: Implement mechanisms to enable users to add dishes to their cart, place orders, and track their order history. Features like notifications, order status updates, and payment integration may be added.
- Admin Dashboard: Create an admin panel that allows authorized cooks to manage their dishes, view and process orders, and track their performance.

### Development Guidelines

When developing the backend, the following guidelines will be considered:

- Follow best practices for security, including proper handling of user credentials, data validation, and protection against common web vulnerabilities.
- Implement efficient database queries and caching mechanisms to ensure optimal performance.
- Design a RESTful API architecture that adheres to industry standards and is well-documented for future maintenance and potential integration with other services.
- Write clean, modular, and maintainable code following coding conventions and utilizing proper code documentation.
