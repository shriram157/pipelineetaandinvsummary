document.head || (document.head = document.getElementsByTagName('head')[0]);

function changeFavicon(src) {
	var link = document.createElement('link');
	link.type = "image/png";
	link.rel = 'shortcut icon';
	link.href = src;
	document.head.appendChild(link);
}

var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);

if (isDivisionSent) {
	this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
	if (this.sDivision == "10") {
		changeFavicon("images/favicon-16x16.png");
	} else if (this.sDivision == "20") {
		changeFavicon("images/faviconL-32x32.png");
	} else {
		changeFavicon("images/favicon-16x16.png");
	}
} else {
	changeFavicon("images/favicon-16x16.png");
}

var isLanguageSent = window.location.search.match(/language=([^&]*)/i);
if (isLanguageSent) {
	isLanguageSent = window.location.search.match(/language=([^&]*)/i)[1];
} else {
	isLanguageSent = "en"; // default is english 

}

if (isLanguageSent == 'fr') {
	var currentText = document.getElementById('oTitleText');
	currentText.text = "Arrivée prévue sur la chaîne d'approv. et sommaire des stocks";
} else {
	var currentText = document.getElementById('oTitleText');
	currentText.text = "Pipeline ETA & Inventory Summary";
}