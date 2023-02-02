// @ts-nocheck
import { WebSocketServer } from "ws";
import { ref, watch } from "vue";

// console.log(WebSocketServer);

const port = 8080;
const wss = new WebSocketServer({
    port,
});
console.log("Waiting connection on port: " + port);

let currentWS = null;
let messageCallback = ref(null);

wss.on("connection", (ws) => {
    console.log("Translation client connected!");
    currentWS = ws;
    ws.on("close", () => {
        console.log("Translation client closed!");
        currentWS = null;
    });
    ws.on("message", (translated) => {
        messageCallback.value = translated;
    });
});

function translate(text) {
    if (currentWS) {
        return new Promise((resolve) => {
            currentWS.send(text);
            const unsub = watch(messageCallback, () => {
                unsub();
                const translated = messageCallback.value;
                messageCallback.value = null;
                resolve(translated);
            });
        });
    } else {
        return null;
    }
}
export default defineEventHandler(async(event) => {
    const text = decodeURIComponent(event.context["params"].text);
    const translated = await translate(text);
    // console.log(translated);
    return translated;
});