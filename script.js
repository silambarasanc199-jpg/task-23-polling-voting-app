"use strict";

/* =========================================
   TASK 23 - POLLING & VOTING APP
   HTML5 + CSS3 + JavaScript + LocalStorage
========================================= */

const STORAGE_KEY = "veda_task23_polls";
const VOTED_KEY = "veda_task23_voted";

const pollForm = document.getElementById("pollForm");
const questionInput = document.getElementById("question");
const optionInputs = document.getElementById("optionInputs");
const addOptionBtn = document.getElementById("addOption");
const clearFormBtn = document.getElementById("clearForm");

const pollList = document.getElementById("pollList");
const pollCount = document.getElementById("pollCount");
const voteCount = document.getElementById("voteCount");
const optionCounter = document.getElementById("optionCounter");
const pollStatus = document.getElementById("pollStatus");

let polls = loadPolls();
let votedPolls = loadVotedPolls();

/* =========================================
   LOCAL STORAGE
========================================= */

function loadPolls() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Unable to load polls:", error);
        return [];
    }
}

function savePolls() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
}

function loadVotedPolls() {
    try {
        const saved = localStorage.getItem(VOTED_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Unable to load voting records:", error);
        return [];
    }
}

function saveVotedPolls() {
    localStorage.setItem(VOTED_KEY, JSON.stringify(votedPolls));
}

/* =========================================
   OPTION CREATION
========================================= */

function createOptionInput(value = "") {
    const row = document.createElement("div");
    row.className = "option-row";

    const number = document.createElement("div");
    number.className = "option-number";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "poll-option-input";
    input.maxLength = 100;
    input.placeholder = "Enter poll option...";
    input.value = value;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-option";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove option");

    remove.addEventListener("click", () => {
        const rows = optionInputs.querySelectorAll(".option-row");

        if (rows.length <= 2) {
            alert("A poll must have at least 2 options.");
            return;
        }

        row.remove();
        updateOptionNumbers();
    });

    row.appendChild(number);
    row.appendChild(input);
    row.appendChild(remove);

    optionInputs.appendChild(row);

    updateOptionNumbers();
}

function updateOptionNumbers() {
    const rows = optionInputs.querySelectorAll(".option-row");

    rows.forEach((row, index) => {
        row.querySelector(".option-number").textContent = index + 1;
    });

    optionCounter.textContent =
        `${rows.length} ${rows.length === 1 ? "option" : "options"}`;

    addOptionBtn.disabled = rows.length >= 8;
}

/* =========================================
   FORM INITIALIZATION
========================================= */

function initializeForm() {
    optionInputs.innerHTML = "";

    createOptionInput();
    createOptionInput();
}

initializeForm();

/* =========================================
   ADD OPTION
========================================= */

addOptionBtn.addEventListener("click", () => {
    const currentCount =
        optionInputs.querySelectorAll(".option-row").length;

    if (currentCount >= 8) {
        alert("You can add a maximum of 8 options.");
        return;
    }

    createOptionInput();
});

/* =========================================
   CREATE POLL
========================================= */

pollForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();

    const options = Array.from(
        document.querySelectorAll(".poll-option-input")
    )
        .map(input => input.value.trim())
        .filter(Boolean);

    if (!question) {
        alert("Please enter a poll question.");
        questionInput.focus();
        return;
    }

    if (options.length < 2) {
        alert("Please provide at least 2 poll options.");
        return;
    }

    const normalizedOptions = options.map(option =>
        option.toLowerCase()
    );

    const hasDuplicate = normalizedOptions.some(
        (option, index) =>
            normalizedOptions.indexOf(option) !== index
    );

    if (hasDuplicate) {
        alert("Poll options must be unique.");
        return;
    }

    const poll = {
        id: generateId(),
        question: question,
        options: options.map(text => ({
            id: generateId(),
            text: text,
            votes: 0
        })),
        createdAt: new Date().toISOString()
    };

    polls.unshift(poll);

    savePolls();
    renderPolls();
    resetForm();

    document.querySelector(".poll-section")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
});

/* =========================================
   ID GENERATOR
========================================= */

function generateId() {
    return (
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 9)
    );
}

/* =========================================
   RENDER POLLS
========================================= */

