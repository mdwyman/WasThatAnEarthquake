var siberia = new google.maps.LatLng(60, 105);
var globecenter = new google.maps.LatLng(0, 0);
var browserSupportFlag =  new Boolean();
var initialLocation = new google.maps.LatLng();

function getCircle(magnitude, eqtime) {
	var d = new Date();
	var n = d.getTime();
	var circColor = n - eqtime < 900000 ? 'red' : 'orange';
	if (n-eqtime > 3600000) {circColor = 'yellow'}
	var pos = n - eqtime < 3600000 ? 10 : 5;
	var circOpacity = circColor == 'red' ? 0.8 : 0.6;
	if (circColor == 'yellow') {circOpacity = 0.4};
  	var circle = {
    	path: google.maps.SymbolPath.CIRCLE,
    	fillColor: circColor,
    	fillOpacity: circOpacity,
    	scale: Math.pow(2, magnitude)/2.0,
    	strokeColor: circColor,
    	strokeWeight: .8,
  	};
  	return circle;
}
	
function legCircle(magnitude) {  //This method probably won't work as it attaches circle to data point but maybe
	var circle = {               //this can be called from a legend function and then stack the icons
		path: google.maps.SymbolPath.CIRCLE,
		fillColor: 'black',
		fillOpacity: 0,
		scale: Math.pow(2, magnitude)/2.0,
		strokeColor: 'black',
		strokeWeight: 1.0,
	};
	return circle;
}
	
function printLocation(locale) {
	var iniLocation = document.getElementById("location");
	var svgcirc = "<svg height=\"20\" width=\"20\"><circle cx=\"10\" cy=\"10\" r=\"8\" stroke=\"#CC33FF\" stroke-width=\"2\" fill-opacity=\"0.4\" fill=\"#CC33FF\" /></svg>";

    console.log("User location", locale.latitude, locale.longitude);
	iniLocation.innerHTML = svgcirc + " Your location: " + parseFloat(locale.latitude).toFixed(2) + 
		", " + parseFloat(locale.longitude).toFixed(2);
}

function circleCenter(userLocation, map) {
    console.log("Circle Center", userLocation.latitude, userLocation.longitude);

	var myCenter = new google.maps.Circle({
	    center:{lat: userLocation.latitude, lng: userLocation.longitude},
//	    center:userLocation,
//	    center: {lat: ulat, lon: },
		radius:100000,  //in meters
// 			scale: 1000,	
		strokeColor:"#CC33FF",
		strokeOpacity:0.8,
		strokeWeight:2,
		fillColor:"#CC33FF",
		fillOpacity:0.4,
		pos:15
		});

	myCenter.setMap(map);  // later on center on midpoint between geolocation and nearest EQ
	printLocation(userLocation);	//should change mapCenter to computerLocation
}

function initialize() {
	var mapProp = {
		zoom:3,
		disableDefaultUI:true,
		panControl:true,
		zoomControl:true,
		scaleControl:true,
		mapTypeId:google.maps.MapTypeId.HYBRID
	};
	var map=new google.maps.Map(document.getElementById("googleMap"),mapProp)

	var onFinishAddEQ = function(stuff) {
		addEQdata(map);
	}
	
	function centerOnUser(map, callback) {
//		initialLocation = new google.maps.LatLng()
	
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) { //success function
//				initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
//				map.setCenter(initialLocation);
//			    console.log(initialLocation);
//				circleCenter(initialLocation, map);
			    initialLocation = position.coords;
			    console.log("Get current position", initialLocation.latitude, initialLocation.longitude);
			    map.setCenter({lat: initialLocation.latitude, lng: initialLocation.longitude});
			    console.log("Just attempted to set center");
// probably need to re-enable previous line so map is centered on user location
			    circleCenter(initialLocation, map);
				callback(initialLocation);
			}, function() {   //error function -- geolocation supported by user doesn't allow location information
				alert("For best results, please allow use of your location.");
				initialLocation = globecenter;
				circleCenter(initialLocation);
				handleNoGeolocation(browserSupportFlag);
			});
		}
