# Coinglass API with Node.js

This project provides a simple Node.js backend to access the Coinglass API, focusing on providing liquidation history data.

**© 2024 Universal Business Technology. All Rights Reserved.**

---

## Project Overview

This Node.js application serves a frontend and provides an API endpoint to fetch data from the Coinglass API. Its main purposes are:

*   **Secure API Key Management:** The Coinglass API key is stored securely as an environment variable on the server, never exposing it to the client-side application.
*   **Simplified Endpoint:** It provides a clean endpoint for fetching liquidation history.
*   **Error Handling:** Implements robust error handling to provide clear feedback when an API call fails.

## Available Endpoints

The following endpoint is available:

### Liquidation Data

*   **`/api/liquidation-history`**
    *   **Description:** Retrieves historical liquidation data for a specific trading pair.
    *   **Method:** `GET`
    *   **Parameters:**
        *   `exchange` (string, required)
        *   `symbol` (string, required)
        *   `interval` (string, required)
        *   `limit` (integer, optional)
        *   `startTime` (integer, optional)
        *   `endTime` (integer, optional)

---

## Deployment

This application is intended for deployment on a platform like Vercel. To deploy:

1.  Push the code to a GitHub repository.
2.  Create a new project on Vercel and link it to the repository.
3.  Set the `COINGLASS_API_KEY` as an environment variable in the Vercel project settings.
4.  Vercel will automatically build and deploy the application.
