// Define configuration options
const opts = $.ajax({dataType: 'json', url: './opts.json', async: false}).responseJSON

// Create a client with our options
const client = new tmi.client(opts)

function main() {

	// Register our event handlers (defined below) and connect
	client.on('message', onMessageHandler)
	client.on('connected', onConnectedHandler)
	client.connect()
}

function remapInt(x, minBefore, maxBefore, minAfter, maxAfter) {
	const xIn0To1 = (x - minBefore) / (maxBefore - minBefore)
	const xInAfterRange = xIn0To1 * (maxAfter - minAfter) + minAfter
	return Math.floor(xInAfterRange)
}

// Output with message text
function overlay(msg) {
	const fontSize = remapInt(Math.random(), 0, 1, 30, 45)
	const textSpeed = remapInt(Math.random(), 0, 1, 2000, 5000)
	const x = Math.random()
	const pct = 0.75
	const textPosition = (x < pct) ? remapInt(x, 0, pct, 0, 50) : remapInt(x, pct, 1, 50, 100)
	const element = $('<div>', { text: msg })
		.addClass('msg')
		.css({ 'font-size': fontSize, 'top': `${textPosition}vh` })

	const textLifespan = setTimeout(function(){ element.remove() }, 15000)
	
	$('body').append( element )
	
	function animate() {
		const msgWidth = element.width()
		console.log(msgWidth)
		element.css({ 'right': `${-msgWidth}px` })
		.animate({ right: '100vw' }, textSpeed, 'linear')
	}
	
	window.requestAnimationFrame(animate)
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    // Ignore messages from the bot
    if (self) { return }

    // Remove whitespace from chat message
    const message = msg.trim()

    overlay(message)
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
}

$(document).ready(main)