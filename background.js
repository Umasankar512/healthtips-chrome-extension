/*
Displays a notification with the current time. Requires "notifications"
permission in the manifest file (or calling
"Notification.requestPermission" beforehand).
 */

if (!localStorage.isInitialized) {
	localStorage.isActivated = true;
	localStorage.frequency = 1;
	localStorage.isInitialized = true;
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
	localStorage.activeSuggestions = JSON.stringify(s);
}

var suggestions = JSON.parse(localStorage.activeSuggestions);

function getRandomTip() {
	var suggestions = JSON.parse(localStorage.activeSuggestions);
	return suggestions[Math.round(Math.random() * 10) % suggestions.length].tip;
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

function show() {
	var time = /(..)(:..)/.exec(new Date());
	var hour = time[1] % 12 || 12;
	var period = time[1] < 12 ? 'a.m.' : 'p.m.';
	new Notification(hour + time[2] + ' ' + period, {
		icon : '128.png',
		body : getRandomTip()
	});
	playSound();
}

if (window.Notification) {

	// While activated, show notifications at the display frequency.
	if (JSON.parse(localStorage.isActivated)) {
		show();
	}

	var interval = 0;

	setInterval(function () {
		interval++;

		if (
			JSON.parse(localStorage.isActivated) &&
			localStorage.frequency <= interval) {
			show();
			interval = 0;
		}
	}, 60000);
}