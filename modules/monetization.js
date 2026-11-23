window.renderMonetizationModule = function (container, state, saveState, onUpdate) {
  if (!state.pillarDetails) {
    state.pillarDetails = {};
    state.pillars.forEach((p) => {
      state.pillarDetails[p] = { active: false, note: "" };
    });
  }

  container.innerHTML = `
    <div class="card">
      <h2>5 Monetarisierungssäulen</h2>
      <p>Aktiviere deine Einnahmequellen und hinterlege Links oder Ideen. Jede Aktivierung bringt <strong>+20 XP</strong>.</p>
    </div>
    ${state.pillars
      .map((pillar, index) => {
        const detail = state.pillarDetails[pillar] || { active: false, note: "" };
        return `
          <div class="card">
            <h2>${index + 1}. ${pillar}</h2>
            <p>Status: <strong>${detail.active ? "Aktiv" : "Noch offen"}</strong></p>
            <label class="form-label" for="note-${index}">Notiz / Partner-Link:</label>
            <input id="note-${index}" class="form-input" type="text" placeholder="z. B. Link oder Idee eintragen..." />
            <button class="primary-btn" data-pillar="${pillar}" data-index="${index}" type="button">
              ${detail.active ? "Notiz speichern" : "Säule aktivieren (+20 XP)"}
            </button>
          </div>
        `;
      })
      .join("")}
  `;

  state.pillars.forEach((pillar, index) => {
    const inputEl = document.getElementById(`note-${index}`);
    if (inputEl && state.pillarDetails[pillar]) {
      inputEl.value = state.pillarDetails[pillar].note || "";
    }
  });

  container.querySelectorAll("button[data-pillar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pillar = btn.dataset.pillar;
      const index = btn.dataset.index;
      const noteVal = document.getElementById(`note-${index}`).value.trim();

      if (!state.pillarDetails[pillar]) {
        state.pillarDetails[pillar] = { active: false, note: "" };
      }
      if (!state.pillarDetails[pillar].active) {
        state.pillarDetails[pillar].active = true;
        state.xp = (state.xp || 0) + 20;
      }
      state.pillarDetails[pillar].note = noteVal;

      saveState(state);
      onUpdate("monetization");
    });
  });
};
