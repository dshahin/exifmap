// Originally solved by Tim Branyen in his drop file plugin
// http://dev.aboutnerd.com/jQuery.dropFile/jquery.dropFile.js
jQuery.event.props.push('dataTransfer'); 
$(document).ready(function(){

	var markers = [];
	// Check that the browser supports the FileReader API.
	if (!window.FileReader) {
		document.write('<strong>Sorry, your web browser does not support the FileReader API.</strong>');
		return;
	}

	
    var status = document.getElementById('status');
    //var drop   = document.getElementById('drop');
    var list   = document.getElementById('list');
  	
    function cancel(e) {
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }
  
    
    $('#map').on('dragover',function(e){
    	e.preventDefault();
    }).on('dragenter',function(e){
    	e.preventDefault();
    }).on('drop', function (event) {
    	event.preventDefault();
		var files, reader;
		var dt    = event.dataTransfer;
		// var files = dt.files;

		files = dt.files;
		reader = new FileReader();
		imageReader = new FileReader();
		
		imageReader.onloadend = function(e){
			var bin           = this.result; 
			var lastMarker = markers[markers.length -1];
			lastMarker.bindPopup("<img class='thumb' src='" + bin +"'/>",{maxWidth:1000}).openPopup();
		}

		$('body').on('click','.thumb',function(){
			var $img = $(this);
			//$img.css({height: '600px'})
		});
	
		reader.onload = function (event) {
		  var exif, tags, tableBody, name, row;

		  try {
		    exif = new ExifReader();

		    // Parse the Exif tags.
		    exif.load(event.target.result);
		    // Or, with jDataView you would use this:
		    //exif.loadView(new jDataView(event.target.result));

		    // The MakerNote tag can be really large. Remove it to lower memory usage.
		    exif.deleteTag('MakerNote');

		    // Output the tags on the page.
		    tags = exif.getAllTags();
		    tableBody = document.getElementById('exif-table-body');
		    for (name in tags) {
		      if (tags.hasOwnProperty(name)) {
		        row = document.createElement('tr');
		        row.innerHTML = '<td>' + name + '</td><td>' + tags[name].description + '</td>';
		        tableBody.appendChild(row);
		      }
		    }
		    if(tags.hasOwnProperty('GPSLatitude') && tags.hasOwnProperty('GPSLongitude')){
		    	console.log(tags.GPSLatitude.description, tags.GPSLongitude.description);
			    var latitude = tags.GPSLatitude.description,
			    	longitude = 0 - tags.GPSLongitude.description;
			    markers.push( L.marker([latitude, longitude]).addTo(map));
			    map.setZoom(15).panTo([latitude, longitude],{animate:true, duration: 1});

		    }else{
		    	alert('no gps data in photo');
		    }
		    
		  } catch (error) {
		    alert(error);
		  }
		};
		// We only need the start of the file for the Exif info.
		reader.readAsArrayBuffer(files[0].slice(0, 128 * 1024));
		imageReader.readAsDataURL(files[0]);
		//reader.readAsArrayBuffer(files[0]);
		
		
		return false;
	});


	// create a map in the "map" div, set the view to a given place and zoom

	L.mapbox.accessToken = 'pk.eyJ1IjoiZGFuc2hhaGluIiwiYSI6IkZBckFFRlkifQ.GEfQV-3qWqBE44gE8dXzmA';
	var map = L.mapbox.map('map', 'danshahin.kc8kah1i');


});
