(function($) {
   var currentPosition = null;
   var previousPosition = null;
   var currentLocationMarker = null;
   var savedLocationMarker = null;
   var map=null;
   var myCurrentPosition = JSON.parse(localStorage.getItem("myCurrentPosition"));

   function initialize() {
      map = new google.maps.Map(document.getElementById("map_canvas"), {
            zoom: 19,
            center: new google.maps.LatLng(46.259755, 20.163903),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });   
    }  
    
	//Mark current position
	function addCurrentLocationMarker(latiLongi) {
		currentLocationMarker = new google.maps.Marker({
			position: latiLongi,
			map: map,
			icon: { 
				path: google.maps.SymbolPath.CIRCLE, 
				scale: 6,
			},
        });
	}
	
	//current location marker is deleted
	function deleteCurrentLocationMarker() {
		if(currentLocationMarker != null) {
			currentLocationMarker.setMap(null);
		}
	}
	
	//Change position -> marker refresh
	function refreshPosition(position) {
		 map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		currentPosition = {
			lat: position.coords.latitude, 
			lng: position.coords.longitude,
		};
		
		if(map) {
			map.setCenter(currentPosition);
			deleteCurrentLocationMarker();
			addCurrentLocationMarker(currentPosition); //currentlocationmarker gets new coordinates
		}
		if (previousPosition){  //tracking
	        var newLineCoordinates = [
	           new google.maps.LatLng(previousPosition.coords.latitude, previousPosition.coords.longitude),
	           new google.maps.LatLng(position.coords.latitude, position.coords.longitude)];

	        var newLine = new google.maps.Polyline({
	          path: newLineCoordinates,        
	          strokeColor: "#FF0000",
	          strokeOpacity: 3.0,
	          strokeWeight: 7
	        });
	        newLine.setMap(map);
	      }
	      previousPosition = position;
	}
	
	//Delete old marker -> add new marker  + local storage(current position)
	function modifyPosition() {
		if(savedLocationMarker != null) {
			savedLocationMarker.setMap(null);
		}
		savedLocationMarker = new google.maps.Marker({
	        position: currentPosition,
	        map: map
        });
		localStorage.setItem("myCurrentPosition", JSON.stringify(currentPosition)); 
		console.log(myCurrentPosition);
	}
  


	function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
           alert( "The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
	
	//Put on marker on the map
	function putOnMarker(add) {
		modifyPosition();
	}


	$(document).ready(function() {
		if(navigator.geolocation) {
			initialize();  //map loading
			var watchId = navigator.geolocation.watchPosition(refreshPosition, showError,{enableHighAccuracy:true}); 
			//connect to htmlButton
			$('#joinButton').on('click', putOnMarker);
		} else {
			alert("Your browser does not support the Geolocation API");
		}
	});
})($);
   


