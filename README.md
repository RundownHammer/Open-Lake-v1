# Open-Lake-v1

**Open-Lake-v1** is a simple blogging platform that requires no user authentication. Anyone can upload blogs without the need for login or signup. The site does not use a database; instead, it stores all blog data directly on the local machine as text files. This means that data is persisted even if you close, refresh, or shut down your computer.

## Features

- **No Authentication Required**: Users can post blogs without signing up or logging in.
- **Local Storage of Blogs**: Blog posts are stored as text files directly on your computer, so they persist even after shutdown.
- **Simple UI**: A basic and intuitive interface to upload and view blogs.
- **File-based Storage**: Data is stored in text files, eliminating the need for an external database.

## Screenshots

### Home page animation video


https://github.com/user-attachments/assets/6649ac75-dde7-4b85-8096-641ac6fec32c


### Blog Creation page looks like this


![Screenshot 2024-09-28 170726](https://github.com/user-attachments/assets/dccb5afd-c3b8-4698-8fde-f57d25f6e8e8)


### Blog reading page


![Blog viewing](https://github.com/user-attachments/assets/8aa7d44d-d277-4a8f-9807-3244661085c5)


## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for handling routes and requests.
- **EJS (Embedded JavaScript)**: Templating engine for rendering HTML with dynamic content.
- **JavaScript**: Client-side and server-side scripting.

## How It Works

- Blogs are stored as text files on your computer's file system.
- Each blog post is saved as a `.txt` file with a unique identifier.
- The app uses your computer's file system as a local "database," allowing blogs to persist across sessions, even after a shutdown or refresh.

## Getting Started

Follow these instructions to install and run the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or higher)
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/Open-Lake-v1.git
   
2. **Navigate to the project directory:**
   
   ```bash
   cd Open-Lake-v1
   
3. **Install dependencies:**
   
   ```bash
   npm install
   
4. **Run the app locally:**

   ```bash
   node app.js
   
5. **Open your browser and navigate to:
   
   ```arduino
   http://localhost:3000

### Folder Structure

   ```bash
    
    Open-Lake-v1/
    ├── views/            # EJS template files for rendering HTML
    ├── public/           # Static assets (CSS, images, JS)
    ├── blogs/            # Text files where the blog posts are saved
    ├── LICENCE           # MIT Licence
    ├── index.js          # Main server code (Express server)
    ├── package.json      # Project dependencies and scripts
    ├── package-lock.json 
    └── README.md         # Project documentation
