function getMusicSource(url) {
	if( url.indexOf("spotify") != -1 )
		return "spotify";
	else if( url.indexOf("deezer") != -1 )
		return "deezer";
				
	return "undefined";
}

var onLogin = function() {
	FB.login(function(response) {
		if ( response.authResponse ) {
			console.log("Logined to facebook");
			
			$(".buttons button[name='login']").remove();
			$(".buttons").append('<button name="getmusics">Get music history</button>');
			$(".buttons button[name='getmusics']").click(onGetMusics);
				
		} else {
			console.log("Failed to login");
		}
	}, {
		scope: "user_actions.music,publish_actions" /*,
		return_scopes: true */
	});
};

var onGetMusics = function() {
	$("#listens").empty();
	
	FB.api("/me/music.listens",
		function (response) {
			console.log("Response: ");
			console.log(response);
			console.log("Error:");
			console.log(response.error);
			
			var sa = new SpotifyApi("https://api.spotify.com/v1/");
			var da = new DeezerApi("https://api.deezer.com/");
						
			var listens = response.data;
			for(var i = 0;i < listens.length; i++) {
				console.log(listens[i]);
				
				var tracklink = listens[i].data.song.url;
				var trackname = listens[i].data.song.title;
				
				$('#listens').append('<li><a href="' + tracklink + '">' + trackname + '</a> from <b>'+ getMusicSource(tracklink) +'</b> : <i>'+ tracklink +'</i></li>');
			
				if( getMusicSource(tracklink) == "spotify" ) {
					//console.log("Music id of spot music: "+ sa.getIdFromFacebookUrl(tracklink));
					$("html").append("<pre>"+ sa.getTrackInfo(sa.getIdFromFacebookUrl(tracklink)) +"</pre>");
				} else if( getMusicSource(tracklink) == "deezer" ) {
					$("html").append("<pre>"+ da.getTrackInfo(da.getIdFromFacebookUrl(tracklink)) +"</pre>");
				}
			}
		}
	);
};

function createButtons() {
	$(".buttons").append('<button name="login">Login to Facebook</button>');
	$(".buttons button[name='login']").click(onLogin);
}


function sendMusic() {
	FB.api(
						"/me/music.listens",
						"POST",
						{
							"song": "http:\/\/samples.ogp.me\/461258627226537",
							"radio_station": "http:\/\/samples.ogp.me\/461258533893213",
							"album": "http:\/\/samples.ogp.me\/461258347226565",
							"playlist": "http:\/\/samples.ogp.me\/461258467226553",
							"musician": "http:\/\/samples.ogp.me\/390580850990722"
						},
						function (response) {
							console.log("Response:");
							console.log(response);
							console.log("Error:");
							console.log(response.error);
						}
					);
}
		
window.fbAsyncInit = function() {
	FB.init({
		appId      : '994279100661995',
		xfbml      : true,
	 	version    : 'v2.6'
	});
	
	createButtons();
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
