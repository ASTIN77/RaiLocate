
	var csvFile = new XMLHttpRequest();
	        csvFile.open("GET", "/documents/RailReferences.csv", true);
	        csvFile.onreadystatechange = function() {
  		if (csvFile.readyState === 4) {  // Makes sure the document is ready to parse.
    	        if (csvFile.status === 200) {  // Makes sure it's found the file.
    	        var crs = [];
    	        crs = csvFile.responseText.split("\r\n"); // Will separate each line into an array
    	        console.log(crs);
    	          $('.findStation').autocomplete({
    lookup: crs,
    onSelect: function (suggestion) {
      var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
    }
  });
    		} //"\r\n" 
  	    }
	};
	
	 // setup autocomplete function pulling from currencies[] array
