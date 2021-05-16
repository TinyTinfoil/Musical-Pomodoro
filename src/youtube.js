browser.runtime.onMessage.addListener(request => {
  if (request.exists) {
    return Promise.resolve(true);
  }
  if(request.setup){
    if(document.querySelector("video.html5-main-video")!=null){
        return Promise.resolve(true);
    } else{
        return Promise.resolve(false);
    }
}
if(request.pause){
    document.querySelector("video.html5-main-video").pause();
    return Promise.resolve(true);
}
if(request.play){
    document.querySelector("video.html5-main-video").play();
    return Promise.resolve(true);
}
});
//removes the "You there?" notification
//This is because the notification autopauses playback, which interferes with the timer's playback control
document.addEventListener('DOMContentLoaded', () => {
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = `(function (){
    window._lact = null
    document.querySelector('ytd-watch-flexy').youthereDataChanged_ = null;
    document.querySelector('ytd-watch-flexy').youThereManager_ = null;
    console.log("Removed 'You there?' pausing notification - Musical Pomodoro")
    })();
    document.currentScript.parentElement
    .removeChild(document.currentScript);`;
  document.documentElement.prepend(scriptElement);
});