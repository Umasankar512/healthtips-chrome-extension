// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
Grays out or [whatever the opposite of graying out is called] the option
field.
 */
function ghost(isDeactivated) {
	options.style.color = isDeactivated ? 'graytext' : 'black';
	// The label color.
	options.frequency.disabled = isDeactivated; // The control manipulability.
}

function checkBoxChanged() {
	var currNode = event.currentTarget;
	console.log(currNode.name, currNode.checked);
	var textNode = currNode.nextSibling;
	if (!currNode.checked) {
		textNode.style.textDecoration = "line-through";
	} else {
		textNode.style.textDecoration = "none";
	}

}

function displayNotif(msg) {
	if (window.Notification) {
		var time = /(..)(:..)/.exec(new Date());
		var hour = time[1] % 12 || 12;
		var period = time[1] < 12 ? 'a.m.' : 'p.m.';
		new Notification(hour + time[2] + ' ' + period, {
			icon : '128.png',
			body : msg
		});
		playSound();
	}
}

function playSound() {
	var audio = new Audio();
	audio.id = "PlaySound" + Math.round(Math.random() * 100);
	//audio.src = "http://dl.google.com/dl/chrome/extensions/audio/" + "smash-glass-1.mp3";
	//audio.src = "http://dl.google.com/dl/chrome/extensions/audio/" + "transform!.mp3";
	//audio.src = "http://dl.google.com/dl/chrome/extensions/audio/" + "sword-shrill.mp3";
	audio.src = "http://dl.google.com/dl/chrome/extensions/audio/" + "bell-small.mp3";
	audio.load();
	audio.play();
}

function addTip() {
	console.log("adding new health tip");
	addBtn.style.display = "none";
	saveBtn.style.display = "inline";
	tipArea.style.display = "block";
}
function savaTips() {
	console.log("saving tips to localStorage..");

	var currSuggestions = new Array();
	var sNode = document.getElementById("suggestions");
	var length = sNode.children.length;
	var activeSuggestions = new Array();

	for (var i = 0; i < length / 3; i++) {
		var isActive = sNode[i].checked;
		var tip = sNode[i].nextSibling.innerText;
		var o = new Object();
		o.tip = tip;
		o.isActive = isActive;
		if (o.isActive)
			activeSuggestions.push(o);
		currSuggestions.push(o);
	}
	
	if (tipArea.value.trim() != "") {
		var o = new Object();
		o.tip = tipArea.value;
		o.isActive = true;
		currSuggestions.push(o);
		activeSuggestions.push(o);
		displayNotif("Successfully added");
	} else {
		displayNotif("Changes saved.");
	}
	
	localStorage.activeSuggestions = JSON.stringify(activeSuggestions);
	localStorage.suggestions = JSON.stringify(currSuggestions);
	addBtn.style.display = "inline";
	tipArea.style.display = "none";
	displayAllSuggestions();
	tipArea.value = "";
}
function cancel() {
	tipArea.style.display = "none";
	addBtn.style.display = "inline";
	console.log("Hiding the textarea");
}

function deleteTips() {
	var response = window.confirm("All unchecked items will be deleted. Are you sure you want to delete?");
	if (response) {
		console.log("Deleting all unchecked items");
		
		var sNode = document.getElementById("suggestions");
		var length = sNode.children.length;
		
		var currSuggestions = new Array();
		var activeSuggestions = new Array();
		var counter = 0;
		for (var i = 0; i < length / 3; i++) {
			var isActive = sNode[i].checked;
			if (!isActive) {
				counter++;
				continue;
			}
			
			var tip = sNode[i].nextSibling.innerText;
			var o = new Object();
			o.tip = tip;
			o.isActive = isActive;
			activeSuggestions.push(o);
			currSuggestions.push(o);
		}
		localStorage.activeSuggestions = JSON.stringify(activeSuggestions);
		localStorage.suggestions = JSON.stringify(currSuggestions);
		displayAllSuggestions();
		if (counter != 0)
			displayNotif("Successfully deleted");
	}
}

function displayAllSuggestions() {
	var suggestions = JSON.parse(localStorage.suggestions);

	var suggestionsNode = document.getElementById("suggestions");
	//suggestionsNode.remove(true);
	while (suggestionsNode.firstChild) {
    suggestionsNode.removeChild(suggestionsNode.firstChild);
}

	//var SUGGESTIONS = document.getElementById("suggestions");

	for (var i = 0; i < suggestions.length; i++) {
		var iNode = document.createElement("input");
		iNode.setAttribute("type", "checkbox");
		iNode.setAttribute("name", "Suggestions" + i);
		iNode.setAttribute("id", i);
		iNode.checked = suggestions[i].isActive;
		//document.getElementById("suggestions")[i].onchange = checkBoxChanged(i);
		var spanNode = document.createElement("span");
		var tNode = document.createTextNode(suggestions[i].tip);

		var brNode = document.createElement("br");

		suggestionsNode.appendChild(iNode);
		spanNode.appendChild(tNode);
		if (!suggestions[i].isActive)
			spanNode.style.textDecoration = "line-through";
		suggestionsNode.appendChild(spanNode);
		suggestionsNode.appendChild(brNode);
		suggestionsNode[i].onchange = function (e) {
			checkBoxChanged();
		};
	}
}

window.addEventListener('load', function () {

	// Initialize the option controls.
	options.isActivated.checked = JSON.parse(localStorage.isActivated);
	// The display activation.
	options.frequency.value = localStorage.frequency;
	// The display frequency, in minutes.

	if (!options.isActivated.checked) {
		ghost(true);
	}

	// Set the display activation and frequency.
	options.isActivated.onchange = function () {
		localStorage.isActivated = options.isActivated.checked;
		ghost(!options.isActivated.checked);
	};

	options.frequency.onchange = function () {
		localStorage.frequency = options.frequency.value;
	};
	var s = [{
			"tip" : "Have a glass of water",
			"isActive" : true
		}, {
			"tip" : "Roll your eyes",
			"isActive" : true
		}, {
			"tip" : "Look at the objects which are far from you",
			"isActive" : true
		}, {
			"tip" : "Move your eyes left and right",
			"isActive" : true
		}, {
			"tip" : "Go and walk for 2 minutes",
			"isActive" : true
		}, {
			"tip" : "Go and have a cup of coffee",
			"isActive" : true
		}
	];
	if (localStorage.suggestions == undefined)
		localStorage.suggestions = JSON.stringify(s);

	if (localStorage.activeSuggestions == undefined)
		localStorage.activeSuggestions = JSON.stringify(s);

	displayAllSuggestions();
	
	tipArea.style.display = "none";
	addBtn.onclick = function () {
		addTip();
	}
	saveBtn.onclick = function () {
		savaTips();
	}
	deleteBtn.onclick = function () {
		deleteTips();
	}
	cancelBtn.onclick = function () {
		cancel();
	}

});