let players = {};
players.normalMusic = -1;
players.breakMusic = -2;
browser.runtime.onMessage.addListener(request => {
	console.log(request);
	console.log(players);
	if(request.GetID){
		return Promise.resolve(players[request.GetID]);
	}
	if(request.SetID){
		return Promise.resolve(players[request.SetID.name]=request.SetID.value);
	}
});