// Browser doesn't support Geolocation
		else {
			alert("Your browser doesn't support geolocation, so I've centered the map on Siberia.");
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		}

		function handleNoGeolocation(errorFlag) {
			if (errorFlag == true) {
			} else {
				initialLocation = siberia;
				circleCenter(initialLocation);
			}
			map.setCenter(initialLocation);
		}
	}
	
	centerOnUser(map, onFinishAddEQ);
	
	var legend = document.getElementById('legend');
	
	
	
	if ($(window).width() > 800) {
		legendSTR = '<h3>Magnitude</h3>';
		legendSTR += '<svg height="140" width="130">'
		legendSTR += '  <circle cx="65" cy="65" r="64" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 7.0 -->'
		legendSTR += '  <text x="57" y="12" fill="black">7.0</text>'
		legendSTR += '	<circle cx="65" cy="97" r="32" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 6.0 -->'
		legendSTR += '	<text x="57" y="63" fill="black">6.0</text>'
		legendSTR += '	<circle cx="65" cy="113" r="16" stroke="black" stroke-width="2" fill-opacity="0" /> <!--M = 5.0 -->'
		legendSTR += '	<text x="57" y="95" fill="black">5.0</text>'
		legendSTR += '	<circle cx="65" cy="121" r="8" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 4.0 -->'
		legendSTR += '	<text x="57" y="111" fill="black">4.0</text>'
		legendSTR += '	<circle cx="65" cy="125" r="4" stroke="black" stroke-width="2" fill-opacity="0" />	<!--M = 3.0 -->'
		legendSTR += '	<text x="57" y="139" fill="black">3.0</text>'
		legendSTR += '</svg>'
		legendSTR += '<h3><b>Age</b></h3>'
		legendSTR += '	<p><svg height="12" width="25"><rect width="20" height="10" style="fill:red;fill-opacity:0.8;stroke-width:0"/></svg>'
		legendSTR += '     <small>Last 15 minutes</small></p>'
		legendSTR += '	<p><svg height="12" width="25"><rect width="20" height="10" style="fill:orange;fill-opacity:0.6;stroke-width:0"/></svg>'
		legendSTR += '     <small>Last hour</small></p>'
		legendSTR += '  <p><svg height="12" width="25"><rect width="20" height="10" style="fill:yellow;fill-opacity:0.4;stroke-width:0"/></svg>'
		legendSTR += '    <small>Last day</small></p>'
	} else {
		if ($(window).height() < $(window).width()) {
			legendSTR = '<table><tbody>'
			legendSTR += '<tr><td><center><h3>Magnitude</h3></center></td><td><center><h3>Age</h3></center></td></tr>'
			legendSTR += '<tr><td>'
			legendSTR += '<svg height="75" width="66">'
			legendSTR += '	<circle cx="33" cy="33" r="32" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 6.0 -->'
			legendSTR += '	<text x="25" y="12" fill="black" font-size=10>6.0</text>'
			legendSTR += '	<circle cx="33" cy="49" r="16" stroke="black" stroke-width="2" fill-opacity="0" /> <!--M = 5.0 -->'
			legendSTR += '	<text x="25" y="31" fill="black" font-size=10>5.0</text>'
			legendSTR += '	<circle cx="33" cy="57" r="8" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 4.0 -->'
			legendSTR += '	<text x="25" y="47" fill="black" font-size=10>4.0</text>'
			legendSTR += '	<circle cx="33" cy="61" r="4" stroke="black" stroke-width="2" fill-opacity="0" />	<!--M = 3.0 -->'
			legendSTR += '	<text x="25" y="75" fill="black" font-size=10>3.0</text>'
			legendSTR += '</svg>'
			legendSTR += '</td><td>'
			legendSTR += '	<p><svg height="10" width="10"><circle cx="5" cy="5" r="4" style="fill:red;fill-opacity:0.8;stroke-width:0"/></svg>'
			legendSTR += '     <small>Last 15 min.</small></p>'
			legendSTR += '	<p><svg height="10" width="10"><circle cx="5" cy="5" r="4" style="fill:orange;fill-opacity:0.6;stroke-width:0"/></svg>'
			legendSTR += '     <small>Last hour</small></p>'
			legendSTR += '  <p><svg height="10" width="10"><circle cx="5" cy="5" r="4" style="fill:yellow;fill-opacity:0.4;stroke-width:0"/></svg>'
			legendSTR += '    <small>Last day</small></p>'
			legendSTR += '</td></tr></tbody></table>'
		} else {
			legendSTR = '<h3>Magnitude</h3>';
			legendSTR += '<svg height="75" width="66">'
			legendSTR += '	<circle cx="33" cy="33" r="32" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 6.0 -->'
			legendSTR += '	<text x="25" y="12" fill="black">6.0</text>'
			legendSTR += '	<circle cx="33" cy="49" r="16" stroke="black" stroke-width="2" fill-opacity="0" /> <!--M = 5.0 -->'
			legendSTR += '	<text x="25" y="31" fill="black">5.0</text>'
			legendSTR += '	<circle cx="33" cy="57" r="8" stroke="black" stroke-width="2" fill-opacity="0" />  <!--M = 4.0 -->'
			legendSTR += '	<text x="25" y="47" fill="black">4.0</text>'
			legendSTR += '	<circle cx="33" cy="61" r="4" stroke="black" stroke-width="2" fill-opacity="0" />	<!--M = 3.0 -->'
			legendSTR += '	<text x="25" y="75" fill="black">3.0</text>'
			legendSTR += '</svg>'	
			legendSTR += '<h3><b>Age</b></h3>'
			legendSTR += '	<p><svg height="10" width="10"><circle cx="5" cy="5" r="4" style="fill:red;fill-opacity:0.8;stroke-width:0"/></svg>'
			legendSTR += '     <small>Last 15 min.</small></p>'
			legendSTR += '	<p><svg height="10" width="10"><circle cx="5" cy="5" r="4" style="fill:orange;fill-opacity:0.6;stroke-width:0"/></svg>'
			legendSTR += '     <small>Last hour</small></p>'
			legendSTR += '  <p><svg height="10" width="10"><circle cx="5" cy="5" r="4" style="fill:yellow;fill-opacity:0.4;stroke-width:0"/></svg>'
			legendSTR += '    <small>Last day</small></p>'
		}
	}
	
	legend.innerHTML = legendSTR;
	
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
	//legend.style.display = "block";
	
}
	
