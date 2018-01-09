let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);

var departureDataList = document.getElementById('json-datalist');
var destinationDataList = document.getElementById('json-datalist2');
var departureInput = document.getElementById('ajax');
var destinationInput = document.getElementById('ajax2');

// Create a new XMLHttpRequest.
var request = new XMLHttpRequest();

// Handle state changes for the request.
request.onreadystatechange = function(response) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      // Parse the JSON
      var jsonOptions = JSON.parse(request.responseText);

      // Loop over the JSON array.
      jsonOptions.forEach(function(item) {
        // Create a new <option> element.
        var departureOption = document.createElement('option');
        var destinationOption = document.createElement('option');
        // Set the value using the item in the JSON array.
        departureOption.value = item;
        
        destinationOption.value = item;
        console.log(destinationOption);
        // Add the <option> element to the <datalist>.
        departureDataList.appendChild(departureOption);
        destinationDataList.appendChild(destinationOption);
      });

      // Update the placeholder text.
      departureInput.placeholder = "Departing Station";
      destinationInput.placeholder = "Departing Station";
    } else {
      // An error occured :(
      departureInput.placeholder = "Couldn't load datalist options :(";
      destinationInput.placeholder = "Couldn't load datalist options :(";
    }
  }
};

// Update the placeholder text.
departureInput.placeholder = "Loading options...";
destinationInput.placeholder = "Loading options...";

// Set up and make the request.
request.open('GET', 'public/javascripts/railRef.json', true);
request.send();

  }
}, 100);