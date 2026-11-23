window.renderQuestsModule = function (container, state, saveState, onUpdate) {
  const today = new Date().toISOString().slice(0, 10);

  const defaultQuests = [
    { id: "q1", title: "1 Content-Idee oder Hook notieren", xp: 10, done: false },
    { id: "q2", title: "Kanal-Ziel oder Säulen-Notiz prüfen", xp: 15, done: false },
    { id: "q3", title: "Sicherheits- & Eltern-Regeln checken", xp: 10, done: false }
  ];

  if (!Array.isArray(state.quests) || state.questsDate !== today) {
    state.quests = defaultQuests.map((q) => ({ ...q }));
    state.questsDate = today;
    saveState(state);
  }

  const completedCount = state.quests.filter((q) => q.done).length;

  container.innerHTML = `
    <div class="card">
      <h2>Tägliche Creator-Quests (${today})</h2>
      <p>Erledigt: <strong>${completedCount} von ${state.quests.length}</strong> Quests | Aktuelle XP: <strong>${state.xp || 0}</strong></p>
      <button class="primary-btn" id="reset-daily-quests" type="button">Quests für neuen Tag zurücksetzen</button>
    </div>

    <div class="card">
      <h2>Eigene Quest hinzufügen</h2>
      <label class="form-label" for="custom-quest-input">Deine eigene Tagesaufgabe (+10 XP):</label>
      <input id="custom-quest-input" class="form-input" type="text" placeholder="z. B. Thumbnail für nächstes Video skizzieren..." />
      <button class="primary-btn" id="add-custom-quest" type="button">Quest hinzufügen</button>
    </div>

    ${state.quests
      .map(
        (quest) => `
          <div class="card">
            <h2>${quest.title}</h2>
            <p>Belohnung: <strong>+${quest.xp} XP</strong> | Status: <strong>${quest.done ? "Erledigt" : "Offen"}</strong></p>
            <button class="primary-btn" data-quest-id="${quest.id}" type="button" ${quest.done ? "disabled" : ""}>
              ${quest.done ? "Bereits abgeschlossen" : `Quest abschließen (+${quest.xp} XP)`}
            </button>
          </div>
        `
      )
      .join("")}
  `;

  const customInput = document.getElementById("custom-quest-input");
  const addCustomQuest = () => {
    const title = customInput.value.trim();
    if (!title) return;

    state.quests.push({
      id: "custom-" + Date.now(),
      title: title,
      xp: 10,
      done: false
    });
    saveState(state);
    onUpdate("quests");
  };

  document.getElementById("add-custom-quest").addEventListener("click", addCustomQuest);
  customInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addCustomQuest();
  });

  container.querySelectorAll("button[data-quest-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quest = state.quests.find((q) => q.id === btn.dataset.questId);
      if (!quest || quest.done) return;

      quest.done = true;
      state.xp = (state.xp || 0) + quest.xp;

      saveState(state);
      onUpdate("quests");
    });
  });

  document.getElementById("reset-daily-quests").addEventListener("click", () => {
    state.quests = defaultQuests.map((q) => ({ ...q }));
    state.questsDate = today;
    saveState(state);
    onUpdate("quests");
  });
};
