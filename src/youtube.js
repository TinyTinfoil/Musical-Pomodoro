// Breaks out of the content script context by injecting a specially
// constructed script tag and injecting it into the page.
// From: https://github.com/intoli/intoli-article-materials/tree/master/articles/sandbox-breakout
const runInPageContext = (method, ...args) => {
  // The stringified method which will be parsed as a function object.
  const stringifiedMethod = method instanceof Function
    ? method.toString()
    : `() => { ${method} }`;

  // The stringified arguments for the method as JS code that will reconstruct the array.
  const stringifiedArgs = JSON.stringify(args);

  // The full content of the script tag.
  const scriptContent = `
    // Parse and run the method with its arguments.
    (${stringifiedMethod})(...${stringifiedArgs});

    // Remove the script element to cover our tracks.
    document.currentScript.parentElement
      .removeChild(document.currentScript);
  `;

  // Create a script tag and inject it into the document.
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = scriptContent;
  document.documentElement.prepend(scriptElement);
};
//removes the annoying "You there?" notification
//This is because the notification autopauses playback, which interferes with the timer's playback control
function removeNaggers(){
    window._lact = null
    document.querySelector('ytd-watch-flexy').youthereDataChanged_ = null;
    document.querySelector('ytd-watch-flexy').youThereManager_ = null;
    console.log("Removed 'You there?' pausing notification - Musical Pomodoro")
}
browser.runtime.onMessage.addListener(request => {
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
document.addEventListener('DOMContentLoaded', runInPageContext(removeNaggers));