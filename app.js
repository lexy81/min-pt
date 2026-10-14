const STORAGE_KEY = "min-pt-app-v1";
const PHOTO_DATABASE = "min-pt-media-v1";
const workouts = [
  {
    day: "Mandag",
    title: "Bryst, skuldre og triceps",
    exercises: [
      { name: "Brystpress", detail: "3 sett × 10–12 repetisjoner", image: "chest-press", guide: "Sitt med ryggen mot puten. Skyv håndtakene frem fra brystet, og senk kontrollert tilbake." },
      { name: "Skulderpress", detail: "3 sett × 10–12 repetisjoner", image: "shoulder-press", guide: "Sitt med ryggen støttet. Press håndtakene opp over hodet uten å låse albuene." },
      { name: "Pec Deck", detail: "3 sett × 12 repetisjoner", image: "pec-deck", guide: "Hold en lett bøy i albuene. Før armene sammen foran brystet, og åpne rolig igjen." },
      { name: "Triceps Pushdown", detail: "3 sett × 12 repetisjoner", image: "triceps-pushdown", guide: "Hold albuene tett inntil kroppen. Press håndtaket ned til armene er nesten strake." },
      { name: "Tredemølle", detail: "15 minutter rask gange", image: "treadmill", guide: "Gå i et tempo der du blir varm, men fortsatt kan snakke. Hold deg i midten av båndet.", timed: true }
    ]
  },
  {
    day: "Onsdag",
    title: "Rygg og biceps",
    exercises: [
      { name: "Nedtrekk", detail: "3 sett × 10–12 repetisjoner", image: "lat-pulldown", guide: "Sitt med lårene under puten. Trekk stangen ned foran kroppen mot øvre bryst." },
      { name: "Sittende roing", detail: "3 sett × 10–12 repetisjoner", image: "seated-row", guide: "Sitt med lang rygg. Trekk håndtaket mot magen, og før armene rolig frem igjen." },
      { name: "Rygghev-maskin", detail: "3 sett × 12 repetisjoner", image: "back-extension", guide: "Plasser puten mot øvre rygg. Strekk overkroppen bakover med kontroll, uten å svaie." },
      { name: "Biceps Curl", detail: "3 sett × 12 repetisjoner", image: "biceps-curl", guide: "Hold albuene inntil kroppen. Bøy armene opp mot skuldrene, og senk rolig." }
    ]
  },
  {
    day: "Fredag",
    title: "Bein og mage",
    exercises: [
      { name: "Beinpress", detail: "3 sett × 12 repetisjoner", image: "leg-press", guide: "Sett føttene omtrent i skulderbredde. Senk plattformen til knærne er bøyd, og press opp igjen." },
      { name: "Leg Curl", detail: "3 sett × 12 repetisjoner", image: "leg-curl", guide: "Legg puten bak anklene. Bøy knærne og trekk hælene mot setet." },
      { name: "Leg Extension", detail: "3 sett × 12 repetisjoner", image: "leg-extension", guide: "Sitt med puten foran anklene. Strekk knærne rolig, og senk beina kontrollert." },
      { name: "Magemaskin", detail: "3 sett × 15 repetisjoner", image: "ab-machine", guide: "Spenn magen og bøy overkroppen fremover. Unngå å dra med armene." },
      { name: "Planke", detail: "3 × 30 sekunder", image: "plank", guide: "Støtt deg på underarmer og tær. Hold kroppen rett, spenn mage og sete.", timed: true }
    ]
  }
];

let state = loadState();
let installPrompt = null;
let toastTimer;
let photoObjectUrls = [];
let selectedStrengthExercise = "Brystpress";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const legacyWeight = localStorage.getItem("weight");
    const legacyExercises = JSON.parse(localStorage.getItem("exercises") || "[]");
    const weights = Array.isArray(saved.weights) ? saved.weights : [];
    if (weights.length === 0 && legacyWeight && Number.isFinite(Number(legacyWeight))) {
      weights.push({ date: localDate(), value: Number(legacyWeight) });
    }
    return {
      weights,
      exercises: Array.isArray(saved.exercises)
        ? saved.exercises.filter((item) => typeof item === "string")
        : Array.isArray(legacyExercises) ? legacyExercises.filter((item) => typeof item === "string") : [],
      lifts: saved.lifts && typeof saved.lifts === "object" ? saved.lifts : {},
      completed: saved.completed && typeof saved.completed === "object" ? saved.completed : {},
      theme: saved.theme === "light" ? "light" : "dark"
    };
  } catch (error) {
    console.error("Kunne ikke lese lagrede treningsdata.", error);
    return { weights: [], exercises: [], completed: {}, theme: "dark" };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const latest = state.weights[state.weights.length - 1];
    if (latest) localStorage.setItem("weight", String(latest.value));
    localStorage.setItem("exercises", JSON.stringify(state.exercises));
  } catch (error) {
    console.error("Kunne ikke lagre treningsdata.", error);
    showToast("Dataene kunne ikke lagres. Kontroller lagringsplassen i nettleseren.");
  }
}

