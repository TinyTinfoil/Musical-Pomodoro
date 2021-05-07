<script>
  import Task from "./Task.svelte";
  import { userList } from "./stores.js";
  import { onDestroy } from "svelte";
  if (localStorage.getItem('userList')!=null) Object.assign($userList, JSON.parse(localStorage.getItem('userList')));
  const unsubscribe = userList.subscribe(() => (localStorage.setItem('userList', JSON.stringify($userList))))
  onDestroy(unsubscribe)
  let nextTask;
  let nextTime = 25;
  let nextDone = false;
  function addToUserList() {
    if (nextTime === undefined || nextTime > 90 || nextTime < 0) {
    } else {
      $userList = [
        ...$userList,
        { name: nextTask, time: nextTime, done: nextDone },
      ];
      nextTask = "";
      nextTime = 25;
      nextDone = false;
    }
    console.log($userList);
  }
  function remove(id){
    $userList.splice(id,1);
    $userList = $userList;
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
    {#each $userList as { name, time, done },id}
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


<style>
  table {
    width: 70%;
    margin: auto;
    text-align: center;
  }
</style>
