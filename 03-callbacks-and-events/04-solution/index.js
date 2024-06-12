import { ticker } from './ticker.js';

const TICK_INTERVAL_MS = 50;

ticker(
  1000,
  TICK_INTERVAL_MS,
  (err, ticks) => {
    if (err) {
      console.log(`Callback Error: ${err.message}, Timestamp: ${err.cause.values[0]}, Iteration: ${err.cause.values[1]}.`);
    } else {
      console.log(`Ticked times:  ${ticks}.`);
    }
  }
)
  .on("tick", (count) => { console.log("Tick: ", count); })
  .on("error", (_timestamp, tickCount) => { console.error(`Event: Error occurred. Failed at tick: ${tickCount}`); })