function localDate(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderWorkouts() {
  const container = document.querySelector("#workoutPlan");
  const today = new Intl.DateTimeFormat("no-NO", { weekday: "long" }).format(new Date());
  container.innerHTML = workouts.map((workout) => {
    const rows = workout.exercises.map((exercise, index) => {
      const key = `${workout.day}-${index}`;
      const checked = state.completed[localDate()]?.includes(key);
      const date = localDate();
      const savedWeight = state.lifts[date]?.[workout.day]?.[exercise.name] ?? "";
      const previousWeight = getPreviousLiftWeight(workout.day, exercise.name, date);
      return `<li class="exercise">
        <svg class="exercise-art" role="img" aria-label="Illustrasjon av ${escapeHtml(exercise.name)}"><use href="./images/exercises.svg#${exercise.image}"></use></svg>
        <div class="exercise-main"><h3>${escapeHtml(exercise.name)}</h3><p>${escapeHtml(exercise.detail)}</p><p class="exercise-guide">${escapeHtml(exercise.guide)}</p>
          ${exercise.timed ? "" : `<div class="lift-entry"><label>Vekt <span>(kg)</span><input type="number" min="0.5" max="1000" step="0.5" inputmode="decimal" placeholder="${previousWeight === null ? "f.eks. 20" : formatWeight(previousWeight)}" value="${savedWeight}" data-lift-weight data-lift-day="${escapeHtml(workout.day)}" data-lift-exercise="${escapeHtml(exercise.name)}" aria-label="Løftet vekt i kilo for ${escapeHtml(exercise.name)}"></label>${previousWeight === null ? "" : `<span class="previous-lift">Forrige: ${formatWeight(previousWeight)} kg</span>`}</div>`}
        </div>
        <label class="exercise-check"><input type="checkbox" data-workout="${escapeHtml(key)}" ${checked ? "checked" : ""} aria-label="Marker ${escapeHtml(exercise.name)} som fullført"><span class="checkmark"></span></label>
      </li>`;
    }).join("");
    return `<section class="card workout-card"><div class="workout-heading"><div><span class="day-label">${workout.day}</span><h2>${escapeHtml(workout.title)}</h2></div>${workout.day.toLowerCase() === today ? '<span class="today-label">I dag</span>' : ""}</div><ul class="exercise-list">${rows}</ul></section>`;
  }).join("");
}

function getPreviousLiftWeight(day, exercise, beforeDate) {
  const previousDates = Object.keys(state.lifts)
    .filter((date) => date < beforeDate)
    .sort((first, second) => second.localeCompare(first));
  for (const date of previousDates) {
    const weight = state.lifts[date]?.[day]?.[exercise];
    if (Number.isFinite(weight)) return weight;
  }
  return null;
}

function renderExercises() {
  const list = document.querySelector("#customExercises");
  list.replaceChildren();
  state.exercises.forEach((exercise, index) => {
    const item = document.createElement("li");
    item.className = "custom-exercise";
    const name = document.createElement("span");
    name.textContent = exercise;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-exercise";
    remove.dataset.removeExercise = String(index);
    remove.setAttribute("aria-label", `Fjern ${exercise}`);
    remove.textContent = "Fjern";
    item.append(name, remove);
    list.append(item);
  });
}

function renderWeights() {
  const history = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = history[history.length - 1];
  const weightText = latest
    ? `Siste registrerte vekt: ${formatWeight(latest.value)} kg`
    : "Ingen målinger registrert ennå.";
  document.querySelector("#currentWeight").textContent = weightText;
  document.querySelector("#overviewWeight").textContent = latest ? `${formatWeight(latest.value)} kg` : "–";
  document.querySelector("#weightDate").value = localDate();
  const list = document.querySelector("#weightHistory");
  list.replaceChildren();
  [...history].reverse().slice(0, 8).forEach((entry) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${formatDate(entry.date)}</span><strong>${formatWeight(entry.value)} kg</strong>`;
    list.append(item);
  });
  const change = history.length > 1 ? latest.value - history[0].value : null;
  document.querySelector("#weightChange").textContent = change === null
    ? "–" : `${change > 0 ? "+" : ""}${formatWeight(change)} kg`;
  renderChart(history);
  renderStrengthProgress();
}

function renderStrengthProgress() {
  const select = document.querySelector("#strengthExercise");
  const liftableExercises = workouts.flatMap((workout) =>
    workout.exercises.filter((exercise) => !exercise.timed).map((exercise) => exercise.name)
  );
  if (!liftableExercises.includes(selectedStrengthExercise)) {
    selectedStrengthExercise = liftableExercises[0];
  }
  select.replaceChildren();
  liftableExercises.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = name === selectedStrengthExercise;
    select.append(option);
  });

  const history = Object.entries(state.lifts)
    .map(([date, days]) => {
      for (const workout of workouts) {
        const weight = days?.[workout.day]?.[selectedStrengthExercise];
        if (Number.isFinite(weight)) return { date, weight };
      }
      return null;
    })
    .filter(Boolean)
    .sort((first, second) => first.date.localeCompare(second.date));

  const summary = document.querySelector("#strengthSummary");
  const chart = document.querySelector("#strengthChart");
  const historyList = document.querySelector("#strengthHistory");
  chart.replaceChildren();
  historyList.replaceChildren();
  chart.setAttribute("aria-label", `Graf over registrert løftevekt i ${selectedStrengthExercise}`);

  if (history.length === 0) {
    summary.textContent = "Registrer vekten på øvelsen under «Trening» for å starte grafen.";
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Ingen registrerte løftevekter ennå.";
    chart.append(empty);
    return;
  }

  const first = history[0];
  const latest = history[history.length - 1];
  const change = latest.weight - first.weight;
  if (history.length === 1) {
    summary.textContent = `Siste registrering: ${formatWeight(latest.weight)} kg · Legg inn en ny økt for å se utviklingen.`;
  } else {
    const direction = change > 0 ? "sterkere med" : change < 0 ? "endring på" : "samme vekt";
    summary.textContent = `${history.length} økter · ${formatWeight(first.weight)} → ${formatWeight(latest.weight)} kg (${direction} ${formatWeight(Math.abs(change))} kg)`;
  }

  drawStrengthChart(chart, history, selectedStrengthExercise);
  [...history].reverse().slice(0, 8).forEach((entry) => {
    const row = document.createElement("li");
    const date = document.createElement("span");
    date.textContent = formatDate(entry.date);
    const weight = document.createElement("strong");
    weight.textContent = `${formatWeight(entry.weight)} kg`;
    row.append(date, weight);
    historyList.append(row);
  });
}

function drawStrengthChart(container, history, exerciseName) {
  const width = 520;
  const height = 230;
  const margin = { top: 22, right: 18, bottom: 42, left: 50 };
  const values = history.map((entry) => entry.weight);
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const padding = Math.max((highest - lowest) * 0.15, highest * 0.05, 1);
  const min = Math.max(0, lowest - padding);
  const max = highest + padding;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const pointX = (index) => margin.left + (history.length === 1 ? plotWidth / 2 : index * plotWidth / (history.length - 1));
  const pointY = (weight) => margin.top + (max - weight) / (max - min) * plotHeight;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${exerciseName}: ${history.map((entry) => `${formatDate(entry.date)} ${formatWeight(entry.weight)} kilo`).join(", ")}`);

  for (let index = 0; index <= 4; index++) {
    const y = margin.top + plotHeight * index / 4;
    const value = max - (max - min) * index / 4;
    const grid = document.createElementNS(svg.namespaceURI, "line");
    grid.setAttribute("x1", margin.left);
    grid.setAttribute("x2", width - margin.right);
    grid.setAttribute("y1", y);
    grid.setAttribute("y2", y);
    grid.setAttribute("class", "strength-grid");
    svg.append(grid);
    const label = document.createElementNS(svg.namespaceURI, "text");
    label.setAttribute("x", margin.left - 8);
    label.setAttribute("y", y + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("class", "strength-axis-label");
    label.textContent = formatWeight(value);
    svg.append(label);
  }

  const points = history.map((entry, index) => ({ x: pointX(index), y: pointY(entry.weight), ...entry }));
  if (points.length > 1) {
    const line = document.createElementNS(svg.namespaceURI, "polyline");
    line.setAttribute("points", points.map((point) => `${point.x},${point.y}`).join(" "));
    line.setAttribute("class", "strength-line");
    svg.append(line);
  }
  points.forEach((point, index) => {
    const marker = document.createElementNS(svg.namespaceURI, "circle");
    marker.setAttribute("cx", point.x);
    marker.setAttribute("cy", point.y);
    marker.setAttribute("r", "5");
    marker.setAttribute("class", "strength-point");
    const title = document.createElementNS(svg.namespaceURI, "title");
    title.textContent = `${formatDate(point.date)}: ${formatWeight(point.weight)} kg`;
    marker.append(title);
    svg.append(marker);

    const date = document.createElementNS(svg.namespaceURI, "text");
    date.setAttribute("x", point.x);
    date.setAttribute("y", height - 12);
    date.setAttribute("text-anchor", history.length > 5 && index % 2 ? "end" : history.length > 5 ? "start" : "middle");
    date.setAttribute("class", "strength-axis-label");
    date.textContent = new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short" })
      .format(new Date(`${point.date}T12:00:00`));
    svg.append(date);
  });
  container.append(svg);
}

function renderChart(history) {
  const container = document.querySelector("#weightChart");
  container.replaceChildren();
  if (history.length < 2) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = history.length ? "Legg inn en måling til for å se utviklingen." : "Vektutviklingen vises når du har registrert målinger.";
    container.append(empty);
    return;
  }
  const values = history.slice(-8);
  const min = Math.min(...values.map((entry) => entry.value));
  const max = Math.max(...values.map((entry) => entry.value));
  const span = max - min || 1;
  const points = values.map((entry, index) => ({
    x: 12 + index * (76 / (values.length - 1)),
    y: 78 - ((entry.value - min) / span) * 58
  }));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  const line = document.createElementNS(svg.namespaceURI, "polyline");
  line.setAttribute("points", points.map((point) => `${point.x},${point.y}`).join(" "));
  line.setAttribute("class", "chart-line");
  svg.append(line);
  points.forEach((point) => {
    const circle = document.createElementNS(svg.namespaceURI, "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", "1.7");
    circle.setAttribute("class", "chart-point");
    svg.append(circle);
  });
  container.append(svg);
}

function renderStats() {
  const count = Object.entries(state.completed).reduce((total, [date, entries]) => {
    if (!Array.isArray(entries)) return total;
    return total + workouts.filter((workout) =>
      workout.exercises.every((_, index) => entries.includes(`${workout.day}-${index}`))
    ).length;
  }, 0);
  document.querySelector("#workoutCount").textContent = String(count);
  document.querySelector("#progressWorkoutCount").textContent = String(count);
  const day = new Intl.DateTimeFormat("no-NO", { weekday: "long" }).format(new Date());
  const todaysWorkout = workouts.find((workout) => workout.day.toLowerCase() === day);
  document.querySelector("#todayWorkout").textContent = todaysWorkout ? todaysWorkout.day : "Hviledag";
}

function render() {
  renderWorkouts();
  renderExercises();
  renderWeights();
  renderStats();
  document.documentElement.dataset.theme = state.theme;
  document.querySelector("#themeToggle").checked = state.theme === "dark";
}

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Nettleseren støtter ikke privat bildelagring."));
      return;
    }
    const request = indexedDB.open(PHOTO_DATABASE, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("photos")) {
        request.result.createObjectStore("photos", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Kunne ikke åpne bildelageret."));
    request.onblocked = () => reject(new Error("Bildelageret er opptatt. Lukk andre faner med Min PT og prøv igjen."));
  });
}

