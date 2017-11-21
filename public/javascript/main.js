function findTrain() {

    

var departing = document.getElementById("departing").value;
console.log(departing);
var destination = document.getElementById("destination").value;
console.log(destination);
var results = document.getElementsByClassName("results");
console.log(results);
    
var r = new XMLHttpRequest();
r.open("GET", "https://huxley.apphb.com/all/" + destination + "/from/" + departing +"/1?accessToken=420b5ac9-3385-4b10-8419-5cfb557cfe2e", true);
r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    var resp = JSON.parse(r.response);
    if (resp.trainServices && resp.trainServices.length > 0) {
            document.write(results.innerHtml="<h5>The next train to arrive at </h5>" + resp.locationName + "<h5> from </h5>" +
            resp.filterLocationName + "<h5> will get in at </h5>" + resp.trainServices[0].sta);
        /*alert("The next train to arrive at" + resp.locationName + " from " + resp.filterLocationName + " will get in at " + resp.trainServices[0].sta);*/
    } else {
            document.write(results.innerHtml = "<h5>Sorry, no trains from </h5>" + resp.filterLocationName + " <h5>arriving soon</h5>");
            /*alert("Sorry, no trains from " + resp.filterLocationName + " arriving soon.");*/
    }
};
r.send();

}