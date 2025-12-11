function toggleMenu() {
    let menu = document.getElementById("mobileMenu");
    if (menu.style.left === "0px") {
        menu.style.left = "-350px";
    } else {
        menu.style.left = "0px";
    }
}

function startCountdown(targetDate) {
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const daysElement = document.getElementById("days");
            const hoursElement = document.getElementById("hours");
            const minutesElement = document.getElementById("minutes");
            const secondsElement = document.getElementById("seconds");

            if (daysElement) daysElement.innerText = days;
            if (hoursElement) hoursElement.innerText = hours;
            if (minutesElement) minutesElement.innerText = minutes;
            if (secondsElement) secondsElement.innerText = seconds;
        } else {
            clearInterval(timer);
            const countdownElement = document.querySelector(".countdown");
            if (countdownElement) {
                countdownElement.innerHTML = "Time's up!";
            }
        }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
}

// Set the target date (adjust as needed)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 10); // 10 days from now

startCountdown(targetDate);
