<script>
  import Playlist from "./Playlist.svelte";
  import Task from "./Task.svelte";
  let nextTask;
  let nextTime = 25;
  let nextDone = false;
  let userList = [];
  function addToUserList() {
    if (nextTime === undefined || nextTime > 90 || nextTime < 0) {
    } else {
      userList = [
        ...userList,
        { name: nextTask, time: nextTime, done: nextDone },
      ];
      nextTask = "";
      nextTime = 25;
      nextDone = false;
    }
    console.log(userList);
  }
  let test = false;
  export let min, breakMusic, normalMusic;
  let state = false;
  function playToggle() {
    state = !state;
  }
  function remove(id){
    userList.splice(id,1);
    userList = userList;
  }
</script>

<table>
  <thead>
    <th>Task:</th>
    <th>Time:</th>
    <th>Done?</th>
    <th>Edit?</th>
    <th>Remove?</th>
  </thead>
  <tbody>
    {#each userList as { name, time, done },id}
      <Task bind:name bind:time bind:done on:delete={() => (remove(id))}/>
    {/each}
  </tbody>
  <tfoot>
    <h4>Add Task</h4>
    <tr>
      <td><input type="text" bind:value={nextTask} /></td>
      <td>
        <input type="number" min="0" max="90" bind:value={nextTime} /> min
      </td>
      <td><input type="checkbox" bind:checked={nextDone} /></td>
      <td><button on:click={addToUserList}>+</button></td>
    </tr>
  </tfoot>
</table>
<button on:click={() => (test = !test)}>Make into Playlist : {test}</button>
{#if test}
  <button on:click={playToggle}>Play:{state}</button>
  <Playlist userListObj={userList} {min} {breakMusic} {normalMusic} {state} />
{/if}

<style>
  table {
    width: 70%;
    margin: auto;
    text-align: center;
  }
</style>
