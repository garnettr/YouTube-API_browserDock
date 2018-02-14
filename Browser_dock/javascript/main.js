/* CURRENTLY IN: javascript/main.js */

  /***** START BOILERPLATE CODE: Load client library, authorize user. *****/

  // Global variables for GoogleAuth object, auth status.
  var GoogleAuth;

  /**
   * Load the API's client and auth2 modules.
   * Call the initClient function after the modules load.
   */
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes

    gapi.client.init({ 
        'clientId': '203134710765-ughqm7a64b2sm54mdm6ppj2qjm19eqt6.apps.googleusercontent.com',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      setSigninStatus();

      // Call handleAuthClick function when user clicks on "Authorize" button.
      $('#execute-request-button').click(function() {
        handleAuthClick(event);
      }); 
    });
  }

  function handleAuthClick(event) {
    // Sign user in after click on auth button.
    GoogleAuth.signIn();
  }

  function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
    // Toggle button text and displayed statement based on current auth status.
    if (isAuthorized) {
     getChanelInfo();
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

  function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
      var value = properties[p];
      if (p && p.substr(-2, 2) == '[]') {
        var adjustedName = p.replace('[]', '');
        if (value) {
          normalizedProps[adjustedName] = value.split(',');
        }
        delete normalizedProps[p];
      }
    }
    for (var p in normalizedProps) {
      // Leave properties that don't have values out of inserted resource.
      if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
        var propArray = p.split('.');
        var ref = resource;
        for (var pa = 0; pa < propArray.length; pa++) {
          var key = propArray[pa];
          if (pa == propArray.length - 1) {
            ref[key] = normalizedProps[p];
          } else {
            ref = ref[key] = ref[key] || {};
          }
        }
      };
    }
    return resource;
  }

  function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }




