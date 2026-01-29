Lab 3: WebRTC + Video/Voice Agent with the Realtime API
Ship a browser + voice agent with video framework end-to-end

Build a full-stack voice experience: a WebRTC web client, a Hono-based backend, and optional SIP telephony with webhook verification. All files are provided in full so you can copy/paste and run.
Lab type

Guided build

Duration

~60 minutes

Level

Intermediate

Environment

Node.js 18+ + browser

Language

TypeScript

Focus

Realtime API + WebRTC + SDP

Jump to

Overview
Prerequisites
Env vars
Project setup
Frontend
Backend routes
Run & test
Troubleshooting
Extension challenges
1. Overview
This lab creates Realtime Voice Agent demo with clear, reproducible steps. You will ship a browser-based WebRTC client, a Hono backend that proxies the OpenAI Realtime API, and an optional SIP webhook so phone calls can reach your agent. All files are shown in full for copy/paste. The Realtime API streams audio to and from a model (for example, gpt-realtime) with very low latency, making it ideal for live dialogue. Browsers use WebRTC for audio transport; phones use SIP trunks that translate telephone audio into the realtime stream.
Realtime transport layers
WebRTC (browser): Handles mic/speaker setup and bidirectional audio streaming directly in the browser.
SIP (telephony): A SIP trunk (for example, Twilio or Bandwidth) forwards calls to OpenAI’s SIP endpoint. Your webhook receives the call event, creates a realtime session, and passes the call_id so audio flows through the phone network.
Agents SDK quick recipe
Create a project: Initialize a TS/JS app and install @openai/agents plus zod.
Generate an ephemeral client key: From your server, call /v1/realtime/client_secrets to get an ek_... key just-in-time for the browser.
Instantiate a RealtimeAgent: Give it a name and concise instructions to define persona and tone.
Create a RealtimeSession: Link it to the agent; the SDK picks WebRTC in the browser.
Connect and stream: Call session.connect() with the client key; mic access starts streaming and responses play through the speaker.
Handle tool calls (optional): Add tools and handle tool_calls events on the server to return results the model can speak.
2. Prerequisites
Node.js 18.18+ and a browser with microphone access.
OpenAI Realtime API access and an API key.
Optional: an OpenAI telephony number configured for SIP webhooks.
Comfort running shell commands.
3. Required environment variables
Set these before running

