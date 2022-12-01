# Musical Pomodoro (Desktop)

![tomato with music notes](public/favicon.svg)

A desktop app that creates a pomodoro timer synced to the music of your choosing.
Basically, it create a pomodoro playlist synced with your music.

## How to use

### Installing

Open the exe and it should work if you are on Windows. Linux support comming soon!

#### Developing

*For devs only*

Same codebase as web extension. The Electron.js runtime loads from the root directory into index.html. Popup.html/.js and some of manager.js/App.svelte have been changed. The main development work is in the electron bridge in preload.js that allows media selection.

also NodeRT can be a bit of a pain, since it requires Windows SDK. Since it is a native node module, make sure to rebuild it using electron-rebuild after installation. You also might need to move a couple files around from Visual Studio.

### Choosing Music

* Choose from a list of processes that support media keys

*bug - only one playing media supported per process. This means that multiple browser tabs with media only support the control of one (oftentimes the most recently opened one)*

### Managing tasks

* If you don't see anything when you hit the "Open MusicalPomodoro" button, make sure that you have JavaScript enabled (if you use NoScript or something similar).

The "pomodoro" part of the extension comes from this page. Here, you can add tasks and play the playlist.
![Tasklist](https://user-images.githubusercontent.com/55459863/118384696-39a9f300-b5d6-11eb-9905-b91b840813e2.gif)
You can add tasks by adding the name, time, and if the task is done in the section labeled "Add Task." You can also edit and delete tasks as you wish. Changes are saved automatically.

#### Options

There are a variety of options available to help make your listening and playback experience as good as possible. These are summarized in the following table:
Option|Effect|Uses
------|------|-----
Make Into Playlist|This will create the "playlist" that will be synchronized with the timer.|You use this to be able to start the timer
Open Music Picker|This will allow you to choose the music playing process|You use this to play audio (if wanted)
Nuke Task list|Removes the tasks stored in your local browser storage|If your task list becomes corrupted in any way, you can reset it with this option
Export tasks to file|Creates a JSON file with all your tasks|Use this to back up if you switch browsers often.
Load tasks from file|Loads in a JSON file with tasks|Overwrites your local browser storage. Use it in combination with the above option
Speak cues|Speak the name of your task aloud when it changes, or speak "Break" when you enter a break|This mostly affects the playlist. It's useful for those that want to do work with the page out of focus

![Options](https://user-images.githubusercontent.com/55459863/118384840-922dc000-b5d7-11eb-88fb-8325b3d4ddab.gif)



### Playlists

When you click "Make into a Playlist" and there is at least one task not done, you will create a pomodoro timer. Your tasks are interspersed with 5-minute breaks. You can't edit them directly while in this state, unlike with the task list above. Click the play button to start the timer and your music.

![Playlist](https://user-images.githubusercontent.com/55459863/118384826-67dc0280-b5d7-11eb-984e-ab82fa005cd5.gif)

When you finish a task on the playlist, the task conveniently gets marked as done in the task list above. 

![Autocheck](https://user-images.githubusercontent.com/55459863/118384849-b9848d00-b5d7-11eb-98ea-848334018882.gif)

There is an estimated completion time displayed below. If you let your computer fall asleep, or pause the playlist, it gets updated automatically.


