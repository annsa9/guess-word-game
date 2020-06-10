## [![Ionic Logo](https://ionicframework.com/img/ionic-logo.png)](https://ionicframework.com)

# Mobile application in ionic 3
# A word puzzle

* Integration with firebase database/Google ads/Play store payment

## Live app on play store

[Four pics one word](https://play.google.com/store/apps/details?id=io.ionic.fourinonegame)

## Prerequisite Technologies

* [Git](https://git-scm.com/downloads)
* [Node](https://nodejs.org/en/download/)
* [Requirements as per mobile OS](https://ionicframework.com/docs/intro/deploying/)

## Installation

```
git clone https://github.com/annsa9/wstatus.git
cd wstatus
npm install -g ionic cordova
```

To run on android os, as per instructions [here](https://ionicframework.com/docs/intro/deploying/),
To run live debugging
```
ionic cordova run android --prod --release
```
To build APK
```
ionic cordova build android --prod --release
```

### Notes

* Replace ```xxxxx``` strings in project with your API keys
* Do not run app in browser as browser dosen't support cordova native plugins. Test app in emulator or device.
* While building app, to avoid Language localisation warning and some exceptions, add this code to
*wstatus/platforms/android/build.gradle* file:
```
android {
    aaptOptions.cruncherEnabled = false
    aaptOptions.useNewCruncher = false
    
    buildTypes {
        release {
            lintOptions {
                disable 'MissingTranslation'
            }
        }
    }
}
```
