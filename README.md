# CookLink

This is the README.md file for the API developed for CookLink, a homemade food delivery website. The purpose of this website is to connect customers with local cooks who offer homemade food. The app aims to support local cooks and provide a platform for customers who are looking for homemade food options.

## API

### Objective

The objective of the backend development is to build a robust and scalable server-side infrastructure that supports the CookLink website. The backend will handle user authentication, user profiles, dish management, order processing, and other essential functionalities.

### Tech Stacks

The API was developed using the following technologies:

- Programming Language: `Node.js`
- Framework: `Express.js`
- Database: `MongoDB/Mongoose`
- Authentication: `Passport.js`
- Testing: `Jest/Supertest`
- Documentation `Swagger UI Express`

### Packages and Libraries

This API uses several packages and libraries, chief among them are:

- `Express`: The main framework used to develop this API.
- `Mongoose`: The ODM used for all database processes.
- `Passport`: For authentication. `passport-google-oauth20` was also used for Google authentication.
- `JSON Web Token`: To generate tokens for users.
- `cookie-parser`: To store the JWT token in a cookie.
- `Swagger UI Express`: For all documentation purposes.
- `Jest`: The main testing framework.
- `Supertest`: for testing the HTTP requests.

### Diagrams

#### API Endpoints Diagram

<img src="https://i.imgur.com/DPO5V39.jpg" alt="Database Diagram" width="1000"/>

#### Database Diagram

<img src="https://i.imgur.com/ir4wF0v.jpg" alt="Database Diagram" width="1000"/>

### Functionality

The API includes the following key functionality:

#### Authentication Functionality

A user may sign up to the application as either a Customer or a Cook. In the case of a Customer, the primary way to sign up is via email by going to `/api/auth/signup`, where the user is required to register using a username, email, and password. Additionally, a Customer may use Single Sign-On (SSO) with Google by going to `/api/auth/google`, in which case they are automatically registered to the app, and can use their Google credentials for future sign-ins. In the case of a Cook, the only way to sign up is via the normal way using email and password by visiting `/api/auth/cook/signup`, and they are required to provide additional information for their profile, namely `bio` and `location`. A registered user can sign in by going to `/api/suth/signin`, upon which they are issued a JWT token, and they can use any of the protected routes that unathenticated users cannot, and sign out by going to `/api/auth/signout`.

#### User-Related Funcionality

After signing up, a user, whether Customer or Cook, can view their profile and update any of the information provided within. A user may also delete their account if they wish to, in which case, all the information related to their profile is removed from the database. A user can also view a certain cook's profile using their ID.

##### User Endpoints

- `GET /api/user` Shows authenticated user their profile.
- `PUT /api/user` Allows a Customer to update their profile.
- `PUT /api/user/cook` Allows a Cook to update their profile.
- `GET /api/user/cook-page/:id` Shows a the page of the cook whose ID was provided in the path.
- `DELETE /api/user` Allows a user to delete their account.

#### Address-Related Functionality

A user can add an address (and one address only for now) after signing up. The address is saved to the database and referenced in their `user document`. If the user has an address added, it will be shown in their profile when they make a GET request to `/api/user`. After adding an address, a user can update their address or delete it entirely, after which they may add a new address.

##### Address Endpoints

- `POST /api/address` Allows a user (Customer or Cook) to add an address to their profile.
- `GET /api/address/:id` Allows a user to view their address.
- `PUT /api/address/:id` Allows a user to update their address.
- `DELETE /api/address/:id` Allows a user to delete their address.

#### Dish-Related Functionality

Cooks can add dishes, which will be referenced in their `user document` and shown in their profiles. After adding the dish, a Cook can update the dish or delete it entirely. The three preceding routes are restricted to Cooks only. A Customer cannot perform any of those actions. Other dish functionality includes showing a certain number of dishes to unathenticated users, showing dishes from Cooks in the same city as the signed-in Customer, filtering dishes by cuisine, and allowing a cook to view all of their dishes.

##### Dish Endpoints