OPENAI_API_KEY – your Realtime API key (required).
OPENAI_SIGNING_SECRET – webhook signing secret for SIP (required if handling phone calls).
FROM_NUMBER – optional default outbound number tied to your OpenAI telephony setup.
PORT – optional server port (default 8000).
4. Project setup
Initialize a workspace
mkdir realtime-voice && cd realtime-voice
npm init -y
Install dependencies
npm install hono ws svix
npm install -D typescript ts-node @types/node @types/ws
Add a basic tsconfig.json
{
"compilerOptions": {
  "target": "ES2020",
  "module": "CommonJS",
  "moduleResolution": "Node",
  "esModuleInterop": true,
  "strict": true,
  "outDir": "dist",
  "types": ["node"]
},
"include": ["**/*.ts", "**/*.tsx"]
}
Create folders: frontend/ and routes/.
5. Frontend: WebRTC client
Place this in frontend/index.html. It requests mic access, starts/stops calls, and plays streamed audio.
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Realtime Video Demo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #050918;
      --card: rgba(12, 18, 40, 0.9);
      --border: rgba(255, 255, 255, 0.08);
      --fg: #eef4ff;
      --muted: #9bb3d8;
      --accent: #7fd6ff;
      --accent-2: #9e8aff;
      --success: #22c55e;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body {
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
      background: radial-gradient(circle at 12% 20%, rgba(126, 133, 255, 0.35), transparent 30%),
                  radial-gradient(circle at 82% 10%, rgba(86, 196, 255, 0.35), transparent 30%),
                  linear-gradient(130deg, #050918 0%, #0d1431 60%, #050918 100%);
      color: var(--fg);
      display: flex;
      justify-content: center;
      padding: 32px 16px 48px;
    }
    .page { width: min(1100px, 100%); display: flex; flex-direction: column; gap: 20px; }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 20px 80px rgba(0,0,0,0.35);
      position: relative;
      overflow: hidden;
    }
    .card::after { content:""; position:absolute; inset:0; pointer-events:none; background: radial-gradient(120% 80% at 100% 0%, rgba(122,125,255,0.08), transparent 60%); }
    .header { display:flex; justify-content:space-between; align-items:center; }
    .pill { padding:8px 12px; border-radius:999px; border:1px solid var(--border); background: rgba(255,255,255,0.04); display:inline-flex; align-items:center; gap:8px; font-size:13px; }
    .pill.fixed { min-width: 150px; justify-content: center; font-variant-numeric: tabular-nums; }
    .dot { width:10px; height:10px; border-radius:50%; }
    .dot.success { background: var(--success); box-shadow:0 0 0 6px rgba(34,197,94,0.15); }
    .dot.idle { background: var(--muted); }
    .layout { display:grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap:16px; }
    .mode-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap:10px; }
    .mode { border:1px solid var(--border); border-radius:12px; padding:12px; background: rgba(255,255,255,0.03); cursor:pointer; transition: all 0.15s ease; }
    .mode.active { border-color: rgba(122,125,255,0.9); box-shadow:0 8px 25px rgba(122,125,255,0.25); background: linear-gradient(135deg, rgba(122,125,255,0.15), rgba(106,196,255,0.08)); }
    button { border:none; border-radius:12px; padding:12px 16px; font-weight:600; cursor:pointer; transition: all 0.12s ease; }
    button:disabled { opacity:0.6; cursor:not-allowed; }
    .primary { background: linear-gradient(135deg, #7a7dff, #6ac4ff); color:#0a0f1f; box-shadow:0 10px 35px rgba(106,196,255,0.35); }
    .ghost { background: transparent; color: var(--fg); border:1px solid var(--border); }
    .preview { position:relative; border:1px solid var(--border); border-radius:14px; overflow:hidden; min-height:320px; background: radial-gradient(circle at 20% 20%, rgba(122,125,255,0.25), rgba(6,11,26,0.9) 65%); }
    .preview video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#0a1124; }
    .activity { max-height:260px; overflow-y:auto; display:grid; gap:8px; }
    .activity-item { padding:10px 12px; border:1px solid var(--border); border-radius:10px; background: rgba(255,255,255,0.03); font-family:"Space Grotesk", monospace; font-size:13px; display:flex; gap:10px; }
    .ts { color: var(--muted); min-width: 90px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card header">
      <div>
        <div style="font-size:22px;font-weight:600;">Realtime Voice/Video Demo</div>
        <div style="color:var(--muted);font-size:14px;">WebRTC with OpenAI Realtime</div>
      </div>
      <div style="display:flex;gap:12px;">
        <span class="pill fixed"><span id="status-dot" class="dot idle"></span><span id="status-text">Idle</span></span>
        <span class="pill fixed">Duration <span id="duration">00:00.000</span></span>
      </div>
    </div>

    <div class="layout">
      <div class="card">
        <h3 style="margin:0 0 4px 0;">Session Controls</h3>
        <p style="margin:0 0 10px 0; color:var(--muted);">Choose mode and launch a realtime session.</p>
        <div class="mode-grid">
          <div class="mode active" data-mode="audio">
            <strong>Audio Only</strong>
            <small style="color:var(--muted); display:block;">Low-latency mic with neural voice.</small>
          </div>
          <div class="mode" data-mode="webcam">
            <strong>Webcam</strong>
            <small style="color:var(--muted); display:block;">Camera + audio streaming.</small>
          </div>
          <div class="mode" data-mode="screen">
            <strong>Share Screen</strong>
            <small style="color:var(--muted); display:block;">Screen + mic audio.</small>
          </div>
        </div>
        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
          <button id="start" class="primary">Launch Session</button>
          <button id="stop" class="ghost" disabled>End Session</button>
        </div>
      </div>

      <div class="card">
        <div class="header" style="gap:12px; align-items:flex-start;">
          <div>
            <h3 style="margin:0;">Live Preview</h3>
            <p style="margin:0; color:var(--muted);">Monitor remote media feed and events.</p>
          </div>
          <span class="pill">WEBRTC</span>
        </div>
        <div class="preview" style="margin-top:10px;">
          <span class="pill" style="position:absolute;top:12px;right:12px;">Local/Remote</span>
          <video id="remoteVideo" autoplay playsinline muted></video>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3 style="margin:0;">Session Activity</h3>
          <p style="margin:0; color:var(--muted);">Inspect signaling, observer, and media changes.</p>
        </div>
        <button id="clear-log" class="ghost">Clear</button>
      </div>
      <div id="activity" class="activity"></div>
    </div>
  </div>

  <audio id="remoteAudio" autoplay playsinline></audio>

  <script>
    const activity = document.getElementById("activity");
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const durationEl = document.getElementById("duration");
    const remoteVideo = document.getElementById("remoteVideo");
    const remoteAudioEl = document.getElementById("remoteAudio");
    const clearLogBtn = document.getElementById("clear-log");
    const modeButtons = Array.from(document.querySelectorAll(".mode"));

    let mode = "audio";
    let callId = null;
    let pc = null;
    let dc = null;
    let localStream = null;
    let timer = null;
    let startTime = null;
    let sessionState = "idle";

    function ts() {
      return new Date().toISOString().split("T")[1].slice(0, 12);
    }
    function log(label, detail="") {
      const row = document.createElement("div");
      row.className = "activity-item";
      row.innerHTML = `<span class="ts">${ts()}</span><span><strong>${label}</strong>${detail ? " — " + detail : ""}</span>`;
      activity.appendChild(row);
      activity.scrollTop = activity.scrollHeight;
    }
    function setStatus(state, text) {
      statusDot.className = "dot " + state;
      statusText.textContent = text;
    }
    function startTimer() {
      startTime = performance.now();
      timer = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const s = Math.floor(elapsed / 1000);
        const ms = Math.floor(elapsed % 1000);
        const m = Math.floor(s / 60);
        durationEl.textContent = `${String(m).padStart(2,"0")}:${String(s%60).padStart(2,"0")}.${String(ms).padStart(3,"0")}`;
      }, 30);
    }
    function stopTimer() { if (timer) clearInterval(timer); timer=null; }

    function cleanupPeer() {
      if (pc) {
        pc.getSenders().forEach(s => s.track?.stop());
        pc.getReceivers().forEach(r => r.track?.stop());
        pc.getTransceivers().forEach(t => t.stop?.());
        pc.close();
      }
      if (dc) dc.close();
      if (localStream) localStream.getTracks().forEach(t => t.stop());
      pc = null; dc = null; localStream = null;
      remoteVideo.srcObject = null; remoteVideo.pause(); remoteVideo.currentTime = 0; remoteVideo.style.opacity = "0.3";
      remoteVideo.muted = true;
      remoteAudioEl.srcObject = null; remoteAudioEl.pause(); remoteAudioEl.currentTime = 0;
    }

    async function buildStream() {
      if (mode === "audio") return navigator.mediaDevices.getUserMedia({ audio: true });
      if (mode === "webcam") return navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720 } });
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      const combined = new MediaStream([...screen.getVideoTracks(), ...mic.getAudioTracks()]);
      screen.getVideoTracks()[0]?.addEventListener("ended", stopCall);
      return combined;
    }

    async function startCall() {
      if (sessionState !== "idle") return;
      sessionState = "starting";
      startBtn.disabled = true;
      stopBtn.disabled = false;
      setStatus("idle", "Connecting…");
      log("Session", "Starting call in mode: " + mode);
      try {
        localStream = await buildStream();
        remoteVideo.muted = true; // prevent local loopback/echo
        if (mode !== "audio") {
          remoteVideo.srcObject = localStream; // local preview until remote arrives
          remoteVideo.style.opacity = "0.7";
          remoteVideo.play().catch(()=>{});
        }

        pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
        dc = pc.createDataChannel("events");
        dc.onopen = () => setInterval(() => dc?.readyState === "open" && dc.send(JSON.stringify({ type:"ping", ts: Date.now()})), 15000);

        localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
        pc.ontrack = (ev) => {
          const [stream] = ev.streams;
          if (stream.getVideoTracks().length) {
            remoteVideo.srcObject = stream;
            remoteVideo.style.opacity = "1";
          } else {
            remoteAudioEl.srcObject = stream;
          }
        };
        pc.onconnectionstatechange = () => {
          log("Peer", pc.connectionState);
          if (pc.connectionState === "connected") {
            setStatus("success", "Connected");
            startTimer();
            sessionState = "active";
          }
        };

        const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
        await pc.setLocalDescription(offer);
        await new Promise((resolve) => {
          if (pc.iceGatheringState === "complete") return resolve(null);
          const t = setTimeout(resolve, 3000);
          pc.addEventListener("icegatheringstatechange", () => {
            if (pc.iceGatheringState === "complete") { clearTimeout(t); resolve(null); }
          }, { once: true });
        });
        const sdp = pc.localDescription?.sdp;
        if (!sdp) throw new Error("No SDP created");

        const resp = await fetch(mode === "audio" ? "/rtc" : "/rtc?video=true", {
          method: "POST",
          headers: { "Content-Type": "application/sdp" },
          body: sdp,
        });
        if (!resp.ok) throw new Error(await resp.text());
        const answer = await resp.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answer });
        callId = resp.headers.get("location")?.split("/").pop() || null;
        if (callId) log("Session", "Call ID: " + callId);
      } catch (err) {
        log("Error", err.message || String(err));
        setStatus("danger", "Error");
        cleanupPeer();
        stopTimer();
        callId = null;
        sessionState = "idle";
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    }

    async function stopCall() {
      if (sessionState === "idle") { startBtn.disabled = false; stopBtn.disabled = true; return; }
      sessionState = "stopping";
      log("Session", "Stopping…");
      stopTimer();
      if (callId) fetch(`/rtc/${callId}/hangup`, { method: "POST" }).catch(()=>{});
      cleanupPeer();
      callId = null;
      sessionState = "idle";
      startBtn.disabled = false;
      stopBtn.disabled = true;
      setStatus("idle", "Idle");
    }

    startBtn.addEventListener("click", () => startCall());
    stopBtn.addEventListener("click", () => stopCall());
    modeButtons.forEach(btn => btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
    }));
    clearLogBtn.addEventListener("click", () => { activity.innerHTML = ""; });
    log("Ready", "UI loaded");
  </script>
