# Architecture Interaction Flow

This document describes how the different parts of the Naadi project (Expo frontend, shared types, Cloud Functions backend) interact with each other.

## Overview

The system follows a client-server pattern:

1.  **Client (Expo App):** The `src/` directory contains the React Native application logic, UI components, and navigation using Expo Router.
2.  **Backend (Firebase):** Firebase provides Authentication, Firestore database, and serverless execution via Cloud Functions (`cloud-functions/`).
3.  **Shared Types:** A root `types/` directory defines common data structures (TypeScript interfaces/types) used by both the client and the backend to ensure consistency.
4.  **Communication:** The Expo app does not directly call the Firebase Admin SDK (except potentially for basic Firestore reads/writes if security rules allow). Instead, it primarily communicates with the backend logic hosted in Cloud Functions via HTTPS requests, orchestrated by helper functions.

## Interaction Diagram

```
+--------------------------+        +-------------------------+        +-----------------------------+
| Expo App (`src/app/`)    |        | API Helpers (`src/api/`)  |        | Shared Types (`types/`)     |
| - Screens & Components   | -----> | - Calls Cloud Functions | <----- | - Interfaces (User, Studio) |
| - Uses Hooks & Contexts|        | - Handles Auth State    |        | - API Payloads              |
+--------------------------+        | - Imports Types         |        +--------------^--------------+
         |                          +-------------^-----------+                         |
         | Imports Helpers                    | Imports Types                           |
         |                                    |                                         |
         | Calls Helpers                      v Makes HTTPS Requests                    |
         |                                    |                                         |
         |                                    |                                         v Imports Types
         |                                    |                               +-----------------------------+
         +------------------------------------->                              | Cloud Functions             |
                                                                            | (`cloud-functions/functions/`)
                                                                            | - HTTP Endpoints            |
                                                                            | - Firestore Triggers        |
                                                                            | - Imports Types             |
                                                                            | - Uses Shared Utils         |
                                                                            | - Interacts w/ Firebase SDK |
                                                                            +-----------------------------+
```

## Detailed Flow (Example: Creating a Studio)

1.  **User Interaction (Expo App):** A partner user fills out a form in a screen component within `src/app/partners/`. On submission, the component calls a function (e.g., `handleCreateStudio`).
2.  **Call API Helper (Expo App):** `handleCreateStudio` imports and calls a specific helper function, e.g., `createStudio` from `src/api/studios.ts`.
    ```typescript
    // src/app/partners/studios/create.tsx
    import { createStudio } from '@/api/studios'; // Assuming @/api alias
    import { StudioData } from '../../../types'; // Import type

    const handleCreateStudio = async (data: StudioData) => {
      try {
        const newStudio = await createStudio(data);
        // Handle success (e.g., navigate)
      } catch (error) {
        // Handle error
      }
    };
    ```
3.  **Execute API Helper (`src/api/`):** The `createStudio` function in `src/api/studios.ts`:
    *   Imports the necessary types (e.g., `StudioData`, `Studio`) from `types/`.
    *   Gets the current user's authentication token (e.g., from an `AuthContext` or Firebase Auth SDK state).
    *   Constructs an HTTPS request (e.g., using `fetch` or `axios`) to the corresponding Cloud Function endpoint (e.g., `https://<region>-<project>.cloudfunctions.net/api/studios`).
    *   Includes the `StudioData` in the request body and the auth token in the `Authorization` header.
    *   Sends the request and awaits the response.
    *   Parses the response (potentially validating it against a type imported from `types/`).
    *   Returns the result (e.g., the created `Studio` object) or throws an error.
    ```typescript
    // src/api/studios.ts
    import { StudioData, Studio } from '../../types';
    import { getAuthToken } from './auth'; // Example auth helper

    const API_URL = 'https://...'; // Cloud Functions base URL

    export async function createStudio(data: StudioData): Promise<Studio> {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/api/studios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle error response
        throw new Error('Failed to create studio');
      }
      return await response.json() as Studio;
    }
    ```
4.  **Receive Request (Cloud Functions):** The Cloud Function mapped to the `POST /api/studios` endpoint (defined in `cloud-functions/functions/src/index.ts` or similar) receives the request.
5.  **Execute Cloud Function (`cloud-functions/functions/`):** The function handler:
    *   Imports types from `types/`.
    *   Imports shared utility functions from `cloud-functions/functions/utils/` (e.g., for validation).
    *   Verifies the user's authentication token using the Firebase Admin SDK.
    *   Validates the incoming request body (`StudioData`).
    *   Uses the Firebase Admin SDK to interact with Firestore (e.g., create a new document in the `studios` collection).
    *   Returns the newly created studio data (conforming to the `Studio` type) in the HTTPS response.
    ```typescript
    // cloud-functions/functions/src/studios.ts (Example)
    import * as functions from 'firebase-functions';
    import * as admin from 'firebase-admin';
    import { StudioData, Studio } from '../../../types'; // Relative path to root types
    import { validateStudioData } from './utils/validation'; // Shared backend util

    export const createStudioHandler = async (req: functions.https.Request, res: functions.Response): Promise<void> => {
      try {
        // 1. Verify Auth Token
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          res.status(401).send('Unauthorized');
          return;
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        // Optional: Check user role (isPartner?)

        // 2. Validate Input
        const studioData = req.body as StudioData;
        if (!validateStudioData(studioData)) {
          res.status(400).send('Invalid input');
          return;
        }

        // 3. Interact with Firestore
        const db = admin.firestore();
        const studioRef = db.collection('studios').doc(); // Auto-generate ID
        const newStudio: Studio = {
          id: studioRef.id,
          businessId: uid,
          createdAt: new Date().toISOString(),
          ...studioData,
        };
        await studioRef.set(newStudio);

        // 4. Send Response
        res.status(201).json(newStudio);

      } catch (error) {
        functions.logger.error('Error creating studio:', error);
        res.status(500).send('Internal Server Error');
      }
    };
    ```
6.  **Handle Response (Expo App):** The `createStudio` API helper receives the response, and returns the data to the original calling component (`src/app/partners/studios/create.tsx`), which updates the UI accordingly.

## Role of `types/`

The root `types/` directory is crucial for maintaining consistency. Both the frontend (`src/`) and the backend (`cloud-functions/`) import type definitions from this central location. This prevents mismatches in data structures passed between the client and server.

## Role of `cloud-functions/functions/utils/`

This directory contains shared code *specifically for the backend*. This could include validation logic, complex business rules, or helpers for interacting with the Firebase Admin SDK, ensuring consistency across different Cloud Functions. 