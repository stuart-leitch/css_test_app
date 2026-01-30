# CSS Test Calculator - iOS App

A native iOS app for calculating Critical Swim Speed (CSS) for swimmers.

## Features

- **Calculator Tab**: Enter 200m and 400m time trial results to calculate CSS
- **Timer Tab**: Use built-in stopwatch to time trials and automatically calculate CSS
- Flexible time input formats (MM:SS, MM.SS, MM SS, or total seconds)
- Support for decimal seconds (e.g., 3:28.5)
- Real-time input validation with inline error messages
- Trial breakdown showing seconds, min:sec, and pace per 100m

## Requirements

- iOS 17.0+
- Xcode 15.0+
- Swift 5.9+

## Building

1. Open `CSSTestCalculator.xcodeproj` in Xcode
2. Select your target device or simulator
3. Press Cmd+R to build and run

## Running Tests

1. Open the project in Xcode
2. Press Cmd+U to run all unit tests

Or from the command line:
```bash
cd iOS
xcodebuild test -project CSSTestCalculator.xcodeproj -scheme CSSTestCalculator -destination 'platform=iOS Simulator,name=iPhone 15'
```

## Project Structure

```
iOS/
├── CSSTestCalculator.xcodeproj/    # Xcode project file
├── CSSTestCalculator/              # Main app source
│   ├── CSSTestCalculatorApp.swift  # App entry point
│   ├── ContentView.swift           # Main tab view
│   ├── CalculatorView.swift        # Calculator tab UI
│   ├── TimerView.swift             # Timer tab UI
│   ├── CSSCalculator.swift         # Core calculation logic
│   ├── Constants.swift             # Time limits configuration
│   └── Assets.xcassets/            # App assets
└── CSSTestCalculatorTests/         # Unit tests
    └── CSSCalculatorTests.swift    # Calculator logic tests
```

## CSS Formula

Critical Swim Speed is calculated using:

```
CSS = (400m time - 200m time) / 2
```

This gives you your sustainable pace per 100m for threshold training.