async function getPhotos() {
  const database = await openPhotoDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction("photos", "readonly");
      const request = transaction.objectStore("photos").getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Kunne ikke lese treningsbildene."));
      transaction.onabort = () => reject(transaction.error || new Error("Kunne ikke lese treningsbildene."));
    });
  } finally {
    database.close();
  }
}

async function storePhoto(photo) {
  const database = await openPhotoDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("photos", "readwrite");
      transaction.objectStore("photos").add(photo);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Kunne ikke lagre bildet."));
      transaction.onabort = () => reject(transaction.error || new Error("Bildet kunne ikke lagres. Det kan være for lite lagringsplass."));
    });
  } finally {
    database.close();
  }
}

async function deletePhoto(id) {
  const database = await openPhotoDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("photos", "readwrite");
      transaction.objectStore("photos").delete(id);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Kunne ikke slette bildet."));
      transaction.onabort = () => reject(transaction.error || new Error("Bildet kunne ikke slettes."));
    });
  } finally {
    database.close();
  }
}

async function clearPhotos() {
  const database = await openPhotoDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("photos", "readwrite");
      transaction.objectStore("photos").clear();
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Kunne ikke slette treningsbildene."));
      transaction.onabort = () => reject(transaction.error || new Error("Treningsbildene kunne ikke slettes."));
    });
  } finally {
    database.close();
  }
}

