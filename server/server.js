require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "StudyPlanner AI server працює"
    });
});

app.post("/api/ai", async (req, res) => {
    try {
        const {
            message,
            tasks = [],
            language = "uk-UA",
            currentDate,
            currentTime
        } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Повідомлення порожнє"
            });
        }

        const languageName = {
            "uk-UA": "українською мовою",
            "en-US": "англійською мовою",
            "pl-PL": "польською мовою"
        }[language] || "українською мовою";

        const prompt = `
Ти — AI-помічник навчального планувальника StudyPlanner.

Користувач спілкується з тобою ${languageName}.

Поточна дата: ${currentDate || "невідома"}
Поточний 시간: ${currentTime || "невідомий"}

Список навчальних завдань користувача:
${JSON.stringify(tasks, null, 2)}

Запит користувача:
${message}

Допомагай користувачу керувати навчанням.

Ти можеш:
- аналізувати його завдання;
- пояснювати статистику;
- знаходити активні та виконані завдання;
- допомагати визначати порядок роботи;
- пропонувати план на день;
- відповідати на звичайні запитання;
- пояснювати, що варто зробити далі;
- використовувати інформацію з переданого списку завдань.

Не вигадуй завдання, яких немає у списку.
Якщо інформації недостатньо, прямо скажи про це.

Відповідай природно, коротко та зрозуміло.
`;
       const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("Не знайдено OPENAI_API_KEY у файлі .env");
}

const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
    })
});

const data = await response.json();

if (!response.ok) {
    console.error("Помилка OpenAI API:", data);
    return res.status(response.status).json({
        error: data.error?.message || "Помилка OpenAI API"
    });
}

const answer = data.output_text;

if (!answer) {
    console.error("Неочікувана відповідь OpenAI:", data);
    return res.status(500).json({
        error: "AI не повернув текст відповіді"
    });
}

return res.json({ answer });
    } catch (error) {
        console.error("Критична помилка сервера:", error);
        res.status(500).json({
            error: "Не вдалося отримати відповідь від AI"
        });
    }
});
app.listen(port, () => {
    console.log(`StudyPlanner AI server запущено: http://localhost:${port}`);
});