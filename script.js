/* =================================
   KONFIGURASI DATABASE SUPABASE
================================= */

const SUPABASE_URL = "https://rlktwvgqaxlwfocxexlf.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_KH25pOcGtHyS5XV1h6IY5g_dgsERao7";

const supabaseReady =
    SUPABASE_URL.includes(".supabase.co") &&
    !SUPABASE_URL.includes("YOUR-PROJECT") &&
    !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");

const db = supabaseReady
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    )
    : null;


/* =================================
   NAVIGASI TAB
================================= */

function showPage(id) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.toggle("active", page.id === id);
    });

    document.querySelectorAll("[data-tab]").forEach(button => {
        button.classList.toggle("active", button.dataset.tab === id);
    });

    document.getElementById("navLinks").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll("[data-tab]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.tab);
    });
});

document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.goto);
    });
});


/* =================================
   MENU HP
================================= */

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
});


/* =================================
   TOMBOL TERIMA KASIH
================================= */

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.getElementById("thankYouButton")
    .addEventListener("click", () => {
        showToast("Terima kasih sudah berkunjung ke SafeNet!");
    });


/* =================================
   KUIS SAFENET
================================= */

const questions = [
    {
        question: "Apa yang harus dilakukan sebelum membagikan berita?",
        answers: [
            "Langsung membagikannya",
            "Memeriksa sumber informasi",
            "Mengubah judulnya",
            "Mengikuti komentar orang"
        ],
        correct: 1,
        explanation: "Periksa sumber dan kebenaran informasi terlebih dahulu."
    },
    {
        question: "Manakah kata sandi yang lebih aman?",
        answers: [
            "12345678",
            "Tanggal lahir",
            "Kata sandi panjang dan unik",
            "Nama sendiri"
        ],
        correct: 2,
        explanation: "Kata sandi panjang dan unik lebih sulit ditebak."
    },
    {
        question: "Apa pengertian phishing?",
        answers: [
            "Upaya menipu untuk mendapatkan data",
            "Aplikasi pengedit foto",
            "Fitur penyimpanan",
            "Cara mempercepat internet"
        ],
        correct: 0,
        explanation: "Phishing merupakan upaya penipuan untuk mendapatkan informasi sensitif."
    },
    {
        question: "Apa yang dilakukan jika menerima tautan mencurigakan?",
        answers: [
            "Segera mengekliknya",
            "Meneruskannya",
            "Memasukkan kata sandi",
            "Tidak mengeklik dan memeriksa pengirim"
        ],
        correct: 3,
        explanation: "Periksa pengirim dan alamat situs melalui sumber resmi."
    },
    {
        question: "Mengapa data pribadi harus dijaga?",
        answers: [
            "Agar mudah ditemukan",
            "Agar tidak disalahgunakan",
            "Agar semua orang mengetahuinya",
            "Agar tidak perlu kata sandi"
        ],
        correct: 1,
        explanation: "Data pribadi perlu dilindungi dari penyalahgunaan."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const nextButton = document.getElementById("nextQuestion");

function loadQuestion() {
    const question = questions[currentQuestion];

    answered = false;

    document.getElementById("quizCount").textContent =
        `${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("progressFill").style.width =
        `${(currentQuestion + 1) / questions.length * 100}%`;

    questionText.textContent = question.question;
    answerList.innerHTML = "";

    document.getElementById("quizFeedback").textContent =
        "Pilih salah satu jawaban.";

    nextButton.disabled = true;
    nextButton.textContent = "Selanjutnya →";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "answer-option";
        button.textContent =
            String.fromCharCode(65 + index) + ". " + answer;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        answerList.appendChild(button);
    });
}

function selectAnswer(index) {
    if (answered) return;

    answered = true;

    const question = questions[currentQuestion];
    const buttons = answerList.children;

    [...buttons].forEach((button, i) => {
        button.disabled = true;

        if (i === question.correct) {
            button.classList.add("correct");
        } else if (i === index) {
            button.classList.add("wrong");
        }
    });

    if (index === question.correct) {
        score++;

        document.getElementById("quizFeedback").textContent =
            "Benar! " + question.explanation;
    } else {
        document.getElementById("quizFeedback").textContent =
            "Belum tepat. " + question.explanation;
    }

    nextButton.disabled = false;

    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "Lihat Hasil"
            : "Selanjutnya →";
}

nextButton.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    document.getElementById("quizResult").classList.remove("hidden");

    const percent = Math.round(score / questions.length * 100);

    let message = "Terus belajar dan tingkatkan pengetahuanmu!";

    if (percent === 100) {
        message = "Luar biasa! Semua jawabanmu benar!";
    } else if (percent >= 60) {
        message = "Bagus! Kamu sudah memahami dasar keamanan digital.";
    }

    document.getElementById("quizResult").innerHTML = `
        <h3>Kuis Selesai!</h3>
        <h2>${score} / ${questions.length}</h2>
        <p>Nilai: ${percent}%</p>
        <p>${message}</p>
        <button class="primary-btn" onclick="restartQuiz()">
            Ulangi Kuis
        </button>
    `;

    questionText.classList.add("hidden");
    answerList.classList.add("hidden");
    document.getElementById("quizFeedback").classList.add("hidden");
    nextButton.classList.add("hidden");
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    document.getElementById("quizResult").classList.add("hidden");

    questionText.classList.remove("hidden");
    answerList.classList.remove("hidden");
    document.getElementById("quizFeedback").classList.remove("hidden");
    nextButton.classList.remove("hidden");

    loadQuestion();
}

loadQuestion();


/* =================================
   HITUNG KARAKTER KOMENTAR
================================= */

const messageInput = document.getElementById("visitorMessage");

messageInput.addEventListener("input", () => {
    document.getElementById("charCount").textContent =
        `${messageInput.value.length}/600`;
});


/* =================================
   FORUM PUBLIK
================================= */

const commentsList = document.getElementById("commentsList");

function createElement(tag, className, value) {
    const element = document.createElement(tag);

    if (className) element.className = className;

    element.textContent = value;

    return element;
}

function displayComments(data) {
    commentsList.innerHTML = "";

    document.getElementById("commentCount").textContent =
        data.length;

    if (data.length === 0) {
        commentsList.appendChild(
            createElement("p", "", "Belum ada pendapat. Jadilah yang pertama!")
        );
        return;
    }

    data.forEach(comment => {
        const card = document.createElement("div");
        card.className = "comment-item";

        const name = createElement(
            "strong",
            "",
            comment.name
        );

        const date = createElement(
            "div",
            "comment-date",
            new Date(comment.created_at).toLocaleString("id-ID")
        );

        const message = createElement(
            "p",
            "",
            comment.message
        );

        card.append(name, date, message);
        commentsList.appendChild(card);
    });
}

async function loadComments() {
    if (!db) {
        commentsList.textContent =
            "Forum belum aktif. Hubungkan Supabase terlebih dahulu.";
        return;
    }

    const { data, error } = await db
        .from("responses")
        .select("id,name,message,created_at")
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        commentsList.textContent =
            "Komentar belum dapat dimuat.";
        return;
    }

    displayComments(data || []);
}


/* =================================
   KIRIM RESPON
================================= */

document.getElementById("responseForm")
    .addEventListener("submit", async event => {

        event.preventDefault();

        const name =
            document.getElementById("visitorName").value.trim();

        const message = messageInput.value.trim();

        const status =
            document.getElementById("formStatus");

        const submit =
            document.getElementById("submitResponse");

        if (!name || !message) {
            status.textContent =
                "Nama dan pendapat wajib diisi.";
            return;
        }

        if (!db) {
            status.textContent =
                "Forum belum aktif. Admin perlu menghubungkan Supabase.";
            return;
        }

        submit.disabled = true;
        submit.textContent = "Mengirim...";

        const { error } = await db
            .from("responses")
            .insert([{ name, message }]);

        if (error) {
            status.textContent =
                "Respon gagal dikirim. Silakan coba kembali.";

            submit.disabled = false;
            submit.textContent = "Kirim Respon →";
            return;
        }

        // Email notifikasi melalui backend Supabase.
        try {
            await db.functions.invoke("notify-response", {
                body: { name, message }
            });
        } catch (error) {
            console.error("Notifikasi email gagal:", error);
        }

        document.getElementById("responseForm").reset();

        document.getElementById("charCount").textContent = "0/600";

        status.textContent =
            "Terima kasih! Pendapatmu berhasil dikirim.";

        showToast("Terima kasih sudah mengirim respon!");

        await loadComments();

        submit.disabled = false;
        submit.textContent = "Kirim Respon →";
    });


/* =================================
   REALTIME KOMENTAR
================================= */

if (db) {
    db.channel("public-responses")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "responses"
            },
            loadComments
        )
        .subscribe();
}

loadComments();

