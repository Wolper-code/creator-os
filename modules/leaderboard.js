window.renderLeaderboardModule = function (container, state) {
  const currentXp = state.xp || 0;
  const level = Math.floor(currentXp / 50) + 1;
  const xpInLevel = currentXp % 50;
  const progressPercent = Math.round((xpInLevel / 50) * 100);

  const entries = [
    { name: state.creatorName || "Du", xp: currentXp, isYou: true },
    { name: "Wolper-Bot", xp: 75, isYou: false },
    { name: "PixelFuchs", xp: 120, isYou: false },
    { name: "ClipStarter", xp: 35, isYou: false }
  ].sort((a, b) => b.xp - a.xp);

  container.innerHTML = `
    <div class="card">
      <h2>Rangliste & Gamification</h2>
      <p>
        <span class="badge">Level ${level}</span>
        <span class="badge">${currentXp} XP</span>
      </p>
      <p style="margin-top: 0.75rem;">
        Fortschritt zum nächsten Level: <strong>${xpInLevel} / 50 XP (${progressPercent}%)</strong>
      </p>
      <div class="xp-bar-container">
        <div class="xp-bar-fill" style="width: ${progressPercent}%;"></div>
      </div>
    </div>

    <div class="card">
      <h2>Aktuelle Platzierungen</h2>
      ${entries
        .map(
          (entry, idx) => `
            <p style="margin-top: 0.65rem; padding: 0.45rem 0.65rem; border-radius: 0.4rem; background-color: ${entry.isYou ? "#0f172a" : "transparent"};">
              <strong>#${idx + 1}</strong> – ${entry.name}${entry.isYou ? " <strong>(Du)</strong>" : ""}: <strong>${entry.xp} XP</strong>
            </p>
          `
        )
        .join("")}
    </div>
  `;
};
