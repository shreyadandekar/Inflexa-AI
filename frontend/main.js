/**
 * Inflexa Frontend Logic - Strict User Mapping Implementation
 */

const API_BASE = '/api';

// State
let activeInputType = null; // 'video', 'audio', 'image', 'text'
let activeFile = null;
let activeImageSrc = null; // For preview

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('dashboard') || path === '/dashboard.html') {
        initDashboard();
    } else if (path.includes('login') || path.includes('signup')) {
        initAuth();
    }
});

function initAuth() {
    const forms = ['loginForm', 'signupForm'];
    forms.forEach(id => {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                window.location.href = 'dashboard.html';
            });
        }
    });
}

function initDashboard() {
    setupUploadZones();
    setupTextInput();
    setupProcessButton();
}

/**
 * Setup Upload Zones with specific file type detection
 */
function setupUploadZones() {
    // 1. Media Zone (Video/Audio)
    const zoneMedia = document.getElementById('uploadZoneMedia');
    const inputMedia = document.getElementById('fileInputMedia');

    setupDragDrop(zoneMedia, inputMedia, (file) => {
        const type = file.type.startsWith('video') ? 'video' : 'audio';
        handleFileSelection(file, type);
    });

    // 2. Image Zone
    const zoneImage = document.getElementById('uploadZoneImage');
    const inputImage = document.getElementById('fileInputImage');

    setupDragDrop(zoneImage, inputImage, (file) => {
        handleFileSelection(file, 'image');
    });
}

function setupDragDrop(zone, input, callback) {
    zone.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
        if (input.files.length) callback(input.files[0]);
    });

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files.length) callback(e.dataTransfer.files[0]);
    });
}

function setupTextInput() {
    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');

    textInput.addEventListener('input', () => {
        const len = textInput.value.length;
        charCount.textContent = len;

        if (len > 0) {
            // Priority: File > Text, but if no file, text is active
            if (!activeFile) setActiveInput('text');
        } else {
            if (!activeFile) setActiveInput(null);
        }
    });
}

function handleFileSelection(file, type) {
    const error = validateFile(file, type);
    if (error) {
        showStatus(error, 'text-danger');
        return;
    }

    activeFile = file;
    setActiveInput(type);

    // Update UI Labels
    const mediaLabel = document.getElementById('fileNameMedia');
    const imageLabel = document.getElementById('fileNameImage');
    const textInput = document.getElementById('textInput');

    if (type === 'video' || type === 'audio') {
        mediaLabel.textContent = `[${type.toUpperCase()}] ${file.name}`;
        mediaLabel.classList.remove('hidden');
        imageLabel.classList.add('hidden');
        textInput.value = ''; // Clear text
        activeImageSrc = null;
    } else if (type === 'image') {
        imageLabel.textContent = `[IMAGE] ${file.name}`;
        imageLabel.classList.remove('hidden');
        mediaLabel.classList.add('hidden');
        textInput.value = '';

        // Read for Preview
        const reader = new FileReader();
        reader.onload = (e) => activeImageSrc = e.target.result;
        reader.readAsDataURL(file);
    }
}

function validateFile(file, type) {
    const MB = 1024 * 1024;

    if (type === 'video' || type === 'audio') {
        const validTypes = ['video/mp4', 'audio/mpeg', 'audio/wav', 'audio/mp3', 'video/quicktime'];
        // Strict limit: 15MB from requirements
        if (file.size > 15 * MB) return "File too large. Max 15MB allowed.";
    } else if (type === 'image') {
        // Strict limit: 5MB
        if (file.size > 5 * MB) return "Image too large. Max 5MB allowed.";
    }
    return null;
}

function setActiveInput(type) {
    activeInputType = type;
    updateOptionsMapping(type);

    const btn = document.getElementById('processBtn');
    if (type) {
        btn.disabled = false;
        showStatus(`Ready to process ${type}`, 'text-teal-600');
    } else {
        btn.disabled = true;
        showStatus('', '');
    }
}

/**
 * IMPLEMENTATION OF USER'S STRICT MAPPING
 * Mapped by Input Type × Disability Perspective
 */
