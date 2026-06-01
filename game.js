let bioDict = {};
let englishWords = new Set();

let targetWord = "";
let targetCount = {};
let guesses = [];

let timeLeft = 60;

Promise.all([
    fetch("biology_dictionary.json").then(r => r.json()),
    fetch("english_words.txt").then(r => r.text())
])
.then(([bioData, englishData]) => {

    bioDict = bioData;

    englishWords = new Set(
        englishData
        .split("\n")
        .map(x => x.trim().toLowerCase())
        .filter(x => x.length > 0)
    );

    startGame();
});

function startGame() {

    let words = Object.keys(bioDict);

    targetWord =
        words[Math.floor(Math.random() * words.length)]
        .toLowerCase();

    let letters =
        targetWord.replaceAll(" ", "").split("");

    letters.sort(() => Math.random() - 0.5);

    document.getElementById("letters")
        .innerText = letters.join(" ");

    targetCount =
        countLetters(targetWord.replaceAll(" ", ""));

    startTimer();
}

function countLetters(word) {

    let counts = {};

    for (let c of word) {
        counts[c] = (counts[c] || 0) + 1;
    }

    return counts;
}

function validWord(word) {

    word = word.toLowerCase();

    if (!englishWords.has(word))
        return false;

    let wc = countLetters(word);

    for (let c in wc) {

        if (!(c in targetCount))
            return false;

        if (wc[c] > targetCount[c])
            return false;
    }

    return true;
}

function submitGuess() {

    let input =
        document.getElementById("guessInput");

    let word =
        input.value.trim().toLowerCase();

    if (word.length === 0)
        return;

    guesses.push(word);

    let li = document.createElement("li");
    li.textContent = word;

    document
        .getElementById("guesses")
        .appendChild(li);

    input.value = "";
}

function startTimer() {

    let interval = setInterval(() => {

        timeLeft--;

        document.getElementById("timer")
            .innerText = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(interval);

            endGame();
        }

    }, 1000);
}

function endGame() {

    let valid = new Set();
    let invalid = new Set();

    for (let word of guesses) {

        if (validWord(word))
            valid.add(word);
        else
            invalid.add(word);
    }

    let score = 0;

    valid.forEach(word => {

        if (word.length === 3)
            score += 1;
        else if (word.length === 4)
            score += 2;
        else if (word.length === 5)
            score += 4;
        else
            score += word.length;
    });

    let html = "";

    html += "<h2>TIME UP!</h2>";
    html += "<h3>Score: " + score + "</h3>";

    html += "<h3>Valid Words</h3>";
    html += [...valid].join(", ");

    html += "<h3>Invalid Words</h3>";
    html += [...invalid].join(", ");

    html += "<h3>Biology Term</h3>";
    html += targetWord;

    html += "<h3>Definition</h3>";
    html += bioDict[targetWord];

    document.getElementById("results")
        .innerHTML = html;
}

window.onload = function() {

    document.getElementById("guessInput")
        .addEventListener("keydown", function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                submitGuess();
            }

        });

};

