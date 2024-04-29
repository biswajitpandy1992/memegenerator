let memeHistory = [];
let currentMemeIndex = 0;
let seenMemes = new Set();  // Set to track seen meme URLs

const generateMemeBtn = document.querySelector(".meme-generator .generate-meme-btn");
const memeImage = document.querySelector(".meme-generator img");
const memeTitle = document.querySelector(".meme-generator .meme-title");
const prevMemeBtn = document.querySelector(".prev-meme-btn");
const nextMemeBtn = document.querySelector(".next-meme-btn");

const updateDetails = (url, title) => {
    memeImage.src = url;
    memeImage.alt = "Meme: " + title;
    memeTitle.innerHTML = title;
};

const addMemeToHistory = (url, title) => {
    if (currentMemeIndex !== memeHistory.length - 1) {
        memeHistory = memeHistory.slice(0, currentMemeIndex + 1);
    }
    memeHistory.push({ url, title });
    currentMemeIndex = memeHistory.length - 1;
};

const generateMeme = () => {
    fetch("https://meme-api.com/gimme/wholesomememes")
        .then(response => response.json())
        .then(data => {
            if (seenMemes.has(data.url)) {
                console.log("Duplicate meme found, fetching another...");
                generateMeme();  // Recursively fetch another meme
                return;
            }
            seenMemes.add(data.url);  // Add the new meme URL to the set of seen memes
            updateDetails(data.url, data.title);
            addMemeToHistory(data.url, data.title);
        })
        .catch(error => {
            console.error('Error fetching meme:', error);
            memeTitle.innerHTML = 'Failed to load meme. Try again!';
        });
};

const goToPreviousMeme = () => {
    if (currentMemeIndex > 0) {
        currentMemeIndex--;
        const meme = memeHistory[currentMemeIndex];
        updateDetails(meme.url, meme.title);
    }
};

const goToNextMeme = () => {
    if (currentMemeIndex < memeHistory.length - 1) {
        currentMemeIndex++;
        const meme = memeHistory[currentMemeIndex];
        updateDetails(meme.url, meme.title);
    }
};

generateMemeBtn.addEventListener("click", generateMeme);
prevMemeBtn.addEventListener("click", goToPreviousMeme);
nextMemeBtn.addEventListener("click", goToNextMeme);

generateMeme();  // Generate an initial meme on load
