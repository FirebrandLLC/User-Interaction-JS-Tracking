//How many times a mouse event was registered
var mouseMoveCount = 0;

//How many times a touchstart event was registered
var touchCount = 0;

//How many times a keydown was registered
var keyCount = 0;

//How many scroll events
var scrollCount = 0;

//How many click events
var clickCount = 0;

//A flag which is used to send off the first interaction immediately (in case the user leaves before the first time-step send)
var isFirstInteraction = true;

//This object stores the previous values from the last send to GTM so we can compare if the user did anything between time-steps
var previousRecord = {};

if (typeof dataLayer === 'undefined') {
    var dataLayer = [];
}

/**
 * This function is checked every time an event is registered,
 * if the flag is true (as it was initialized)
 * - then we send a dataLayer push immediately before the user has a chance to exit
 * The rationale for this is to categorize users who immediately close the window as non-bots,
 * and also provide us a better bounce-rate/exit metric
 *
 * @param interactionType - the type of the first interaction
 */
function sendFirstInteraction(interactionType) {
    if (isFirstInteraction) {
        sendGTMUserEvents(interactionType, true);
        isFirstInteraction = false;
    }
}

/**
 * This function is fired every time we have a chunk of data we want to
 * send back to google analytics, via google tag manager's DataLayer push
 * If you don't use GTM replace the dataLayer.push with a call to ga()
 *
 *
 * @param interactionType
 * @param firstInteraction
 */
function sendGTMUserEvents(interactionType, firstInteraction) {

    /**
     * If it's not the user's first rodeo, set the first interaction flag to false
     */
    if (typeof firstInteraction === 'undefined') {
        firstInteraction = false;
    }

    var dataLayerPushObject = {
        "event": "GAEvent",
        "eventCategory": "UserInteractionEvent - v3",
        "eventAction": interactionType,
        "eventLabel": 'ActiveInteractionEvent',
        "nonInteraction": true
    };

    if (firstInteraction) {
        //Nothing to compare against for the first push
        dataLayer.push(dataLayerPushObject);

    } else {
        /**
         * If the current values match the old ones,
         * mark as inactive and push this result to GTM
         */
        if (scrollCount === previousRecord.scrollCount &&
            keyCount === previousRecord.keyCount &&
            clickCount === previousRecord.clickCount &&
            mouseMoveCount === previousRecord.mouseMoveCount &&
            touchCount === previousRecord.touchCount) {

            dataLayerPushObject.eventLabel = 'InactiveInteractionEvent';

            //Then Push non-interaction
            dataLayer.push(dataLayerPushObject);
        } else {
            //Otherwise push interaction event
            dataLayer.push(dataLayerPushObject);
        }
    }

    //Now that we're done with the current record...
    //let's tuck it away for the next comparison
    previousRecord = dataLayerPushObject;
}

window.onload = function () {

    //Zero out empty record object
    previousRecord = {
        touchCount: 0,
        mouseMoveCount: 0,
        keyCount: 0,
        scrollCount: 0,
        clickCount: 0
    };

    window.addEventListener('mousemove', function () {
        mouseMoveCount++;
        sendFirstInteraction('MouseMove');
    });

    /**
     * I'm counting touchstarts to give the approximate total number of swipes on the screen,
     * if you cared about the distance of those swipes you could track touchend as well (or instead)
     */

    window.addEventListener('touchstart', function () {
        touchCount++;
        sendFirstInteraction('Touch');
    });

    window.addEventListener('scroll', function () {
        scrollCount++;
        sendFirstInteraction('Scroll');
    });

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            keyCount++;
            sendGTMUserEvents("Return")
        } else {
            keyCount++;
            sendFirstInteraction('KeyDown');
        }
    });

    window.addEventListener('click', function () {
        clickCount++;
        sendFirstInteraction('Click');
    });

    window.setTimeout(function () {
        sendGTMUserEvents("5 seconds")
    }, 5000);

    window.setTimeout(function () {
        sendGTMUserEvents("19 seconds")
    }, 19000);

    window.setTimeout(function () {
        sendGTMUserEvents("39 seconds")
    }, 39000);

    window.setTimeout(function () {
        sendGTMUserEvents("67 seconds")
    }, 67000);

    window.setTimeout(function () {
        sendGTMUserEvents("103 seconds")
    }, 103000);

    window.setTimeout(function () {
        sendGTMUserEvents("143 seconds")
    }, 143000);

    window.setTimeout(function () {
        sendGTMUserEvents("233 seconds")
    }, 233000);

};