# Next.js Photo + Commenting App

This is a simple Next.js project that allows users to upload photos, add comments to them, and persist them using Firestore and Firebase Storage (GCS). This project utilizes Chakra UI for the UI components and dayjs for handling and formatting timestamps.

## Features

- Users can upload a photo.
- Users can see the list of uploaded photos.
- Users can add a comment to a photo.
- Each photo and comment is persisted in Firestore & Firebase Storage (GCS)
- Each photo and comment has a timestamp.
- The photos and comments are displayed in descending order of their timestamps.

## Technologies

- Next.js
- Chakra UI
- Dayjs
- Firebase Firestore
- Firebase Storage (GCS)

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)

### Installation

1. Clone this repository:

```sh
git clone https://github.com/leonidlouis/qode-takehome-test
```

2. Navigate to the project directory:

```sh
cd <project-dir>
```

3. Install the dependencies:

```sh
npm install
```

or if you are using Yarn:

```sh
yarn
```

4. Set up Firebase Configuration:

   - Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your project and obtain your Firebase configuration.
   - Create a `.env.local` file in the root of your project and add your Firebase configuration as environment variables:

     ```
     FIREBASE_API_KEY=your-api-key
     FIREBASE_AUTH_DOMAIN=your-auth-domain
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_STORAGE_BUCKET=your-storage-bucket
     FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     FIREBASE_APP_ID=your-app-id
     ```

5. Run the development server:

```sh
npm run dev
```

or with Yarn:

```sh
yarn dev
```

6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Usage

1. **Upload & View Photos:**

   - Click the 'Choose File' button to select a photo.
   - Once a photo is selected, click 'Upload' to add the photo to the list.
   - Once in the list, photo is persisted in the cloud and are viewable at anytime by the user.

2. **Add & View Comments:**

   - Under each photo, there is a textarea to write a comment.
   - Write the comment in the textarea and click 'Add Comment'.
   - Once submitted, comment is persisted in the cloud and are viewable at anytime by the user.
