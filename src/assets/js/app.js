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

            document.getElementById("days").innerText = days;
            document.getElementById("hours").innerText = hours;
            document.getElementById("minutes").innerText = minutes;
            document.getElementById("seconds").innerText = seconds;
        } else {
            clearInterval(timer);
            document.querySelector(".countdown").innerHTML = "Time's up!";
        }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
}

// Set the target date (adjust as needed)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 10); // 10 days from now

startCountdown(targetDate);