function updateOptionsMapping(type) {
    // Helper to toggle
    const toggle = (id, enable) => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = !enable;
            if (!enable) el.checked = false;
            el.parentElement.style.opacity = enable ? '1' : '0.5';
            el.parentElement.style.cursor = enable ? 'pointer' : 'not-allowed';
        }
    };

    // 1. Reset all
    ['optCaptions', 'optISLx', 'optDiagram', 'optTTS', 'optSimplify', 'optSummary', 'optCognitive'].forEach(id => toggle(id, false));

    if (!type) return;

    // 2. Apply Mapping
    if (type === 'video') {
        // Video Input
        // Hearing: Captions, ISL
        toggle('optCaptions', true);
        toggle('optISLx', true);
        // Visual: Audio Narration (of visuals)
        toggle('optTTS', true);
        // Dyslexic: Simplified Captions
        toggle('optSimplify', true);
        // ADHD: Highlights
        toggle('optSummary', true);
        // Cognitive: Step-by-step
        toggle('optCognitive', true);

    } else if (type === 'audio') {
        // Audio Input
        // Hearing: Transcript (captured by Captions logic), ISL
        toggle('optCaptions', true); // Acts as Transcript
        toggle('optISLx', true);
        // Visual: Clean audio exists -> Disable visual tools? 
        // User said "Clean audio already exists → No extra processing". So we keep TTS disabled? 
        // Actually, let's keep TTS disabled as requested (User: "No extra processing").
        toggle('optTTS', false);
        // Dyslexia: Simplified Transcript
        toggle('optSimplify', true);
        // ADHD: Summaries
        toggle('optSummary', true);

    } else if (type === 'image') {
        // Image Input
        // Visual: Diagram Explain, Audio Narration
        toggle('optDiagram', true);
        toggle('optTTS', true); // TTS of the explanation
        // Cognitive: Step-by-step
        toggle('optCognitive', true);
        // ADHD: Highlights
        toggle('optSummary', true);
        // Hearing: N/A usually, but maybe ISL of text in image? User didn't specify, so disable ISL/Captions.

    } else if (type === 'text') {
        // Text Input
        // Hearing: ISL Gloss
        toggle('optISLx', true);
        // Dyslexia: Simplify
        toggle('optSimplify', true);
        // ADHD: Highlights
        toggle('optSummary', true);
        // Visual: Audio Narration (TTS)
        toggle('optTTS', true);
        // Cognitive
        toggle('optCognitive', true);
    }
}

function setupProcessButton() {
    document.getElementById('processBtn').addEventListener('click', async () => {
        const resultsSection = document.getElementById('resultsSection');
        const spinner = document.getElementById('loadingSpinner');
        const grid = document.getElementById('resultsGrid');

        resultsSection.classList.remove('hidden');
        spinner.classList.remove('hidden');
        grid.innerHTML = '';

        try {
            const results = await processPipeline();
            renderResults(results);
        } catch (err) {
            console.error(err);
            showStatus(err.message, 'text-danger');
            grid.innerHTML = `<div class="col-span-2 text-center text-danger">Error: ${err.message}</div>`;
        } finally {
            spinner.classList.add('hidden');
        }
    });
}

/**
 * Processing Pipeline orchestrating API calls
 */