</body>
</html>
6. Backend: Hono server + routes
Place these files as shown; they run end-to-end when env vars are set. For a richer UX, add a status panel in React that shows WebRTC connection state, session ID, and recent events for easier debugging.
6.1 main.ts
import { Hono } from "hono";
import { readFile } from "fs/promises";
import path from "path";
import rtc from "./routes/rtc";
import observer from "./routes/observer";
import { serve } from "@hono/node-server";

const app = new Hono();
app.route("/rtc", rtc);
app.route("/observer", observer);

app.get("/", async (c) => {
  const filePath = path.join(process.cwd(), "frontend", "index.html");
  const html = await readFile(filePath, "utf8");
  return c.html(html);
});

const PORT = process.env.PORT || 8000;
console.log(`Server listening on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: Number(PORT) });
6.2 routes/observer.ts
import { Hono } from "hono";
import { readFile } from "fs/promises";
import path from "path";
import rtc from "./routes/rtc";
import observer from "./routes/observer";
import { serve } from "@hono/node-server";

const app = new Hono();
app.route("/rtc", rtc);
app.route("/observer", observer);

app.get("/", async (c) => {
  const filePath = path.join(process.cwd(), "frontend", "index.html");
  const html = await readFile(filePath, "utf8");
  return c.html(html);
});

const PORT = process.env.PORT || 8000;
console.log(`Server listening on http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: Number(PORT) });
6.3 routes/rtc.ts
import { Hono } from "hono";
import { makeHeaders, makeSession, getErrorText } from "./utils";

