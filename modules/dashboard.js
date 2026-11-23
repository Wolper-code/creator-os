window.renderDashboardModule = function (container, state, onNavigate) {
  const currentXp = state.xp || 0;
  const level = Math.floor(currentXp / 50) + 1;
  const xpInLevel = currentXp % 50;
  const progressPercent = Math.round((xpInLevel / 50) * 100);

  const activePlatforms = state.platformDetails
    ? Object.values(state.platformDetails).filter((p) => p && p.active).length
    : 0;

  const activePillars = state.pillarDetails
    ? Object.values(state.pillarDetails).filter((p) => p && p.active).length
    : 0;

  const completedQuests = Array.isArray(state.quests)
    ? state.quests.filter((q) => q && q.done).length
    : 0;
  const totalQuests = Array.isArray(state.quests) ? state.quests.length : 3;

  const filterActive = state.parentControls ? Boolean(state.parentControls.contentFilter) : true;
  const guardActive = state.parentControls ? Boolean(state.parentControls.spendingGuard) : true;

  container.innerHTML = `
    <div class="card">
      <h2>Gesamt-Dashboard</h2>
      <p>Willkommen zurück, <strong>${state.creatorName}</strong>! Deine Hauptplattform ist <strong>${state.mainPlatform}</strong>.</p>
      <p style="margin-top: 0.75rem;">
        <span class="badge">Level ${level}</span>
        <span class="badge">${currentXp} XP Gesamt</span>
        <span class="badge">Onboarding: ${state.onboardingDone ? "Fertig" : "Offen"}</span>
      </p>
      <p style="margin-top: 0.75rem; font-size: 0.9rem; color: #cbd5e1;">
        Fortschritt zu Level ${level + 1}: <strong>${xpInLevel} / 50 XP (${progressPercent}%)</strong>
      </p>
      <div class="xp-bar-container">
        <div class="xp-bar-fill" style="width: ${progressPercent}%;"></div>
      </div>
    </div>

    <div class="card">
      <h2>Dein Fortschritt im Überblick</h2>
      <p>Aktive Plattformen: <strong>${activePlatforms} von ${state.platforms.length}</strong></p>
      <p>Aktive Monetarisierungssäulen: <strong>${activePillars} von ${state.pillars.length}</strong></p>
      <p>Tages-Quests erledigt: <strong>${completedQuests} von ${totalQuests}</strong></p>
      <p>Eltern-Schutz: <strong>Filter ${filterActive ? "AN" : "AUS"}</strong> • <strong>Ausgaben-/Link-Sperre ${guardActive ? "AN" : "AUS"}</strong></p>
      <button class="primary-btn" data-jump="quests" type="button">Zu den Tages-Quests</button>
      <button class="primary-btn" data-jump="monetization" type="button" style="margin-left: 0.5rem;">Zu den 5 Säulen</button>
      <button class="primary-btn" data-jump="platforms" type="button" style="margin-left: 0.5rem;">Zu den Plattformen</button>
    </div>
  `;

  container.querySelectorAll("button[data-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      onNavigate(btn.dataset.jump);
    });
  });
};
