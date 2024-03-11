//const flipCard = document.querySelector(".flip-card");

function updateFlip(timeLeft, initial = false) {
    //const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    //const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))

    const seconds = Math.floor((timeLeft % (1000 * 60)) / (1000));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (initial) {
        flipToCurrent(document.getElementById("hours-tens"), Math.floor(hours / 10));
        flipToCurrent(document.getElementById("hours-units"), hours % 10);
        flipToCurrent(document.getElementById("minutes-tens"), Math.floor(minutes / 10));
        flipToCurrent(document.getElementById("minutes-units"), minutes % 10);
        flipToCurrent(document.getElementById("seconds-tens"), Math.floor(seconds / 10));
        flipToCurrent(document.getElementById("seconds-units"), seconds % 10);
    }
    else {
        if (timeLeft > 0) {
            flip(document.getElementById("hours-tens"), Math.floor(hours / 10));
            flip(document.getElementById("hours-units"), hours % 10);
            flip(document.getElementById("minutes-tens"), Math.floor(minutes / 10));
            flip(document.getElementById("minutes-units"), minutes % 10);
            flip(document.getElementById("seconds-tens"), Math.floor(seconds / 10));
            flip(document.getElementById("seconds-units"), seconds % 10);
        }
        else {
            flip(document.getElementById("hours-tens"), "-");
            flip(document.getElementById("hours-units"), "-");
            flip(document.getElementById("minutes-tens"), "-");
            flip(document.getElementById("minutes-units"), "-");
            flip(document.getElementById("seconds-tens"), "-");
            flip(document.getElementById("seconds-units"), "-");
        }
        console.log(hours + "hours " + minutes + "minutes " + seconds + "seconds");
    }
}

function flip(flipCard, newNumber) {
    const topHalf = flipCard.querySelector(".top");
    const startNumber = parseInt(topHalf.textContent);
    if (newNumber == startNumber) return;

    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div"); // Create animation div element
    topFlip.classList.add("top-flip");
    const bottomFlip = document.createElement("div"); // Create animation div element
    bottomFlip.classList.add("bottom-flip");

    topHalf.textContent = startNumber;
    bottomHalf.textContent = startNumber;
    topFlip.textContent = startNumber;
    bottomFlip.textContent = newNumber;

    topFlip.addEventListener("animationstart", event => {
        topHalf.textContent = newNumber;
    })
    topFlip.addEventListener("animationend", event => {
        topFlip.remove();
    })
    bottomFlip.addEventListener("animationend", event => {
        bottomHalf.textContent = newNumber;
        bottomFlip.remove();
    })
    flipCard.append(topFlip, bottomFlip);
}

function flipToCurrent(flipCard, newNumber) {
    const topHalf = flipCard.querySelector(".top");
    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div");
    topFlip.classList.add("top-flip");
    const bottomFlip = document.createElement("div");
    bottomFlip.classList.add("bottom-flip");

    topHalf.textContent = newNumber;
    bottomHalf.textContent = newNumber;
    topFlip.textContent = newNumber;
    bottomFlip.textContent = newNumber;
}