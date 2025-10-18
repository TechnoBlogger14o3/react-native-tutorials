# Creating and Running React Native Projects

## 🚀 Project Creation Methods

### Method 1: React Native CLI (Recommended for Production)

#### Create New Project
```bash
# Create a new React Native project
npx react-native init MyAwesomeApp

# Navigate to project directory
cd MyAwesomeApp
```

#### Project Structure
```
MyAwesomeApp/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/                     # Your JavaScript code
├── App.js                   # Main app component
├── index.js                 # Entry point
├── package.json             # Dependencies
├── metro.config.js          # Metro bundler config
├── babel.config.js          # Babel configuration
└── react-native.config.js   # React Native config
```

### Method 2: Expo CLI (Recommended for Beginners)

#### Create New Project
```bash
# Create a new Expo project
npx create-expo-app MyAwesomeApp

# Navigate to project directory
cd MyAwesomeApp
```

#### Project Structure
```
MyAwesomeApp/
├── App.js                   # Main app component
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── babel.config.js          # Babel configuration
└── assets/                  # Images, fonts, etc.
```

## 📱 Running Your Project

### React Native CLI Projects

#### Prerequisites
- Android Studio with emulator running (for Android)
- Xcode with simulator (for iOS, macOS only)

#### Run on Android
```bash
# Method 1: Using React Native CLI
npx react-native run-android

# Method 2: Using npm scripts
npm run android

# Method 3: Using yarn
yarn android
```

#### Run on iOS (macOS only)
```bash
# Method 1: Using React Native CLI
npx react-native run-ios

# Method 2: Using npm scripts
npm run ios

# Method 3: Using yarn
yarn ios
```

#### Run on Specific Device
```bash
# Android - specific device
npx react-native run-android --deviceId=DEVICE_ID

# iOS - specific simulator
npx react-native run-ios --simulator="iPhone 14"
```

### Expo Projects

#### Start Development Server
```bash
# Start Expo development server
npx expo start

# Alternative commands
npm start
yarn start
```

#### Run on Devices
```bash
# Start with specific options
npx expo start --android    # Open Android emulator
npx expo start --ios        # Open iOS simulator
npx expo start --web        # Open in web browser
npx expo start --tunnel     # Use tunnel for remote access
```

## 🔧 Essential Commands

### Development Commands
```bash
# Start Metro bundler
npx react-native start

# Start with cache reset
npx react-native start --reset-cache

# Start in verbose mode
npx react-native start --verbose
```

### Build Commands
```bash
# Build Android APK
cd android && ./gradlew assembleRelease

# Build iOS (requires Xcode)
# Open ios/MyApp.xcworkspace in Xcode
# Product → Archive
```

### Debugging Commands
```bash
# Open React Native Debugger
npx react-native log-android    # Android logs
npx react-native log-ios         # iOS logs

# Reload app
# Press 'r' in Metro terminal
# Or shake device → Reload
```

## 📱 Device Setup

### Android Emulator Setup

#### Create Virtual Device
1. Open Android Studio
2. Go to **Tools** → **AVD Manager**
3. Click **Create Virtual Device**
4. Choose device (e.g., Pixel 4)
5. Select system image (API 33 recommended)
6. Click **Finish**

#### Start Emulator
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_4_API_33
```

### iOS Simulator Setup (macOS only)

#### List Available Simulators
```bash
xcrun simctl list devices
```

#### Start Simulator
```bash
# Start specific simulator
xcrun simctl boot "iPhone 14"

# Open Simulator app
open -a Simulator
```

### Physical Device Setup

#### Android Device
1. Enable **Developer Options**
2. Enable **USB Debugging**
3. Connect device via USB
4. Accept debugging prompt on device

#### iOS Device (macOS only)
1. Connect device via USB
2. Open Xcode
3. Go to **Window** → **Devices and Simulators**
4. Select your device
5. Trust the computer

## 🛠️ Project Configuration

### Metro Configuration
```javascript
// metro.config.js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### Babel Configuration
```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Add plugins here
  ],
};
```

### Package.json Scripts
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Issue: `Metro bundler not starting`
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear npm cache
npm start -- --reset-cache
```

#### Issue: `Android build failed`
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### Issue: `iOS build failed`
```bash
# Clean iOS build
cd ios
xcodebuild clean
cd ..
npx react-native run-ios
```

#### Issue: `Device not found`
```bash
# Check connected devices
adb devices                    # Android
xcrun simctl list devices     # iOS
```

#### Issue: `Port already in use`
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use different port
npx react-native start --port=8082
```

## 📊 Performance Tips

### Development Performance
```bash
# Use Hermes engine (Android)
# Add to android/app/build.gradle:
def enableHermes = project.ext.react.get("enableHermes", true);

# Use Flipper for debugging
# Install Flipper and configure in project
```

### Build Performance
```bash
# Enable parallel builds
# Add to android/gradle.properties:
org.gradle.parallel=true
org.gradle.daemon=true
org.gradle.configureondemand=true
```

## 🎯 Best Practices

### Project Structure
```
src/
├── components/          # Reusable components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API calls, utilities
├── store/              # State management
├── assets/             # Images, fonts
└── utils/              # Helper functions
```

### Development Workflow
1. **Start Metro**: `npx react-native start`
2. **Run on Device**: `npx react-native run-android/ios`
3. **Make Changes**: Edit code
4. **See Updates**: Hot reload automatically applies changes
5. **Debug**: Use debugging tools as needed

---

**You're now ready to create and run React Native projects! 🚀📱**
