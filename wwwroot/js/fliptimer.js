//const flipCard = document.querySelector(".flip-card");

function updateFlip(timeLeft, initial = false) {
    //const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    //const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const seconds = Math.floor((timeLeft % (1000 * 60)) / (1000));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    if (initial) {
        if (days > 99) {
            flipToCurrent(document.getElementById("days-more-than"), ">");
            flipToCurrent(document.getElementById("days-tens"), "9");
            flipToCurrent(document.getElementById("days-units"), "9");
        }
        else {
            flipToCurrent(document.getElementById("days-more-than"), "0");
            flipToCurrent(document.getElementById("days-tens"), Math.floor(days / 10));
            flipToCurrent(document.getElementById("days-units"), days % 10);
        }
        flipToCurrent(document.getElementById("hours-tens"), Math.floor(hours / 10));
        flipToCurrent(document.getElementById("hours-units"), hours % 10);
        flipToCurrent(document.getElementById("minutes-tens"), Math.floor(minutes / 10));
        flipToCurrent(document.getElementById("minutes-units"), minutes % 10);
        flipToCurrent(document.getElementById("seconds-tens"), Math.floor(seconds / 10));
        flipToCurrent(document.getElementById("seconds-units"), seconds % 10);
    }
    else {
        if (timeLeft > 0) {
            if (days <= 99) {
                flip(document.getElementById("days-more-than"), 0);
                flip(document.getElementById("days-tens"), Math.floor(days / 10));
                flip(document.getElementById("days-units"), days % 10);
            }
            flip(document.getElementById("hours-tens"), Math.floor(hours / 10));
            flip(document.getElementById("hours-units"), hours % 10);
            flip(document.getElementById("minutes-tens"), Math.floor(minutes / 10));
            flip(document.getElementById("minutes-units"), minutes % 10);
            flip(document.getElementById("seconds-tens"), Math.floor(seconds / 10));
            flip(document.getElementById("seconds-units"), seconds % 10);
        }
        else {
            flip(document.getElementById("days-more-than"), "-");
            flip(document.getElementById("days-tens"), "-");
            flip(document.getElementById("days-units"), "-");
            flip(document.getElementById("hours-tens"), "-");
            flip(document.getElementById("hours-units"), "-");
            flip(document.getElementById("minutes-tens"), "-");
            flip(document.getElementById("minutes-units"), "-");
            flip(document.getElementById("seconds-tens"), "-");
            flip(document.getElementById("seconds-units"), "-");
        }
        console.log(days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds");
    }
}

function flip(flipCard, newValue) {
    const topHalf = flipCard.querySelector(".top");
    const startValue = topHalf.textContent;
    if (newValue == startValue) return;

    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div"); // Create animation div element
    topFlip.classList.add("top-flip");
    const bottomFlip = document.createElement("div"); // Create animation div element
    bottomFlip.classList.add("bottom-flip");

    topHalf.textContent = startValue;
    bottomHalf.textContent = startValue;
    topFlip.textContent = startValue;
    bottomFlip.textContent = newValue;

    topFlip.addEventListener("animationstart", event => {
        topHalf.textContent = newValue;
    })
    topFlip.addEventListener("animationend", event => {
        topFlip.remove();
    })
    bottomFlip.addEventListener("animationend", event => {
        bottomHalf.textContent = newValue;
        bottomFlip.remove();
    })
    flipCard.append(topFlip, bottomFlip);
}

function flipToCurrent(flipCard, newValue) {
    const topHalf = flipCard.querySelector(".top");
    const bottomHalf = flipCard.querySelector(".bottom");
    const topFlip = document.createElement("div");
    topFlip.classList.add("top-flip");
    const bottomFlip = document.createElement("div");
    bottomFlip.classList.add("bottom-flip");

    topHalf.textContent = newValue;
    bottomHalf.textContent = newValue;
    topFlip.textContent = newValue;
    bottomFlip.textContent = newValue;
}