window.renderPlatformsModule = function (container, state, saveState, onUpdate) {
  if (!state.platformDetails) {
    state.platformDetails = {};
    state.platforms.forEach((p) => {
      state.platformDetails[p] = { active: false, goal: "" };
    });
  }

  container.innerHTML = `
    <div class="card">
      <h2>Plattform-Sub-Dashboards</h2>
      <p>Lege pro Kanal ein Ziel oder eine Idee fest. Jede Aktivierung bringt <strong>+15 XP</strong>.</p>
    </div>
    ${state.platforms
      .map((platform, index) => {
        const detail = state.platformDetails[platform] || { active: false, goal: "" };
        return `
          <div class="card">
            <h2>${platform}</h2>
            <p>Status: <strong>${detail.active ? "Aktiv" : "Noch offen"}</strong></p>
            <label class="form-label" for="platform-goal-${index}">Ziel / Content-Idee:</label>
            <input id="platform-goal-${index}" class="form-input" type="text" placeholder="z. B. 3 Shorts pro Woche..." />
            <button class="primary-btn" data-platform="${platform}" data-index="${index}" type="button">
              ${detail.active ? "Ziel speichern" : "Plattform aktivieren (+15 XP)"}
            </button>
          </div>
        `;
      })
      .join("")}
  `;

  state.platforms.forEach((platform, index) => {
    const inputEl = document.getElementById(`platform-goal-${index}`);
    if (inputEl && state.platformDetails[platform]) {
      inputEl.value = state.platformDetails[platform].goal || "";
    }
  });

  container.querySelectorAll("button[data-platform]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const platform = btn.dataset.platform;
      const index = btn.dataset.index;
      const goalVal = document.getElementById(`platform-goal-${index}`).value.trim();

      if (!state.platformDetails[platform]) {
        state.platformDetails[platform] = { active: false, goal: "" };
      }
      if (!state.platformDetails[platform].active) {
        state.platformDetails[platform].active = true;
        state.xp = (state.xp || 0) + 15;
      }
      state.platformDetails[platform].goal = goalVal;

      saveState(state);
      onUpdate("platforms");
    });
  });
};
