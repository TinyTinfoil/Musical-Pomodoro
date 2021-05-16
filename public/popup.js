function openUI() {
	browser.tabs.create({
		url:"/index.html"
	});
}async function messanger(id,message){
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
 	musicId = await browser.runtime.sendMessage({"GetID":"normalMusic"});
	breakId = await browser.runtime.sendMessage({"GetID":"breakMusic"});
    document.getElementById('MusicPick').innerText = (musicId<0) ? "Pick tab?" : ((musicId===tabId) ? "This Tab!" : musicId);
    document.getElementById('BreakPick').innerText = (breakId<0) ? "Pick tab?" : ((breakId===tabId) ? "This Tab!" : breakId);
    
    document.getElementById('MusicPick').addEventListener('click', async function() {
        await browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => musicId = tabs[0].id);
        await messanger(musicId,"setup");
        if(breakId!=musicId){
            browser.runtime.sendMessage({"SetID":{name:"normalMusic",value:musicId}});
            document.getElementById('MusicPick').innerText = await browser.runtime.sendMessage({"GetID":"normalMusic"});
        }
    });
    document.getElementById('BreakPick').addEventListener('click', async function() {
        await browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => breakId = tabs[0].id);
        await messanger(breakId,"setup");
        if(breakId!=musicId){
            browser.runtime.sendMessage({"SetID":{name:"breakMusic",value:breakId}});
            document.getElementById('BreakPick').innerText = await browser.runtime.sendMessage({"GetID":"breakMusic"});
        }
    });
}
);
