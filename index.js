const makeWASocket = require("@adiwajshing/baileys").default
const qrcode = require("qrcode-terminal")
const { delay , useMultiFileAuthState } = require("@adiwajshing/baileys")

async function connect() {
const { state, saveCreds } = await useMultiFileAuthState('./Wiley-Auth')

async function qr() {
	let conn = makeWASocket({
		auth: state,
		printQRInTerminal: true,
	})
	conn.ev.on("connection.update", async (s) => {
		const { connection, lastDisconnect } = s
		if (connection == "open") {
			await delay(1000 * 10)
			process.exit(0)
		}
		if (
			connection === "close" &&
			lastDisconnect &&
			lastDisconnect.error &&
			lastDisconnect.error.output.statusCode != 401
			) {
			qr()
		}
	})
	conn.ev.on('creds.update', saveCreds)
	conn.ev.on('messages.upsert', () => { })
}
qr()
}
connect() 
