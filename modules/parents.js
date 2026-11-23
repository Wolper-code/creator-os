window.renderParentsModule = function (container, state, saveState, onUpdate) {
  if (!state.parentControls) {
    state.parentControls = {
      contentFilter: true,
      spendingGuard: true,
      parentNote: "",
      pin: "1234"
    };
  }
  if (!state.parentControls.pin) {
    state.parentControls.pin = "1234";
  }

  if (!window.creatorOsParentUnlocked) {
    container.innerHTML = `
      <div class="card">
        <h2>Eltern-Dashboard gesperrt</h2>
        <p>Bitte gib die 4-stellige Eltern-PIN ein, um Einstellungen, Backup und Reset zu öffnen.</p>
        <label class="form-label" for="parent-pin-input">Eltern-PIN (Standard: 1234):</label>
        <input id="parent-pin-input" class="form-input" type="password" maxlength="4" inputmode="numeric" placeholder="****" />
        <p id="pin-error" style="color: #f87171; margin-top: 0.5rem; display: none;">Falsche PIN. Bitte erneut versuchen.</p>
        <button class="primary-btn" id="unlock-parent-btn" type="button">Entsperren</button>
      </div>
    `;

    const pinInput = document.getElementById("parent-pin-input");
    const errorEl = document.getElementById("pin-error");

    const tryUnlock = () => {
      if (pinInput.value.trim() === state.parentControls.pin) {
        window.creatorOsParentUnlocked = true;
        onUpdate("parents");
      } else {
        errorEl.style.display = "block";
        pinInput.value = "";
      }
    };

    document.getElementById("unlock-parent-btn").addEventListener("click", tryUnlock);
    pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") tryUnlock();
    });
    return;
  }

  const activePillarsCount = state.pillarDetails
    ? Object.values(state.pillarDetails).filter((p) => p && p.active).length
    : 0;

  container.innerHTML = `
    <div class="card">
      <h2>Eltern-Dashboard (entsperrt)</h2>
      <p>Creator: <strong>${state.creatorName}</strong> | Hauptplattform: <strong>${state.mainPlatform}</strong></p>
      <p>Status Onboarding: <strong>${state.onboardingDone ? "Abgeschlossen" : "Noch offen"}</strong></p>
      <p>Aktuelle XP: <strong>${state.xp}</strong> | Aktive Säulen: <strong>${activePillarsCount} von ${state.pillars.length}</strong></p>
      <button class="primary-btn" id="lock-parent-btn" type="button" style="background-color: #475569; color: #f8fafc;">
        Eltern-Bereich wieder sperren
      </button>
    </div>

    <div class="card">
      <h2>Sicherheit & Freigaben</h2>
      <label class="form-label">
        <input id="filter-content" type="checkbox" /> Altersgerechter Content- & Kommentarfilter aktiv
      </label>
      <label class="form-label">
        <input id="guard-spending" type="checkbox" /> Freigabe-Sperre für Ausgaben & externe Links
      </label>
      <label class="form-label" for="parent-note">Eltern-Notiz / Regeln:</label>
      <input id="parent-note" class="form-input" type="text" placeholder="z. B. Tägliche Zeit oder Regeln eintragen..." />
      <label class="form-label" for="parent-pin-change">Neue 4-stellige Eltern-PIN:</label>
      <input id="parent-pin-change" class="form-input" type="text" maxlength="4" inputmode="numeric" placeholder="4 Ziffern (z. B. 1234)" />
      <button class="primary-btn" id="save-parent-controls" type="button">Einstellungen & PIN speichern</button>
    </div>

    <div class="card">
      <h2>Fortschritt sichern & wiederherstellen (Backup)</h2>
      <p>Speichere deinen aktuellen Spielstand als JSON-Datei oder lade ein vorhandenes Backup zurück.</p>
      <button class="primary-btn" id="export-backup" type="button">Backup herunterladen</button>
      <label class="form-label" for="import-backup">Backup-Datei laden:</label>
      <input id="import-backup" class="form-input" type="file" accept=".json,application/json" />
    </div>

    <div class="card">
      <h2>Fortschritt zurücksetzen</h2>
      <p>Löscht alle gespeicherten XP, Notizen und Einstellungen lokal auf diesem Gerät.</p>
      <button class="primary-btn" id="reset-creator-os" type="button" style="background-color: #ef4444; color: #ffffff;">
        Alles zurücksetzen
      </button>
    </div>
  `;

  const filterEl = document.getElementById("filter-content");
  const guardEl = document.getElementById("guard-spending");
  const noteEl = document.getElementById("parent-note");
  const pinChangeEl = document.getElementById("parent-pin-change");

  filterEl.checked = Boolean(state.parentControls.contentFilter);
  guardEl.checked = Boolean(state.parentControls.spendingGuard);
  noteEl.value = state.parentControls.parentNote || "";
  pinChangeEl.value = state.parentControls.pin || "1234";

  document.getElementById("lock-parent-btn").addEventListener("click", () => {
    window.creatorOsParentUnlocked = false;
    onUpdate("parents");
  });

  document.getElementById("save-parent-controls").addEventListener("click", () => {
    const newPin = pinChangeEl.value.trim();
    if (/^\d{4}$/.test(newPin)) {
      state.parentControls.pin = newPin;
    } else {
      window.alert("Bitte genau 4 Ziffern für die PIN eingeben.");
      return;
    }

    state.parentControls.contentFilter = filterEl.checked;
    state.parentControls.spendingGuard = guardEl.checked;
    state.parentControls.parentNote = noteEl.value.trim();

    saveState(state);
    onUpdate("parents");
  });

  document.getElementById("export-backup").addEventListener("click", () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "creator-os-backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  document.getElementById("import-backup").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && typeof parsed === "object") {
          Object.assign(state, parsed);
          saveState(state);
          window.location.reload();
        }
      } catch (err) {
        window.alert("Die ausgewählte Datei ist kein gültiges Creator-OS-Backup.");
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("reset-creator-os").addEventListener("click", () => {
    const confirmed = window.confirm("Wirklich alle XP, Notizen und Einstellungen zurücksetzen?");
    if (confirmed) {
      localStorage.removeItem("creator_os_state_v1");
      window.location.reload();
    }
  });
};
