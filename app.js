import {
  getActiveCases,
  saveCaseToLibrary,
  resetCasesToDefault,
  diagnoseComplaint,
  getStoredActivityLog,
  logActivity
} from './cases_data.js';

// Global state
let currentScreen = "screen-new-complaint";
let currentDiagnosisResult = null;
let currentComplaintText = "";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDiagnosisController();
  initFeedbackModal();
  initTriageQueue();
  initCaseLibrary();
  initRecurringIssues();
  initActivityLog();
  initDemoWalkthrough();
  updateLibraryTicker();

  // Reset database button
  document.getElementById("reset-db-btn").addEventListener("click", () => {
    if (confirm("Reset case database and activity log to default initial state (48 cases)?")) {
      resetCasesToDefault();
      localStorage.removeItem("fixfinder_activity");
      updateLibraryTicker();
      renderCaseLibrary();
      renderRecurringIssues();
      renderActivityLog();
      alert("Database reset to initial 48 synthetic cases.");
    }
  });
});

/* ----------------------------------------------------
 * SCREEN NAVIGATION CONTROLLER
 * ---------------------------------------------------- */
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const screens = document.querySelectorAll(".screen-view");

  const titles = {
    "screen-new-complaint": { title: "Diagnose a Complaint", subtitle: "Intake free-text building complaints, match historical precedents & generate actionable repairs." },
    "screen-triage-queue": { title: "Triage Queue", subtitle: "Prioritize pending maintenance requests by urgency rating and critical safety factors." },
    "screen-case-library": { title: "Historical Case Library", subtitle: "Search and inspect 48+ synthetic cases, including technician-confirmed additions." },
    "screen-recurring-issues": { title: "Recurring Issues Analytics", subtitle: "Auto-detect high-frequency fault patterns (3+ recurrences) across facilities." },
    "screen-activity-log": { title: "Agent Activity Log", subtitle: "Complete audit log of diagnoses, match scores, and feedback confirmation loops." }
  };

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetScreen = item.getAttribute("data-screen");
      if (!targetScreen) return;

      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      screens.forEach(s => s.classList.remove("active"));
      const targetEl = document.getElementById(targetScreen);
      if (targetEl) targetEl.classList.add("active");

      currentScreen = targetScreen;

      // Update header
      if (titles[targetScreen]) {
        document.getElementById("screen-title").textContent = titles[targetScreen].title;
        document.getElementById("screen-subtitle").textContent = titles[targetScreen].subtitle;
      }

      // Refresh data on screen entry
      if (targetScreen === "screen-case-library") renderCaseLibrary();
      if (targetScreen === "screen-recurring-issues") renderRecurringIssues();
      if (targetScreen === "screen-activity-log") renderActivityLog();
    });
  });
}

function updateLibraryTicker() {
  const cases = getActiveCases();
  const tickerEl = document.getElementById("active-case-count");
  if (tickerEl) tickerEl.textContent = cases.length;
}

/* ----------------------------------------------------
 * MAIN DIAGNOSIS CONTROLLER (SCREEN 1)
 * ---------------------------------------------------- */
function initDiagnosisController() {
  const complaintInput = document.getElementById("input-complaint-text");
  const buildingSelect = document.getElementById("input-building");
  const diagnoseBtn = document.getElementById("diagnose-btn");
  const clearBtn = document.getElementById("clear-btn");
  const sampleChips = document.querySelectorAll(".sample-chip");

  // Sample Chips Click Handler
  sampleChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const text = chip.getAttribute("data-text");
      complaintInput.value = text;
      runDiagnosisPipeline();
    });
  });

  // Clear button
  clearBtn.addEventListener("click", () => {
    complaintInput.value = "";
    resetPipelineStepper();
    document.getElementById("result-idle-state").style.display = "block";
    document.getElementById("result-active-container").style.display = "none";
  });

  // Diagnose button click
  diagnoseBtn.addEventListener("click", () => {
    runDiagnosisPipeline();
  });
}

