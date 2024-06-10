---
sidebar_label: macOS
---

# Installing on macOS

## Introduction

This guide details the installation process for the iR Engine on macOS devices.

## Prerequisites

Ensure you have the following tools installed on your system before starting the installation:

- [Homebrew](https://brew.sh/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
- [Python 3](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

## Installation instructions

Follow these steps to set up the iR Engine on your macOS device.

### Step 1: Prepare your project

First, generate a copy of the project by cloning the repository and navigate to the project directory:

1. Open your terminal
2. Clone the repository by running:

   ```bash
   git clone https://github.com/EtherealEngine/etherealengine.git
   ```

3. Navigate to the directory of the cloned repository:

   ```bash
   cd etherealengine
   ```

### Step 2: Set up environment variables

The iR Engine requires specific environment settings. Configure them by running:

```bash
cp .env.local.default .env.local
```

This command creates a copy of the default environment file, `.env.local.default`, renaming it to `.env.local` for use by the application.

### Step 3: Install and activate the recommended Node.js version

The iR Engine functions with a specific Node.js version, outlined in the `.nvmrc` file. To activate the recommended version, run:

```bash
nvm use
```

**Command output options**:

- **If the version is found (✅):** The system switches to the recommended Node.js version.
- **If the version is not found (❌):** The system returns a message indicating the missing version.  
To resolve, run the following commands:
  1. Install the missing version:

     ```bash
     nvm install <version>
     ```

  2. Activate the version:

     ```bash
     nvm use
     ```

### Step 4: Install dependencies

Install the required dependencies by running:

```bash
npm install
```

Upon completion, proceed to initialize and run your development environment.

## Run your development environment

This section contains the instructions to run your local development environment.

### Step 1: Start Docker and initialize the database

1. Open Docker Desktop

2. Initialize the database by running:

   ```bash
   npm run dev-reinit
   ```

### Step 2: Start the development environment

Launch the iR Engine development environment with:

```bash
npm run dev
```

This command opens the application at `http://localhost:3000/location/default` in your web browser.

### Step 3: Open your development environment

Navigate to the application's URL in your browser to start working with the iR Engine development environment.