const rtc = new Hono();

rtc.post("/", async (c) => {
  const url = new URL(c.req.url);
  const video = url.searchParams.get("video") === "true";
  const sdp = await c.req.text();
  if (!sdp) return c.text("Missing SDP offer", 400);

  const fd = new FormData();
  fd.set("sdp", sdp);
  fd.set("session", JSON.stringify(makeSession(video)));

  const upstream = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: makeHeaders(),
    body: fd,
  });
  if (!upstream.ok) {
    const err = await getErrorText(upstream);
    console.error("start call failed", err);
    return c.text(err, upstream.status as any);
  }

  const answer = upstream.body;
  const location = upstream.headers.get("location");
  const headers: Record<string, string> = {
    "Content-Type": upstream.headers.get("content-type") || "application/sdp",
  };
  if (location) {
    headers["Location"] = location;
    const callId = location.split("/").pop();
    if (callId) {
      const origin = new URL(c.req.url).origin;
      fetch(`${origin}/observer/${callId}`, { method: "POST" }).catch(() => {});
    }
  }
  return c.newResponse(answer, { headers });
});

rtc.post("/:callId/:action", async (c) => {
  const { callId, action } = c.req.param();
  const resp = await fetch(`https://api.openai.com/v1/realtime/calls/${callId}/${action}`, {
    method: "POST",
    headers: makeHeaders(),
  });
  if (!resp.ok) return c.text(await getErrorText(resp), resp.status as any);
  return c.text("ok");
});

