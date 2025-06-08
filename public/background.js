let players = {};
let playersIndex = {};
players.normalMusic = -1;
players.breakMusic = -2;
playersIndex.normalMusic = -1;
playersIndex.breakMusic = -2;
browser.runtime.onMessage.addListener(request => {
	if(request.GetID){
		return Promise.resolve(players[request.GetID]);
	}
	if(request.SetID){
		return Promise.resolve(players[request.SetID.name]=request.SetID.value);
	}
	if(request.GetIDIndex){
		return Promise.resolve(playersIndex[request.GetIDIndex]);
	}
	if(request.SetIDIndex){
		return Promise.resolve(playersIndex[request.SetIDIndex.name]=request.SetIDIndex.value);
	}
});
