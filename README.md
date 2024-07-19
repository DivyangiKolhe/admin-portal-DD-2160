# Admin Portal

Welcome to the Admin Portal! This project is a React-based web application created with Vite, Tailwind CSS and MaterialUI, designed for managing content across the application.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Scripts](#running-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Deployment and Testing](#deployment-and-testing)
- [Deployed Dev Environment](#deployed-dev-environment)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you need to have the following software installed:

- Node.js (version >= 20.x)
- npm (version >= 6.x) or Yarn (version >= 1.22.x)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Manastik-Tech/admin-portal.git
   ```
2. Navigate to the project directory:
   ```
   cd admin-portal
   ```
3. Install dependencies:
   ```
   npm i
   ```
### Running Scripts
- `npm run dev`: To start the development server
- `npm run build`: To generate build for deployment
   
## Project Structure

The directory structure of this React Vite application is organized as follows:

- `src/`: Root directory for all source code.
- `pages/`: Contains individual page components.
- `components/`: Houses reusable components used across the application.
 - `layout/`: Includes layout components defining the overall structure of pages.
 - `shared/`: Includes reusebale components shared across multiple components.
- `context/`: Stores Context API implementations, such as managing the sidebar open state.
- `utils/`: Contains utility functions in separate .js files.
- `services/`: Includes services responsible for specific functionalities (e.g., building tree structures for S3 objects).
- `App.jsx`: Defines the application's routes and main components.

## Contributing

We appreciate your interest in contributing to the Admin Portal! Here's how you can contribute:

1. Branch out from the `development` branch to work on your feature or fix:
`git checkout -b feature-name development`
2. Implement your changes while adhering to coding standards and conventions.
3. Ensure your code is well-tested and documented.
4. Push your branch to your forked repository and open a pull request (PR) against the `development` branch of this repository.
5. Use the provided [Pull Request Template](.github/pull_request_template.md) available in the `.github` folder to structure your PR description.
6. Clearly explain the changes, referencing related issues or tasks.

### Deployment and Testing

- Use the labels `dev-deploy` and `test-deploy` when deploying PRs to the development and test environments, respectively.

### Deployed Dev Environment

- Access the Admin Portal for the dev environment here: [adminportaldev.manastik.com/](https://adminportaldev.manastik.com/)

Your contributions will greatly enhance the Admin Portal! Thank you for your efforts and happy coding!