//===================== End of Boiler Plate ================================

  // Grabs Uploads ID and passes it to Recent Playlist Function 
  const executeChnlInfo = request => {
    request.execute(function(response) {
      let data = response;
      console.log(data.items[0].contentDetails.relatedPlaylists.uploads);
      requestChnlPlaylist(data.items[0].contentDetails.relatedPlaylists.uploads);
    });
  }

  // Grabs a specific channel information
  const buildChnlInfo =(requestMethod, path,params, properties) => {
    params = removeEmptyParams(params);
    let request;
    if (properties) {
      let resource = createResource(properties);
      request = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    executeChnlInfo(request);
  }

  // Renders the parameters passed in from "buildChnlSections"
  const executeChnlPlaylist = request => {
    request.execute(function(response) {
      let data = response;
      console.log(data);

      let playlistsItem = document.querySelector('.js-videos-container');

      let str = '';

      for (let i = 0; i < data.items.length; i ++) {
        str += `<div class="video-wrapper"><iframe width="560" height="315" src="https://www.youtube.com/embed/${data.items[i].snippet.resourceId.videoId}" frameborder="0" encrypted-media" allowfullscreen></iframe></div>`;  
        playlistsItem.innerHTML = str;  
      }
    });
  }

  // Passing in the parameters to "executeChnlSections" to render Channel Sections
  const buildChnlPlaylist =(requestMethod, path,params, properties) => {
    params = removeEmptyParams(params);
    let request;
    if (properties) {
      let resource = createResource(properties);
      request = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    executeChnlPlaylist(request);
  }

  let items = [];

  // Renders the parameters passed in from "buildSubscriptions"
  const executeSubscriptions = requestSub => {
    requestSub.execute(function(requestSub) {
      let data = requestSub;
      console.log(data);
      let subscriptImages = document.querySelector('.youtube_profiles'); 
      let profile_info = document.querySelector('.profile_info');
      let content = '';
      let str = '';

        // Loop through and save "profileImage" and "channelId"
      for (let i = 0; i < data.items.length; i ++) {
        content = {
          'profileImage': data.items[i].snippet.thumbnails.high.url,
          'channelId': data.items[i].snippet.resourceId.channelId
        }
        // push "profileImage" and "channelId" to "items" and render suscription images to page
        items.push(content);
        let source = items[i].profileImage;
        let channelId = items[i].channelId;
        str += `<img src="${source}" alt="" height="20%" width="40%" class="js-subscriptions-image" id="${channelId}" onclick="activateImages(this.id)">`; 
        subscriptImages.innerHTML = str;  
      }
      $(".input-group-append").css("display", "none");
      profile_info.innerHTML = `<p class="info">Please select a channel below</p>`;
      console.log(content);
      console.log(items);
    });
  }

  // Passing in the parameters to "execute" to render Subscriptions
  const buildSubscriptions=(requestMethod, path,params, properties) => {
    params = removeEmptyParams(params);
    let requestSub;
    if (properties) {
      let resource = createResource(properties);
      requestSub = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      requestSub = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    executeSubscriptions(requestSub);
  }

  // Renders the parameters passed in from "buildProfile"
  const executeProfile = requestSub => {
    requestSub.execute(function(requestSub) {
      let data = requestSub;
      let yourProfile = document.querySelector('.my_profile_img');

      let str = '';

      for (let i = 0; i < data.items.length; i ++) {
        str += `<img src="${data.items[i].snippet.thumbnails.high.url}" alt="" height="20%" width="40%">`;  
        yourProfile.innerHTML = str; 
      }
      console.log(str);
    });
  }

  // Passing in the parameters to "executeProfile" to render Profile Image
  const buildProfile =(requestMethod, path,params, properties) => {
    params = removeEmptyParams(params);
    let requestSub;
    if (properties) {
      let resource = createResource(properties);
      requestSub = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      requestSub = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    executeProfile(requestSub);
  }

/***** END BOILERPLATE CODE *****/



// ============== Defining Requests ===============//

// Gets your channel info > upon "signing in"
const getChanelInfo = () => {
  $(".input-group-append").css("display", "flex");
  $("header span").css("display", "none");
  buildProfile('GET',
              '/youtube/v3/channels', 
              {'mine': 'true',
              'order': 'alphabetical',
               'part': 'snippet,contentDetails,statistics'});
}

// Gets a list of Your subscriptions 
const requestSubscriptions = (NextPage) => {
    buildSubscriptions('GET',
                    '/youtube/v3/subscriptions',
                    {'mine': 'true',
                      'maxResults': '50',
                      'pageToken': NextPage,
                      'part': 'snippet,contentDetails'});
}

// Gets a list of playlists 
let requestChnlPlaylist= (channelId) => {
 buildChnlPlaylist('GET',
                '/youtube/v3/playlistItems',
                {'maxResults': '25',
                 'part': 'snippet,contentDetails',
                 'playlistId': channelId});
}

// On click of subsciption images gets Uploads Id
let activateImages = (clicked_id) => {
  buildChnlInfo('GET',
                '/youtube/v3/channels',
                {'id': clicked_id,
                 'part': 'snippet,contentDetails,statistics'});
}

// On click grab next page token
let nextPage = (NextPage) => {
    buildSubscriptions('GET',
                    '/youtube/v3/subscriptions',
                    {'mine': 'true',
                      'maxResults': '4',
                      'pageToken': NextPage,
                      'part': 'snippet,contentDetails'});
}


// ============== EVENT LISTENERS ===============//

const GrabInfoClicked = (evt) => {
  // requestChnlSections();
  requestSubscriptions();

} // button click handler



// ============== Defining selectors ===============//

const grabInfo = document.querySelector('.js-grab-info');
let youtube_profiles = document.querySelector('.youtube_profiles');
const profileInner = youtube_profiles.innerHTML;
const subscrptIcon = document.querySelector('.js-subscriptions');


// ============== Event Handlers ===============//

grabInfo.addEventListener('click', GrabInfoClicked);
