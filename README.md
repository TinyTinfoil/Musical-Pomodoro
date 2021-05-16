# Musical Pomodoro

![tomato with music notes](public/favicon.svg)

A browser extension that creates a pomodoro timer synced to the music of your choosing.
Basically, it create a pomodoro playlist synced with your music.

## How to use

### Installing

Download the zip of this extension. Then, go to about:debugging (or your browser's equivalent), and choose the file located at public/manifest.json. This will side load the extension in developer mode, so you can debug it as necessary. Hopefully, I'll be able to release it through offical browser web stores, but in the meantime, you'll have to use this method.

#### Developing

*For devs only*

You'll need to clone the directory and then run `npm install` to install all the dependencies. The MusicalPomodoro page itself is written with lots of [svelte](https://svelte.dev) components, while the other parts of the extension are pure Javascript and HTML. This extension uses the WebExtensions [polyfill](https://github.com/mozilla/webextension-polyfill#basic-setup) directly inside the public folder, where the popup.html and index.html are also stored.
Use `npm run build` to build the extension inside the public directory. `npm run dev` works only with the extension page.

### Choosing Music

* Currently, the extension only supports YouTube as a music provider, although we plan to add more options for playing music

For choosing the music to play, navigate to its YouTube tab. Then, click on the tomato icon and click "Pick This?" for the music that you want to play. Break music plays during 5-minute breaks after the tasks, while the regular music plays during the task itself. The text will change if it's successful. Don't close the tab once you've picked your music if you want it to be controlled by the extension. You can open a new tab and pick the other music playlist, then once you're done, click the "Open MusicalPomodoro" button. This will open up the main interface, where you can create tasks.

### Managing tasks

* If you don't see anything when you hit the "Open MusicalPomodoro" button, make sure that you have JavaScript enabled (if you use NoScript or something similar).

The "pomodoro" part of the extension comes from this page. Here, you can add tasks and play the playlist.
![Tasklist](https://user-images.githubusercontent.com/55459863/118384696-39a9f300-b5d6-11eb-9905-b91b840813e2.gif)
You can add tasks by adding the name, time, and if the task is done in the section labeled "Add Task." You can also edit and delete tasks as you wish. Changes are saved to your local browser storage automatically.

#### Options

There are a variety of options available to help make your listening and playback experience as good as possible. These are summarized in the following table:
Option|Effect|Uses
------|------|-----
Make Into Playlist|This will create the "playlist" that will be synchronized with the timer.|You use this to be able to start the timer
Nuke Task list|Removes the tasks stored in your local browser storage|If your task list becomes corrupted in any way, you can reset it with this option
Export tasks to file|Creates a JSON file with all your tasks|Use this to back up if you switch browsers often.
Load tasks from file|Loads in a JSON file with tasks|Overwrites your local browser storage. Use it in combination with the above option
Speak cues|Speak the name of your task aloud when it changes, or speak "Break!" when you enter a break|This mostly affects the playlist. It's useful for those that want to do work with the page out of focus

![Options](https://user-images.githubusercontent.com/55459863/118384840-922dc000-b5d7-11eb-88fb-8325b3d4ddab.gif)



### Playlists

When you click "Make into a Playlist" and there is at least one task not done, you will create a pomodoro timer. Your tasks are interspersed with 5-minute breaks. You can't edit them directly while in this state, unlike with the task list above. Click the play button to start the timer and your music.

![Playlist](https://user-images.githubusercontent.com/55459863/118384826-67dc0280-b5d7-11eb-984e-ab82fa005cd5.gif)

When you finish a task on the playlist, the task conveniently gets marked as done in the task list above. 

![Autocheck](https://user-images.githubusercontent.com/55459863/118384849-b9848d00-b5d7-11eb-98ea-848334018882.gif)

There is an estimated completion time displayed below. If you let your computer fall asleep, or pause the playlist, it gets updated automatically.




## Tips

* Remember, you can play *anything* from a tab on YouTube. This includes playlists and things like the watch later queue.
* Let your music playlist be more intense than the break playlist, and within them, have lighter songs at the top and more intense songs at the bottom
* Sound effects, if you choose to use them, work best in your break playlist (although I'm thinking of adding the ability to have dedicated sound effects in the future)
* Ya can't cheat the timer. If you shut your computer away after an extended break, the timer will adjust the remaining times.
* But at the same time, make sure that you **don't make your computer sleep when you're actively working on a task or during a break**, because the timer won't count it.

<sup><sub>If you stay up all night, the timer and the night might become imperishable</sub></sup> 
