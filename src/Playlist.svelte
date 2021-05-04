<script>
  import Youtube from "./Youtube.svelte";
  export let userListObj, min;
  let windowList = [];
  let index = 0;
  userListObj.forEach((e) => {
    if (e.done === false) {
      windowList.push(e);
      windowList.push({
        name: "Break",
        time: 5,
        done: undefined,
      });
    }
  });
  export let normalMusic, breakMusic;
  normalMusic.setPlaylist(
    [
      "nkPHnBWrdDI",
      "wPqHEgswMBU",
      "7YKhiqA9L_U"
    ]
  );
  breakMusic.setPlaylist(
    [
      "waMXTrx4SGw",
    ]
  );
  normalMusic.pause();
  breakMusic.pause();
  let totalTime;
  let estimatedComplete = { _hour: 0, _min: 0 };
  export let hour;
  let playing = false;
  let accumulator = 0;
  function playMusic(){
    if (windowList[index].done === undefined) {
        normalMusic.pause();
        breakMusic.play();
      } else {
        normalMusic.play();
        breakMusic.pause();
      }
  }
  function updr() {
    if (!playing) return;
    if (windowList[index].time > 0) {
      windowList[index].time--;
    } else if (windowList.length > index) {
      windowList[index].done = true;
      index++;
      playMusic();
    }
    windowList = windowList;
  }
  $: {
    min;
    updr();
    accumulator = 0;
    for (let item of windowList) {
      accumulator += item.time;
    }
    totalTime = accumulator;
    estimatedComplete = {
      _hour: hour,
      _min: min,
    };
    if (estimatedComplete._min + totalTime >= 60) {
      estimatedComplete._hour++;
      if (estimatedComplete._hour == 24) estimatedComplete._hour = 0;
      estimatedComplete._min = estimatedComplete._min + (totalTime % 60);
    } else estimatedComplete._min += totalTime;
  }
  $:{
    if(!playing) {
      normalMusic.pause()
      breakMusic.pause()
    } else{
      playMusic()
    }
  }
</script>

{#each windowList as { name, time, done }}
  <br />
  <span>{name}</span>
  <span>{time} min</span>
  {#if done !== undefined}<input
      type="checkbox"
      bind:checked={done}
      disabled
    />{/if}
{/each}

<button
  on:click={() => {
    playing = !playing;
  }}>Play this</button
>
{#if (playing)}
  <p>Now Playing</p>
{/if}
<p>Playlist has {totalTime} minutes remaining. This will finish at aprox. {estimatedComplete._hour % 12 || 12}:{estimatedComplete._min < 10 ? "0" + estimatedComplete._min : estimatedComplete._min}
  {estimatedComplete._hour > 12 ? "PM" : "AM"}</p>