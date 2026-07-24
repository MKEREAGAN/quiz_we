const accueil = document.getElementById("accueil");
const quiz = document.getElementById("quiz");
const commencer = document.getElementById("commencer");
const themeSelect = document.getElementById("theme");

console.log("script.js chargé");
console.log(mots);

let score = 0;
let index = 0;
let questions = [];
let motCourant = "";
let audioCourant = "";
function melanger(tableau) {
    return tableau.sort(() => Math.random() - 0.5);
}

const question = document.getElementById("question");
const boutons = document.querySelectorAll(".reponse");
const message = document.getElementById("message");

const barre = document.getElementById("barre");
const progression = document.getElementById("progression");
const parler = document.getElementById("parler");
function afficherQuestion() {

    let q = questions[index];
motCourant = q.motWe;
audioCourant = q.audio; 
let pourcentage =
        ((index + 1) / questions.length) * 100;

    barre.style.width = pourcentage + "%";

    progression.textContent =
        "Question " +
        (index + 1) +
        "/" +
        questions.length;

    question.textContent =
        "Question " + (index + 1) + "/" + questions.length +
        " : " + q.question;
    boutons.forEach((btn, i) => {

        btn.textContent = q.choix[i];

        btn.onclick = function () {

            boutons.forEach(b => b.disabled = true);

            if (i === q.bonne) {

                score++;
                message.textContent = "✅ Bonne réponse !";
                message.style.color = "green";

            } else {

                message.textContent = "❌ Mauvaise réponse !";
                message.style.color = "red";

            }

            setTimeout(function () {

                message.textContent = "";

                index++;

                if (index < questions.length) {
                    afficherQuestion();
                } else {
                    afficherResultat();
                }

                boutons.forEach(b => b.disabled = false);

            }, 1000);

        };

    });
}

function afficherResultat() {

    let pourcentage =
        Math.round((score / questions.length) * 100);

    let messageFinal = "";

    if (pourcentage >= 90) {

        messageFinal = "🌟 Maître du Wɛ";

    } else if (pourcentage >= 80) {

        messageFinal = "🏆 Lecteur confirmé";

    } else if (pourcentage >= 60) {

        messageFinal = "👍 Bon lecteur";

    } else if (pourcentage >= 40) {

        messageFinal = "📖 Apprenti";

    } else {

        messageFinal = "🌱 Débutant";
    }

    let historique =
        JSON.parse(localStorage.getItem("scores")) || [];

    historique.push({
        score: score,
        total: questions.length,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        "scores",
        JSON.stringify(historique)
    );

    quiz.innerHTML = `
        <h2>🏆 Bravo !</h2>

        <h3>Score : ${score}/${questions.length}</h3>

        <h3>${pourcentage}%</h3>

        <h2>${messageFinal}</h2>

        <h3>📊 Historique des scores</h3>

        ${historique.slice(-5).reverse().map(s =>
            `<p>${s.date} : ${s.score}/${s.total}</p>`
        ).join("")}

        <br>

        <button onclick="location.reload()">
            🔄 Rejouer
        </button>
    `;
}

commencer.onclick = function () {

    let themeChoisi = themeSelect.value;

    let motsSelectionnes;

    if (themeChoisi === "Tous") {

        motsSelectionnes = mots;

    } else {

        motsSelectionnes =
            mots.filter(m => m.theme === themeChoisi);

    }

    questions = [];

    motsSelectionnes.forEach(mot => {

        let mauvaisesReponses = motsSelectionnes
            .filter(m => m.fr !== mot.fr)
            .map(m => m.fr);

        if (mauvaisesReponses.length < 3) {

            mauvaisesReponses = mots
                .filter(m => m.fr !== mot.fr)
                .map(m => m.fr);

        }

        mauvaisesReponses = melanger(mauvaisesReponses);

        let choix = [
            mot.fr,
            mauvaisesReponses[0],
            mauvaisesReponses[1],
            mauvaisesReponses[2]
        ];

        choix = melanger(choix);

        questions.push({
    motWe: mot.we,
    audio: mot.audio,
    question: "Que signifie " + mot.we + " ?",
    choix: choix,
    bonne: choix.indexOf(mot.fr)
});

    });

    questions = melanger(questions);

    if (questions.length > 10) {
        questions = questions.slice(0, 10);
    }

    score = 0;
    index = 0;

    accueil.style.display = "none";
    quiz.style.display = "block";

    afficherQuestion();

};
parler.onclick = function () {

    if(audioCourant){

        let audio = new Audio(audioCourant);
        audio.play();

    }else{

        let voix = new SpeechSynthesisUtterance(motCourant);

        voix.lang = "fr-FR";
        voix.rate = 0.8;

        speechSynthesis.speak(voix);
    }

};