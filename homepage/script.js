// Load the Google Calendar API
gapi.load('client:auth2', init);

function init() {
    gapi.client.init({
        apiKey: 'AIzaSyCOHnx6hZ-aMzFRpLY3rPqw7OftkqC0guE',
        clientId: '743187805234-7ipqds37pd4o7vtoj7ngfqoiv0a69uei.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
    }).then(() => {
        // Check if the user is signed in
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            loadCalendarEvents();
        } else {
            // User is not signed in, handle sign-in flow
            gapi.auth2.getAuthInstance().signIn();
        }
    });
}

function loadCalendarEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(response => {
        const events = response.result.items;
        // Process and display events in the calendar section
        const calendarSection = document.querySelector('.calendar');
        // Update the DOM with event information
    });
}
