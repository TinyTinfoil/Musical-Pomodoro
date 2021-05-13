# Musical Pomodoro

![tomato with music notes](public/favicon.svg)

A browser extension that creates a pomodoro timer synced to the music of your choosing.
Basically, it create a pomodoro playlist with your music.

## How to use

### Installing

Download the zip of this extension. Then, go to about:debugging (or your browser's equivelent), and choose the file located at public/manifest.json.
This will sideload the extension in developer mode, so you can debug it as nessicary.

### Choosing Music

* Currently, the extension only supports youtube as a music provider, althogh we plan to add more

For choosing the music to play, navigate to its youtube tab. Then, click on the tomato icon and click "Pick This?" for the music that you want to play. 
Break music plays during 5 minute breaks after the tasks, while the regular music plays during the task itself.
The text will change if it's sucessful. Don't close the tab once you've picked your music.
You can open a new tab and pick the other music playlist, then once you're done, click the "Open MusicalPomodoro" button. 
This will open up the main interface, where you can create tasks.

### Managing tasks

* If you don't see anything when you hit the "Open MusicalPomodoro" button, make sure that you have javascript enabled (if you use NoScript or something simmilar).

The "pomodoro" part of the extension comes from this page. Here, you can add tasks and play the playlist.

You can add tasks by going adding the name, time, and if the task is done in the section labled "Add Task."
You can also edit and delete tasks as you wish. Changes are saved to your local browser storage automaticly.

#### Options

There are a variety of options avalible to help make your listening and playback experience as good as possible.
These are summerized in the following table:

____________________
|Option|Effect|Uses|
|-----|--------|--------
Make Into Playlist|This will create the "playlist" that is syncronised with the timer.|You use this to actually start the timer
Nuke Task lisk|Removes the tasks stored in your local browser storage|If your tasklist becomes corrupted in any way, you can reset it with this option
Export tasks to file|Creates a json file with all your tasks|Use this to back up if you switch browsers oftenly.
Load tasks from file|Loads in a json file with it's tasks|Overwrites your local browser storage. Use it in combination with the above option
Speak cues|Speak the name of your task aloud when it changes, or speak "Break!" when you enter a break| This mostly affects the playlist. It's useful for those that do work with the page out of focus
________________

### Playlists

When you click "Make into a Playlist" and there is at least one task not done, you will create a pomodoro timer.
Your tasks are interspersed with 5 minute breaks. You can't edit them directly while in this state, unlike with the task list above.
Click the play button to start the timer and your music. When you finish a task on the playlist, the task conviniently gets marked as done in the task list above.
There is an estimated completion time displayed below. If you let your computer fall asleep, or pause the playlist, it gets updated automaticlly.

## Tips

* Remember, you can play *anything* from a tab in Youtube. This includes playlists and things like the watch later queue.

* Let your music playlist be more intense than the break playlist, and within them, have lighter songs at the top and more intense songs at the bottom

* Sound effects, if you choose to use them, work best in your break playlist (although I'm thinking of adding the ability to have dedicated sound effects in the future)

* Ya can't cheat the timer. If you shut your computer away after an extended break, the timer will adjust the remaining times.

* But at the same time, make sure that you _**don't**_ make your computer sleep when you're actively working on a task or during a break, because the timer won't count it.

<sub> * If you stay up all night, the timer will become <sup>imperishable</sup> </sub> 