function addEQdata(map) {

	var usgsURL = '../perl/1.0_day.geojson';

	console.log("Adding earthquake data");

	function GetJson(JsonURL){
		var httpReq = new XMLHttpRequest();

		httpReq.onreadystatechange = function() {
			  if (httpReq.readyState == 4 && httpReq.status == 200) {
				  var tempData = JSON.parse(httpReq.responseText);
				  console.log("File received");
				  map.data.addGeoJson(tempData);
				  
			      var data_load_time = new Date(tempData.metadata.generated);
			      document.getElementById("load_time").innerHTML = "Data retrieved: "+ data_load_time;
				  wellWasIt(tempData);
					
			  } else {
				  console.log("Waiting");
			  }
		}

		httpReq.open("GET", JsonURL, true);
		httpReq.send(); 
	}
	
	var usgsData = GetJson(usgsURL);

	map.data.setStyle(function(feature) {
		var millitime = feature.getProperty('time');
		var magnitude = feature.getProperty('mag');
					
		return {
			icon: getCircle(magnitude, millitime)
		};   
	});

	function distanceFromEQ(userLon, userLat, lonEQ, latEQ) {
			//gives an ~angular distance, used law of cosines and factored out earth radius
			var phi1 = (userLon + 180)*Math.PI/180.0;
			var theta1 = (90 - userLat)*Math.PI/180.0;
			var phi2 = (lonEQ + 180)*Math.PI/180.0;
			var theta2 = (90 - latEQ)*Math.PI/180.0;
			
			var angFactor1A = Math.sin(theta1) * Math.sin(theta2);
			var angFactor1B = Math.cos(phi1) * Math.cos(phi2) + Math.sin(phi1) * Math.sin(phi2);
			var angFactor2 = Math.cos(theta1) * Math.cos(theta2);
			//Straight line distance (chord throught earth)
			var distance = Math.sqrt(2 * (1 - angFactor1A * angFactor1B - angFactor2)); 

		return distance;		
	};
	
	function wellWasIt(eqData) {
		var R_earth = 6.38e6 // in meters
		var result = document.getElementById("wellwasit");
		var result2 = document.getElementById("wellwasit2");
		var eqFeatures = eqData.features;			
		var numCoords = eqFeatures.length;			
		var recentEQ = 0; //set to false			
		var currDate = new Date();
		var currTime = currDate.getTime();
//		var userLoc = map.getCenter(); //initialLocation is also global variable could use instead
		var userLat = initialLocation.latitude; 
		var userLon = initialLocation.longitude;
		var timeLimit = 15;
		var nearestMag = 0;
		var nearestDist = 0;
		var equivalentMag = -20.0 //generally mag < 2 not felt

		for (var i = 0; i < numCoords; i++) {
			var eqTime = eqFeatures[i].properties.time;
			var timeDist = (currTime - eqTime) / 1000.0 / 60.0;
			if (timeDist < 60) {console.log(timeDist)} ;
	
			
			if (timeDist < timeLimit) {
				recentEQ = 1;
				var eqLon = eqFeatures[i].geometry.coordinates[0];
				var eqLat = eqFeatures[i].geometry.coordinates[1];
				var mag = parseFloat(eqFeatures[i].properties.mag);
				eqDist = distanceFromEQ(userLon, userLat, eqLon, eqLat)
				//chordDist is in km
				chordDist = eqDist*R_earth/1000.0      
//					tempMag = Math.pow(10,1.5*mag)/eqDist;
//					Using USGS's predicted distance attenuation formula for Eastern US (upper bound)
				tempMagUpper = 1.60 + 1.29*mag - 0.00051*chordDist - 2.16*(Math.log(chordDist))/(Math.log(10))
//					Using USGS's predicted distance attenuation formula for Western US (lower bound)
				tempMagLower = 1.15 + 1.01*mag - 0.00054*chordDist - 1.72*(Math.log(chordDist))/(Math.log(10))
				if (tempMagUpper > equivalentMag) {
					equivalentMag = tempMagUpper;
					nearestMag = mag;
					nearestDist = chordDist;
					console.log(nearestMag, nearestDist);
					};					
				console.log(eqLon, eqLat, mag, tempMagUpper, tempMagLower);
//					console.log("Chord distance to earthquake (km): ",chordDist);
			}
		}
			
		//Check to see if recent EQ; if not "No M1.0+ earthquakes in last 15 minutes"
		//Create four result.innerHTML statements
		if (recentEQ != 0) {
			if (equivalentMag > 3) {
				result.innerHTML = "<h3>Was that an earthquake? <strong>Yes</strong></h3>";
			} else {
				if (equivalentMag > 2) {
					result.innerHTML = "<h3>Was that an earthquake? <strong>Probably</strong></h3>";
				} else {
					result.innerHTML = "<h3>Was that an earthquake? <strong>Probably not</strong></h3>";
				}
			}
			console.log("Nearest data: ",nearestMag, nearestDist)
			result2_str1 = "<p>Nearest/Strongest earthquake in last "+timeLimit+" minutes "
			result2_str2 = "was of magnitude "+ nearestMag.toFixed(2) + " and "+nearestDist.toFixed(0) +" km away as the mole digs.</p>";
			result2.innerHTML = result2_str1 + result2_str2;
//				perhaps alter marker with popup of mag, time, distance?				
		} else {
			result.innerHTML = "<h3>Was that an earthquake? <strong>Nope</strong></h3>";
			result2.innerHTML = "<p>No M1.0+ earthquakes in the last "+timeLimit+" minutes</p>";
		}
		document.getElementById('waiting').style.display = "none";
		document.getElementById('legend').style.display = "block";
		document.getElementById('container').style.opacity = "1.0";
		
	};
	
	
}


google.maps.event.addDomListener(window, 'load', initialize);
//    google.maps.event.trigger(map, "resize")