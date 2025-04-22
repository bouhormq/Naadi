import * as admin from "firebase-admin";
import { https } from 'firebase-functions';
import express from "express";

// Initialize Firebase Admin SDK if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();

// Add CORS headers before handling requests
// IMPORTANT: In a production environment, restrict Access-Control-Allow-Origin
// to only the domains that should access your function.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all domains - Restrict this in production!
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Include OPTIONS for preflight requests
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No content, just headers
  }

  // Add 'return' here to satisfy the TypeScript compiler
  return next();
});

app.use(express.json()); // Middleware to parse JSON request bodies

// Define the interface for the PhoneInfo structure as expected from the frontend
interface PhoneInfo {
  code: string; // e.g., "MA"
  name: string; // e.g., "Morocco"
  number: string; // The raw phone number part (e.g., "612345678")
  dialCode: string; // e.g., "+212"
}

// Define the interface for the partner registration request
interface RegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website: string; // Assuming this is optional based on frontend, but required here
  businessType: string;
  location: string;
  phone: PhoneInfo; // PhoneInfo object
  consent: boolean;
}

// Define interface for the partner contact request
interface ContactRequest {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website: string;
  businessType: string;
  location: string;
  phone: PhoneInfo;
  message: string; // Added message field
  consent: boolean;
}

// POST endpoint to handle registration requests
app.post("/partner-register-request", async (req: express.Request, res: express.Response) => {
  // Destructure the request body, expecting 'phone' to be the PhoneInfo object
  const {
    email,
    firstName,
    lastName,
    businessName,
    website,
    businessType,
    location,
    phone,
    consent
  }: RegistrationRequest = req.body;

  // Validate the required fields
  // Now we check if 'phone' is an object and if 'phone.number' exists and is a non-empty string
  if (
    !email || typeof email !== 'string' || email.trim() === '' ||
    !firstName || typeof firstName !== 'string' || firstName.trim() === '' ||
    !lastName || typeof lastName !== 'string' || lastName.trim() === '' ||
    !businessName || typeof businessName !== 'string' || businessName.trim() === '' ||
    !businessType || typeof businessType !== 'string' || businessType.trim() === '' ||
    !location || typeof location !== 'string' || location.trim() === '' ||
    typeof consent !== 'boolean' || // Check consent is a boolean
    !phone || // Check if phone object exists
    typeof phone !== 'object' || // Check if phone is an object
    !phone.number || typeof phone.number !== 'string' || phone.number.trim() === '' // Check for raw number string
    // You might add checks for phone.code, phone.name, phone.dialCode if they are strictly mandatory on the backend
  ) {
    console.error("Validation failed: Missing or invalid fields in request body.", req.body);
    return res.status(400).json({ error: "Missing or invalid required fields." });
  }

   // Optional: Basic email format validation on backend (recommended)
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
       console.error("Validation failed: Invalid email format.", email);
       return res.status(400).json({ error: "Invalid email format." });
   }

  try {
    // Save the registration request in Firestore
    const requestRef = admin.firestore().collection("PartnerRegistrationRequest").doc();

    // Store the entire phone object directly in the document
    await requestRef.set({
      email: email.trim(), // Trim whitespace
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      businessName: businessName.trim(),
      website: website ? website.trim() : '', // Handle optional website
      businessType: businessType.trim(),
      location: location.trim(),
      phone: { // Store the structured phone object
          code: phone.code ? phone.code.trim() : '', // Trim if exists
          name: phone.name ? phone.name.trim() : '',
          number: phone.number.trim(), // Number is required and trimmed
          dialCode: phone.dialCode ? phone.dialCode.trim() : '',
      },
      consent,
      approved: false, // Not approved by default
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Respond with a success message
    console.log("Registration request submitted successfully for:", email);
    return res.status(200).json({ message: "Registration request submitted successfully" });
  } catch (error) {
    console.error("Error registering business:", error);
    // Provide a more informative error in development, less in production
    const errorMessage = process.env.NODE_ENV === 'production' ? "Internal server error" : `Internal server error: ${(error as Error).message}`;
    return res.status(500).json({ error: errorMessage });
  }
});

// POST endpoint to handle partner contact requests
app.post("/partner-contact-request", async (req: express.Request, res: express.Response) => {
  // Destructure the request body, including the message field
  const {
    email,
    firstName,
    lastName,
    businessName,
    website,
    businessType,
    location,
    phone,
    message, // New field for contact requests
    consent
  }: ContactRequest = req.body;

  // Validate the required fields
  if (
    !email || typeof email !== 'string' || email.trim() === '' ||
    !firstName || typeof firstName !== 'string' || firstName.trim() === '' ||
    !lastName || typeof lastName !== 'string' || lastName.trim() === '' ||
    !businessName || typeof businessName !== 'string' || businessName.trim() === '' ||
    !businessType || typeof businessType !== 'string' || businessType.trim() === '' ||
    !location || typeof location !== 'string' || location.trim() === '' ||
    !message || typeof message !== 'string' || message.trim() === '' || // Validate message field
    typeof consent !== 'boolean' ||
    !phone ||
    typeof phone !== 'object' ||
    !phone.number || typeof phone.number !== 'string' || phone.number.trim() === ''
  ) {
    console.error("Validation failed: Missing or invalid fields in contact request.", req.body);
    return res.status(400).json({ error: "Missing or invalid required fields." });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Validation failed: Invalid email format.", email);
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    // Save the contact request in a new collection: PartnerContactRequest
    const contactRef = admin.firestore().collection("PartnerContactRequest").doc();

    await contactRef.set({
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      businessName: businessName.trim(),
      website: website ? website.trim() : '',
      businessType: businessType.trim(),
      location: location.trim(),
      phone: {
        code: phone.code ? phone.code.trim() : '',
        name: phone.name ? phone.name.trim() : '',
        number: phone.number.trim(),
        dialCode: phone.dialCode ? phone.dialCode.trim() : '',
      },
      message: message.trim(), // Save the message field
      consent,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Respond with a success message
    console.log("Contact request submitted successfully for:", email);
    return res.status(200).json({ message: "Contact request submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact request:", error);
    const errorMessage = process.env.NODE_ENV === 'production' ? "Internal server error" : `Internal server error: ${(error as Error).message}`;
    return res.status(500).json({ error: errorMessage });
  }
});

// Export the Express app as a Firebase function
export const api = https.onRequest(
  {
    // Specify memory and timeout if needed, e.g., memory: '256MB', timeoutSeconds: 60
    region: "europe-southwest1" // Change to your preferred region
  },
  app
);