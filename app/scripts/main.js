// Originally solved by Tim Branyen in his drop file plugin
// http://dev.aboutnerd.com/jQuery.dropFile/jquery.dropFile.js
jQuery.event.props.push('dataTransfer'); 
$(document).ready(function(){


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
    }).on('drop', function(e){
  //   	e = e || window.event; // get window.event if e argument missing (in IE)   
		// if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

		// var dt    = e.dataTransfer;
		// var files = dt.files;
		// for (var i=0; i<files.length; i++) {
		// 	var file = files[i];
		// 	var reader = new FileReader();


			  
		// 	//attach event handlers here...
		// 	addEventHandler(reader, 'loadend', function(e, file) {
		// 	    var bin           = this.result; 
		// 	    var newFile       = document.createElement('div');
		// 	    newFile.innerHTML = 'Loaded : '+file.name+' size '+file.size+' B';
		// 	    list.appendChild(newFile);  
		// 	    var fileNumber = list.getElementsByTagName('div').length;
		// 	    status.innerHTML = fileNumber < files.length 
		// 	                     ? 'Loaded 100% of file '+fileNumber+' of '+files.length+'...' 
		// 	                     : 'Done loading. processed '+fileNumber+' files.';

		// 	    var img = document.createElement("img"); 
		// 	    img.file = file;   
		// 	    img.src = bin;
		// 	    list.appendChild(img);
		// 	}.bindToEventHandler(file));

		// 	reader.readAsDataURL(file);
		// }
		// return false;
    }).on('drop', function (event) {
    	event.preventDefault();
		var files, reader;
		var dt    = event.dataTransfer;
		// var files = dt.files;

		files = dt.files;
		reader = new FileReader();
		reader.onloadend = function(e, file){
			e.preventDefault();
		    var bin           = this.result; 
		    //console.log(bin)
		    var newFile       = document.createElement('div');
		    //newFile.innerHTML = 'Loaded : '+file.name+' size '+file.size+' B';
		    //list.appendChild(newFile);  
		    //var fileNumber = list.getElementsByTagName('div').length;
		    // status.innerHTML = fileNumber < files.length 
		    //                  ? 'Loaded 100% of file '+fileNumber+' of '+files.length+'...' 
		    //                  : 'Done loading. processed '+fileNumber+' files.';

		    // var img = document.createElement("img"); 
		    // img.file = file;   
		    // img.src = bin;
		    //list.appendChild(img);
		}
	
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
			    var marker = L.marker([latitude, longitude]).addTo(map).bindPopup("Lat:" + latitude + " Long:"+longitude);
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
	});


	var handleFile = function (event) {
		var files, reader;

		files = event.target.files;
		reader = new FileReader();
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
		    console.log(tags);
		    tableBody = document.getElementById('exif-table-body');
		    for (name in tags) {
		      if (tags.hasOwnProperty(name) ) {
		        row = document.createElement('tr');
		        //row.innerHTML = '<td>' + name + '</td><td>' + tags[name].description + '</td>';
		        tableBody.appendChild(row);
		      }
		    }

		    // 
		  } catch (error) {
		    alert(error);
		  }
		};
		// We only need the start of the file for the Exif info.
		reader.readAsArrayBuffer(files[0].slice(0, 128 * 1024));
	};

	$('#file').change(handleFile);


	// create a map in the "map" div, set the view to a given place and zoom

	L.mapbox.accessToken = 'pk.eyJ1IjoiZGFuc2hhaGluIiwiYSI6IkZBckFFRlkifQ.GEfQV-3qWqBE44gE8dXzmA';
	var map = L.mapbox.map('map', 'danshahin.kc8kah1i');


});
