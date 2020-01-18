
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function changeUser(){
	setCookie("cf_username","",1);
	window.location.reload();
}

document.write(`<div style=\"position:absolute;right:0;\"><span id="cf_username">${getCookie('cf_username')}</span><br><button onclick=\"changeUser()\"> Change User </button></div>`)

function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function updatePage(){
	let username = getCookie("cf_username");
	$("#cf_username").html(username)
	let url = `https://codeforces.com/api/user.status?handle=${username}`;
	$.getJSON(url,(data,status) => {
		let solved = new Set();
		for (let item of data.result){
			if (item.verdict != "OK")
				continue;
			solved.add(`http://codeforces.com/problemset/problem/${item.problem.contestId}/${item.problem.index}`)
		}
		for (let item of solved)
			console.log(item)

		for(let element of $("td > a")){
			if(solved.has($(element).attr("href"))){
				console.log("yeah")
				$(element).parent().parent().css("background-color", "lightgreen")
			}
		}
	})
	
}
function startService(){
	updatePage()
	setInterval(updatePage,60000)
	
}
function validateUsername(username){
	let url = `https://codeforces.com/api/user.info?handles=${username}`
	let timer = setTimeout(() => {
		username = prompt("Some error while setting username, please re-enter")
		validateUsername(username)
	},5000)
	$.getJSON(url,(data,status) => {
		console.log(data,status)
		clearInterval(timer)
		setCookie("cf_username",username,1)
		startService();
	})
}

loadScript("https://code.jquery.com/jquery-3.4.1.min.js",() => {
	$(document).ready(function(){
		let username = getCookie("cf_username");
		if(!username){
			username = prompt("No username is set,Enter your codeforces username")
			validateUsername(username)
		} else {
			startService();
		}
	}); 
})
