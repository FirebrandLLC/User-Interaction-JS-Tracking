Tracking User Interactions for Impersonator Bot Detection
===========================
Motivation
----------
Google Analytics reports are polluted with a lot of "Direct" traffic that doesn't appear to correlate with other visitor information.

This script implements a method, using Google Analytics Events, to discriminate between users interacting with an app or web page and bots just accessing a page.

Learn more about our [research](https://firebrand.net).

Features
----------
 - Easily implemented on most sites using Google Tag Manager or inserting the code in your site's theme
 - Reports can use simple tests for events without setting up custom dimensions
 
Requirements
------------
 - jQuery - Script uses jQuery to capture interaction events
 - Google Analytics - The data is sent to Google Universal Analytics
 - Google Tag Manager - This implementation uses Google Tag Manager

Installation
------------
This script was designed to generate a custom segment for [Google Analytics](https://analytics.google.com/). And is implemented using [Google Tag Manager](https://www.google.com/analytics/tag-manager/)

### Set up Google Tag Manager
If you haven't already set up Google Tag Manager (GTM), Google has some [helpful instructions](https://support.google.com/tagmanager/answer/6102821?hl=en).

Create a generic GA Event tag to send the data to Google Analytics. Simo Ahava [explains how](https://www.simoahava.com/analytics/create-a-generic-event-tag/). 
Or you can import our [pre-packaged version](https://github.com/FirebrandLLC/GTM-GAEvent).  Just Import Container and select "merge." Then update the Global Settings variable with your Analytics ID and any other settings.

### Add the script tag to Google Tag Manager

1. From the Tags tab, create a new tag

 ![New Tag](screenshots/new-tag.png "New Tag")

2. Name it "Active User Events"

 ![Tag Name](screenshots/tag-name.png "Tag Name")

3. Set the type to Custom HTML

 ![Tag Type](screenshots/tag-type.png "Tag Type")

4. Paste the contents of [user-interaction.js](https://github.com/FirebrandLLC/User-Interaction-JS-Tracking/blob/master/user-interaction.js) into the HTML edit box. Add script tags around the JavaScript.

 ![Tag HTML](screenshots/tag-html.png "Tag HTML")

5. Set the trigger to "All Pages"

 ![Tag Trigger](screenshots/tag-trigger.png "Tag Trigger")

6. Then save and publish your tag. Of course, you should [preview your changes](https://support.google.com/tagmanager/answer/6107056?hl=en) and make sure there are no errors first.

### Use the events in your reports
Your Google Analytics sessions will now include new events:
<dl>
<dt>Category:</dt>
<dd>Firebrand User Events</dd>
<dt>Action:</dt>
<dd>

  + MouseMove
  + Touch
  + Scroll
  + KeyDown
  + Click
  + 5 seconds
  + 19 seconds
  + 39 seconds
  + 67 seconds
  + etc.
 </dd>
<dt>Label:</dt>
<dd>

  + Active Interaction
  + Inactive Interaction
</dd>
</dl>

Any session with an Active Interaction event is probably a human.




License
-------
Apache V2(http://www.apache.org/licenses/)