async function runDiagnosisPipeline() {
  const text = document.getElementById("input-complaint-text").value.trim();
  const building = document.getElementById("input-building").value;

  if (!text) {
    alert("Please enter or select a maintenance complaint first.");
    return;
  }

  currentComplaintText = text;

  // Show result active container & hide idle state
  document.getElementById("result-idle-state").style.display = "none";
  document.getElementById("result-active-container").style.display = "block";
  document.getElementById("diagnosis-card").style.display = "block";
  document.getElementById("recommendation-card").style.display = "block";
  document.getElementById("similar-cases-card").style.display = "block";
  document.getElementById("refusal-card").style.display = "none";

  // Reset feedback alert msg
  document.getElementById("feedback-success-msg").style.display = "none";

  // Step 1: Intake
  updateStepperStage(1, "Intake: Parsing complaint & equipment...");
  await sleep(300);

  // Step 2: Retrieval
  updateStepperStage(2, "Retrieval: Vector matching against library...");
  await sleep(350);

  // Step 3: Diagnosis
  updateStepperStage(3, "Diagnosis: Evaluating cause confidence...");
  await sleep(350);

  // Perform calculation
  const result = diagnoseComplaint(text, building);
  currentDiagnosisResult = result;

  // Step 4: Recommendation
  updateStepperStage(4, "Recommendation: Synthesizing fix & cost...");
  await sleep(300);

  completeStepper();

  if (result.status === "no_precedent") {
    renderRefusalState(result);
  } else {
    renderDiagnosisResults(result);
  }
}

function updateStepperStage(stageNum, textStatus) {
  document.getElementById("pipeline-status-tag").textContent = textStatus;
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`step-${i}`);
    if (i < stageNum) {
      el.className = "step-item completed";
    } else if (i === stageNum) {
      el.className = "step-item active";
    } else {
      el.className = "step-item";
    }
  }
}

function completeStepper() {
  document.getElementById("pipeline-status-tag").textContent = "Diagnosis Complete";
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step-${i}`).className = "step-item completed";
  }
}

function resetPipelineStepper() {
  document.getElementById("pipeline-status-tag").textContent = "Ready";
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step-${i}`).className = "step-item";
  }
}

function renderDiagnosisResults(res) {
  document.getElementById("detected-equipment-tag").textContent = res.detected_equipment;

  // Render Ranked Causes
  const container = document.getElementById("ranked-causes-container");
  container.innerHTML = "";

  res.ranked_causes.forEach((item, index) => {
    const citationsHtml = item.cited_cases.map(cId => `<span class="citation-badge">[${cId}]</span>`).join(" ");
    
    const div = document.createElement("div");
    div.className = "ranked-cause-item";
    div.innerHTML = `
      <div class="ranked-cause-header">
        <span class="ranked-cause-title">#${index + 1} ${item.cause}</span>
        <span class="ranked-cause-score">${item.score}% Match</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${item.score}%;"></div>
      </div>
      <div class="citation-tags">
        <span>Citations:</span> ${citationsHtml}
      </div>
    `;
    container.appendChild(div);
  });

  // Disagreement Banner
  const disagEl = document.getElementById("disagreement-warning-banner");
  if (res.disagreement_warning) {
    disagEl.style.display = "flex";
    document.getElementById("disagreement-warning-text").textContent = res.disagreement_warning;
  } else {
    disagEl.style.display = "none";
  }

  // Manager Summary
  document.getElementById("manager-summary-text").textContent = res.manager_summary;

  // KPI Row
  document.getElementById("kpi-cost").textContent = `$${res.recommendation.median_cost}`;
  document.getElementById("kpi-cost-range").textContent = res.recommendation.cost_range;
  document.getElementById("kpi-time").textContent = `${res.recommendation.median_time_hours} hrs`;
  document.getElementById("kpi-time-range").textContent = res.recommendation.time_range;

  const urgBadge = document.getElementById("kpi-urgency-badge");
  urgBadge.className = `urgency-badge urgency-${res.recommendation.urgency}`;
  urgBadge.textContent = `${res.recommendation.urgency}`;

  document.getElementById("urgency-reason-text").textContent = res.recommendation.urgency_reason;

  // Fix Steps
  const stepsContainer = document.getElementById("fix-steps-container");
  stepsContainer.innerHTML = "";
  res.recommendation.fix_steps.forEach((stepText, idx) => {
    const li = document.createElement("div");
    li.className = "fix-step-item";
    li.innerHTML = `
      <div class="fix-step-num">${idx + 1}</div>
      <div>${stepText}</div>
    `;
    stepsContainer.appendChild(li);
  });

  // Render Similar Cases Table
  const tbody = document.getElementById("similar-cases-tbody");
  tbody.innerHTML = "";
  res.top_matches.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="citation-badge">${m.id}</span></td>
      <td>${m.equipment}</td>
      <td>${m.cause}</td>
      <td><strong>${m.match_score}%</strong></td>
      <td><span class="urgency-badge urgency-${m.urgency}">${m.urgency}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // Log activity
  logActivity({
    id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    building: res.building || "Building A",
    complaint: currentComplaintText,
    cause: res.primary_cause,
    urgency: res.recommendation.urgency,
    score: res.highest_score,
    status: "Pending Feedback"
  });
}

