let bioDict = {};
let englishWords = new Set();

let targetWord = "";
let targetCount = {};
let guesses = [];
let interval = null;
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
});

function startGame() {
   
    timeLeft = 60;
    document.getElementById("timer").innerText = 60;
   
    document.getElementById("startScreen")
        .style.display = "none";

    document.getElementById("gameScreen")
        .style.display = "block";

    let words = Object.keys(bioDict);

    targetWord =
        words[Math.floor(Math.random() * words.length)];

    let letters =
        targetWord.replaceAll(" ", "").split("");

    letters.sort(() => Math.random() - 0.5);

    document.getElementById("letters")
        .innerText = letters.join(" ");

    targetCount =
        countLetters(
            targetWord.toLowerCase().replaceAll(" ", "")
        );

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
     clearInterval(interval);
     interval = setInterval(() => {

        timeLeft--;

        document.getElementById("timer")
            .innerText = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(interval);

            endGame();
        }

    }, 1000);
}


document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("guessInput");

    console.log("Input found:", input);

    input.addEventListener("keydown", (event) => {

        console.log("Key pressed:", event.key);

        if (event.key === "Enter") {
            event.preventDefault();
            submitGuess();
        }
    });
});


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

    console.log("Target word:", targetWord);
    console.log("Definition:", bioDict[targetWord]);
    document.getElementById("guessInput").disabled = true;
    
    html += "<h3>Definition</h3>";
    html += bioDict[targetWord];

    html += "<br><br>";
    html += '<button onclick ="nextRound()"> Another One</button>';

    document.getElementById("results")
      .innerHTML = html;

    
}
        function nextRound() {
    timeLeft = 60;
    document.getElementById("timer").innerText = 60;
    guesses = [];
    document.getElementById("guesses").innerHTML = "";
    document.getElementById("results").innerHTML = "";
    document.getElementById("guessInput").disabled = false;
    document.getElementById("guessInput").value = "";
    startGame();
}