async function processPipeline() {
    const options = {
        captions: document.getElementById('optCaptions')?.checked,
        isl: document.getElementById('optISLx')?.checked,
        diagram: document.getElementById('optDiagram')?.checked,
        tts: document.getElementById('optTTS')?.checked,
        simplify: document.getElementById('optSimplify')?.checked,
        summary: document.getElementById('optSummary')?.checked,
        cognitive: document.getElementById('optCognitive')?.checked,
    };

    const results = [];
    let baseText = "";

    // --- STEP 1: EXTRACT BASE CONTENT ---
    if (activeInputType === 'video' || activeInputType === 'audio') {
        // Always transcribe first for audio/video
        const transcript = await uploadFile('/audio/transcribe', activeFile);

        // Try to parse as JSON (timestamped sequence)
        let cleanText = transcript;
        try {
            if (transcript.trim().startsWith('[')) {
                const parsed = JSON.parse(transcript);
                cleanText = parsed.map(p => p.text).join(' ');
            }
        } catch (e) { }

        baseText = cleanText;

        // Output Processor for video, or simple text for audio
        if (activeInputType === 'video' && options.captions) {
            results.push({
                title: 'Video Analysis',
                type: 'video_processor',
                transcript: transcript,
                isl: null,
                videoSrc: URL.createObjectURL(activeFile),
                icon: 'fa-video'
            });
        } else if (options.captions) {
            results.push({
                title: activeInputType === 'video' ? 'Video Transcript' : 'Audio Transcript',
                type: 'text',
                content: cleanText,
                icon: 'fa-closed-captioning'
            });
        }
    } else if (activeInputType === 'image') {
        // Explain image
        const explanation = await uploadFile('/image/diagram-explain', activeFile);
        baseText = explanation; // Use explanation as base for other tools (TTS, Summary)

        if (options.diagram) {
            results.push({
                title: 'Visual Explanation',
                type: 'text',
                content: explanation,
                icon: 'fa-eye',
                image: activeImageSrc // Pass image for rendering
            });
        }
    } else {
        baseText = document.getElementById('textInput').value;
    }

    if (!baseText) throw new Error("No content to process.");

    // --- STEP 2: GENERATE DERIVED OUTPUTS (Chain calls) ---

    const promises = [];

    // ISL Gloss
    if (options.isl) {
        // If we already have ISL in the JSON transcript, use it
        const videoCard = results.find(r => r.type === 'video_processor');
        let islContent = "";

        if (videoCard && videoCard.transcript.trim().startsWith('[')) {
            try {
                const parsed = JSON.parse(videoCard.transcript);
                islContent = parsed.map(p => p.isl).join(' ');
            } catch (e) { }
        }

        if (islContent) {
            results.push({
                title: 'ISL Gloss Output',
                type: 'text',
                content: islContent,
                icon: 'fa-hands-signing'
            });
        } else {
            promises.push(callTextApi('/text/isl-gloss', baseText).then(res => ({
                title: 'ISL Gloss Output',
                type: 'text',
                content: res,
                icon: 'fa-hands-signing'
            })));
        }
    }

    // Simplification (Dyslexia)
    if (options.simplify) {
        promises.push(callTextApi('/text/simplify', baseText).then(res => ({
            title: 'Simplified Text (Dyslexia Friendly)',
            type: 'text',
            content: res,
            icon: 'fa-book-open'
        })));
    }

    // Summary / Highlights (ADHD)
    if (options.summary) {
        promises.push(callTextApi('/text/adhd-summary', baseText).then(res => ({
            title: 'Key Highlights (ADHD Support)',
            type: 'text',
            content: res,
            icon: 'fa-highlighter'
        })));
    }

    // Cognitive Step-by-Step
    if (options.cognitive) {
        promises.push(callTextApi('/text/cognitive-explain', baseText).then(res => ({
            title: 'Step-by-Step Explanation',
            type: 'text',
            content: res,
            icon: 'fa-list-ol'
        })));
    }

    // TTS (Audio Narration)
    if (options.tts) {
        // For Image: Narrate the explanation
        // For Video: User wants narration of visuals. Since we lack frame analysis, we act on the transcript/explanation.
        promises.push(callTextApi('/text/text-to-speech', baseText).then(res => {
            if (res.audio_content) {
                return {
                    title: 'Audio Narration',
                    type: 'audio',
                    content: res.audio_content,
                    icon: 'fa-volume-up'
                };
            }
            return null;
        }).catch(() => {
            // Fallback to Frontend TTS
            return {
                title: 'Audio Narration',
                type: 'frontend_tts',
                content: baseText,
                icon: 'fa-volume-up'
            };
        }));
    }

    const derivedResults = await Promise.all(promises);
    results.push(...derivedResults.filter(r => r !== null));

    return results;
}

// --- API Helpers ---

