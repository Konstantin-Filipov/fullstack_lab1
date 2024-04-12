# Recipe Management System

This project is a Recipe Management System that allows users to create, edit, view, and delete recipes. It consists of a frontend application built with HTML, CSS, and JavaScript, and a backend server built with Node.js and Express.js. The backend server interacts with a MongoDB database to store and retrieve recipe data.

## Features

- View a list of recipes
- Create a new recipe
- Edit an existing recipe
- Delete a recipe

## Installation & Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd recipe-management-system
````
2. Install dependencies for the frontend and backend:

```bash
cd frontend
npm install
```
3. Set up environment variables:

Create a .env file in the backend directory and add the following variables:

```makefile
PORT=3000
MONGODB_URI=<your-mongodb-uri>
```
Replace <your-mongodb-uri> with the URI of your MongoDB database.

4. Start the frontend and backend servers:
```bash

# Start the frontend server
cd ../<directory of package.json>
npm run dev
```

## Usage

Open your web browser and navigate to http://localhost:3000 to access the Recipe Management System.

You can perform the following actions:

- View a list of recipes: The homepage displays a list of recipes with details such as title, ingredients, instructions, and cooking time.
- Create a new recipe: Click the "Create Recipe" button to add a new recipe.
- Edit an existing recipe: Click the "Edit" button next to a recipe to modify its details.
- Delete a recipe: Click the "Delete" button next to a recipe to remove it from the system.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

- Fork the repository
- Create a new branch (git checkout -b feature)
- Make your changes
- Commit your changes (git commit -am 'Add new feature')
- Push to the branch (git push origin feature)
- Create a new Pull Request
