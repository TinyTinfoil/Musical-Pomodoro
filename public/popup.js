function openUI() {
	browser.tabs.create({
		url:"/index.html"
	});
}const delay = time => new Promise(res=>setTimeout(res,time));
async function messanger(id,message){
    let resp = await browser.tabs.sendMessage(id,{[message]:true});
    return resp;
 }
 let musicId,breakId;
 document.addEventListener('DOMContentLoaded', async function() {
    tabId = await browser.tabs.query({currentWindow: true, active: true}).then((tabs) => tabs[0].id);
    document.getElementById('openUI').addEventListener('click', function() {
        openUI();
    });
    if (!await browser.tabs.sendMessage(tabId,{"exists":true}).catch(()=> false)) {
        document.getElementById('MusicPick').innerText = "Not YouTube, can't pick";
        document.getElementById('BreakPick').innerText = "Not YouTube, can't pick";
        return;
    }
 	musicIdIndex = await browser.runtime.sendMessage({"GetIDIndex":"normalMusic"});
	breakIdIndex = await browser.runtime.sendMessage({"GetIDIndex":"breakMusic"});
    document.getElementById('MusicPick').innerText = (musicIdIndex<0) ? "Pick tab?" : ((musicId===tabId) ? "This Tab!" : "Tab #"+musicIdIndex);
    document.getElementById('BreakPick').innerText = (breakIdIndex<0) ? "Pick tab?" : ((breakId===tabId) ? "This Tab!" : "Tab #"+breakIdIndex);
    
    document.getElementById('MusicPick').addEventListener('click', async function() {
        await browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => musicId = tabs[0].id);
        await browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => musicIdIndex = tabs[0].index+1);
        await messanger(musicId,"setup");
        if(breakId!=musicId){
            browser.runtime.sendMessage({"SetID":{name:"normalMusic",value:musicId}});
            browser.runtime.sendMessage({"SetIDIndex":{name:"normalMusic",value:musicIdIndex}});
            document.getElementById('MusicPick').innerText = "Tab #" + await browser.runtime.sendMessage({"GetIDIndex":"normalMusic"});
        } else {
            document.getElementById('MusicPick').innerText = "Break and music tabs are the same";
            await delay(2000);
            document.getElementById('MusicPick').innerText = "Pick tab?";
        }
    });
    document.getElementById('BreakPick').addEventListener('click', async function() {
        await browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => breakId = tabs[0].id);
        await browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => breakIdIndex = tabs[0].index+1);
        await messanger(breakId,"setup");
        if(breakId!=musicId){
            browser.runtime.sendMessage({"SetID":{name:"breakMusic",value:breakId}});
            browser.runtime.sendMessage({"SetIDIndex":{name:"breakMusic",value:breakIdIndex}});
            document.getElementById('BreakPick').innerText = "Tab #" + await browser.runtime.sendMessage({"GetIDIndex":"breakMusic"});
        }  else {
            document.getElementById('MusicPick').innerText = "Break and music tabs are the same";
            await delay(2000);
            document.getElementById('MusicPick').innerText = "Pick tab?";
        }
    });
}
);
