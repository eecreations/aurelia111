# Aurelia feature upgrade

Implemented in this build:

1. Context-aware Aurelia companion with explicit personal-context opt-in.
2. Adaptive daily ritual on Today, based on time of day plus mood/energy check-in.
3. Weekly reflection card on Progress with an AI-generated reflection action.
4. Tree of Life milestone unlocks and reward language.
5. Home/Lock Screen layer: PWA shortcuts, install/reminder controls, existing wallpaper flow, plus a checked-in WidgetKit target under `ios/App/AureliaWidget` (the source scaffold remains under `native/ios/AureliaWidget` as reference).
6. Six on-demand guided Aurelia audio rituals using the existing voice endpoint.
7. Social sharing upgrades: native share sheet, 9:16 Story, 1:1 square, and lock-screen formats.

## Native iOS widget

The repository now includes `ios/App/App.xcodeproj`, `ios/App/App.xcworkspace`, and a real `AureliaWidget` app-extension target. Both targets are configured for App Group `group.com.aurelia.app`, and the widget deep-links to `aurelia://today`. iOS 16+ is the deployment target so the Lock Screen accessory widget is available.

## Validation note

A full Vite build could not be executed in the current environment because the configured npm registry does not contain `@capacitor/cli@^8.5.0`. The build command was attempted first; dependency installation was then attempted from the repository lockfile and stopped on that registry 404. No dependency versions or lockfiles were changed as part of the feature implementation.
