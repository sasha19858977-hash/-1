let recognition = null;
let isListening = false;
function startVoiceRecognition() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert(
            "Ваш браузер не підтримує голосове керування. " +
            "Використовуйте Google Chrome або Microsoft Edge."
        );
        return;
    }
    if (isListening) {
        if (recognition) {

            recognition.stop();
        }
        return;
    }
    const languageSelect =
        document.getElementById(
            "languageSelect"
        );
    const button =
        document.getElementById(
            "voiceButton"
        );
    const status =
        document.getElementById(
            "voiceStatus"
        );
    if (
        !languageSelect ||
        !button ||
        !status
    ) {
        console.error(
            "Елементи голосового керування не знайдено."
        );
        return;
    }
    const language =
        languageSelect.value;
    recognition =
        new SpeechRecognition();
    recognition.lang =
        language;
    recognition.continuous =
        false;
    recognition.interimResults =
        false;
    recognition.maxAlternatives =
        3;
    isListening =
        true;
    button.textContent =
        "🔴 Зупинити слухання";
    button.classList.add(
        "listening"
    );
    status.textContent =
        getListeningMessage(
            language
        );
    try {
        recognition.start();
    } catch (error) {
        console.error(
            "Помилка запуску:",
            error
        );
        resetVoiceUI();
        return;
    }
    recognition.onresult =
        function(event) {
            let bestResult =
                "";
            if (
                !event.results ||
                !event.results[0]
            ) {
                return;

            }
            for (
                let i = 0;
                i <
                event.results[0].length;
                i++
            ) {
                const result =
                    event.results[0][i];
                const transcript =
                    result.transcript ||
                    "";
                if (
                    transcript.length >
                    bestResult.length
                ) {
                    bestResult =
                        transcript;
                }
            }
            bestResult =
                cleanVoiceText(
                    bestResult
                );
            if (
                bestResult === ""
            ) {
                status.textContent =
                    getMessage(
                        language,
                        "noSpeech"
                    );
                return;
            }
            status.textContent =
                "👂 Почув: " +
                bestResult;
            processVoiceCommand(
                bestResult,
                language
            );
        };
    recognition.onerror =
        function(event) {
            console.error(
                "Voice error:",
                event.error
            );
            status.textContent =
                getMessage(
                    language,
                    event.error
                );
        };
    recognition.onend =
        function() {
            isListening =
                false;
            button.textContent =
                "🎤 " +
                getStartText(
                    language
                );
            button.classList.remove(
                "listening"
            );
        };
}
function resetVoiceUI() {
    isListening =
        false;
    const languageSelect =
        document.getElementById(
            "languageSelect"
        );
    const button =
        document.getElementById(
            "voiceButton"
        );
    if (
        button &&
        languageSelect
    ) {
        button.textContent =
            "🎤 " +
            getStartText(
                languageSelect.value
            );
        button.classList.remove(
            "listening"
        );
    }
}
function getListeningMessage(
    language
) {
    if (
        language ===
        "en-US"
    ) {
        return "🎤 Listening... Speak now.";
    }

    if (
        language ===
        "pl-PL"
    ) {
        return "🎤 Słucham... Mów teraz.";
    }
    return "🎤 Слухаю... Говоріть.";
}
function getStartText(
    language
) {
    if (
        language ===
        "en-US"
    ) {
        return "Start listening";
    }
    if (
        language ===
        "pl-PL"
    ) {
        return "Rozpocznij słuchanie";
    }
    return "Почати слухати";
}
function getMessage(
    language,
    error
) {
    if (
        language ===
        "en-US"
    ) {
        if (
            error ===
            "not-allowed"
        ) {
            return "❌ Microphone permission was denied.";
        }
        if (
            error ===
            "no-speech"
        ) {
            return "❌ I didn't hear anything.";
        }
        if (
            error ===
            "audio-capture"
        ) {
            return "❌ Microphone was not found.";
        }
        return "❌ Speech recognition error.";
    }
    if (
        language ===
        "pl-PL"
    ) {
        if (
            error ===
            "not-allowed"
        ) {
            return "❌ Brak dostępu do mikrofonu.";
        }
        if (
            error ===
            "no-speech"
        ) {
            return "❌ Nic nie usłyszałem.";
        }
        if (
            error ===
            "audio-capture"
        ) {
            return "❌ Nie znaleziono mikrofonu.";
        }
        return "❌ Błąd rozpoznawania mowy.";
    }
    if (
        error ===
        "not-allowed"
    ) {
        return "❌ Немає доступу до мікрофона.";
    }
    if (
        error ===
        "no-speech"
    ) {
        return "❌ Я нічого не почув.";
    }
    if (
        error ===
        "audio-capture"
    ) {
        return "❌ Мікрофон не знайдений.";
    }
    return "❌ Помилка розпізнавання голосу.";
}
function cleanVoiceText(
    text
) {
    return String(text)
        .trim()
        .replace(
            /[.!?]+$/,
            ""
        );
}
function processVoiceCommand(
    command,
    language
) {
    const text =
        command
            .toLowerCase()
            .trim();
    if (
        language ===
        "uk-UA"
    ) {
        processUkrainianCommand(
            text
        );
        return;
    }
    if (
        language ===
        "en-US"
    ) {
        processEnglishCommand(
            text
        );
        return;
    }
    if (
        language ===
        "pl-PL"
    ) {
        processPolishCommand(
            text
        );
    }
}
function processUkrainianCommand(
    text
) {
    const addWords = [

        "додай завдання",

        "додати завдання",

        "додай задачу",

        "додати задачу",

        "запиши завдання",

        "створи завдання"

    ];
    for (
        const word of addWords
    ) {
        if (
            text.includes(word)
        ) {
            const taskText =
                text
                    .replace(
                        word,
                        ""
                    )
                    .trim();
            if (
                taskText === ""
            ) {
                speak(
                    "Скажіть назву завдання.",
                    "uk-UA"
                );
                return;
            }
            addTask(
                taskText
            );
            showVoiceAnswer(
                "✓ Завдання додано."
            );
            speak(
                "Завдання додано.",
                "uk-UA"
            );
            return;
        }
    }
    if (
        text.includes(
            "покажи мої завдання"
        ) ||
        text.includes(
            "покажи завдання"
        ) ||
        text ===
            "мої завдання"
    ) {
        showVoiceTasks(
            "uk-UA"
        );
        return;
    }
    if (
        text.includes(
            "скільки"
        ) ||
        text.includes(
            "кількість"
        )
    ) {
        const total =
            tasks.length;
        const completed =
            tasks.filter(
                task =>
                    task.completed
            ).length;
        const remaining =
            total -
            completed;
        const answer =
            `Усього ${total} завдань. ` +
            `Виконано ${completed}. ` +
            `Залишилось ${remaining}.`;
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            "uk-UA"
        );
        return;
    }
    if (
        text.includes(
            "виконай останнє"
        ) ||
        text.includes(
            "познач останнє"
        ) ||
        text.includes(
            "останнє завдання виконано"
        )
    ) {
        completeLastTask(
            "uk-UA"
        );
        return;
    }
    if (
        text.includes(
            "видали останнє"
        ) ||
        text.includes(
            "видалити останнє"
        )
    ) {
        deleteLastTask(
            "uk-UA"
        );

        return;
    }
    const answer =
        "Я не зрозумів команду. " +
        "Спробуйте сказати: " +
        "додай завдання, покажи мої завдання " +
        "або скільки в мене завдань.";
    showVoiceAnswer(
        answer
    );
    speak(
        answer,
        "uk-UA"
    );
}
function processEnglishCommand(
    text
) {
    const addWords = [
        "add a task",
        "add task",
        "create a task",
        "create task"
    ];
    for (
        const word of addWords
    ) {
        if (
            text.includes(word)
        ) {
            const taskText =
                text
                    .replace(
                        word,
                        ""
                    )
                    .trim();
            if (
                taskText === ""
            ) {
                speak(
                    "Please say the task name.",
                    "en-US"
                );
                return;
            }
            addTask(
                taskText
            );
            showVoiceAnswer(
                "✓ Task added."
            );
            speak(
                "Task added.",
                "en-US"
            );
            return;
        }
    }
    if (
        text.includes(
            "show my tasks"
        ) ||
        text.includes(
            "show tasks"
        ) ||
        text ===
            "my tasks"
    ) {
        showVoiceTasks(
            "en-US"
        );
        return;
    }
    if (
        text.includes(
            "how many"
        ) ||
        text.includes(
            "how much"
        )
    ) {
        const total =
            tasks.length;
        const completed =
            tasks.filter(
                task =>
                    task.completed
            ).length;
        const remaining =
            total -
            completed;
        const answer =
            `You have ${total} tasks. ` +
            `${completed} completed. ` +
            `${remaining} remaining.`;
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            "en-US"
        );
        return;
    }
    if (
        text.includes(
            "complete the last task"
        ) ||
        text.includes(
            "complete last task"
        ) ||
        text.includes(
            "mark the last task"
        )
    ) {
        completeLastTask(
            "en-US"
        );
        return;
    }
    if (
        text.includes(
            "delete the last task"
        ) ||
        text.includes(
            "delete last task"
        )
    ) {
        deleteLastTask(
            "en-US"
        );
        return;
    }
    const answer =
        "I didn't understand the command. " +
        "Try saying: add a task, show my tasks, " +
        "or how many tasks do I have.";
    showVoiceAnswer(
        answer
    );
    speak(
        answer,
        "en-US"
    );
}

