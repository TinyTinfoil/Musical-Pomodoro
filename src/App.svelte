<script>
  import Tasklist from "./Tasklist.svelte";
  import Header from "./Header.svelte";
  import Playlist from "./Playlist.svelte";
  import Youtube from "./Youtube.svelte";
  import { userList } from "./stores.js";
  export let version;
  let interval = 1000; // ms
  let expected = Date.now() + interval;
  let t = new Date();
  let deltaTime = t.getSeconds();
  let hour = t.getHours();
  let min = t.getMinutes();
  let drift_history = [];
  let drift_history_samples = 10;
  let drift_correction = 0;

  function calc_drift(arr) {
    // Calculate drift correction.

    /*
  In this example I've used a simple median.
  You can use other methods, but it's important not to use an average. 
  If the user switches tabs and back, an average would put far too much
  weight on the outlier.
  */

    var values = arr.concat(); // copy array so it isn't mutated

    values.sort(function (a, b) {
      return a - b;
    });
    if (values.length === 0) return 0;
    var half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    var median = (values[half - 1] + values[half]) / 2.0;

    return median;
  }

  setTimeout(step, interval);
  function step() {
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
      // something really bad happened. Maybe the browser (tab) was inactive?
      // possibly special handling to avoid futile "catch up" run
      console.log(
        "Significant time drift ... Correcting ... (if you get this message many times, please contact us, because it's likely a bug)"
      );
      t = new Date();
      hour = t.getHours();
      min = t.getMinutes();
      deltaTime = t.getSeconds();
    }
    // do what is to be done
    deltaTime++;
    // don't update the history for exceptionally large values
    if (dt <= interval) {
      // sample drift amount to history after removing current correction
      // (add to remove because the correction is applied by subtraction)
      drift_history.push(dt + drift_correction);

      // predict new drift correction
      drift_correction = calc_drift(drift_history);

      // cap and refresh samples
      if (drift_history.length >= drift_history_samples) {
        drift_history.shift();
      }
    }
    expected += interval;
    // take into account drift with prediction
    setTimeout(step, Math.max(0, interval - dt - drift_correction));
  }

  $: {
    if (deltaTime === 60) {
      min++;
      deltaTime = 0;
    }
    if (min >= 60) {
      hour++;
      min = 0;
    }
    if (hour == 24) {
      hour = 0;
    }
  }
  let plist = false;
  function messanger(id, message, callback) {
    browser.tabs.sendMessage(id, ({}[message] = true)).then((response) => {
      console.log("Message from the content script:");
      console.log(response, message);
      callback();
    });
  }
  let normalMusic,breakMusic;
  normalMusic.play = () => (messanger(testing,"play")
  normalMusic.pause = () => (messanger(testing,"pause")
  breakMusic.play = () => (messanger(testing2,"play")
  breakMusic.pause = () => (messanger(testing2,"pause")
</script>

<main>
  <Header {version} {hour} {min} />
  <p>{t}</p>
  <p>
    {deltaTime}
  </p>
  <Tasklist />
  <br />

  <Youtube videoId="g8K21P8CoeI" bind:this={normalMusic} />
  <Youtube videoId="XI7Cxdj2pAQ" bind:this={breakMusic} />
  <!-- <Playlist /> -->
  <button
    on:click={function () {
      plist = !plist;
    }}>Make into Playlist : {plist}</button
  >
  {#if plist && $userList != []}
    <Playlist userListObj={$userList} {min} {hour} {breakMusic} {normalMusic} />
  {/if}
</main>
