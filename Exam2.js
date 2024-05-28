document.addEventListener("DOMContentLoaded", function() {
    const images = ["nai", "bau", "ga", "ca", "cua", "tom"];
    const slots = document.querySelectorAll(".slot img");
    const spinButton = document.getElementById("spinButton");
    const resetButton = document.getElementById("resetButton");
    const imageElements = document.querySelectorAll(".image");
    const result = document.getElementById("result");
    let bettingPoints = {
        "nai": 0,
        "bau": 0,
        "ga": 0,
        "ca": 0,
        "cua": 0,
        "tom": 0
    };
    let totalBettingPoints = 0;
    let isSpinning = false;

    spinButton.addEventListener("click", function() {
        if (isSpinning) return;

        isSpinning = true;
        toggleButtons(false);

        let spinCount = 0;
        const intervalId = setInterval(() => {
            spinCount++;
            slots.forEach(slot => {
                const randomImage = images[Math.floor(Math.random() * images.length)];
                slot.src = `./img/${randomImage}.png`;
            });

            if (spinCount >= 100) {
                clearInterval(intervalId);
                isSpinning = false;
                toggleButtons(true);
                checkResult();
            }
        }, 50);
    });

    imageElements.forEach(imageElement => {
        imageElement.addEventListener("click", function() {
            if (isSpinning || totalBettingPoints >= 3) return;

            const image = imageElement.getAttribute("data-image");
            if (bettingPoints[image] < 3 && totalBettingPoints < 3) {
                bettingPoints[image]++;
                totalBettingPoints++;
                updateBettingPoints();
            }
        });
    });

    resetButton.addEventListener("click", function() {
        if (isSpinning) return;
        bettingPoints = {
            "nai": 0,
            "bau": 0,
            "ga": 0,
            "ca": 0,
            "cua": 0,
            "tom": 0
        };
        totalBettingPoints = 0;
        updateBettingPoints();
        result.innerHTML = "";
    });

    function updateBettingPoints() {
        imageElements.forEach(imageElement => {
            const image = imageElement.getAttribute("data-image");
            const span = imageElement.querySelector("span");
            span.innerHTML = bettingPoints[image];
        });
    }

    function toggleButtons(enable) {
        spinButton.disabled = !enable;
        resetButton.disabled = !enable;
        imageElements.forEach(imageElement => {
            imageElement.style.pointerEvents = enable ? "auto" : "none";
        });
    }

    function checkResult() {
        const results = Array.from(slots).map(slot => decodeURIComponent(slot.src.split('/').pop().split('.').shift()));
        const resultCount = results.reduce((acc, image) => {
            acc[image] = (acc[image] || 0) + 1;
            return acc;
        }, {});
        let correctGuesses = 0;
        for (const image in bettingPoints) {
            if (bettingPoints[image] > 0 && resultCount[image] >= bettingPoints[image]) {
                correctGuesses++;
            }
        }
        if (correctGuesses === 3) {
            result.innerHTML = `Bạn đã đoán đúng với kết quả: ${results.join(", ")}`;
        } else {
            result.innerHTML = `Bạn đã đoán sai với kết quả: ${results.join(", ")}`;
        }
    }
});
