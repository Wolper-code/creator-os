const STORAGE_KEY = "creator_os_state_v1";

const defaultState = {
  currentView: "onboarding",
  creatorName: "Starter-Creator",
  mainPlatform: "YouTube",
  xp: 0,
  onboardingDone: false,
  pillars: [
    "SaaS-Affiliates",
    "Hardware-Affiliates",
    "Merch",
    "Creator-Shops",
    "Scouting"
  ],
  platforms: ["YouTube", "TikTok", "Twitch", "Instagram"]
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

function setActiveButton(view) {
  document.querySelectorAll("#main-nav button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
}

function renderView(view) {
  state.currentView = view;
  saveState(state);
  setActiveButton(view);

  const container = document.getElementById("app-content");

  if (view === "onboarding") {
    if (typeof window.renderOnboardingModule === "function") {
      window.renderOnboardingModule(container, state, saveState, renderView);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/onboarding.js wurde nicht gefunden.</p></div>`;
    }
    return;
  }

  if (view === "dashboard") {
    if (typeof window.renderDashboardModule === "function") {
      window.renderDashboardModule(container, state, renderView);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/dashboard.js wurde nicht gefunden.</p></div>`;
    }
  } else if (view === "platforms") {
    if (typeof window.renderPlatformsModule === "function") {
      window.renderPlatformsModule(container, state, saveState, renderView);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/platforms.js wurde nicht gefunden.</p></div>`;
    }
  } else if (view === "monetization") {
    if (typeof window.renderMonetizationModule === "function") {
      window.renderMonetizationModule(container, state, saveState, renderView);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/monetization.js wurde nicht gefunden.</p></div>`;
    }
  } else if (view === "quests") {
    if (typeof window.renderQuestsModule === "function") {
      window.renderQuestsModule(container, state, saveState, renderView);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/quests.js wurde nicht gefunden.</p></div>`;
    }
  } else if (view === "leaderboard") {
    if (typeof window.renderLeaderboardModule === "function") {
      window.renderLeaderboardModule(container, state);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/leaderboard.js wurde nicht gefunden.</p></div>`;
    }
  } else if (view === "parents") {
    if (typeof window.renderParentsModule === "function") {
      window.renderParentsModule(container, state, saveState, renderView);
    } else {
      container.innerHTML = `<div class="card"><h2>Fehler</h2><p>Die Datei modules/parents.js wurde nicht gefunden.</p></div>`;
    }
  }
}

document.querySelectorAll("#main-nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    renderView(btn.dataset.view);
  });
});

renderView(state.currentView || "onboarding");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