- `GET /api/dish` Shows a certain number of dishes to unathenticated users.
- `GET /api/dish/:id` Shows a certain dish to an autneticated user.
- `GET /api/dish/same-city` Shows dishes from Cooks who are in the same city as the authenticated user to said user.
- `GET /api/dish/filter` Filters dishes by their cuisine.
- `POST /api/dish` Allows a Cook to add a dish.
- `PUT /api/dish/:id` Allows a Cook to update a certain dish.
- `DELETE /api/dish/:id` Allows a Cook to delete a certain dish.
- `GET /api/dish/mydishes` Shows a Cook all of their own dishes.

#### Cart-Related Functionality

A signed-in Customer can view their cart (which shows them the details of the dishes inside their cart with their total price), add a certain dish to their cart, remove a certain dish from their cart, and increase/decrease the quantity of a certain dish in their cart. Finally, the user can `checkout`, in which case a new order is created, and their cart is emptied.

##### Cart Endpoints

- `GET /api/cart` Shows the Customer their cart, with information about the dishes they have in it and the total price.
- `POST /api/cart/:dishId` Allows the user to add a dish to their cart using its ID.
- `DELETE /api/cart/:dishId` Allows the user to remove a dish from their cart using its ID.
- `PUT /api/cart/:dishId/increase` Allows the user to increase the quantity of a certain dish in their cart.
- `PUT /api/cart/:dishId/decrease` Allows the user to decrease the quantity of a certain dish in their cart.
- `POST /api/cart/checkout` Allows the user to check out and place an order, which automatically empties their cart.

#### Order-Related Functionality

After the order is created via `/api/cart/checkout`, it is saved to the database, and can be then viewed by the Customer who placed it. The Customer now can "pay" for the order using its ID. The Customer can also view all of their past orders. For Cooks, the main order functionality is that they can update its status and view all of the orders that contained their dishes.

##### Order Endpoints

- `GET /api/order/myorders` Allows a user to view all of their past orders.
- `GET /api/order/:orderId` Allows a user to view a specific order of theirs using its ID.
- `GET /api/order/assigned-orders` Allows a Cook to view all the orders placed by Customers that contain their dishes.
- `PUT /api/order/:orderId` Allows Cooks to update an order item status and Admins to update an order status.
- `POST /api/order/payment/:orderId` Allows the customer to pay for their order. As of now, this only changes the status of order to `paid`; there is no actual payment functionality.

#### Admin-Restricted Routes

There are certain routes in the API that allow large-scale data fetching, such as viewing all users, dishes, orders, etc. These routes are restricted to Admins only. It is worth mentioning that there is no way to sign up as an Admin; the only way to register an admin is if you have access to the database. Upon signing up, Customers are defaulted to `user` type, and Cooks are defaulted to `cook` type.

#### Admin-Only Endpoints

- `GET /api/user/users` Allows admins to view all users in the database.
- `GET /api/address/addresses` Allows admins to view all addresses in the database.
- `GET /api/dish/admin` Allows admins to view all dishes in the database.
- `GET /api/order` Allows admins to view all orders in the database.

### Scripts

#### To install dependencies

Run the command `npm install` to install all the packages used in the project and their dependencies.

#### To run the server

Run the command `npm start`.

#### To run the tests

Run the command `npm test`.

### Development Guidelines

When developing the backend, the following guidelines were considered:

- Follow best practices for security, including proper handling of user credentials, data validation, and protection against common web vulnerabilities.
- Implement efficient database queries and caching mechanisms to ensure optimal performance.
- Design a RESTful API architecture that adheres to industry standards and is well-documented for future maintenance and potential integration with other services.
- Write clean, modular, and maintainable code following coding conventions and utilizing proper code documentation.

### Future Ideas

- Add a working payment functionality.
- Allow for more filter options.
- Allow a user to have more than one address.
- Add a feature to send an email for the Cook whose dish has been ordered.

### Known Bugs/Issues

- Updating a status of an order item is not working for Cooks.
- A Customer can place an order even if they do not have an address.
- A Cook can create a dish even if they do not have an address.
- Signing up does not automatically sign the user in.
