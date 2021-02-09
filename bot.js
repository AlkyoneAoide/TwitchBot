// Define configuration options
const opts = {
	//Username and oauth token of bot
    identity: {
    	username: "",
    	password: ""
    },
    //Username of channels you want bot to be present in
    channels: [
    	""
    ]
};

	// Create a client with our options
const client = new tmi.client(opts);
function main() {

	// Register our event handlers (defined below)
	client.on('message', onMessageHandler);
	client.on('connected', onConnectedHandler);

	// Connect to Twitch:
	client.connect();
	//consolelog('Connecting...')
}

function remapInt(x, minBefore, maxBefore, minAfter, maxAfter) {
	const xIn0To1 = (x - minBefore) / (maxBefore - minBefore);
	const xInAfterRange = xIn0To1 * (maxAfter - minAfter) + minAfter;
	return Math.floor(xInAfterRange);
}

// Output with message text
function consolelog(msg) {
	const fontSize = remapInt(Math.random(), 0, 1, 30, 40); // Math.round((Math.random() * 40) + 30);
	const textSpeed = remapInt(Math.random(), 0, 1, 10000, 15000);
	const x = Math.random()
	const pct = .75
	const textPosition = (x < pct) ? remapInt(x, 0, pct, 0, 50) : remapInt(x, pct, 1, 50, 100);
	const element = $('<div>', { text: msg })
		.addClass('msg')
		.css({ "font-size": fontSize, "top": `${textPosition}vh` })

	const textLifespan = setTimeout(function(){ element.remove() }, 15000);
	
	$('body').append( element )
	
	function animate() {
		const msgWidth = element.width();
		console.log(msgWidth);
		element.css({ "right": `${-msgWidth}px` })
		.animate({ right: "100vw" }, textSpeed)
	}
	
	window.requestAnimationFrame(animate);
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    //console.log(arguments)
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    // if (commandName === '!dice') {
    //     const num = rollDice();
    // 	client.say(target, `You rolled a ${num}`);
    // 	console.log(`* Executed ${commandName} command`);
    // } else {
    // 	consolelog(`${commandName}`);
    // }
}

// Function called when the "dice" command is issued
// function rollDice () {
//     const sides = 6;
//     return remapInt(Math.random(), 0, 1, 1, 6); // Math.floor(Math.random() * sides) + 1;
// }

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    //consolelog('Connected');
    console.log(`* Connected to ${addr}:${port}`);
}

$(document).ready(main)