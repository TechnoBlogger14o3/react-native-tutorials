# Development Environment Setup Guide

## 🛠️ Prerequisites

Before setting up React Native, ensure you have the following installed:

### Required Software
- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js
- **Git**: Version control system
- **Code Editor**: VS Code (recommended)

### Platform-Specific Requirements
- **Android Development**: Android Studio, Android SDK
- **iOS Development**: Xcode (macOS only), iOS Simulator

## 📦 Step 1: Install Node.js

### Download and Install
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation:

```bash
node --version
npm --version
```

### Expected Output
```
v18.17.0
9.6.7
```

## 📱 Step 2: Android Development Setup

### Install Android Studio
1. Download Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Run the installer
3. Follow the setup wizard
4. Install the recommended SDK components

### Configure Android SDK
1. Open Android Studio
2. Go to **Tools** → **SDK Manager**
3. Install the following:
   - **Android SDK Platform-Tools**
   - **Android SDK Build-Tools**
   - **Android SDK Platform** (API level 33 or higher)
   - **Android Emulator**

### Set Environment Variables
Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Verify Android Setup
```bash
# Check if Android SDK is properly configured
echo $ANDROID_HOME

# Check if adb is accessible
adb --version
```

## 🍎 Step 3: iOS Development Setup (macOS Only)

### Install Xcode
1. Open App Store
2. Search for "Xcode"
3. Install Xcode (large download, ~10GB)
4. Open Xcode and accept license agreements

### Install Xcode Command Line Tools
```bash
xcode-select --install
```

### Install iOS Simulator
1. Open Xcode
2. Go to **Xcode** → **Preferences** → **Components**
3. Install iOS Simulator for your target iOS version

### Verify iOS Setup
```bash
# Check Xcode installation
xcode-select --print-path

# Check iOS Simulator
xcrun simctl list devices
```

## ⚛️ Step 4: Install React Native CLI

### Global Installation
```bash
npm install -g @react-native-community/cli
```

### Verify Installation
```bash
npx react-native --version
```

### Expected Output
```
@react-native-community/cli: 11.3.6
```

## 🚀 Step 5: Install Expo CLI (Optional)

### Global Installation
```bash
npm install -g @expo/cli
```

### Verify Installation
```bash
npx expo --version
```

## 🔧 Step 6: Install Additional Tools

### VS Code Extensions
Install these VS Code extensions for better React Native development:

```bash
# Install VS Code extensions
code --install-extension ms-vscode.vscode-react-native
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

### React Native Debugger (Optional)
```bash
# Install React Native Debugger
npm install -g react-native-debugger
```

### Flipper (Optional)
1. Download Flipper from [fbflipper.com](https://fbflipper.com/)
2. Install and configure for React Native debugging

## 🧪 Step 7: Test Your Setup

### Create Test Project
```bash
# Create a new React Native project
npx react-native init TestApp

# Navigate to project directory
cd TestApp
```

### Run on Android
```bash
# Start Android emulator first
# Then run:
npx react-native run-android
```

### Run on iOS (macOS only)
```bash
npx react-native run-ios
```

## 🔍 Troubleshooting Common Issues

### Android Issues

#### Issue: `adb: command not found`
**Solution**: Add Android SDK platform-tools to PATH
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Issue: `SDK location not found`
**Solution**: Set ANDROID_HOME environment variable
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

#### Issue: `Android license not accepted`
**Solution**: Accept Android licenses
```bash
cd $ANDROID_HOME/tools/bin
./sdkmanager --licenses
```

### iOS Issues

#### Issue: `xcode-select: error`
**Solution**: Install Xcode Command Line Tools
```bash
xcode-select --install
```

#### Issue: `No iOS Simulator found`
**Solution**: Install iOS Simulator in Xcode
1. Open Xcode
2. Go to **Xcode** → **Preferences** → **Components**
3. Install iOS Simulator

### General Issues

#### Issue: `Metro bundler not starting`
**Solution**: Clear Metro cache
```bash
npx react-native start --reset-cache
```

#### Issue: `Node version incompatible`
**Solution**: Use Node Version Manager (nvm)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js LTS
nvm install --lts
nvm use --lts
```

## ✅ Verification Checklist

- [ ] Node.js installed and accessible
- [ ] npm installed and accessible
- [ ] Android Studio installed
- [ ] Android SDK configured
- [ ] ANDROID_HOME environment variable set
- [ ] Android emulator created and working
- [ ] Xcode installed (macOS only)
- [ ] iOS Simulator installed (macOS only)
- [ ] React Native CLI installed
- [ ] Test project created successfully
- [ ] Android app runs on emulator
- [ ] iOS app runs on simulator (macOS only)

## 🎯 Next Steps

After completing the setup:

1. **Create Your First App**: Follow the project creation guide
2. **Learn Basic Components**: Start with Course 1
3. **Set Up Debugging**: Configure debugging tools
4. **Join Community**: React Native Discord, Stack Overflow

---

**Your React Native development environment is now ready! 🚀**