async function uploadFile(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(API_BASE + endpoint, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.transcript || data.explanation || data.result;
}

async function callTextApi(endpoint, text) {
    const res = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.result || data;
}

// --- Rendering ---

function renderResults(results) {
    const grid = document.getElementById('resultsGrid');

    if (results.length === 0) {
        grid.innerHTML = '<div class="col-span-2 text-center text-muted p-8">No specific outputs selected.</div>';
        return;
    }

    // Check if we have only video results (no image/visual analysis)
    const hasVisualAnalysis = results.some(item => item.image || item.title.includes('Visual'));
    const hasOnlyVideo = results.length === 1 && results[0].type === 'video_processor';

    // 1. Setup Layout Containers
    grid.innerHTML = '';
    grid.className = 'results-section-container';

    let layout, leftCol, rightCol;

    if (hasOnlyVideo || !hasVisualAnalysis) {
        // Use single-column centered layout for video-only or non-visual results
        layout = document.createElement('div');
        layout.className = 'space-y-4';
        layout.style.maxWidth = '1000px';
        layout.style.margin = '0 auto';
        grid.appendChild(layout);
    } else {
        // Use split layout for mixed content
        layout = document.createElement('div');
        layout.className = 'results-split-layout';

        leftCol = document.createElement('div');
        leftCol.className = 'sticky-column space-y-4';

        rightCol = document.createElement('div');
        rightCol.className = 'space-y-4';

        layout.appendChild(leftCol);
        layout.appendChild(rightCol);
        grid.appendChild(layout);
    }

    // 2. Distribute Cards
    results.forEach(item => {
        // Decide column based on type
        // For single-column layout, append to layout directly
        // For split layout: Image Explanation -> Left, Others -> Right
        let targetCol;
        if (hasOnlyVideo || !hasVisualAnalysis) {
            targetCol = layout; // Single column
        } else {
            targetCol = (item.image || item.title.includes('Visual')) ? leftCol : rightCol;
        }

        const card = document.createElement('div');
        card.className = 'card-professional p-0 animate-fade-in';

        const header = `
            <div class="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <h3 class="font-bold text-gray-800 text-lg">${item.title}</h3>
                </div>
            </div>
        `;

        let body = '';
        if (item.type === 'video_processor') {
            body = `
                <div class="p-0">
                    <div class="video-container" id="videoContainer">
                        <video id="activeVideo" class="video-player" controls>
                            <source src="${item.videoSrc}" type="video/mp4">
                        </video>
                        <div class="video-captions-overlay" id="captionOverlay">
                            <div class="caption-bubble" id="captionText">Initializing captions...</div>
                        </div>
                    </div>
                    <div class="caption-controls" id="captionControls">
                        <button class="caption-btn active" onclick="setCaptionMode('normal', this)">
                            <i class="fas fa-closed-captioning mr-1"></i> English
                        </button>
                        <button class="caption-btn" onclick="setCaptionMode('isl', this)">
                            <i class="fas fa-hand-paper mr-1"></i> ISL Gloss
                        </button>
                        <button class="caption-btn" onclick="setCaptionMode('none', this)">
                            Off
                        </button>
                        <button class="caption-btn ml-auto" onclick="toggleFullScreen()">
                            <i class="fas fa-expand mr-1"></i> Full Screen
                        </button>
                    </div>

                </div>
            `;
            // Store data for sync
            window.activeVideoData = {
                transcript: item.transcript,
                isl: item.isl,
                mode: 'normal'
            };
            // Setup sync after render
            setTimeout(() => setupVideoSync(), 200);
        } else if (item.type === 'audio') {
            body = `
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                        <i class="fas fa-headphones-alt text-2xl"></i>
                    </div>
                    <audio controls class="w-full mb-4">
                        <source src="data:audio/mp3;base64,${item.content}" type="audio/mp3">
                    </audio>
                    <a href="data:audio/mp3;base64,${item.content}" download="inflexa-audio.mp3" class="btn btn-outline w-full">
                        <i class="fas fa-download mr-2"></i> Download MP3
                    </a>
                </div>
            `;
        } else if (item.type === 'frontend_tts') {
            // Browser-based TTS - Clean text before speaking!
            const cleanTextForSpeech = item.content.replace(/[\*#_:;]/g, '').replace(/\n/g, '. ');

            // Browser-based TTS Fallback
            body = `
                <div class="p-8 text-center">
                    <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                        <i class="fas fa-bullhorn text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-2">Audio Narration</h4>
                    <p class="text-sm text-gray-500 mb-6">Generated using browser text-to-speech.</p>
                    
                    <button class="btn btn-primary w-full mb-3" onclick="speakText(\`${cleanTextForSpeech.replace(/`/g, '\\`').replace(/"/g, '&quot;')}\`)">
                        <i class="fas fa-play mr-2"></i> Read Aloud
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="window.speechSynthesis.cancel()">
                        <i class="fas fa-stop mr-2"></i> Stop
                    </button>
                </div>
            `;
        } else {
            // Text Content with optional Image Preview (Zoomable)
            const imgHtml = item.image ?
                `<div class="image-preview-container" onclick="openZoom('${item.image}')">
            <img src="${item.image}" class="image-preview-rect" alt="Analyzed Image">
            <div class="image-overlay-icon"><i class="fas fa-search-plus text-2xl"></i></div>
         </div>` : '';

            body = `
                ${imgHtml}
                <div class="p-6">
                    <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-4 font-body">
                        ${marked.parse(item.content)}
                    </div>
                    <div class="flex gap-3">
                        <button class="btn btn-sm btn-secondary flex-1" onclick="copyToClipboard(this, \`${item.content.replace(/`/g, '\\`').replace(/"/g, '&quot;')}\`)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="btn btn-sm btn-outline flex-1" onclick="downloadText('${item.title}', \`${item.content.replace(/`/g, '\\`')}\`)">
                            <i class="fas fa-download"></i> Save
                        </button>
                    </div>
                </div>
            `;
        }

        card.innerHTML = header + body;
        targetCol.appendChild(card);
    });
}