async function preparePhoto(file) {
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Bildet er større enn 12 MB. Velg et mindre bilde.");
  }
  if (typeof createImageBitmap !== "function") return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Kunne ikke klargjøre bildet."));
      }, "image/jpeg", 0.82);
    });
    return blob;
  } finally {
    if (bitmap) bitmap.close();
  }
}

async function renderPhotos() {
  const gallery = document.querySelector("#photoGallery");
  photoObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  photoObjectUrls = [];
  gallery.replaceChildren();
  let photos;
  try {
    photos = await getPhotos();
  } catch (error) {
    console.error("Kunne ikke hente treningsbildene.", error);
    gallery.textContent = "Bildene kunne ikke åpnes. Prøv å laste siden på nytt.";
    return;
  }
  photos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!photos.length) {
    const empty = document.createElement("p");
    empty.className = "photo-empty";
    empty.textContent = "Her vises bildene dine etter hvert. Ta ett nå for å markere starten!";
    gallery.append(empty);
    return;
  }
  photos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "photo-entry";
    const image = document.createElement("img");
    const imageUrl = URL.createObjectURL(photo.blob);
    photoObjectUrls.push(imageUrl);
    image.src = imageUrl;
    image.alt = `Fremgangsbilde fra ${formatDate(photo.date)}, ${photo.workout}`;
    image.loading = "lazy";
    const info = document.createElement("div");
    info.className = "photo-entry-info";
    const label = document.createElement("span");
    label.className = "photo-workout-label";
    label.textContent = photo.workout;
    const date = document.createElement("time");
    date.dateTime = photo.date;
    date.textContent = formatDate(photo.date);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-photo";
    remove.dataset.deletePhoto = photo.id;
    remove.setAttribute("aria-label", `Slett bildet fra ${formatDate(photo.date)}`);
    remove.textContent = "Slett bilde";
    info.append(label, date, remove);
    card.append(image, info);
    gallery.append(card);
  });
}

