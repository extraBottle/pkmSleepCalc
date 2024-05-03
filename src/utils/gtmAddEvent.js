import { useGtm } from '@gtm-support/vue-gtm';

function triggerEvent(eventName){
    const gtm = useGtm()
    gtm.trackEvent({event: eventName})
}

export { triggerEvent };