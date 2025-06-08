<script>
  export let name, time, done;
  let disabled = true;
  let active = false;
  let oldtime = time;
  function toggle() {
    if (active && (time > 90 || time < 0 || !time)) {
      time = oldtime;
    } else {
      oldtime = time;
    }
    disabled = !disabled;
    active = !active;
  }
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  function remove() {
    dispatch('delete');
  }
</script>

<tr>
  <td><input type="text" bind:value={name} {disabled} /></td>
  <td
    ><input type="number" min="0" max="90" bind:value={time} {disabled} /> min
  </td>
  <td><input type="checkbox" {disabled} bind:checked={done} /></td>
  <td
    ><button on:click={toggle} class:active
      ><img src="images/edit.svg" alt="Edit Item" /></button
    ></td
  >
  <td><button on:click={remove}><img src="images/trash-alt.svg" alt="Remove Item"/></button></td>
</tr>

<style>
  button {
    width: auto;
  }
  img {
    width: 20px;
    height: 22.85px;
  }
  .active {
    background-color: rgb(39, 99, 39);
  }
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
