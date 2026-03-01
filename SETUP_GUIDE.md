# Techno Fusion Club - Setup & Build Instructions

## STEP 1: Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project named **Techno Fusion Club**.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Firestore Database** (Start in production mode, we will apply the provided `firestore.rules`).
4. Enable **Cloud Storage**.
5. Add an **Android App** to your Firebase project:
   - Android package name: `com.technofusionclub`
   - App nickname: Techno Fusion Club
6. Download the `google-services.json` file.
7. Place the downloaded `google-services.json` inside the `android/app/` directory of this project.

## STEP 19: Android Build & Run Instructions

1. **Install Dependencies:**
   Run the following command in the root of your project to install all necessary packages:
   ```bash
   npm install
   ```

2. **Link Native Modules (if required):**
   React Native 0.60+ auto-links native modules, but ensure you clean gradlew if needed:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **Run the Metro Bundler:**
   Open a terminal and run:
   ```bash
   npm start
   ```

4. **Build and Run on Android:**
   Open another terminal and run:
   ```bash
   npm run android
   ```
   *Note: Make sure your Android emulator is running or a physical device is connected via ADB.*
