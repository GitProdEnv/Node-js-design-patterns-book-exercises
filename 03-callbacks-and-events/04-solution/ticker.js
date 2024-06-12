import { EventEmitter } from "events";

function isDivisibleByFive(timestamp) {
  return timestamp % 5 === 0;
}

function isTickerValid(timestamp) {
  return !isDivisibleByFive(timestamp);
}

const WITH_TIME_DIVISION = true;

export function ticker(ms, tickInterval, cb) {
  let tickCount = 0;
  const emitter = new EventEmitter();
  const timestamp = Date.now();

  if (ms <= 0) {
    throw new Error('Ticker must have a positive number');
  }  

  if (WITH_TIME_DIVISION && !isTickerValid(timestamp)) {
    process.nextTick(() => {
      emitter.emit('error', timestamp, tickCount);
      cb(new Error("Timestamp divisible by 5.", { cause: { values: [timestamp, tickCount] }}));
    })

    return emitter;
  }

  // ZALDO. The same happens for event emitters.
  // For clarification we send along the tickCount on the "tick" event. (This was not asked in the book!)
  // notice, without process.nextTick, the first tick will not be called on our listener. You won't see `Tick: 0`.
  // That's because the function emits the event synchronously, before we listen on the event.
  // emitter.emit('tick!'); // uncomment for demonstration.
  process.nextTick(() => { emitter.emit('tick', 0); });

  function tick(timeRemainingMs) {
    if (timeRemainingMs <= 0) {
      return cb(null, tickCount);
    }

    setTimeout(() => {
      const timestamp = Date.now();
      
      if (WITH_TIME_DIVISION && !isTickerValid(timestamp)) {
        emitter.emit('error', timestamp, tickCount);
        cb(new Error("Timestamp divisible by 5.", { cause: { values: [timestamp, tickCount] }}));
        return;
      }

      emitter.emit('tick', tickCount);
      tick(timeRemainingMs - tickInterval);
    }, tickInterval);

    tickCount++;
  }

  tick(ms);

  return emitter;
}