<script>
  export let version;
  export let hour, min;
  let desc = "";
  $: if (hour === 23) {
    desc = "Hour of the Rat";
  } else if (hour === 0) {
    desc = "Midnight";
  } else if (hour === 1) {
    desc = "Hour of the Ox";
  } else if (hour === 2) {
    desc = "Late Hour";
  } else if (hour === 3) {
    desc = "Hour of the Tiger";
  } else if (hour === 4) {
    desc = "Morning Hour";
  } else if (hour === 5) {
    desc = "Daybreak";
  } else {
    desc = version;
  }
</script>

<h1>
  {hour % 12 || 12}:{min < 10 ? "0" + min : min}
  {hour > 12 ? "PM" : "AM"}
  <br />
  <sub>{desc}</sub>
</h1>
<h2>Musical Pomodoro</h2>

<style>
  h1 {
    width: fit-content;
    width: -moz-fit-content;
    display: inline-block;
  }
  sub {
    font-size: 10px;
    float: right;
  }
  h2 {
    float: right;
    margin-right: 5%;
  }
</style>
