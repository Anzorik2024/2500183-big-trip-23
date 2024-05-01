import { getRandomInt, getRandomArrayElement} from './util.js';
import {POINTS_TYPES,EventDate,offerList,DESTINATIONS_CITY} from './const.js';

const MIN_PRICE_OFFER = 20;
const MAX_PRICE_OFFER = 90;
const MIN_VALUE_POINT = 3;

const offerValue = getRandomArrayElement(offerList);

function createWaypoint() {
  return {
    id:crypto.randomUUID(),
    type: getRandomArrayElement(POINTS_TYPES),
    favoriteType: Math.random() < 0.5,
    destination: getRandomArrayElement(DESTINATIONS_CITY),
    timeStart: EventDate.START,
    timeEnd: EventDate.END,
    date:EventDate.DATE,
    price:  getRandomInt(MIN_PRICE_OFFER,MAX_PRICE_OFFER),
    eventOffer: offerValue.name,
    eventOfferPrice: offerValue.price
  };
}

function generateWaypoint() {
  return Array.from({length:MIN_VALUE_POINT},createWaypoint);
}

export {generateWaypoint};
