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
  export let normalMusic, breakMusic, state;
  normalMusic.setPlaylist([
  "nkPHnBWrdDI",
  "wPqHEgswMBU",
  "7YKhiqA9L_U",
  "vJjc5Wt6rJ0",
  "UCaexiaNWHA",
  "zxsit6vn7Co",
  "FdUed2x5yfo",
  "h9exxibPjF4",
  "IKNUbNzAYGs",
  "0G3RYk2YbaY",
  "SaB2Xh3KNp0",
  "q7mVzgBibaU",
  "tFemvMsbipw",
  "1_lpdtkovyw",
  "-6GmUKrlCM0",
  "5erHIwYAsFc",
  "zh-vLDwgKY4",
  "cGs-vYIdrUc",
  "4Kga0hz8KYk",
  "LcmjFC4-qPI",
  "TlZCP-rcQaA",
  "YX05LWM6zOw",
  "FQs9cV0jycg",
  "k-3y2LVF_SE",
  "52uNxK7qdxc",
  "ha0HbaJPl64",
  "2Z3sTwsC4Q4",
  "M6ukpNepHCY",
  "cywf8AbDi_4",
  "oJ6mV8Mz-js",
  "hiZVOTB7f8A",
  "zG_tQZMUK00",
  "Dp9nGccaPNE",
  "mn_Sa0ZAXeI",
  "fCiHSZzuwdc",
  "aLVr0VfeLmk",
  "KY-iiHml9Lo",
  "1ZQvpIVn3ZY",
  "qeL--5yCdDA",
  "-1EPegIzD2M",
  "J_mFvJ6y_3I",
  "e0mTMGYzWms",
  "o0UlGDsH2R4",
  "mLXtuvYyk-A",
  "4W28wWWxKuQ",
  "Q2NMceQvd64",
  "yuySSmW5cfo",
  "OrxEVT0wHMc",
  "zqP2tIxaY90",
  "n9Y2giJ6kDM",
  "LsqCcu10YO8",
  "tYjOp6v3KhE",
  "hkuQVT6Irsk",
  "R9DAvY45Gzs",
  "nbbsw5lLsoo",
  "vvnzu0Nu6tI",
  "iG9-MwFYC-o",
  "DjiEoY9kfB4",
  "PEoJTEzcmiI",
  "ypynP-vhsZI",
  "PXxHI9dQGYE",
  "ZwP8XHLvBI4",
  "r7JH6EieP8w",
  "K88XMWvnOqg",
  "0bigS535rl8",
  "5QxnOER5Hdc",
  "-jU5p8Y-9qY",
  "k51ZlNpBZmM",
  "_vzBAHwIJJs",
  "5EYajAeYEgQ",
  "e1CMaS9pokM",
  "FSLNuTGQHs4",
  "4GnAZvyyC4c",
  "kQknzKl9ym8",
  "JjHPGJ3wr5E",
  "IZuKt2TPVSo",
  "1Zrq8FiKS6A",
  "YGy0mGwZtok",
  "U9_3ucD66hI",
  "tkDlc-xxNs8",
  "HM2JpZg-Qx0",
  "2VPhdMORsAQ",
  "K87qZZkG2fw",
  "Yvr15O0TVtc",
  "0hvY-CXJVlY"
].reverse());
  breakMusic.setPlaylist([
  "gLrj8atz67k",
  "cf3PtLGjU5I",
  "qcGy-8KbE8E",
  "RrXp7jKybgg",
  "H2oHKSZ12qw",
  "GTeQ-4_XW0w",
  "cS1qN9SZtd8",
  "YfCA4qAitNU",
  "vVYwYg5XNd8",
  "bvd4XdQsMjQ",
  "Xhy3G7-2fcY",
  "4sdBPRliIkM",
  "LXq0O0b5wAY",
  "r3C-FrmHn44",
  "TpLx3iDxPv8",
  "kMnC7kTUd3E",
  "TkySI0bQm3I",
  "Ab8uXlfxlfk",
  "Uj8MsbgpjaQ",
  "Sc_QWB2zwi8",
  "d6tV0cr9zYI",
  "HuINhsEizk8",
  "2wPL9PoLqFY",
  "mFXOJ1mkKtI",
  "b6ci3u2mJVw",
  "qTSGnjoQA2A",
  "euADZxFYfXw",
  "RgbP4WO90Zg",
  "NpJD2MecgJw",
  "siy0pWdUrOs",
  "KIDYGGu2Mak",
  "waMXTrx4SGw"
].reverse());
  normalMusic.play();
  breakMusic.pause();
  $: {
    min;
    if (windowList[index].time > 0) {
       windowList[index].time--;
    } else if (windowList.length > index) {
      windowList[index].done = true;
      index++;
      if (windowList[index].done === undefined) {
        normalMusic.pause();
        breakMusic.play();
      } else {
        normalMusic.play()
        breakMusic.pause()
      };
    }
    windowList = windowList;
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