function renderPolls() {

    pollList.innerHTML = "";

    if (polls.length === 0) {
        pollList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">◉</div>
                <h3>No polls created yet</h3>
                <p>
                    Create your first poll above and start collecting votes.
                </p>
            </div>
        `;

        updateStats();
        return;
    }

    polls.forEach((poll, index) => {
        const card = createPollCard(poll, index);
        pollList.appendChild(card);
    });

    updateStats();
}

/* =========================================
   CREATE POLL CARD
========================================= */

function createPollCard(poll, index) {

    const card = document.createElement("article");
    card.className = "poll-card";

    const totalVotes = getTotalVotes(poll);

    const hasVoted = votedPolls.includes(poll.id);

    const percentages = calculatePercentages(poll);

    const highestVotes =
        Math.max(...poll.options.map(option => option.votes), 0);

    const pollTop = document.createElement("div");
    pollTop.className = "poll-top";

    const titleBox = document.createElement("div");

    const number = document.createElement("div");
    number.className = "poll-number";
    number.textContent =
        `POLL ${String(index + 1).padStart(2, "0")}`;

    const question = document.createElement("h3");
    question.className = "poll-question";
    question.textContent = poll.question;

    titleBox.appendChild(number);
    titleBox.appendChild(question);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-poll";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deletePoll(poll.id);
    });

    pollTop.appendChild(titleBox);
    pollTop.appendChild(deleteButton);

    card.appendChild(pollTop);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "vote-options";

    poll.options.forEach((option, optionIndex) => {

        const percentage = percentages[optionIndex];

        const wrapper = document.createElement("div");
        wrapper.className = "vote-option";

        if (
            totalVotes > 0 &&
            option.votes === highestVotes &&
            highestVotes > 0
        ) {
            wrapper.classList.add("leader");
        }

        const resultBar = document.createElement("div");
        resultBar.className = "result-bar";
        resultBar.style.width = `${percentage}%`;

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `poll-${poll.id}`;
        input.id = `${poll.id}-${option.id}`;
        input.value = option.id;

        const label = document.createElement("label");
        label.className = "vote-label";
        label.htmlFor = input.id;

        const radio = document.createElement("span");
        radio.className = "radio";

        const content = document.createElement("div");
        content.className = "result-content";

        const resultRow = document.createElement("div");
        resultRow.className = "result-row";

        const optionName = document.createElement("span");
        optionName.className = "option-name";
        optionName.textContent = option.text;

        const percent = document.createElement("span");
        percent.className = "vote-percent";
        percent.textContent = `${percentage}%`;

        const count = document.createElement("div");
        count.className = "vote-count";
        count.textContent =
            `${option.votes} ${option.votes === 1 ? "vote" : "votes"}`;

        resultRow.appendChild(optionName);
        resultRow.appendChild(percent);

        content.appendChild(resultRow);
        content.appendChild(count);

        label.appendChild(radio);
        label.appendChild(content);

        wrapper.appendChild(resultBar);
        wrapper.appendChild(input);
        wrapper.appendChild(label);

        optionsContainer.appendChild(wrapper);
    });

    card.appendChild(optionsContainer);

    const footer = document.createElement("div");
    footer.className = "poll-footer";

    const total = document.createElement("span");
    total.className = "total-votes";
    total.textContent =
        `${totalVotes} ${totalVotes === 1 ? "total vote" : "total votes"}`;

    footer.appendChild(total);

    if (hasVoted) {

        const voted = document.createElement("span");
        voted.className = "voted-message";
        voted.textContent = "✓ You have already voted";

        footer.appendChild(voted);

    } else {

        const voteButton = document.createElement("button");
        voteButton.className = "vote-btn";
        voteButton.textContent = "Vote";

        voteButton.addEventListener("click", () => {
            submitVote(poll.id, card);
        });

        footer.appendChild(voteButton);
    }

    card.appendChild(footer);

    return card;
}

/* =========================================
   VOTE
========================================= */

function submitVote(pollId, card) {

    if (votedPolls.includes(pollId)) {
        alert("You have already voted in this poll.");
        return;
    }

    const selected = card.querySelector(
        `input[name="poll-${pollId}"]:checked`
    );

    if (!selected) {
        alert("Please select an option before voting.");
        return;
    }

    const poll = polls.find(item => item.id === pollId);

    if (!poll) {
        return;
    }

    const selectedOption = poll.options.find(
        option => option.id === selected.value
    );

    if (!selectedOption) {
        return;
    }

    selectedOption.votes += 1;

    votedPolls.push(pollId);

    savePolls();
    saveVotedPolls();

    renderPolls();
}

/* =========================================
   CALCULATE TOTAL
========================================= */

function getTotalVotes(poll) {
    return poll.options.reduce(
        (total, option) => total + Number(option.votes || 0),
        0
    );
}

/* =========================================
   CALCULATE PERCENTAGES
========================================= */

function calculatePercentages(poll) {

    const total = getTotalVotes(poll);

    return poll.options.map(option => {

        if (total === 0) {
            return 0;
        }

        return Math.round(
            (option.votes / total) * 100
        );
    });
}

/* =========================================
   DELETE POLL
========================================= */

function deletePoll(pollId) {

    const confirmed = confirm(
        "Are you sure you want to delete this poll?"
    );

    if (!confirmed) {
        return;
    }

    polls = polls.filter(
        poll => poll.id !== pollId
    );

    votedPolls = votedPolls.filter(
        id => id !== pollId
    );

    savePolls();
    saveVotedPolls();

    renderPolls();
}

/* =========================================
   RESET FORM
========================================= */

function resetForm() {
    questionInput.value = "";
    initializeForm();
}

clearFormBtn.addEventListener("click", resetForm);

/* =========================================
   STATISTICS
========================================= */

function updateStats() {

    const totalVotes = polls.reduce(
        (total, poll) => total + getTotalVotes(poll),
        0
    );

    pollCount.textContent = polls.length;
    voteCount.textContent = totalVotes;

    if (polls.length === 0) {
        pollStatus.textContent = "No polls yet";
    } else {
        pollStatus.textContent =
            `${polls.length} active ${
                polls.length === 1 ? "poll" : "polls"
            }`;
    }
}

/* =========================================
   START APPLICATION
========================================= */

renderPolls();