function showStatus(msg, cls) {
    const el = document.getElementById('statusMessage');
    el.textContent = msg;
    el.className = `text-center text-xs mt-2 h-4 ${cls}`;
}

window.copyToClipboard = (btn, text) => {
    navigator.clipboard.writeText(text);
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
    setTimeout(() => btn.innerHTML = original, 2000);
};

window.downloadText = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

window.speakText = (text) => {
    window.speechSynthesis.cancel();
    // Double clean just in case
    const clean = text.replace(/[\*#_:;]/g, ' ').replace(/\s+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    window.speechSynthesis.speak(utterance);
};

// Zoom Modal Logic
const modalHtml = `
<div id="imageZoomModal" class="zoom-modal">
  <span class="close-modal" onclick="closeZoom()">&times;</span>
  <img class="modal-content" id="img01">
</div>`;
if (!document.getElementById('imageZoomModal')) document.body.insertAdjacentHTML('beforeend', modalHtml);

window.openZoom = (src) => {
    const modal = document.getElementById('imageZoomModal');
    const modalImg = document.getElementById('img01');
    modal.style.display = "flex";
    modalImg.src = src;
};

window.closeZoom = () => {
    document.getElementById('imageZoomModal').style.display = "none";
};

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('imageZoomModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Video Caption Sync Logic
window.setCaptionMode = (mode, btn) => {
    if (!window.activeVideoData) return;
    window.activeVideoData.mode = mode;

    // Update active button
    const container = document.getElementById('captionControls');
    container.querySelectorAll('.caption-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const overlay = document.getElementById('captionOverlay');
    if (mode === 'none') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'block';
        if (mode === 'isl') overlay.classList.add('isl-mode');
        else overlay.classList.remove('isl-mode');
    }
};

function setupVideoSync() {
    const video = document.getElementById('activeVideo');
    const display = document.getElementById('captionText');
    const container = document.getElementById('videoContainer');
    if (!video || !display || !container) return;

    // 1. Parse JSON sequence if it exists
    try {
        let raw = window.activeVideoData.transcript;
        if (typeof raw === 'string') {
            // Robustly strip markdown blocks
            raw = raw.replace(/^```[a-z]*\n?/mi, '').replace(/\n?```$/m, '').trim();
            if (raw.startsWith('[')) {
                window.activeVideoData.sequence = JSON.parse(raw);
                console.log("DEBUG: Using JSON sequence for perfect sync.");
            }
        }
    } catch (e) {
        console.warn("Could not parse caption sequence:", e);
    }


    // 2. Add Full-screen support on double click of container
    container.ondblclick = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        }
    };

    // 3. Perfect Sync Loop
    video.ontimeupdate = () => {
        if (!window.activeVideoData || window.activeVideoData.mode === 'none') return;

        const time = video.currentTime;
        const mode = window.activeVideoData.mode;
        const sequence = window.activeVideoData.sequence;

        if (sequence && Array.isArray(sequence)) {
            // Find the current caption segment
            const current = sequence.find(cap => time >= cap.start && time <= cap.end);
            if (current) {
                display.textContent = mode === 'isl' ? current.isl : current.text;
                return;
            }
            display.textContent = "";
        } else {
            // Fallback to old sentence logic if JSON failed
            const fullText = mode === 'isl' ? window.activeVideoData.isl : window.activeVideoData.transcript;

            // If it still looks like JSON, don't display it as text!
            if (!fullText || fullText.trim().startsWith('[') || fullText.trim().startsWith('{') || fullText.trim().startsWith('```')) {
                display.textContent = "";
                return;
            }

            const sentences = fullText.split(/[.!?]/).filter(s => s.trim().length > 0);
            const duration = video.duration;
            if (!duration) return;
            const index = Math.floor((time / duration) * sentences.length);
            display.textContent = sentences[Math.min(index, sentences.length - 1)].trim();
        }

    };
}
window.toggleFullScreen = () => {
    const container = document.getElementById('videoContainer');
    if (!container) return;

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};