function formatWeight(value) {
  return new Intl.NumberFormat("no-NO", { maximumFractionDigits: 1 }).format(value);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${date}T12:00:00`));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3000);
}

document.querySelector("#weightForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number(document.querySelector("#weightInput").value);
  const date = document.querySelector("#weightDate").value;
  if (!Number.isFinite(value) || value <= 0 || value > 500 || !date || date > localDate()) {
    showToast("Skriv inn en gyldig vekt og dato.");
    return;
  }
  state.weights = state.weights.filter((entry) => entry.date !== date);
  state.weights.push({ date, value });
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
  renderWeights();
  document.querySelector("#weightInput").value = "";
  showToast("Vektmålingen er lagret.");
});

document.querySelector("#strengthExercise").addEventListener("change", (event) => {
  selectedStrengthExercise = event.currentTarget.value;
  renderStrengthProgress();
});

document.querySelector("#exerciseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#exerciseInput");
  const exercise = input.value.trim();
  if (!exercise) return;
  state.exercises.push(exercise);
  saveState();
  renderExercises();
  input.value = "";
  showToast("Øvelsen er lagt til.");
});

document.querySelector("#customExercises").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-exercise]");
  if (!button) return;
  state.exercises.splice(Number(button.dataset.removeExercise), 1);
  saveState();
  renderExercises();
});

document.querySelector("#workoutPlan").addEventListener("change", (event) => {
  const weightInput = event.target.closest("[data-lift-weight]");
  if (weightInput) {
    const value = weightInput.value === "" ? null : Number(weightInput.value);
    if (value !== null && (!Number.isFinite(value) || value < 0.5 || value > 1000)) {
      showToast("Skriv inn en gyldig treningsvekt mellom 0,5 og 1000 kg.");
      return;
    }
    const date = localDate();
    const { liftDay, liftExercise } = weightInput.dataset;
    if (!state.lifts[date]) state.lifts[date] = {};
    if (!state.lifts[date][liftDay]) state.lifts[date][liftDay] = {};
    if (value === null) {
      delete state.lifts[date][liftDay][liftExercise];
      if (Object.keys(state.lifts[date][liftDay]).length === 0) delete state.lifts[date][liftDay];
      if (Object.keys(state.lifts[date]).length === 0) delete state.lifts[date];
    } else {
      state.lifts[date][liftDay][liftExercise] = value;
    }
    saveState();
    showToast(value === null ? "Vektregistreringen er fjernet." : `Lagret: ${formatWeight(value)} kg for ${liftExercise}.`);
    return;
  }
  const checkbox = event.target.closest("[data-workout]");
  if (!checkbox) return;
  const date = localDate();
  if (!Array.isArray(state.completed[date])) state.completed[date] = [];
  state.completed[date] = state.completed[date].filter((key) => key !== checkbox.dataset.workout);
  if (checkbox.checked) state.completed[date].push(checkbox.dataset.workout);
  if (!state.completed[date].length) delete state.completed[date];
  saveState();
  renderStats();
});

document.querySelector("#themeToggle").addEventListener("change", (event) => {
  state.theme = event.target.checked ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  saveState();
});

document.querySelector("#clearData").addEventListener("click", async () => {
  if (!window.confirm("Slette alle lagrede vektmålinger, økter, egne øvelser og bilder?")) return;
  try {
    await clearPhotos();
  } catch (error) {
    console.error("Kunne ikke slette alle treningsbildene.", error);
    showToast("Bildene ble ikke slettet. Prøv igjen før du sletter resten av dataene.");
    return;
  }
  state.weights = [];
  state.lifts = {};
  state.exercises = [];
  state.completed = {};
  localStorage.removeItem("weight");
  localStorage.removeItem("exercises");
  saveState();
  render();
  photoObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  photoObjectUrls = [];
  renderPhotos();
  showToast("Alle treningsdata og bilder er slettet.");
});

document.querySelector("#photoDate").value = localDate();
document.querySelector("#photoDate").max = localDate();
document.querySelector("#choosePhoto").addEventListener("click", () => {
  document.querySelector("#photoInput").click();
});

document.querySelector("#photoInput").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Velg en bildefil.");
    input.value = "";
    return;
  }
  const photoDate = document.querySelector("#photoDate").value;
  if (!photoDate || photoDate > localDate()) {
    showToast("Velg en gyldig dato som ikke er i fremtiden.");
    input.value = "";
    return;
  }
  try {
    const blob = await preparePhoto(file);
    await storePhoto({
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      date: photoDate,
      workout: document.querySelector("#photoWorkout").value,
      createdAt: new Date().toISOString(),
      blob
    });
    await renderPhotos();
    showToast("Bildet er lagret trygt på denne enheten.");
  } catch (error) {
    console.error("Kunne ikke lagre treningsbildet.", error);
    showToast(error.message || "Bildet kunne ikke lagres. Kontroller lagringsplassen og prøv igjen.");
  } finally {
    input.value = "";
  }
});

document.querySelector("#photoGallery").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-photo]");
  if (!button) return;
  try {
    await deletePhoto(button.dataset.deletePhoto);
    await renderPhotos();
    showToast("Bildet er slettet.");
  } catch (error) {
    console.error("Kunne ikke slette treningsbildet.", error);
    showToast("Bildet kunne ikke slettes. Prøv igjen.");
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  document.querySelector("#installButton").hidden = false;
});

document.querySelector("#installButton").addEventListener("click", async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  installPrompt = null;
  document.querySelector("#installButton").hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => console.error("Kunne ikke registrere service worker.", error));
  });
}

render();
renderPhotos();
