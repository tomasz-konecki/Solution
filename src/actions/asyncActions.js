import { ASYNC_STARTED, ASYNC_ENDED } from "../constants";

export const asyncStarted = () => ({
  type: ASYNC_STARTED
});

export const asyncEnded = () => ({
  type: ASYNC_ENDED
});
