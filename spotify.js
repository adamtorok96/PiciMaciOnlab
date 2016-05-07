class SpotifyApi {

	constructor(url) {
		this.url = url;
	}

	getIdFromFacebookUrl(url) {
		var track = "track/";
		var start = url.indexOf(track);
		
		if( start == -1 )
			return null;
			
		return url.substr(start + track.length, url.length - start - track.length);
	}
	
	getTrackInfo(id) {
		var response = null;
		
		$.ajax({
			url: 		this.url + "tracks/" + id,
			method: 	"GET",
			async: 		false,
			cache: 		false,
			dataType: 	"json",
			success: 	function(data) { response = data; },
			error: 		function() { }
		});
		
		return response;
	}
}
