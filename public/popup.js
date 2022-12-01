function openUI() {
	Electro.run("openUI"); 
}async function regenList(){
    const arr = await Electro.run("reloadSessions");
    return arr.map((v,i) => `<option value="${i}">${v}</option>`).reduce((ll,l)=>ll+l);
}
let docstring, musicId, breakId;
const regen = async function () {
    musicId = await Electro.run("getNormal");
    breakId = await Electro.run("getBreak");
    docstring = await regenList();
    document.getElementById('music').innerHTML = docstring;
    document.getElementById('break').innerHTML = docstring;
    document.getElementById('music').value = musicId;
    document.getElementById('break').value = breakId;
 };
 document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById('openUI').addEventListener('click', openUI);
    await regen();
    document.getElementById('reload').addEventListener('click', regen);
    document.getElementById('music').addEventListener('change', async function() {
        const l = document.getElementById('music').value;
            if (l) Electro.run("setNormal",parseInt(l));
        }
    );
    document.getElementById('break').addEventListener('change', async function() {
        const l = document.getElementById('break').value;
            if (l) Electro.run("setBreak",parseInt(l));
        }
    );
 });