function renderRefusalState(res) {
  document.getElementById("diagnosis-card").style.display = "none";
  document.getElementById("recommendation-card").style.display = "none";
  document.getElementById("similar-cases-card").style.display = "none";

  const refusalCard = document.getElementById("refusal-card");
  refusalCard.style.display = "block";

  document.getElementById("refusal-reason-text").textContent = res.reasoning;
  document.getElementById("refusal-manager-summary").textContent = `Manager Summary: ${res.manager_summary}`;
}

/* ----------------------------------------------------
 * TECHNICIAN FEEDBACK LOOP MODAL
 * ---------------------------------------------------- */
function initFeedbackModal() {
  const confirmBtn = document.getElementById("feedback-confirm-btn");
  const rejectBtn = document.getElementById("feedback-reject-btn");
  const refusalAddBtn = document.getElementById("refusal-add-case-btn");
  const modal = document.getElementById("feedback-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const form = document.getElementById("feedback-form");

  confirmBtn.addEventListener("click", () => {
    document.getElementById("feedback-success-msg").style.display = "block";
    updateLibraryTicker();
  });

  rejectBtn.addEventListener("click", () => {
    openFeedbackModal();
  });

  refusalAddBtn.addEventListener("click", () => {
    openFeedbackModal();
  });

  modalCloseBtn.addEventListener("click", () => closeModal());
  modalCancelBtn.addEventListener("click", () => closeModal());

  function openFeedbackModal() {
    document.getElementById("modal-complaint-display").value = currentComplaintText;
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const realCause = document.getElementById("modal-real-cause").value.trim();
    const cost = parseFloat(document.getElementById("modal-cost").value) || 200;
    const time = parseFloat(document.getElementById("modal-time").value) || 1.5;
    const stepsText = document.getElementById("modal-fix-steps").value.trim();

    const fixSteps = stepsText ? stepsText.split("\n").filter(s => s.trim()) : ["Inspect system & verify operation", "Replace defective module"];

    const cases = getActiveCases();
    const newId = `CASE-${100 + cases.length + 1}`;

    const newCase = {
      id: newId,
      building: document.getElementById("input-building").value || "Building B",
      equipment: currentDiagnosisResult ? currentDiagnosisResult.detected_equipment : "Refrigeration",
      complaint: currentComplaintText,
      cause: realCause,
      fix_steps: fixSteps,
      cost: cost,
      time_hours: time,
      urgency: "P1",
      urgency_reason: "Technician confirmed priority case.",
      is_tech_confirmed: true,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    saveCaseToLibrary(newCase);
    updateLibraryTicker();
    closeModal();

    alert(`✅ New case ${newId} saved to historical case library! Re-running diagnosis to demonstrate live learning...`);
    runDiagnosisPipeline();
  });
}

/* ----------------------------------------------------
 * TRIAGE QUEUE CONTROLLER (SCREEN 2)
 * ---------------------------------------------------- */
function initTriageQueue() {
  const loadBtn = document.getElementById("load-triage-samples-btn");
  loadBtn.addEventListener("click", () => renderTriageQueue());
}

function renderTriageQueue() {
  const sampleComplaints = [
    { building: "Building A", complaint: "Server room AC unit B humming loudly and temperature rising to 82F", equip: "HVAC" },
    { building: "Building C", complaint: "Main entrance glass automatic door sensor failing, door jammed halfway", equip: "Security" },
    { building: "Building B", complaint: "Breakroom sink faucet leaking steadily onto countertop", equip: "Plumbing" },
    { building: "Building D", complaint: "Freight elevator car stopping 3 inches below floor level", equip: "Elevator" }
  ];

  const tbody = document.getElementById("triage-queue-tbody");
  tbody.innerHTML = "";

  // Auto-diagnose samples to get urgency & cost
  const triagedList = sampleComplaints.map(item => {
    const diag = diagnoseComplaint(item.complaint, item.building);
    return {
      building: item.building,
      complaint: item.complaint,
      equip: diag.detected_equipment || item.equip,
      cause: diag.primary_cause || "Pending diagnosis",
      cost: diag.recommendation ? diag.recommendation.median_cost : 150,
      urgency: diag.recommendation ? diag.recommendation.urgency : "P3"
    };
  });

  // Auto-sort by urgency (P1 top)
  const urgencyWeight = { "P1": 1, "P2": 2, "P3": 3, "P4": 4 };
  triagedList.sort((a, b) => urgencyWeight[a.urgency] - urgencyWeight[b.urgency]);

  triagedList.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="urgency-badge urgency-${item.urgency}">${item.urgency}</span></td>
      <td><strong>${item.building}</strong></td>
      <td style="max-width: 320px;">${item.complaint}</td>
      <td><span class="badge-tech">${item.equip}</span></td>
      <td>${item.cause}</td>
      <td>$${item.cost}</td>
      <td>
        <button class="btn btn-secondary btn-sm open-diag-btn">Inspect</button>
      </td>
    `;

    tr.querySelector(".open-diag-btn").addEventListener("click", () => {
      // Load into Screen 1 & switch
      document.querySelector('[data-screen="screen-new-complaint"]').click();
      document.getElementById("input-building").value = item.building;
      document.getElementById("input-complaint-text").value = item.complaint;
      runDiagnosisPipeline();
    });

    tbody.appendChild(tr);
  });
}

/* ----------------------------------------------------
 * CASE LIBRARY CONTROLLER (SCREEN 3)
 * ---------------------------------------------------- */
let activeEquipFilter = "All";

function initCaseLibrary() {
  const searchInput = document.getElementById("library-search-input");
  const filterPills = document.querySelectorAll("#equipment-filter-pills button");

  searchInput.addEventListener("input", () => renderCaseLibrary());

  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active-pill"));
      pill.classList.add("active-pill");
      activeEquipFilter = pill.getAttribute("data-equip");
      renderCaseLibrary();
    });
  });
}

function renderCaseLibrary() {
  const cases = getActiveCases();
  const searchVal = document.getElementById("library-search-input").value.toLowerCase();
  const tbody = document.getElementById("case-library-tbody");
  tbody.innerHTML = "";

  const filtered = cases.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(searchVal) ||
                        c.complaint.toLowerCase().includes(searchVal) ||
                        c.cause.toLowerCase().includes(searchVal) ||
                        c.building.toLowerCase().includes(searchVal);
    const matchEquip = activeEquipFilter === "All" || c.equipment.toLowerCase() === activeEquipFilter.toLowerCase();
    return matchSearch && matchEquip;
  });

  filtered.forEach(c => {
    const tr = document.createElement("tr");
    const isNew = c.is_tech_confirmed ? `<span class="badge-new">NEW</span>` : "";
    const isTech = c.is_tech_confirmed ? `<span class="badge-tech">Tech-Confirmed</span>` : `<span style="font-size: 11px; color: var(--text-subtle);">Synthetic</span>`;

    tr.innerHTML = `
      <td><span class="citation-badge">${c.id}</span> ${isNew}</td>
      <td>${c.building}</td>
      <td><span class="badge-tech">${c.equipment}</span></td>
      <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.complaint}</td>
      <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.cause}</td>
      <td>$${c.cost}</td>
      <td><span class="urgency-badge urgency-${c.urgency}">${c.urgency}</span></td>
      <td>${isTech}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ----------------------------------------------------
 * RECURRING ISSUES & PATTERN ENGINE (SCREEN 4)
 * ---------------------------------------------------- */
