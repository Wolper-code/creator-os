window.renderOnboardingModule = function (container, state, saveState, onComplete) {
  const currentName = state.creatorName || "";
  const currentPlatform = state.mainPlatform || state.platforms[0] || "YouTube";

  container.innerHTML = `
    <div class="card">
      <h2>Wolper Onboarding – Schritt 1: Dein Profil</h2>
      <p>Richte deinen Creator-Namen und deine Hauptplattform ein, um 50 Start-XP zu erhalten.</p>

      <label class="form-label" for="input-creator-name">Creator-Name:</label>
      <input id="input-creator-name" class="form-input" type="text" placeholder="Namen eingeben..." />

      <label class="form-label" for="select-main-platform">Hauptplattform:</label>
      <select id="select-main-platform" class="form-input">
        ${state.platforms
          .map(
            (p) =>
              `<option value="${p}" ${currentPlatform === p ? "selected" : ""}>${p}</option>`
          )
          .join("")}
      </select>

      <button class="primary-btn" id="save-onboarding" type="button">Profil speichern (+50 XP)</button>
    </div>
  `;

  const nameInputEl = document.getElementById("input-creator-name");
  nameInputEl.value = currentName;

  document.getElementById("save-onboarding").addEventListener("click", () => {
    const typedName = nameInputEl.value.trim();
    const platformSelect = document.getElementById("select-main-platform").value;

    if (typedName) {
      state.creatorName = typedName;
    }
    state.mainPlatform = platformSelect;
    state.xp = (state.xp || 0) + 50;
    state.onboardingDone = true;

    saveState(state);
    onComplete("dashboard");
  });
};
