# [browserDock](https://garnettr.github.io/YouTube-API_browserDock/) 
> browserdock.com

<img width="1590" alt="browserDock" src="https://user-images.githubusercontent.com/28959285/127800233-4cd6c191-9003-44a4-b6f5-0477cd0bd837.png">


> Psssst this is in the que to get rebuilt in react 


> This was a great final project to end my first ever JS boot-camp.
I'm writing this README.md years after finishing the project and it's great looking back at
how far I've came and what I've accomplished. 


## My motivation?

To practice, practice, practice! 

My goal was to learn how to use client side API's and how to work with JSON data.
I knew once I was able to access the data, the sky was the limit with what I could build. 

developer.google.com provides great documentation on how to get started with YouTubes API.
This was a great starting place for everything I needed to get started and through roadblocks.


## Why I built this project?

I wanted to build an app that I could use everday. Something that could be of good use, and would keep me interested. 
Not just a app to test out a new coding pattern and then it's discarded. 

But rather an app that was built around something I was already interested in. 



## What problem does it solve?

This app provides the user with more screen relastate when using one monitor and having 2 windows open with one being YouTube.

It also allows for a full screen uninterrupted viewing, meaning no black constraining bars on the left of right side or added UI elements below. A 100% screen to screen viewing experience from mobile to as large as your browser window allows. 

* Provides you with a list of your subscribed channels in full, where you can easily scroll to view them all at once 
* After you have selected your desired channel, a list of the channels videos are populated that you can horizontally scroll through
* Making it easy to watch one video after another with out having to click out of the window

---

<h3 align="center">Side by side windows example - with - standard YoutTube App</h4>

![browser-dock-sidebyside-2](https://user-images.githubusercontent.com/28959285/128177159-13acdc15-b90b-46e5-b748-f99f67a15b3c.png)

---



<h3 align="center">Side by side windows example - with - BrowserDock</h4>

![browser-dock-sidebyside-1](https://user-images.githubusercontent.com/28959285/128177176-99ac3ae4-32a4-418d-9b3d-ce6d53468d97.png)

> You are able to scroll horizontally through not only your subscriptions but your loaded videos. 
This makes for easy browsing when multi-tasking. 



## How it works 

  In order for the app to access a users subscribed channels, google has a series of steps to authorize the app. 

* It creates the redirect URL for Google's authorization server and provides a method to direct the user to that URL.
* It handles the redirect from that server back to your application.
* It validates the access token returned by the authorization server.
* It stores the access token that the authorization server sends to your application and retrieves it when your app subsequently makes authorized API calls.


```
var GoogleAuth; // Google Auth object.
function initClient() {
  gapi.client.init({
      'apiKey': 'YOUR_API_KEY',
      'clientId': 'YOUR_CLIENT_ID',
      'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
  });
}
```

#### After the app is authorized and data is loaded
---

An example of the JSON and what can be accessed after the data is loaded. 


> Returned object of YouTube channel and there basic info
<img width="922" alt="Youtube-channel-info" src="https://user-images.githubusercontent.com/28959285/128637167-ca76e654-d2c8-4f0d-bfc4-9f3df7bcfe0e.png">

> That sme channels, and the returned object of channels **Vidoes**

<img width="965" alt="Youtube-channel-videos" src="https://user-images.githubusercontent.com/28959285/128637170-ffbf509e-9657-4838-a345-eada84412d15.png">




