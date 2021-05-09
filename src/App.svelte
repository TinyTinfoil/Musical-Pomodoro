<script>
  import Tasklist from "./Tasklist.svelte";
  import Header from "./Header.svelte";
  import Playlist from "./Playlist.svelte";
  import { userList } from "./stores.js";
import { onDestroy } from "svelte";
import { text } from "svelte/internal";
  //import { browser } from "node:process";
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
  async function messanger(id,message){
    let resp = await browser.tabs.sendMessage(id,{[message]:true});
    console.log("Message from the content script:");
    console.log(resp,message);
    return resp;
 }
  let normalMusic = {};
  let breakMusic = {};
  normalMusic.play = async ()  => messanger(await browser.runtime.sendMessage({"GetID":"normalMusic"}),"play");
  normalMusic.pause = async () => messanger(await browser.runtime.sendMessage({"GetID":"normalMusic"}),"pause");
  breakMusic.play = async () => messanger(await browser.runtime.sendMessage({"GetID":"breakMusic"}),"play");
  breakMusic.pause = async () => messanger(await browser.runtime.sendMessage({"GetID":"breakMusic"}),"pause");

  if (localStorage.getItem('userList')!=null) Object.assign($userList, JSON.parse(localStorage.getItem('userList')));
  const unsubscribe = userList.subscribe(() => (localStorage.setItem('userList', JSON.stringify($userList))))
  onDestroy(unsubscribe)

  function nuke () {
      $userList = [];
      localStorage.removeItem('userList');
    }
    let speak = false;
</script>

<main>
  <Header {version} {hour} {min} />
  <p>{t}</p>
  <p>
    {deltaTime}
  </p>
  <Tasklist />
  <br />
  <button
    on:click={function () {
      plist = !plist;
    }}>Make into Playlist : {plist}</button
  >
  <button
    on:click={nuke}>Nuke Task List (removes cache)</button
  >
  <button
    on:click={
      function() {
  var dl = document.createElement('a');
  dl.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($userList)));
  dl.setAttribute('download', 'tasks.json');
  dl.click();
}
}>Export tasks to file</button
  >
  <input type=file on:change={
    async function() {
      let f = await this.files[0].text();
      $userList = JSON.parse(f)
    }
  }>
  <label>
  <input type=checkbox bind:checked={speak}>
  Speak cues
</label>

  {#if plist && $userList != []}
    <Playlist userListObj={$userList} {speak} {min} {hour} {breakMusic} {normalMusic} />
  {/if}
</main>