function initRecurringIssues() {
  // Initial render when navigated
}

function renderRecurringIssues() {
  const cases = getActiveCases();

  // Aggregate by building
  const buildingCounts = { "Building A": 0, "Building B": 0, "Building C": 0, "Building D": 0 };
  const equipCounts = { "HVAC": 0, "Plumbing": 0, "Electrical": 0, "Elevator": 0, "Refrigeration": 0, "Security": 0 };

  // Track patterns (Building + Equipment combinations)
  const patternMap = {};

  cases.forEach(c => {
    if (buildingCounts[c.building] !== undefined) buildingCounts[c.building]++;
    if (equipCounts[c.equipment] !== undefined) equipCounts[c.equipment]++;

    const key = `${c.building} - ${c.equipment}`;
    if (!patternMap[key]) patternMap[key] = { building: c.building, equip: c.equipment, count: 0, causes: [] };
    patternMap[key].count++;
    if (!patternMap[key].causes.includes(c.cause)) patternMap[key].causes.push(c.cause);
  });

  // Render Pattern Alert Cards for count >= 3
  const patternContainer = document.getElementById("pattern-alerts-container");
  patternContainer.innerHTML = "";

  const alerts = Object.values(patternMap).filter(p => p.count >= 3);
  if (alerts.length === 0) {
    patternContainer.innerHTML = `<div style="font-size: 13px; color: var(--text-muted);">No critical recurring fault patterns detected at current threshold.</div>`;
  } else {
    alerts.forEach(alertItem => {
      const div = document.createElement("div");
      div.className = "pattern-alert-card";
      div.innerHTML = `
        <div class="alert-icon">🚨</div>
        <div>
          <div style="font-weight: 700; color: #ef4444; font-size: 15px;">Recurring Fault Cluster: ${alertItem.building} (${alertItem.equip})</div>
          <div style="font-size: 13px; color: var(--text-main); margin-top: 4px;">
            Detected <strong>${alertItem.count} instances</strong> of ${alertItem.equip} faults in ${alertItem.building}. Primary causes: ${alertItem.causes.slice(0, 2).join(", ")}.
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">
            <strong>Preventive Recommendation:</strong> Schedule comprehensive system maintenance & coil/valve replacement audit.
          </div>
        </div>
      `;
      patternContainer.appendChild(div);
    });
  }

  // Render Building Chart
  renderBarChart("chart-building", buildingCounts);
  renderBarChart("chart-equipment", equipCounts);
}

