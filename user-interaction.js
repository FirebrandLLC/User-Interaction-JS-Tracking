/**
 * @file Sends Google Analytics events when users interact with page or if they are inactive for specified periods.
 * @version 1.0
 * @author Firebrand LLC. https://firebrand.net
 * @license Apache-2.0
 */

/**
 *
 * @returns { {} }
 * @constructor
 */
FirebrandUserInteractionEvents = function () {
    /**
     * The object in which user events are stored
     * @type { { mouseMoveCount: number, touchCount: number, keyCount: number, scrollCount: number, clickCount: number, isFirstInteraction: boolean, previousRecord: {} } }
     */
    var userInteractionTracking = {

        //How many times a mouse event was registered
        mouseMoveCount: 0,

        //How many times a touchstart event was registered
        touchCount: 0,

        //How many times a keydown was registered
        keyCount: 0,

        //How many scroll events
        scrollCount: 0,

        //How many click events
        clickCount: 0,

        //A flag which is used to send off the first interaction immediately (in case the user leaves before the first time-step send)
        isFirstInteraction: true,

        //This object stores the previous values from the last send to GTM so we can compare if the user did anything between time-steps
        previousRecord: {}
    };

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
        if (userInteractionTracking.isFirstInteraction) {
            sendGTMUserEvents(interactionType, true);
            userInteractionTracking.isFirstInteraction = false;
        }
    }

    var $body = jQuery('body');

//Zero out empty record object
    userInteractionTracking.previousRecord = {
        touchCount: 0,
        mouseMoveCount: 0,
        keyCount: 0,
        scrollCount: 0,
        clickCount: 0
    };

    $body.on('mousemove', function () {
        userInteractionTracking.mouseMoveCount++;
        sendFirstInteraction('MouseMove');
    });

    /**
     * I'm counting touchstarts to give the approximate total number of swipes on the screen,
     * if you cared about the distance of those swipes you could track touchend as well (or instead)
     */
    $body.on('touchstart', function () {
        userInteractionTracking.touchCount++;
        sendFirstInteraction('Touch');
    });

    jQuery(window).on('scroll', function () {
        userInteractionTracking.scrollCount++;
        sendFirstInteraction('Scroll');
    });

    jQuery(document).keydown(function (event) {

        if (event.keyCode === 13) {
            userInteractionTracking.keyCount++;
            sendGTMUserEvents("Return")
        } else {
            userInteractionTracking.keyCount++;
            sendFirstInteraction('KeyDown');
        }
    });

    $body.click(function () {
        userInteractionTracking.clickCount++;
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


    /**
     * This function is fired every time we have a chunk of data we want to
     * send back to google analytics, via google tag manager's DataLayer push,
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
            "eventCategory": "Firebrand User Events",
            "eventAction": interactionType,
            "eventLabel": 'Active Interaction',
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

            if (userInteractionTracking.scrollCount === userInteractionTracking.previousRecord.scrollCount &&
                userInteractionTracking.keyCount === userInteractionTracking.previousRecord.keyCount &&
                userInteractionTracking.clickCount === userInteractionTracking.previousRecord.clickCount &&
                userInteractionTracking.mouseMoveCount === userInteractionTracking.previousRecord.mouseMoveCount &&
                userInteractionTracking.touchCount === userInteractionTracking.previousRecord.touchCount) {

                dataLayerPushObject.eventLabel = 'Inactive Interaction';

                //Then Push non-interaction
                dataLayer.push(dataLayerPushObject);
            } else {
                //Otherwise push interaction event
                dataLayer.push(dataLayerPushObject);
            }
        }

        //Now that we're done with the current record...
        //let's tuck it away for the next comparison
        userInteractionTracking.previousRecord = {
            mouseMoveCount: userInteractionTracking.mouseMoveCount,
            touchCount: userInteractionTracking.touchCount,
            keyCount: userInteractionTracking.keyCount,
            scrollCount: userInteractionTracking.scrollCount,
            clickCount: userInteractionTracking.clickCount,
            isFirstInteraction: userInteractionTracking.isFirstInteraction,
        };
    }

    return {}
};

jQuery(document).ready(function () {
    if (typeof jQuery !== 'function') {
        console.warn('jQuery is not defined!');
    } else {
        FirebrandUserInteractionEvents();
    }
});