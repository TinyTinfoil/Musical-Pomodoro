<script>
import { userList } from "./stores";
export let userListObj, min;
  let windowList = [];
  let index = 0;
  userListObj.forEach((e,i) => {
    if (e.done === false) {
      windowList.push({...e,callback:()=>{
        $userList[i].done = true;
      }});
      windowList.push({
        name: "Break",
        time: 5,
        done: undefined,
      });
    }
  });
  export let normalMusic, breakMusic;
  normalMusic.pause();
  breakMusic.pause();
  let totalTime;
  let estimatedComplete = { _hour: 0, _min: 0 };
  export let hour;
  let playing = false;
  let accumulator = 0;
  export let speak = false;
  function playMusic(){
    if (windowList[index].done === undefined) {
        normalMusic.pause();
        breakMusic.play();
        
      } else {
        normalMusic.play();
        breakMusic.pause();
      }
    if (speak) speechSynthesis.speak(new window.SpeechSynthesisUtterance(windowList[index].name));
  }
  function updr() {
    if (!playing) return;
    if (windowList[index].time > 0) {
      windowList[index].time--;
    } else if (windowList.length > index) {
      windowList[index].done = true;
      if(windowList[index].callback!=null) windowList[index].callback();
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
      _hour: (hour + Math.floor((min + totalTime) / 60)) % 24,
      _min : (min+totalTime)%60
    }
  }
  $: if(!playing) {
      normalMusic.pause()
      breakMusic.pause()
    } else{
      playMusic()
    }
</script>

<table>
{#each windowList as { name, time, done }}
  <tr>
  <td>{name}</td>
  <td>{time} min</td>
  {#if done !== undefined}<td><input
      type="checkbox"
      bind:checked={done}
      disabled
    /></td>{/if}
    </tr>
{/each}
</table>

<button
  on:click={() => {
    playing = !playing;
  }}><img src={playing ? "images/stop-circle.svg":"images/play-circle.svg"} width="32" alt={playing ? "Stop Playing?":"Play?"}></button
>
<p>Playlist has {totalTime} minutes remaining. This will finish at aprox. {estimatedComplete._hour % 12 || 12}:{estimatedComplete._min < 10 ? "0" + estimatedComplete._min : estimatedComplete._min}
  {estimatedComplete._hour > 12 ? "PM" : "AM"}</p>
<style>
  input[type="checkbox"]{
    appearance: none;
    content : url("../images/square.svg");
    width : 2.5em;
  }
  input:checked{
    appearance: none;
    content : url("../images/check-square.svg");
    width : 2.5em;
  }
</style>