function processPolishCommand(
    text
) {
    const addWords = [
        "dodaj zadanie",
        "utwórz zadanie",
        "stwórz zadanie"
    ];
    for (
        const word of addWords
    ) {
        if (
            text.includes(word)
        ) {
            const taskText =
                text
                    .replace(
                        word,
                        ""
                    )
                    .trim();
            if (
                taskText === ""
            ) {
                speak(
                    "Podaj nazwę zadania.",
                    "pl-PL"
                );
                return;
            }
            addTask(
                taskText
            );
            showVoiceAnswer(
                "✓ Zadanie zostało dodane."
            );
            speak(
                "Zadanie zostało dodane.",
                "pl-PL"
            );
            return;
        }
    }
    if (
        text.includes(
            "pokaż moje zadania"
        ) ||
        text.includes(
            "pokaż zadania"
        ) ||
        text ===
            "moje zadania"
    ) {
        showVoiceTasks(
            "pl-PL"
        );
        return;
    }
    if (
        text.includes(
            "ile mam zadań"
        ) ||
        text.includes(
            "ile zadań"
        ) ||
        text.includes(
            "ile mam"
        )
    ) {
        const total =
            tasks.length;
        const completed =
            tasks.filter(
                task =>
                    task.completed
            ).length;
        const remaining =
            total -
            completed;
        const answer =
            `Masz ${total} zadań. ` +
            `Wykonano ${completed}. ` +
            `Pozostało ${remaining}.`;
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            "pl-PL"
        );
        return;
    }
    if (
        text.includes(
            "wykonaj ostatnie zadanie"
        ) ||
        text.includes(
            "oznacz ostatnie zadanie"
        )
    ) {
        completeLastTask(
            "pl-PL"
        );
        return;
    }
    if (
        text.includes(
            "usuń ostatnie zadanie"
        ) ||
        text.includes(
            "usun ostatnie zadanie"
        )
    ) {
        deleteLastTask(
            "pl-PL"
        );
        return;
    }
    const answer =
        "Nie rozumiem polecenia. " +
        "Spróbuj powiedzieć: dodaj zadanie, " +
        "pokaż moje zadania lub ile mam zadań.";

    showVoiceAnswer(
        answer
    );
    speak(
        answer,
        "pl-PL"
    );
}
function showVoiceTasks(
    language
) {
    const active =
        tasks.filter(
            task =>
                !task.completed
        );
    if (
        active.length === 0
    ) {
        let answer;
        if (
            language ===
            "en-US"
        ) {
            answer =
                "You have no active tasks.";

        } else if (
            language ===
            "pl-PL"
        ) {
            answer =
                "Nie masz aktywnych zadań.";

        } else {
            answer =
                "У тебе немає активних завдань.";

        }
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            language
        );
        return;
    }
    const title =
        language === "en-US"
            ? "Active tasks:"
            : language === "pl-PL"
                ? "Aktywne zadania:"
                : "Активні завдання:";
    const html =
        `<strong>${title}</strong><br><br>` +
        active
            .map(
                (
                    task,
                    index
                ) => {
                    const safeText =
                        escapeVoiceHTML(
                            task.text
                        );
                    return `
                        ${index + 1}.
                        ${safeText}
                    `;
                }
            )
            .join(
                "<br>"
            );
    showVoiceAnswerHTML(
        html
    );
    let speech;
    if (
        language ===
        "en-US"
    ) {
        speech =
            `You have ${active.length} active tasks.`;
    } else if (
        language ===
        "pl-PL"
    ) {
        speech =
            `Masz ${active.length} aktywnych zadań.`;
    } else {
        speech =
            `У тебе ${active.length} активних завдань.`;
    }
    speak(
        speech,
        language
    );

}
function completeLastTask(
    language
) {
    if (
        tasks.length === 0
    ) {
        const answer =
            language === "en-US"
                ? "You have no tasks."
                : language === "pl-PL"
                    ? "Nie masz żadnych zadań."
                    : "У тебе немає завдань.";
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            language
        );
        return;
    }
    let lastIndex =
        tasks.length - 1;
    while (
        lastIndex >= 0 &&
        tasks[lastIndex].completed
    ) {
        lastIndex--;
    }
    if (
        lastIndex < 0
    ) {
        const answer =
            language === "en-US"
                ? "All tasks are already completed."
                : language === "pl-PL"
                    ? "Wszystkie zadania są już wykonane."
                    : "Усі завдання вже виконані.";
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            language
        );
        return;
    }
    tasks[lastIndex].completed =
        true;
    saveTasks();
    renderTasks();
    const answer =
        language === "en-US"
            ? "The last active task has been completed."
            : language === "pl-PL"
                ? "Ostatnie aktywne zadanie zostało wykonane."
                : "Останнє активне завдання виконано.";
    showVoiceAnswer(
        "✓ " + answer
    );
    speak(
        answer,
        language
    );
}
function deleteLastTask(
    language
) {
    if (
        tasks.length === 0
    ) {
        const answer =
            language === "en-US"
                ? "You have no tasks to delete."
                : language === "pl-PL"
                    ? "Nie masz żadnych zadań do usunięcia."
                    : "У тебе немає завдань для видалення.";
        showVoiceAnswer(
            answer
        );
        speak(
            answer,
            language
        );
        return;
    }
    tasks.pop();
    saveTasks();
    renderTasks();
    const answer =
        language === "en-US"
            ? "The last task has been deleted."
            : language === "pl-PL"
                ? "Ostatnie zadanie zostało usunięte."
                : "Останнє завдання видалено.";
    showVoiceAnswer(
        "✓ " + answer
    );
    speak(
        answer,
        language
    );
}
function showVoiceAnswer(
    text
) {
    const element =
        document.getElementById(
            "aiAnswer"
        );
    if (element) {
        element.textContent =
            text;
    }
}
function showVoiceAnswerHTML(
    html
) {
    const element =
        document.getElementById(
            "aiAnswer"
        );
    if (element) {
        element.innerHTML =
            html;
    }
}
function escapeVoiceHTML(
    value
) {
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
function speak(
    text,
    language
) {
    if (
        !(
            "speechSynthesis"
            in window
        )
    ) {
        return;
    }
    window.speechSynthesis.cancel();
    const speech =
        new SpeechSynthesisUtterance(
            text
        );
    speech.lang =
        language;
    speech.rate =
        0.95;
    speech.pitch =
        1;
    window.speechSynthesis.speak(
        speech
    );
}