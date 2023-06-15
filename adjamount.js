// task data (montos originalmente entre 500 y 1000 USD)
// The code defines and initializes some variables to store task data and subject data.

var taskData = {
    immAmount: 500,
    delAmount: 1000,
    changeAmount: [250, 125, 63, 31, 16],
    delLength: [{
        inMonths: 0.25,
        inWords: "1 semana"
    }, {
        inMonths: 0.5,
        inWords: "2 semanas"
    }, {
        inMonths: 1,
        inWords: "1 mes"
    }, {
        inMonths: 4,
        inWords: "4 meses"
    }, {
        inMonths: 8,
        inWords: "8 meses"
    }, {
        inMonths: 12,
        inWords: "1 año"
    }, {
        inMonths: 60,
        inWords: "5 años"
    }, {
        inMonths: 120,
        inWords: "10 años"
    }]
};

// subject data
var subjectData = {
    delays: [],
    indiffVals: [],
};

var makingChoice = true;

var delayCounter = 0;

// The start() function is defined, which sets up the trial view for the web page.
function start() {
    // setup trialHTML variable stores an HTML template for the trial view, which is then assigned to the document.body.innerHTML. 
    var trialHTML = "<div class=\"task-container\">\r\n<div class=\"container u-vert-align\">\r\n  <div class=\"row\">\r\n    <div class=\"u-full-width\"><p class=\"instructions\">¿Qué prefieres?<\/p><\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns now-label\">Ahora<\/div>\r\n    <div class=\"six columns after-label\" id=\"delay\">After x<\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"imm-btn\">immediate amount<\/button>\r\n    <\/div>\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"del-btn\">delayed amount<\/button>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>\r\n<\/div>";
    document.body.innerHTML = trialHTML;     // This template includes buttons for immediate and delayed amounts.

    delay = document.getElementById("delay");
    delay.textContent = "Luego de " + taskData.delLength[delayCounter].inWords;

    if (makingChoice) {

        task();
// The task() function is defined as an immediately-invoked function expression (IIFE). 
// It initializes variables and sets the content of buttons and labels in the trial view based on the task data.
    } else {

        console.log(subjectData);

        delayCounter++;

        // end task after no more delays
        if (delayCounter > taskData.delLength.length - 1) {
            showResults();
            return; // end execution of start() before task() called again
        }
        
        task();
    }
}

var task = (function() {

    // initialize variables
    var trialCounter = 0;
    var curImmAmount = taskData.immAmount;
    var immChoiceCount = 0;

    // remember: variable declarations without var are automatically GLOBAL
    immBtn = document.getElementById("imm-btn");
    delBtn = document.getElementById("del-btn");
    immBtn.textContent = "$ " + taskData.immAmount + " mil";
    delBtn.textContent = "$ 1 millón";
    delay.textContent = "Luego de " + taskData.delLength[delayCounter].inWords;

// The delayedChoice() function is defined within the task() function. 
// It handles the logic when the delayed amount button is clicked. 
// It updates the current immediate amount, checks if the trial limit has been reached, and decides whether to proceed to the next delay or end the task.
    var delayedChoice = function() {

        if (trialCounter > 3) {
            // reset counters, makingChoice = false -> next delay
            
            // immediate amount never selected on this trial
            if (immChoiceCount == 0) {
                subjectData.delays.push(taskData.delLength[delayCounter].inMonths);
                subjectData.indiffVals.push(taskData.delAmount);   
            } else {
                subjectData.delays.push(taskData.delLength[delayCounter].inMonths);
                subjectData.indiffVals.push(curImmAmount);                
            }            

            trialCounter = 0;
            makingChoice = false;
            start();
        } else {
            curImmAmount = curImmAmount + taskData.changeAmount[trialCounter];
            immBtn.textContent = "$ " + curImmAmount + " mil";
        }

        trialCounter++;
    };

    // The immediateChoice() function is also defined within the task() function. 
    // It handles the logic when the immediate amount button is clicked. 
    // It updates the current immediate amount, checks if the trial limit has been reached, and decides whether to proceed to the next delay or end the task.
    var immediateChoice = function() {
        immChoiceCount++;

        if (trialCounter > 3) {
            // reset counters, makingChoice = false -> next delay
            subjectData.delays.push(taskData.delLength[delayCounter].inMonths);
            subjectData.indiffVals.push(curImmAmount);          
            trialCounter = 0;
            makingChoice = false;
            start();
        } else {
            curImmAmount = curImmAmount - taskData.changeAmount[trialCounter];
            immBtn.textContent = "$ " + curImmAmount + " mil";
        }

        trialCounter++;
    };

    // Event listeners are attached to the immediate and delayed amount buttons to trigger the corresponding functions when clicked.
    immBtn.addEventListener("click", immediateChoice);
    delBtn.addEventListener("click", delayedChoice);
});

// The showResults() function displays the results view of the web page. 
// It sets the resultsHTML variable to an HTML template and assigns it to the document.body.innerHTML.
function showResults() {
    var resultsHTML = "<div class=\"results-container\">\r\n  <div class=\"container u-vert-align\">\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\"><h3>Results<\/h3><\/div>\r\n    <\/div>\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\" id=\"results-k\"><\/div>\r\n      <div class=\"u-full-width\" id=\"results-a\"><\/div>\r\n      <div class=\"u-full-width\" id=\"results-graph\"><\/div>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>";
    document.body.innerHTML = resultsHTML;
    calc();
}

// Generate a unique ID
var dataID = generateUniqueID();
// Function to generate a unique ID (example)
function generateUniqueID() {
  // Generate a timestamp-based ID
  var timestamp = moment().format('DDMMYY_hhmmssa'); // requires loading the moment.js library in the HTML file
  return "ID" + timestamp;
}

// The sendData() function is defined to export the subject data to a JSON file
// subjectData.delays and subjectData.indiffVals arrays are extracted and stored in the data object. 
function sendData() {
  var data = {
    id: dataID,
    k: subjectData.kValue,
    a: subjectData.aValue,
    delays: subjectData.delays,
    indiffVals: subjectData.indiffVals
  };
// The data object is then converted to JSON using JSON.stringify.
  var jsonData = JSON.stringify(data);
  // Add the dataID to the JSON object
  var blob = new Blob([jsonData], { type: "application/json" });
  // Blob object is created with the JSON data and assigned a MIME type of "application/json". 
  var url = URL.createObjectURL(blob);   // The URL.createObjectURL method is used to generate a URL for the Blob.
  var downloadLink = document.createElement("a"); // Download link is created
  downloadLink.href = url; // href attribute is set to the generated URL
  downloadLink.download = dataID + ".json"; //download attribute is set to the desired filename for the downloaded file
  downloadLink.click(); // link is programmatically clicked, triggering the file download.
}

// event listener is attached to the start button ("start-btn") to trigger the start() function when clicked.
document.getElementById("start-btn").addEventListener("click", start);