function renderBarChart(containerId, dataMap) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const values = Object.values(dataMap);
  const maxVal = Math.max(...values, 1);

  Object.entries(dataMap).forEach(([label, count]) => {
    const heightPercent = Math.round((count / maxVal) * 100);
    const col = document.createElement("div");
    col.className = "bar-column";
    col.innerHTML = `
      <div class="bar-fill" style="height: ${heightPercent}%;">
        <div class="bar-val">${count}</div>
      </div>
      <div class="bar-label">${label}</div>
    `;
    container.appendChild(col);
  });
}

/* ----------------------------------------------------
 * ACTIVITY LOG CONTROLLER (SCREEN 5)
 * ---------------------------------------------------- */
function initActivityLog() {
  // Initial render when navigated
}

function renderActivityLog() {
  const logs = getStoredActivityLog();
  const tbody = document.getElementById("activity-log-tbody");
  tbody.innerHTML = "";

  logs.forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="citation-badge">${log.id}</span></td>
      <td>${log.timestamp}</td>
      <td>${log.building}</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${log.complaint}</td>
      <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${log.cause}</td>
      <td><strong>${log.score}%</strong></td>
      <td><span class="urgency-badge urgency-${log.urgency}">${log.urgency}</span></td>
      <td><span class="badge-tech">${log.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ----------------------------------------------------
 * DEMO SCRIPT GUIDED WALKTHROUGH
 * ---------------------------------------------------- */
function initDemoWalkthrough() {
  document.getElementById("demo-step-1").addEventListener("click", () => {
    document.querySelector('[data-screen="screen-new-complaint"]').click();
    document.getElementById("input-building").value = "Building A";
    document.getElementById("input-complaint-text").value = "AC in room 204 is leaking water from casing and making loud rattling noises.";
    runDiagnosisPipeline();
  });

  document.getElementById("demo-step-2").addEventListener("click", () => {
    document.querySelector('[data-screen="screen-new-complaint"]').click();
    document.getElementById("input-building").value = "Building A";
    document.getElementById("input-complaint-text").value = "AC not cooling well in 3rd floor open office space, warm air blowing from vents.";
    runDiagnosisPipeline();
  });

  document.getElementById("demo-step-3").addEventListener("click", () => {
    document.querySelector('[data-screen="screen-new-complaint"]').click();
    document.getElementById("input-building").value = "Building B";
    document.getElementById("input-complaint-text").value = "Cafeteria fridge compressor making grinding noise and food cabinet temperature rising.";
    runDiagnosisPipeline();
  });

  document.getElementById("demo-step-4").addEventListener("click", async () => {
    document.querySelector('[data-screen="screen-new-complaint"]').click();
    document.getElementById("input-building").value = "Building B";
    document.getElementById("input-complaint-text").value = "Cafeteria fridge compressor making grinding noise and food cabinet temperature rising.";
    await runDiagnosisPipeline();
    await sleep(400);
    document.getElementById("feedback-reject-btn").click();
  });

  document.getElementById("demo-step-5").addEventListener("click", () => {
    document.querySelector('[data-screen="screen-triage-queue"]').click();
    document.getElementById("load-triage-samples-btn").click();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
