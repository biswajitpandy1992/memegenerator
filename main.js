let memeHistory = [];
let currentMemeIndex = 0;
let seenMemes = new Set();  // Set to track seen meme URLs

const generateMemeBtn = document.querySelector(".meme-generator .generate-meme-btn");
const memeImage = document.querySelector(".meme-generator img");
const memeTitle = document.querySelector(".meme-generator .meme-title");
const memeAuthor = document.querySelector(".meme-generator .meme-author");
const prevMemeBtn = document.querySelector(".prev-meme-btn");
const nextMemeBtn = document.querySelector(".next-meme-btn");

const updateDetails = (url, title, author) => {
    memeImage.src = url;
    memeImage.alt = "Meme: " + title;
    memeTitle.innerHTML = title;
    memeAuthor.innerHTML = `Meme by: ${author}`;
};

const addMemeToHistory = (url, title, author) => {
    if (currentMemeIndex !== memeHistory.length - 1) {
        memeHistory = memeHistory.slice(0, currentMemeIndex + 1);
    }
    memeHistory.push({ url, title, author });
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
            updateDetails(data.url, data.title, data.author);
            addMemeToHistory(data.url, data.title, data.author);
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
        updateDetails(meme.url, meme.title, meme.author);
    }
};

const goToNextMeme = () => {
    if (currentMemeIndex < memeHistory.length - 1) {
        currentMemeIndex++;
        const meme = memeHistory[currentMemeIndex];
        updateDetails(meme.url, meme.title, meme.author);
    }
};

generateMemeBtn.addEventListener("click", generateMeme);
prevMemeBtn.addEventListener("click", goToPreviousMeme);
nextMemeBtn.addEventListener("click", goToNextMeme);

generateMeme();  // Generate an initial meme on load