export default rtc;
6.4 routes/utils.ts
const MODEL = "gpt-realtime";
const VOICE = "marin";
const INSTRUCTIONS = `Greet the user in English. Keep replies brief and conversational.`;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key not configured");
}

export function makeHeaders(contentType?: string): Record<string, string> {
  const headers: Record<string, string> = { Authorization: `Bearer ${OPENAI_API_KEY}` };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

export function makeSession(_video?: boolean) {
  return {
    type: "realtime",
    model: MODEL,
    instructions: INSTRUCTIONS,
    audio: {
      input: { noise_reduction: { type: "near_field" } },
      output: { voice: VOICE },
    },
  };
}

export async function getErrorText(resp: Response): Promise<string> {
  const body = await resp.text().catch(() => "<no body>");
  return `${resp.status} ${resp.statusText}: ${body}`;
}
7. Run & test
Create .env
OPENAI_API_KEY=sk-...
PORT=8000
Start the server
npm run dev
Open the UI at http://localhost:8000, allow microphone access, click Start, and speak. You should hear responses streamed back with minimal latency.
Try video flag: Start a session with ?video=true on the frontend to pass a video hint in the SDP and observe how the backend forwards it.
You should be able to run the demo locally and add more components to it.realtime_video
![alt text](image.png)
8. Troubleshooting
401/403 errors: Ensure OPENAI_API_KEY is set and has Realtime access.
SIP webhook failures: Check OPENAI_SIGNING_SECRET and verify the Svix headers are present.
No audio: Confirm mic permissions, inspect browser console for mixed content or websocket errors, and verify audio/mpeg playback.
TLS/ingress: For public SIP/web access, run behind HTTPS (e.g., via ngrok or a reverse proxy).
9. Extension challenges
Add a tool invocation path in createHandler to call functions (for example, weather lookup) via MCP.
Swap the TTS voice and model (voice.name, model) to compare latency and quality.
Persist transcripts and audio snippets to storage for later retrieval or analytics.
Deploy behind HTTPS with auth; use ngrok for local tunnels and a TLS reverse proxy (e.g., Nginx) in production. Set up automatic restarts using a process manager.
Add a simple React status panel to display connection state and recent events.
Configure a SIP trunk to forward calls to OpenAI’s SIP endpoint and, in your webhook, use the call_id to start a RealtimeSession that bridges phone audio to the model.
With the Realtime API hooked to WebRTC and SIP, you now have a template for browser and telephony voice agents you can adapt to any workflow.