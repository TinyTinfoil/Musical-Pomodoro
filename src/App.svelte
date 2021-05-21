<script>
  import Tasklist from "./Tasklist.svelte";
  import Header from "./Header.svelte";
  import Playlist from "./Playlist.svelte";
  import { userList } from "./stores.js";
  import { onDestroy } from "svelte";
  
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
    let values = arr.concat(); // copy array

    values.sort(function (a, b) {
      return a - b;
    });
    if (values.length === 0) return 0;
    let half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    let median = (values[half - 1] + values[half]) / 2.0;

    return median;
  }

  setTimeout(step, interval);
  function step() {
    let dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
      console.log(
        "Significant time drift ..."
      );
      t = new Date();
      hour = t.getHours();
      min = t.getMinutes();
      deltaTime = t.getSeconds();
    }
    deltaTime++;
    if (dt <= interval) {
      drift_history.push(dt + drift_correction);
      drift_correction = calc_drift(drift_history);
      if (drift_history.length >= drift_history_samples) {
        drift_history.shift();
      }
    }
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt - drift_correction));
  }

  $: if (deltaTime === 60) {
    min++;
    deltaTime = 0;
  }
  $: if (min >= 60) {
    hour++;
    min = 0;
  }
  $: if (hour === 24) {
    hour = 0;
  }
  let plist = false;
  async function messanger(id, message) {
    return await browser.tabs.sendMessage(id, { [message]: true });
  }
  let normalMusic = {};
  let breakMusic = {};
  normalMusic.play = async () =>
    messanger(
      await browser.runtime.sendMessage({ GetID: "normalMusic" }),
      "play"
    );
  normalMusic.pause = async () =>
    messanger(
      await browser.runtime.sendMessage({ GetID: "normalMusic" }),
      "pause"
    );
  breakMusic.play = async () =>
    messanger(
      await browser.runtime.sendMessage({ GetID: "breakMusic" }),
      "play"
    );
  breakMusic.pause = async () =>
    messanger(
      await browser.runtime.sendMessage({ GetID: "breakMusic" }),
      "pause"
    );

  if (localStorage.getItem("userList") != null)
    Object.assign($userList, JSON.parse(localStorage.getItem("userList")));
  const unsubscribe = userList.subscribe(() =>
    localStorage.setItem("userList", JSON.stringify($userList))
  );
  onDestroy(unsubscribe);

  function nuke() {
    $userList = [];
    localStorage.removeItem("userList");
  }
  let speak = false;
</script>

<main>
  <Header {version} {hour} {min} />
  <Tasklist />
  <details open>
    <summary>Options</summary>
  <button
    on:click={function () {
      if ($userList.length !== 0) plist = !plist;
    }}>Make into Playlist : {plist}</button
  >
  <button on:click={nuke}>Nuke Task List (removes cache)</button>
  <button
    on:click={function () {
      let dl = document.createElement("a");
      dl.setAttribute(
        "href",
        "data:application/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify($userList))
      );
      dl.setAttribute("download", "tasks.json");
      dl.click();
    }}
    >Export tasks to file <img
      src="images/save.svg"
      width="16"
      alt="Save to file"
    /></button
  ><button>
    <label>
      <input
        type="file"
        style="display: none;"
        on:change={async function () {
          let f = await this.files[0].text();
          $userList = JSON.parse(f);
        }}
      />
      Load tasks from file
    </label></button
  >
  <label style="display:inline;">
    <input type="checkbox" bind:checked={speak} />
    Speak cues
  </label>
</details>
  {#if plist}
    <Playlist
      userListObj={$userList}
      {speak}
      {min}
      {hour}
      {breakMusic}
      {normalMusic}
    />
  {/if}
</main>

<style>
  :global(input:disabled) {
    border-width: 0px;
    border: none;
    background-color: initial;
    color: initial;
  }
  :global(table) {
    width: 70%;
    margin: auto;
    text-align: center;
  }
  main{
    margin: 0% 1em;
  }
  :global(body){
    background: linear-gradient(crimson,white);
  }
  :global(button){
  background-color:slategray;
  border: none;
  padding: 15px 32px;
  margin: 1em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
	font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif;
  }
</style>
