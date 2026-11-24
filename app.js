const STORAGE_KEY = "min-pt-app-v1";
const PHOTO_DATABASE = "min-pt-media-v1";
const motivationMessages = [
  "Målet er ikke å trene perfekt. Målet er å møte opp.",
  "Små økter gjentatt gir store resultater.",
  "Du trenger ikke å være sterk i dag. Du må bare ta første steg.",
  "Fremdrift skjer når du gjør det litt igjen.",
  "En treningsøkt er en gave til fremtidige deg.",
  "Hold tempoet. Konsistens slår intensitet over tid.",
  "Du er sterkere enn grunnen du bruker for å stå over.",
  "Møt opp for deg selv – resten kommer etterpå."
];
const visibleHistoryLimit = 3;
const expandedHistoryLists = new Set();
const cardioActivities = ["Tredemølle", "Sykling", "Gåtur", "Ellipsemaskin", "Stakemaskin"];
const cardioOptionalFields = {
  speed: { label: "Hastighet (km/t)", id: "cardioSpeed", type: "number", attributes: { min: "0.1", max: "100", step: "0.1", inputmode: "decimal", placeholder: "f.eks. 6,5" } },
  incline: { label: "Stigning (%)", id: "cardioIncline", type: "number", attributes: { min: "0", max: "100", step: "0.1", inputmode: "decimal", placeholder: "f.eks. 2" } },
  pace: { label: "Tempo (min/km)", id: "cardioPace", type: "text", attributes: { inputmode: "numeric", placeholder: "f.eks. 06:30" } },
  comment: { label: "Kommentar", id: "cardioComment", type: "textarea", attributes: { maxlength: "500", rows: "3", placeholder: "Skriv en kommentar (valgfritt)" } }
};
const exerciseRecommendations = {
  "Bein": [
    { name: "Beinpress", equipment: "Beinpressmaskin", detail: "3 sett × 10–12 repetisjoner", tip: "Plasser føttene omtrent i skulderbredde. Senk kontrollert, og press gjennom hele foten." },
    { name: "Leg Extension", equipment: "Beinstrekkmaskin", detail: "3 sett × 10–12 repetisjoner", tip: "Strekk knærne rolig uten å låse dem, og senk vekten kontrollert." },
    { name: "Leg Curl", equipment: "Lårcurlmaskin", detail: "3 sett × 10–12 repetisjoner", tip: "Juster puten ved anklene. Bøy knærne og før hælene mot setet uten å løfte hoftene." },
    { name: "Hack squat", equipment: "Hack squat-maskin", detail: "3 sett × 8–12 repetisjoner", tip: "Hold ryggen mot puten. Senk bare så langt du kan holde god kontroll." },
    { name: "Tåhev", equipment: "Tåhev- eller beinpressmaskin", detail: "3 sett × 12–15 repetisjoner", tip: "Senk hælene rolig og løft deg opp på tærne uten å sprette." }
  ],
  "Rumpe og lår": [
    { name: "Hip thrust", equipment: "Hip thrust-maskin", detail: "3 sett × 8–12 repetisjoner", tip: "Hold ribbeina nede og press gjennom hælene. Stopp når hoftene er strake." },
    { name: "Abduksjon", equipment: "Abduktormaskin", detail: "3 sett × 12–15 repetisjoner", tip: "Press knærne utover rolig, hold et kort øyeblikk, og før dem kontrollert tilbake." },
    { name: "Adduksjon", equipment: "Adduktormaskin", detail: "3 sett × 12–15 repetisjoner", tip: "Før knærne sammen med kontroll. Velg en behagelig bevegelsesbane." },
    { name: "Kabel kickback", equipment: "Kabelapparat med ankelstropp", detail: "3 sett × 10–12 repetisjoner per side", tip: "Hold overkroppen stabil og før beinet bakover uten å svaie i korsryggen." },
    { name: "Knebøy i Smith-maskin", equipment: "Smith-maskin", detail: "3 sett × 8–12 repetisjoner", tip: "Stå stødig og senk deg kontrollert. Bruk en dybde som føles stabil og smertefri." }
  ],
  "Mage": [
    { name: "Magemaskin", equipment: "Magemaskin", detail: "3 sett × 12–15 repetisjoner", tip: "Rund overkroppen kontrollert ved å spenne magen; unngå å dra med armene." },
    { name: "Roterende magemaskin", equipment: "Rotasjonsmaskin for mage", detail: "3 sett × 10–12 repetisjoner per side", tip: "Hold hoftene stabile og roter overkroppen rolig innenfor et komfortabelt utslag." },
    { name: "Kabelcrunch", equipment: "Kabelapparat med tau", detail: "3 sett × 10–15 repetisjoner", tip: "Bøy overkroppen ved å trekke ribbeina mot hoftene. Hold hoftene mest mulig i ro." },
    { name: "Kneløft i stativ", equipment: "Kneløftstativ (Captain's chair)", detail: "3 sett × 8–12 repetisjoner", tip: "Støtt underarmene og løft knærne kontrollert uten å svinge kroppen." },
    { name: "Pallof press", equipment: "Kabelapparat", detail: "3 sett × 10–12 repetisjoner per side", tip: "Stå sidelengs mot kabelen og hold overkroppen rolig mens du presser håndtaket frem." }
  ],
  "Bryst": [
    { name: "Brystpress", equipment: "Brystpressmaskin", detail: "3 sett × 8–12 repetisjoner", tip: "Hold ryggen mot puten. Press frem uten å låse albuene, og senk kontrollert." },
    { name: "Skrå brystpress", equipment: "Skrå brystpressmaskin", detail: "3 sett × 8–12 repetisjoner", tip: "Juster setet slik at håndtakene starter omtrent ved øvre bryst." },
    { name: "Pec Deck", equipment: "Pec Deck-maskin", detail: "3 sett × 10–12 repetisjoner", tip: "Hold en lett bøy i albuene og før armene sammen uten å bruke fart." },
    { name: "Kabel-flyes", equipment: "Kabelapparat", detail: "3 sett × 10–12 repetisjoner", tip: "Stå stødig og før hendene sammen foran brystet med en myk albuebøy." },
    { name: "Brystpress med manualer", equipment: "Manualer og treningsbenk", detail: "3 sett × 8–12 repetisjoner", tip: "Hold håndleddene stabile og senk manualene kontrollert til en behagelig dybde." }
  ],
  "Rygg": [
    { name: "Nedtrekk", equipment: "Nedtrekksmaskin", detail: "3 sett × 8–12 repetisjoner", tip: "Trekk stangen mot øvre bryst mens du holder overkroppen rolig." },
    { name: "Sittende roing", equipment: "Sittende ro-maskin", detail: "3 sett × 8–12 repetisjoner", tip: "Trekk håndtaket mot magen med lang rygg og før armene rolig frem igjen." },
    { name: "Bryststøttet roing", equipment: "Ro-maskin med bryststøtte", detail: "3 sett × 8–12 repetisjoner", tip: "Hold brystet mot puten og trekk albuene bakover uten å løfte skuldrene." },
    { name: "Rygghev-maskin", equipment: "Rygghev-maskin", detail: "3 sett × 10–12 repetisjoner", tip: "Strekk overkroppen kontrollert og unngå å svaie langt bak." },
    { name: "Assistert pull-up", equipment: "Assistert pull-up-maskin", detail: "3 sett × 6–10 repetisjoner", tip: "Trekk albuene ned mot siden og bruk en hjelpemotstand du kan kontrollere." },
    { name: "Face pull", equipment: "Kabelapparat med tau", detail: "3 sett × 12–15 repetisjoner", tip: "Trekk tauet mot ansiktet med albuene ut, og hold skuldrene avslappet." }
  ]
};
const muscleLabels = {
  chest: "Bryst",
  shoulders: "Skuldre",
  biceps: "Biceps",
  triceps: "Triceps",
  upperBack: "Øvre rygg",
  lats: "Brede ryggmuskler",
  lowerBack: "Korsrygg",
  abs: "Mage",
  obliques: "Skrå magemuskler",
  glutes: "Rumpe",
  quads: "Forside lår",
  hamstrings: "Bakside lår",
  calves: "Legger",
  innerThigh: "Lår innsiden"
};
const muscleGroupsByCategory = {
  "Bein": ["quads", "hamstrings", "calves"],
  "Rumpe og lår": ["glutes", "quads", "hamstrings"],
  "Mage": ["abs", "obliques"],
  "Bryst": ["chest", "shoulders"],
  "Rygg": ["upperBack", "lats", "lowerBack"]
};
const muscleGroupsByExercise = {
  "Beinpress": ["quads", "glutes"],
  "Leg Extension": ["quads"],
  "Leg Curl": ["hamstrings"],
  "Hack squat": ["quads", "glutes"],
  "Tåhev": ["calves"],
  "Hip thrust": ["glutes", "hamstrings"],
  "Abduksjon": ["glutes"],
  "Adduksjon": ["innerThigh"],
  "Kabel kickback": ["glutes"],
  "Knebøy i Smith-maskin": ["quads", "glutes"],
  "Magemaskin": ["abs"],
  "Roterende magemaskin": ["obliques"],
  "Kabelcrunch": ["abs"],
  "Kneløft i stativ": ["abs"],
  "Pallof press": ["obliques"],
  "Brystpress": ["chest", "shoulders", "triceps"],
  "Skrå brystpress": ["chest", "shoulders", "triceps"],
  "Pec Deck": ["chest"],
  "Kabel-flyes": ["chest"],
  "Brystpress med manualer": ["chest", "shoulders", "triceps"],
  "Nedtrekk": ["lats", "upperBack", "biceps"],
  "Sittende roing": ["lats", "upperBack", "biceps"],
  "Bryststøttet roing": ["lats", "upperBack", "biceps"],
  "Rygghev-maskin": ["lowerBack", "glutes", "hamstrings"],
  "Assistert pull-up": ["lats", "upperBack", "biceps"],
  "Face pull": ["upperBack", "shoulders"],
  "Skulderpress": ["shoulders", "triceps"],
  "Triceps Pushdown": ["triceps"],
  "Biceps Curl": ["biceps"]
};
const muscleGroupsByCardioActivity = {
  "Tredemølle": ["glutes", "quads", "hamstrings", "calves"],
  "Sykling": ["glutes", "quads", "hamstrings", "calves"],
  "Gåtur": ["glutes", "quads", "hamstrings", "calves"],
  "Ellipsemaskin": ["glutes", "quads", "hamstrings", "calves"],
  "Stakemaskin": ["shoulders", "triceps", "upperBack", "lats", "abs"]
};
const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const groupClasses = [
  { name: "Yoga myk og rolig", category: "Kropp & sjel" },
  { name: "Pust & bekkenbunn", category: "Kropp & sjel" },
  { name: "Lymph Flow", category: "Kropp & sjel" },
  { name: "Pilates", category: "Kropp & sjel" },
  { name: "Voksen dans og bevegelse", category: "For alle" },
  { name: "Stram – sett og repetisjoner", category: "For alle" },
  { name: "Stram – styrke og mobilitet", category: "For alle" },
  { name: "Løpesterk", category: "For alle" },
  { name: "Overkropp", category: "For alle" },
  { name: "Core", category: "For alle" },
  { name: "Mage, rumpe og lår", category: "For alle" },
  { name: "Voksen styrke og stabilitet", category: "For alle" },
  { name: "Cross training", category: "Litt trent" },
  { name: "Styrke med stang", category: "Litt trent" },
  { name: "Løp", category: "Litt trent" },
  { name: "Spinn", category: "Litt trent" },
  { name: "Fredags Surprise", category: "Spesialtimer" },
  { name: "Spesialtime: dans", category: "Spesialtimer" }
];
const exercisePhotos = {
  Brystpress: "./images/brystpress-machine.png",
  Skulderpress: "./images/skulderpress-machine.png",
  "Pec Deck": "./images/pec-deck-machine.png",
  "Triceps Pushdown": "./images/triceps-machine.png",
  Nedtrekk: "./images/nedtrekk-machine.png",
  "Sittende roing": "./images/roing-machine.png",
  "Rygghev-maskin": "./images/back-extension-machine.png",
  "Biceps Curl": "./images/biceps-curl-machine.png",
  Beinpress: "./images/leg-press-machine.png",
  "Leg Curl": "./images/leg-curl-machine.png",
  "Leg Extension": "./images/leg-extension-machine.png",
  Magemaskin: "./images/ab-machine.png",
  "Roterende magemaskin": "./images/rotating-ab-machine.png"
};
const exercisePhotoAlt = {
  Brystpress: "Brystpressmaskin",
  Skulderpress: "Skulderpressmaskin",
  "Pec Deck": "Pec Deck-maskin",
  "Triceps Pushdown": "Tricepsmaskin",
  Nedtrekk: "Nedtrekksmaskin",
  "Sittende roing": "Ro-maskin",
  "Rygghev-maskin": "Rygghev-maskin",
  "Biceps Curl": "Biceps curl-maskin",
  Beinpress: "Beinpressmaskin",
  "Leg Curl": "Leg curl-maskin",
  "Leg Extension": "Leg extension-maskin",
  Magemaskin: "Magemaskin",
  "Roterende magemaskin": "Roterende magemaskin"
};
const workouts = [
  {
    day: "Mandag",
    title: "Bryst, skuldre og triceps",
    exercises: [
      { name: "Brystpress", detail: "3 sett × 10–12 repetisjoner", image: "chest-press", guide: "Sitt med ryggen mot puten. Skyv håndtakene frem fra brystet, og senk kontrollert tilbake." },
      { name: "Skulderpress", detail: "3 sett × 10–12 repetisjoner", image: "shoulder-press", guide: "Sitt med ryggen støttet. Press håndtakene opp over hodet uten å låse albuene." },
      { name: "Pec Deck", detail: "3 sett × 12 repetisjoner", image: "pec-deck", guide: "Hold en lett bøy i albuene. Før armene sammen foran brystet, og åpne rolig igjen." },
      { name: "Triceps Pushdown", detail: "3 sett × 12 repetisjoner", image: "triceps-pushdown", guide: "Hold albuene tett inntil kroppen. Press håndtaket ned til armene er nesten strake." },
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
      { name: "Roterende magemaskin", detail: "3 sett × 12 repetisjoner per side", image: "ab-machine", guide: "Sitt med ryggen mot puten og hold overkroppen stabil mot motstanden. Roter kontrollert til én side, og gjenta til den andre." }
    ]
  }
];

function defaultWorkoutPlan() {
  return Object.fromEntries(workouts.map((workout) => [
    workout.day,
    workout.exercises.map((exercise, index) => ({
      ...exercise,
      id: `${workout.day}-${index}`
    }))
  ]));
}

function defaultWorkoutSchedule() {
  return Object.fromEntries(workouts.map((workout) => [workout.day, workout.day]));
}

function normalizeWorkoutSchedule(savedSchedule) {
  const schedule = {};
  workouts.forEach((workout) => {
    const savedDay = savedSchedule?.[workout.day];
    const day = weekdays.includes(savedDay)
      ? savedDay
      : workout.day;
    schedule[workout.day] = day;
  });
  return schedule;
}

function normalizeWorkoutPlan(savedPlan) {
  const defaults = defaultWorkoutPlan();
  if (!savedPlan || typeof savedPlan !== "object" || Array.isArray(savedPlan)) return defaults;
  const validImages = new Set(workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => exercise.image)
  ));
  return Object.fromEntries(workouts.map((workout) => {
    const savedExercises = savedPlan[workout.day];
    if (!Array.isArray(savedExercises)) return [workout.day, defaults[workout.day]];
    const updatedExercises = savedExercises.map((exercise) => {
      if (workout.day !== "Fredag" || exercise?.id !== "Fredag-4" || exercise.name !== "Planke") return exercise;
      const replacement = defaults.Fredag.find((item) => item.name === "Roterende magemaskin");
      return { ...replacement, id: exercise.id };
    });
    const usedIds = new Set();
    const exercises = updatedExercises.filter((exercise) =>
      exercise && typeof exercise === "object" && !Array.isArray(exercise) &&
      typeof exercise.id === "string" && exercise.id.length > 0 && exercise.id.length <= 100 &&
      typeof exercise.name === "string" && exercise.name.trim().length > 0 && exercise.name.length <= 60 &&
      typeof exercise.detail === "string" && exercise.detail.trim().length > 0 && exercise.detail.length <= 120 &&
      (exercise.guide === undefined || typeof exercise.guide === "string") &&
      (exercise.image === undefined || exercise.image === "" || validImages.has(exercise.image)) &&
      (exercise.timed === undefined || typeof exercise.timed === "boolean") &&
      !usedIds.has(exercise.id) && usedIds.add(exercise.id)
    ).map((exercise) => ({
      id: exercise.id,
      name: exercise.name.trim(),
      detail: exercise.detail.trim(),
      guide: typeof exercise.guide === "string" ? exercise.guide.slice(0, 240) : "",
      image: validImages.has(exercise.image) ? exercise.image : "",
      timed: exercise.timed === true
    }));
    return [workout.day, exercises];
  }));
}

function migrateCompletedEntries(completed) {
  if (!completed || typeof completed !== "object" || Array.isArray(completed)) return {};
  const legacyDays = Object.fromEntries(workouts.map((workout) => [workout.day, workout]));
  return Object.fromEntries(Object.entries(completed).map(([date, entries]) => [
    date,
    Array.isArray(entries) ? entries.map((key) => {
      if (typeof key !== "string") return key;
      const match = key.match(/^(Mandag|Onsdag|Fredag)-(\d+)$/);
      const exercise = match && legacyDays[match[1]].exercises[Number(match[2])];
      return exercise ? `${match[1]}-${match[1]}-${Number(match[2])}` : key;
    }) : entries
  ]));
}

function workoutExerciseKey(day, exercise) {
  return `${day}-${exercise.id}`;
}

function migrateCompletedWorkouts(completed, workoutPlan) {
  return Object.entries(completed).flatMap(([date, entries]) => {
    if (!isValidStoredDate(date) || !Array.isArray(entries)) return [];
    return workouts
      .filter((workout) => {
        const exercises = workoutPlan[workout.day];
        return exercises.length > 0 && exercises.every((exercise) =>
          entries.includes(workoutExerciseKey(workout.day, exercise))
        );
      })
      .map((workout) => ({
        id: `legacy-${date}-${workout.day}`,
        workoutDay: workout.day,
        date,
        createdAt: new Date(`${date}T12:00:00`).toISOString()
      }));
  });
}

let state = loadState();
let installPrompt = null;
let toastTimer;
let photoObjectUrls = [];
let selectedStrengthExercise = "Brystpress";
const selectedWorkoutDates = {};
let restTimerInterval = null;
let restTimerEnd = null;
let editingRecord = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const legacyWeight = localStorage.getItem("weight");
    const legacyExercises = JSON.parse(localStorage.getItem("exercises") || "[]");
    const weights = Array.isArray(saved.weights) ? saved.weights : [];
    if (weights.length === 0 && legacyWeight && Number.isFinite(Number(legacyWeight))) {
      weights.push({ date: localDate(), value: Number(legacyWeight) });
    }
    const workoutPlan = normalizeWorkoutPlan(saved.workoutPlan);
    const completed = migrateCompletedEntries(saved.completed);
    return {
      weights,
      exercises: Array.isArray(saved.exercises)
        ? saved.exercises.filter((item) => typeof item === "string")
        : Array.isArray(legacyExercises) ? legacyExercises.filter((item) => typeof item === "string") : [],
      workoutPlan,
      workoutSchedule: normalizeWorkoutSchedule(saved.workoutSchedule),
      lifts: saved.lifts && typeof saved.lifts === "object" ? saved.lifts : {},
      completed,
      workoutSessions: Array.isArray(saved.workoutSessions)
        ? saved.workoutSessions.filter(isValidWorkoutSession)
        : migrateCompletedWorkouts(completed, workoutPlan),
      cardioSessions: Array.isArray(saved.cardioSessions) ? saved.cardioSessions.filter((entry) =>
        entry && typeof entry.id === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
        cardioActivities.includes(entry.activity) &&
        Number.isFinite(entry.duration) && entry.duration > 0 && entry.duration <= 600 &&
        isOptionalNumberInRange(entry.distance, 0, 1000) &&
        isOptionalNumberInRange(entry.speed, 0.1, 100) &&
        isOptionalNumberInRange(entry.incline, 0, 100) &&
        isOptionalIntegerInRange(entry.paceSeconds, 1, 5999) &&
        (entry.comment === undefined || (typeof entry.comment === "string" && entry.comment.length <= 500))
      ) : [],
      theme: saved.theme === "light" ? "light" : "dark",
      motivationNotifications: saved.motivationNotifications === true,
      motivationTime: ["08:00", "12:00", "18:00", "20:00"].includes(saved.motivationTime) ? saved.motivationTime : "18:00",
      motivationLastSent: typeof saved.motivationLastSent === "string" ? saved.motivationLastSent : ""
    };
  } catch (error) {
    console.error("Kunne ikke lese lagrede treningsdata.", error);
    return { weights: [], exercises: [], workoutPlan: defaultWorkoutPlan(), workoutSchedule: defaultWorkoutSchedule(), lifts: {}, completed: {}, workoutSessions: [], cardioSessions: [], theme: "dark", motivationNotifications: false, motivationTime: "18:00", motivationLastSent: "" };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const latest = state.weights[state.weights.length - 1];
    if (latest) localStorage.setItem("weight", String(latest.value));
    localStorage.setItem("exercises", JSON.stringify(state.exercises));
    return true;
  } catch (error) {
    console.error("Kunne ikke lagre treningsdata.", error);
    showToast("Dataene kunne ikke lagres. Kontroller lagringsplassen i nettleseren.");
    return false;
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
    const exercises = state.workoutPlan[workout.day];
    const scheduledDay = state.workoutSchedule[workout.day];
    const date = selectedWorkoutDates[workout.day] || localDate();
    const weekdaysOptions = weekdays.map((weekday) =>
      `<option value="${weekday}" ${weekday === scheduledDay ? "selected" : ""}>${weekday}</option>`
    ).join("");
    const rows = exercises.map((exercise) => {
      const key = workoutExerciseKey(workout.day, exercise);
      const checked = state.completed[date]?.includes(key);
      const savedWeight = state.lifts[date]?.[workout.day]?.[exercise.name] ?? "";
      const previousWeight = getPreviousLiftWeight(workout.day, exercise.name, date);
      const exercisePhoto = exercisePhotos[exercise.name];
      return `<li class="exercise">
        ${exercisePhoto
          ? `<img class="exercise-art" src="${exercisePhoto}" alt="${exercisePhotoAlt[exercise.name]}">`
          : exercise.image
          ? `<svg class="exercise-art" role="img" aria-label="Illustrasjon av ${escapeHtml(exercise.name)}"><use href="./images/exercises.svg?v=54#${escapeHtml(exercise.image)}"></use></svg>`
          : '<span class="exercise-art exercise-art-placeholder" aria-hidden="true">🏋️</span>'}
        <div class="exercise-main"><h3>${escapeHtml(exercise.name)}</h3><p>${escapeHtml(exercise.detail)}</p><p class="exercise-guide">${escapeHtml(exercise.guide)}</p>
          ${exercise.timed ? "" : `<div class="lift-entry"><label>Vekt <span>(kg)</span><input type="number" min="0.5" max="1000" step="0.5" inputmode="decimal" placeholder="${previousWeight === null ? "f.eks. 20" : formatWeight(previousWeight)}" value="${savedWeight}" data-lift-weight data-lift-day="${escapeHtml(workout.day)}" data-lift-exercise="${escapeHtml(exercise.name)}" aria-label="Løftet vekt i kilo for ${escapeHtml(exercise.name)}"></label>${previousWeight === null ? "" : `<span class="previous-lift">Forrige: ${formatWeight(previousWeight)} kg</span>`}</div>`}
        </div>
        <label class="exercise-check"><input type="checkbox" data-workout="${escapeHtml(key)}" ${checked ? "checked" : ""} aria-label="Marker ${escapeHtml(exercise.name)} som fullført"><span class="checkmark"></span></label>
        <button type="button" class="remove-plan-exercise" data-remove-plan-day="${escapeHtml(workout.day)}" data-remove-plan-id="${escapeHtml(exercise.id)}" aria-label="Fjern ${escapeHtml(exercise.name)} fra ${escapeHtml(workout.day)}">Fjern</button>
      </li>`;
    }).join("");
    return `<section class="card workout-card" data-workout-card="${workout.day}"><div class="workout-heading"><div><span class="day-label">${scheduledDay}${scheduledDay.toLowerCase() === today ? " · I dag" : ""}</span><h2>${escapeHtml(workout.title)}</h2></div><label class="workout-schedule-picker">Treningsdag<select data-workout-schedule="${workout.day}" aria-label="Velg ukedag for ${escapeHtml(workout.title)}">${weekdaysOptions}</select></label></div><div class="workout-log-controls"><label>Dato for økten<input type="date" data-workout-date="${workout.day}" value="${date}" max="${localDate()}"></label><button type="button" data-save-workout="${workout.day}">Lagre utført økt</button></div>${rows ? `<ul class="exercise-list">${rows}</ul>` : '<p class="exercise-empty">Ingen øvelser ennå. Legg til en øvelse i skjemaet nedenfor.</p>'}</section>`;
  }).join("");
}

function renderWorkoutDaySelectors() {
  const planDay = document.querySelector("#planExerciseDay");
  const selectedPlanDay = planDay.value;
  planDay.replaceChildren(...workouts.map((workout) => {
    const option = document.createElement("option");
    option.value = workout.day;
    option.textContent = `${state.workoutSchedule[workout.day]} · ${workout.title}`;
    option.selected = workout.day === selectedPlanDay;
    return option;
  }));

  const photoWorkout = document.querySelector("#photoWorkout");
  const selectedPhotoWorkout = photoWorkout.value;
  photoWorkout.replaceChildren(new Option("Egen fremgang", "Egen fremgang"), ...workouts.map((workout) => {
    const option = document.createElement("option");
    option.value = workout.day;
    option.textContent = state.workoutSchedule[workout.day];
    option.selected = workout.day === selectedPhotoWorkout;
    return option;
  }));
}

function saveWorkoutSession(workoutDay, date) {
  const workout = workouts.find((item) => item.day === workoutDay);
  if (!workout || !isValidStoredDate(date)) {
    showToast("Velg en gyldig treningsdato som ikke er i fremtiden.");
    return;
  }
  const exercises = state.workoutPlan[workoutDay];
  if (exercises.length === 0) {
    showToast("Legg minst én øvelse til i økten før du lagrer den.");
    return;
  }
  if (!Array.isArray(state.completed[date])) state.completed[date] = [];
  exercises.forEach((exercise) => {
    const key = workoutExerciseKey(workoutDay, exercise);
    if (!state.completed[date].includes(key)) state.completed[date].push(key);
  });
  state.workoutSessions.push({
    id: typeof crypto.randomUUID === "function"
      ? `workout-${crypto.randomUUID()}`
      : `workout-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    workoutDay,
    date,
    createdAt: new Date().toISOString()
  });
  if (!saveState()) return;
  renderWorkouts();
  renderWorkoutHistory();
  renderStats();
  showToast(`${workout.title} er lagret for ${formatDate(date)}.`);
}

function renderWorkoutHistory() {
  const sessions = [...state.workoutSessions].sort((first, second) =>
    second.date.localeCompare(first.date) ||
    (second.createdAt || "").localeCompare(first.createdAt || "")
  );
  renderWorkoutHistoryList(
    document.querySelector("#workoutHistory"),
    sessions.filter((session) => !session.groupClass),
    false,
    "strength"
  );
  renderWorkoutHistoryList(
    document.querySelector("#groupWorkoutHistory"),
    sessions.filter((session) => session.groupClass),
    true,
    "groups"
  );
}

function renderWorkoutHistoryList(history, sessions, isGroupClassHistory, historyType) {
  history.replaceChildren();
  if (!sessions.length) {
    const empty = document.createElement("li");
    empty.className = "cardio-empty";
    empty.textContent = isGroupClassHistory
      ? "Ingen gruppetimer er registrert ennå."
      : "Ingen styrkeøkter er lagret ennå.";
    history.append(empty);
    return;
  }
  const visibleSessions = expandedHistoryLists.has(historyType)
    ? sessions
    : sessions.slice(0, visibleHistoryLimit);
  visibleSessions.forEach((session) => {
    const workout = workouts.find((item) => item.day === session.workoutDay);
    const groupClass = groupClasses.find((item) => item.name === session.groupClass);
    if (!workout && !groupClass) return;
    const row = document.createElement("li");
    row.className = "workout-history-entry";
    const details = document.createElement("div");
    details.className = "workout-history-details";
    const sessionTitle = groupClass ? groupClass.name : workout.title;
    const title = document.createElement("strong");
    title.textContent = sessionTitle;
    const date = document.createElement("time");
    date.dateTime = session.date;
    date.textContent = formatDate(session.date);
    if (groupClass) {
      const category = document.createElement("span");
      category.className = "workout-history-category";
      category.textContent = `Gruppetime · ${groupClass.category}`;
      details.append(title, category, date);
    } else {
      details.append(title, date);
    }
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-cardio";
    remove.dataset.removeWorkoutSession = session.id;
    remove.textContent = "Slett";
    remove.setAttribute("aria-label", `Slett ${sessionTitle} fra ${formatDate(session.date)}`);
    row.append(details, remove);
    history.append(row);
  });
  appendHistoryToggle(history, historyType, sessions.length);
}

function appendHistoryToggle(list, historyType, total) {
  if (total <= visibleHistoryLimit) return;
  const row = document.createElement("li");
  row.className = "history-toggle-row";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "history-toggle";
  button.dataset.toggleHistory = historyType;
  button.textContent = expandedHistoryLists.has(historyType)
    ? "Vis færre"
    : `Vis alle ${total} økter`;
  row.append(button);
  list.append(row);
}

function toggleHistoryList(historyType) {
  if (expandedHistoryLists.has(historyType)) {
    expandedHistoryLists.delete(historyType);
  } else {
    expandedHistoryLists.add(historyType);
  }
  if (historyType === "cardio") {
    renderCardioSessions();
  } else {
    renderWorkoutHistory();
  }
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
  renderPlanExerciseOptions();
}

function renderPlanExerciseOptions() {
  const select = document.querySelector("#planExerciseName");
  const selectedName = select.value;
  const category = document.querySelector("#planExerciseCategory").value;
  const recommendations = exerciseRecommendations[category] || [];
  select.replaceChildren(new Option("Velg øvelse", ""));
  const day = document.querySelector("#planExerciseDay").value;
  const existingForDay = new Set(state.workoutPlan[day].map((exercise) => exercise.name.toLocaleLowerCase("no")));
  const plannedExercises = Array.from(new Set(workouts.flatMap((workout) =>
    state.workoutPlan[workout.day].map((exercise) => exercise.name)
  )));
  const recommendationNames = new Set(recommendations.map((item) => item.name.toLocaleLowerCase("no")));
  const plannedNames = new Set(plannedExercises.map((name) => name.toLocaleLowerCase("no")));
  const customExercises = state.exercises.filter((name) =>
    !plannedNames.has(name.toLocaleLowerCase("no")) &&
    !recommendationNames.has(name.toLocaleLowerCase("no"))
  );
  const addGroup = (label, exercises, isRecommendation = false) => {
    if (!exercises.length) return;
    const group = document.createElement("optgroup");
    group.label = label;
    exercises.forEach((exercise) => {
      const recommendation = isRecommendation ? exercise : recommendations.find((item) => item.name === exercise);
      const name = isRecommendation ? exercise.name : exercise;
      const option = new Option(
        recommendation ? `${name} · ${recommendation.equipment}` : name,
        name
      );
      option.disabled = existingForDay.has(name.toLocaleLowerCase("no"));
      option.dataset.muscles = (
        muscleGroupsByExercise[name] || muscleGroupsByCategory[category] || []
      ).join(",");
      option.dataset.equipment = recommendation?.equipment || name;
      option.dataset.equipmentImage = exercisePhotos[name] || "";
      if (recommendation) {
        option.dataset.detail = recommendation.detail;
        option.dataset.tip = recommendation.tip;
      }
      group.append(option);
    });
    select.append(group);
  };
  addGroup(`Forslag · ${category.toLocaleLowerCase("no")}`, recommendations, true);
  addGroup("Øvelser i treningsplanen", plannedExercises.filter((name) =>
    !recommendationNames.has(name.toLocaleLowerCase("no"))
  ));
  addGroup("Egne øvelser", customExercises);
  if (Array.from(select.options).some((option) => option.value === selectedName)) {
    select.value = selectedName;
  }
}

function showPlanExerciseTip() {
  const select = document.querySelector("#planExerciseName");
  const option = select.selectedOptions[0];
  const tip = document.querySelector("#planExerciseTip");
  const equipmentPreview = document.querySelector("#planEquipmentPreview");
  const equipmentImage = document.querySelector("#planEquipmentPhoto");
  const hasEquipmentPhoto = Boolean(option?.dataset.equipmentImage);
  equipmentPreview.hidden = !hasEquipmentPhoto;
  equipmentImage.hidden = !hasEquipmentPhoto;
  equipmentImage.alt = option?.dataset.equipment
    ? `Bilde av ${option.dataset.equipment}`
    : "";
  if (option?.dataset.equipmentImage) {
    equipmentImage.src = option.dataset.equipmentImage;
  } else {
    equipmentImage.removeAttribute("src");
  }
  document.querySelector("#planEquipmentLabel").textContent = option?.dataset.equipment || "Apparat";
  const selectedMuscles = (option?.dataset.muscles || "")
    .split(",")
    .filter((muscle) => muscleLabels[muscle]);
  const latestTraining = getLatestMuscleTraining();
  document.querySelectorAll(".plan-exercise-help .muscle-map [data-muscle]").forEach((region) => {
    const isSelected = selectedMuscles.includes(region.dataset.muscle);
    const training = latestTraining.get(region.dataset.muscle);
    region.classList.toggle("is-active", isSelected);
    if (isSelected) {
      region.dataset.recoveryStatus = training
        ? getRecoveryStatus(getRecoveryPercent(training.date))
        : "unknown";
    } else {
      delete region.dataset.recoveryStatus;
    }
  });
  document.querySelector("#planMuscleLabels").textContent = selectedMuscles.length
    ? selectedMuscles.map((muscle) => muscleLabels[muscle]).join(" · ")
    : "Velg en øvelse for å se musklene som trenes.";
  renderPlanExerciseRecovery(selectedMuscles);
  if (!option?.value) {
    tip.textContent = "Velg en muskelgruppe og øvelse for å se tips.";
    return;
  }
  const recommendation = option.dataset.tip;
  tip.textContent = recommendation
    ? `${option.dataset.equipment}: ${recommendation} Start lett, øk gradvis og stopp hvis du får smerter.`
    : "Tips: Velg en vekt du kan løfte med kontroll, og be gjerne en instruktør vise riktig innstilling.";
}

function renderPlanExerciseRecovery(muscles) {
  const container = document.querySelector("#planExerciseRecovery");
  container.replaceChildren();
  if (!muscles.length) {
    container.textContent = "Velg en øvelse for å se restitusjonsstatus.";
    return;
  }

  const heading = document.createElement("strong");
  heading.textContent = "Restitusjon nå (veiledende)";
  const statuses = document.createElement("div");
  statuses.className = "plan-muscle-recovery-list";
  const latestTraining = getLatestMuscleTraining();

  muscles.forEach((muscle) => {
    const training = latestTraining.get(muscle);
    const status = document.createElement("span");
    status.className = "plan-muscle-recovery";
    if (!training) {
      status.textContent = `${muscleLabels[muscle]}: Ingen økt logget`;
      status.dataset.recoveryStatus = "unknown";
    } else {
      const percent = getRecoveryPercent(training.date);
      status.textContent = `${muscleLabels[muscle]}: ${percent}%`;
      status.dataset.recoveryStatus = getRecoveryStatus(percent);
      status.setAttribute("aria-label", `${muscleLabels[muscle]}: ${percent}% restituert, veiledende`);
    }
    statuses.append(status);
  });

  container.append(heading, statuses, createRecoveryLegend());
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
    const date = document.createElement("span");
    date.textContent = formatDate(entry.date);
    const value = document.createElement("strong");
    value.textContent = `${formatWeight(entry.value)} kg`;
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "history-edit";
    edit.dataset.editType = "weight";
    edit.dataset.editDate = entry.date;
    edit.textContent = "Rediger";
    item.append(date, value, edit);
    list.append(item);
  });
  const change = history.length > 1 ? latest.value - history[0].value : null;
  document.querySelector("#weightChange").textContent = change === null
    ? "–" : `${change > 0 ? "+" : ""}${formatWeight(change)} kg`;
  renderProgressCharts();
}

function renderProgressCharts() {
  const history = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const range = getProgressDateRange("weight", history.map((entry) => entry.date));
  renderChart(
    range.valid ? history.filter((entry) => entry.date >= range.startDate && entry.date <= range.endDate) : [],
    range
  );
  renderStrengthProgress();
  renderCardioProgress();
}

function getProgressDateRange(prefix, availableDates) {
  const period = document.querySelector(`#${prefix}Period`).value;
  const today = localDate();
  let startDate;
  let endDate = today;
  let error = "";

  if (period === "custom") {
    startDate = document.querySelector(`#${prefix}DateFrom`).value;
    endDate = document.querySelector(`#${prefix}DateTo`).value;
    if (!startDate || !endDate) {
      error = "Velg både fra- og til-dato.";
    } else if (startDate > endDate) {
      error = "Fra-dato må være før til-dato.";
    } else if (endDate > today) {
      error = "Til-dato kan ikke være i fremtiden.";
    }
  } else if (period === "all") {
    startDate = availableDates.length ? availableDates.reduce((earliest, date) => date < earliest ? date : earliest) : today;
  } else {
    const from = new Date(`${today}T12:00:00`);
    from.setDate(from.getDate() - Number(period) + 1);
    startDate = localDate(from);
  }

  const custom = document.querySelector(`#${prefix}CustomDates`);
  custom.hidden = period !== "custom";
  custom.querySelectorAll("input").forEach((input) => { input.max = today; });
  const message = document.querySelector(`#${prefix}PeriodMessage`);
  message.textContent = period === "custom" ? error : "";
  return { startDate, endDate, error, valid: !error };
}

function renderStrengthProgress() {
  const select = document.querySelector("#strengthExercise");
  const liftableExercises = workouts.flatMap((workout) =>
    state.workoutPlan[workout.day].filter((exercise) => !exercise.timed).map((exercise) => exercise.name)
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
  const range = getProgressDateRange("strength", history.map((entry) => entry.date));
  const filteredHistory = range.valid
    ? history.filter((entry) => entry.date >= range.startDate && entry.date <= range.endDate)
    : [];

  const summary = document.querySelector("#strengthSummary");
  const chart = document.querySelector("#strengthChart");
  const historyList = document.querySelector("#strengthHistory");
  chart.replaceChildren();
  historyList.replaceChildren();
  chart.setAttribute("aria-label", `Graf over registrert løftevekt i ${selectedStrengthExercise}`);

  if (filteredHistory.length === 0) {
    summary.textContent = range.error || "Registrer vekten på øvelsen under «Trening» for å starte grafen.";
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = range.error ? "Kontroller datoperioden for å vise grafen." : "Ingen registrerte løftevekter i valgt periode.";
    chart.append(empty);
    return;
  }

  const first = filteredHistory[0];
  const latest = filteredHistory[filteredHistory.length - 1];
  const change = latest.weight - first.weight;
  if (filteredHistory.length === 1) {
    summary.textContent = `Siste registrering i valgt periode: ${formatWeight(latest.weight)} kg · Legg inn en ny økt for å se utviklingen.`;
  } else {
    const direction = change > 0 ? "sterkere med" : change < 0 ? "endring på" : "samme vekt";
    summary.textContent = `${filteredHistory.length} økter · ${formatWeight(first.weight)} → ${formatWeight(latest.weight)} kg (${direction} ${formatWeight(Math.abs(change))} kg)`;
  }

  drawStrengthChart(chart, filteredHistory, selectedStrengthExercise);
  [...filteredHistory].reverse().slice(0, 8).forEach((entry) => {
    const row = document.createElement("li");
    const date = document.createElement("span");
    date.textContent = formatDate(entry.date);
    const weight = document.createElement("strong");
    weight.textContent = `${formatWeight(entry.weight)} kg`;
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "history-edit";
    edit.dataset.editType = "lift";
    edit.dataset.editDate = entry.date;
    edit.dataset.editDay = workouts.find((workout) =>
      Number.isFinite(state.lifts[entry.date]?.[workout.day]?.[selectedStrengthExercise])
    )?.day || "";
    edit.dataset.editExercise = selectedStrengthExercise;
    edit.textContent = "Rediger";
    row.append(date, weight, edit);
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
  const dateLabelStep = Math.max(1, Math.ceil(points.length / 6));
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

    if (index % dateLabelStep === 0 || index === points.length - 1) {
      const date = document.createElementNS(svg.namespaceURI, "text");
      date.setAttribute("x", point.x);
      date.setAttribute("y", height - 12);
      date.setAttribute("text-anchor", "middle");
      date.setAttribute("class", "strength-axis-label");
      date.textContent = new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short" })
        .format(new Date(`${point.date}T12:00:00`));
      svg.append(date);
    }
  });
  container.append(svg);
}

function renderChart(history, range) {
  const container = document.querySelector("#weightChart");
  container.replaceChildren();
  if (range.error) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Kontroller datoperioden for å vise grafen.";
    container.append(empty);
    return;
  }
  if (history.length < 2) {
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = history.length ? "Legg inn en måling til i valgt periode for å se utviklingen." : "Ingen vektmålinger i valgt periode.";
    container.append(empty);
    return;
  }

  const values = history;
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

function renderCardioProgress() {
  const activity = document.querySelector("#cardioFilter").value;
  const matchingSessions = state.cardioSessions.filter((session) =>
    activity === "Alle" || session.activity === activity
  );
  const range = getProgressDateRange("cardio", matchingSessions.map((session) => session.date));
  const sessions = range.valid ? matchingSessions.filter((session) =>
    session.date >= range.startDate && session.date <= range.endDate
  ) : [];
  const totalDurationSeconds = sessions.reduce((total, session) => total + Math.round(session.duration * 60), 0);
  const totalDistance = sessions.reduce((total, session) => total + (session.distance || 0), 0);
  const hasDistance = sessions.some((session) => session.distance !== undefined);
  document.querySelector("#cardioProgressCount").textContent = String(sessions.length);
  document.querySelector("#cardioProgressDuration").textContent = formatDuration(totalDurationSeconds);
  document.querySelector("#cardioProgressDistance").textContent = hasDistance ? `${formatDistance(totalDistance)} km` : "–";

  const chart = document.querySelector("#cardioChart");
  chart.replaceChildren();
  chart.setAttribute("aria-label", `Kondisjonsdistanse ${activity === "Alle" ? "for alle aktiviteter" : `for ${activity}`}`);
  const summary = document.querySelector("#cardioChartSummary");
  if (range.error) {
    summary.textContent = range.error;
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Kontroller datoperioden for å vise grafen.";
    chart.append(empty);
    return;
  }
  if (!sessions.length) {
    summary.textContent = `Ingen økter i valgt periode${activity === "Alle" ? "." : ` for ${activity}.`}`;
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "Kondisjonsgrafen vises når du registrerer økter.";
    chart.append(empty);
    return;
  }
  summary.textContent = `${sessions.length} økter · ${formatDuration(totalDurationSeconds)}${hasDistance ? ` · ${formatDistance(totalDistance)} km` : ""}`;

  const rangeDays = Math.floor((new Date(`${range.endDate}T12:00:00`) - new Date(`${range.startDate}T12:00:00`)) / 86400000) + 1;
  const bucket = rangeDays > 730 ? "month" : rangeDays > 60 ? "week" : "day";
  const bucketedDistance = new Map();
  const bucketForDate = (date) => {
    if (bucket === "month") return `${date.slice(0, 7)}-01`;
    if (bucket === "week") {
      const offset = Math.floor((new Date(`${date}T12:00:00`) - new Date(`${range.startDate}T12:00:00`)) / 86400000);
      const start = new Date(`${range.startDate}T12:00:00`);
      start.setDate(start.getDate() + Math.floor(offset / 7) * 7);
      return localDate(start);
    }
    return date;
  };
  sessions.forEach((session) => {
    const key = bucketForDate(session.date);
    bucketedDistance.set(key, (bucketedDistance.get(key) || 0) + (session.distance || 0));
  });
  const history = [];
  if (bucket === "day") {
    for (let index = 0; index < rangeDays; index++) {
      const date = new Date(`${range.startDate}T12:00:00`);
      date.setDate(date.getDate() + index);
      const key = localDate(date);
      history.push({ date: key, distance: bucketedDistance.get(key) || 0 });
    }
  } else if (bucket === "week") {
    for (let index = 0; index < rangeDays; index += 7) {
      const date = new Date(`${range.startDate}T12:00:00`);
      date.setDate(date.getDate() + index);
      const key = localDate(date);
      history.push({ date: key, distance: bucketedDistance.get(key) || 0 });
    }
  } else {
    const month = new Date(`${range.startDate.slice(0, 7)}-01T12:00:00`);
    const lastMonth = range.endDate.slice(0, 7);
    while (localDate(month).slice(0, 7) <= lastMonth) {
      const key = localDate(month);
      history.push({ date: key, distance: bucketedDistance.get(key) || 0 });
      month.setMonth(month.getMonth() + 1);
    }
  }
  drawCardioChart(chart, history, activity);
}

function drawCardioChart(container, history, activity) {
  const width = 520;
  const height = 230;
  const margin = { top: 20, right: 14, bottom: 42, left: 48 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const highest = Math.max(...history.map((entry) => entry.distance), 0);
  const max = highest > 0 ? highest * 1.15 : 1;
  const slotWidth = plotWidth / history.length;
  const barWidth = Math.max(2, Math.min(26, slotWidth * 0.62));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${activity === "Alle" ? "Alle aktiviteter" : activity}: ${history.filter((entry) => entry.distance > 0).map((entry) => `${formatDate(entry.date)} ${formatDistance(entry.distance)} kilometer`).join(", ")}`);

  for (let index = 0; index <= 4; index++) {
    const y = margin.top + plotHeight * index / 4;
    const value = max - max * index / 4;
    const grid = document.createElementNS(svg.namespaceURI, "line");
    grid.setAttribute("x1", margin.left);
    grid.setAttribute("x2", width - margin.right);
    grid.setAttribute("y1", y);
    grid.setAttribute("y2", y);
    grid.setAttribute("class", "strength-grid");
    svg.append(grid);
    const label = document.createElementNS(svg.namespaceURI, "text");
    label.setAttribute("x", margin.left - 7);
    label.setAttribute("y", y + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("class", "strength-axis-label");
    label.textContent = formatDistance(value);
    svg.append(label);
  }

  const labelStep = Math.max(1, Math.ceil(history.length / 6));
  history.forEach((entry, index) => {
    const x = margin.left + slotWidth * index + (slotWidth - barWidth) / 2;
    const barHeight = entry.distance / max * plotHeight;
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", x);
    bar.setAttribute("y", margin.top + plotHeight - barHeight);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", Math.max(barHeight, entry.distance > 0 ? 1 : 0));
    bar.setAttribute("rx", "2");
    bar.setAttribute("class", "cardio-bar");
    if (entry.distance > 0) {
      const title = document.createElementNS(svg.namespaceURI, "title");
      title.textContent = `${formatDate(entry.date)}: ${formatDistance(entry.distance)} km`;
      bar.append(title);
    }
    svg.append(bar);

    if (index % labelStep === 0 || index === history.length - 1) {
      const label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", x + barWidth / 2);
      label.setAttribute("y", height - 12);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "strength-axis-label");
      label.textContent = entry.date.slice(8, 10) === "01" && history.length > 12
        ? new Intl.DateTimeFormat("no-NO", { month: "short", year: "2-digit" }).format(new Date(`${entry.date}T12:00:00`))
        : new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short" }).format(new Date(`${entry.date}T12:00:00`));
      svg.append(label);
    }
  });
  container.append(svg);
}

function renderGroupClassStats() {
  const period = document.querySelector("#groupClassPeriod").value;
  const today = localDate();
  const startDate = period === "all"
    ? ""
    : (() => {
      const from = new Date(`${today}T12:00:00`);
      from.setDate(from.getDate() - Number(period) + 1);
      return localDate(from);
    })();
  const sessions = state.workoutSessions.filter((session) =>
    session.groupClass && (!startDate || (session.date >= startDate && session.date <= today))
  );
  const counts = new Map(groupClasses.map((item) => [item.name, 0]));
  sessions.forEach((session) => counts.set(session.groupClass, (counts.get(session.groupClass) || 0) + 1));
  const ranked = groupClasses
    .map((item) => ({ ...item, count: counts.get(item.name) || 0 }))
    .filter((item) => item.count > 0)
    .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name, "no"));
  const favorite = ranked[0];
  const periodText = period === "all" ? "hele perioden" : `de siste ${period} dagene`;
  document.querySelector("#groupClassCount").textContent = String(sessions.length);
  document.querySelector("#groupClassVariety").textContent = String(ranked.length);
  document.querySelector("#groupClassFavorite").textContent = favorite ? favorite.name : "–";
  document.querySelector("#groupClassSummary").textContent = sessions.length
    ? `${sessions.length} deltakelser ${periodText}${favorite ? ` · Mest besøkt: ${favorite.name} (${favorite.count})` : ""}.`
    : `Ingen registrerte gruppetimer ${periodText}.`;

  const breakdown = document.querySelector("#groupClassBreakdown");
  breakdown.replaceChildren();
  if (!ranked.length) {
    const empty = document.createElement("li");
    empty.className = "cardio-empty";
    empty.textContent = "Registrerte timer vises her, sortert etter antall deltakelser.";
    breakdown.append(empty);
    return;
  }
  const maxCount = ranked[0].count;
  ranked.forEach((item) => {
    const row = document.createElement("li");
    row.className = "group-class-stat";
    const labels = document.createElement("div");
    labels.className = "group-class-stat-labels";
    const name = document.createElement("span");
    name.textContent = item.name;
    const count = document.createElement("strong");
    count.textContent = String(item.count);
    labels.append(name, count);
    const track = document.createElement("div");
    track.className = "group-class-stat-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${item.name}: ${item.count} deltakelser`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(maxCount));
    track.setAttribute("aria-valuenow", String(item.count));
    const fill = document.createElement("span");
    fill.style.width = `${item.count / maxCount * 100}%`;
    track.append(fill);
    const category = document.createElement("small");
    category.textContent = item.category;
    row.append(labels, track, category);
    breakdown.append(row);
  });
}

function renderStats() {
  const count = state.workoutSessions.length;
  document.querySelector("#workoutCount").textContent = String(count);
  document.querySelector("#progressWorkoutCount").textContent = String(count);
  const day = new Intl.DateTimeFormat("no-NO", { weekday: "long" }).format(new Date());
  const todaysWorkout = workouts.find((workout) => state.workoutSchedule[workout.day].toLowerCase() === day);
  document.querySelector("#todayWorkout").textContent = todaysWorkout ? state.workoutSchedule[todaysWorkout.day] : "Hviledag";
  renderGroupClassStats();
  renderRecovery();
  showPlanExerciseTip();
}

function getDaysSinceRecovery(date) {
  const [year, month, day] = localDate().split("-").map(Number);
  const [trainedYear, trainedMonth, trainedDay] = date.split("-").map(Number);
  return Math.max(0, Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(trainedYear, trainedMonth - 1, trainedDay)) / 86400000
  ));
}

function getRecoveryPercent(date) {
  if (!date) return null;
  return Math.min(100, Math.round(getDaysSinceRecovery(date) / 2 * 100));
}

function getRecoveryStatus(percent) {
  if (percent >= 100) return "ready";
  if (percent <= 0) return "resting";
  return "recovering";
}

function createRecoveryLegend() {
  const legend = document.createElement("div");
  legend.className = "muscle-recovery-legend";
  legend.setAttribute("role", "group");
  legend.setAttribute("aria-label", "Fargeforklaring for restitusjon");
  [
    ["resting", "0% · Ikke klar"],
    ["recovering", "50% · Restituerer"],
    ["ready", "100% · Klar"]
  ].forEach(([status, label]) => {
    const item = document.createElement("span");
    item.dataset.recoveryStatus = status;
    item.textContent = label;
    legend.append(item);
  });
  return legend;
}

function getLatestMuscleTraining() {
  const latestTraining = new Map();
  const exerciseMuscles = new Map();
  const equipmentByExercise = Object.fromEntries(
    Object.values(exerciseRecommendations).flat().map(({ name, equipment }) => [name, equipment])
  );
  Object.assign(equipmentByExercise, {
    "Skulderpress": "Skulderpressmaskin",
    "Triceps Pushdown": "Kabelapparat",
    "Biceps Curl": "Bicepscurlmaskin"
  });

  workouts.forEach(({ day }) => {
    (state.workoutPlan[day] || []).forEach((exercise) => {
      exerciseMuscles.set(workoutExerciseKey(day, exercise), {
        name: exercise.name,
        equipment: equipmentByExercise[exercise.name] || exercise.name,
        muscles: muscleGroupsByExercise[exercise.name] || [],
        type: "strength"
      });
    });
  });

  const recordTraining = (muscle, date, exercise) => {
    const previous = latestTraining.get(muscle);
    if (!previous || date > previous.date) {
      latestTraining.set(muscle, { date, exercises: [exercise] });
    } else if (date === previous.date &&
      !previous.exercises.some((item) => item.name === exercise.name && item.type === exercise.type)) {
      previous.exercises.push(exercise);
    }
  };

  Object.entries(state.completed).forEach(([date, entries]) => {
    if (!isValidStoredDate(date) || !Array.isArray(entries)) return;
    entries.forEach((key) => {
      const exercise = exerciseMuscles.get(key);
      exercise?.muscles.forEach((muscle) => {
        recordTraining(muscle, date, exercise);
      });
    });
  });

  state.cardioSessions.forEach((session) => {
    if (!isValidStoredDate(session.date)) return;
    const muscles = muscleGroupsByCardioActivity[session.activity] || [];
    const activity = {
      name: session.activity,
      equipment: session.activity,
      muscles,
      type: "cardio"
    };
    muscles.forEach((muscle) => recordTraining(muscle, session.date, activity));
  });

  return latestTraining;
}

function renderRecoveryMuscleMap(muscles) {
  const container = document.querySelector("#recoveryMuscleMap");
  const source = document.querySelector(".muscle-map");
  const map = source.cloneNode(true);
  map.classList.add("recovery-muscle-map-svg");
  map.setAttribute("role", "img");
  map.setAttribute("aria-label", muscles.length
    ? `Kroppskart med muskelgrupper og restitusjonsfarge trent siste 7 dager: ${muscles.map(([muscle, training]) => `${muscleLabels[muscle]} ${getRecoveryPercent(training.date)} prosent`).join(", ")}`
    : "Kroppskart for muskelgrupper trent den siste tiden");
  map.removeAttribute("aria-labelledby");
  map.querySelector("title").textContent = "Muskelgrupper trent siste 7 dager";
  map.querySelector("desc").textContent = "Rødt viser 0 prosent, oransje 50 prosent, og grønt 100 prosent veiledende restitusjon. Både styrke og kondisjonsøkter inngår.";
  map.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  map.querySelectorAll("[data-muscle]").forEach((region) => {
    const entry = muscles.find(([muscle]) => muscle === region.dataset.muscle);
    region.classList.toggle("is-active", Boolean(entry));
    if (entry) {
      region.dataset.recoveryStatus = getRecoveryStatus(getRecoveryPercent(entry[1].date));
    } else {
      delete region.dataset.recoveryStatus;
    }
  });
  container.replaceChildren(map, createRecoveryLegend());
}

function renderRecovery() {
  const list = document.querySelector("#recoveryList");
  const latestTraining = getLatestMuscleTraining();
  const recentGroups = [...latestTraining.entries()]
    .filter(([, training]) => getDaysSinceRecovery(training.date) <= 7)
    .sort(([firstMuscle, firstDate], [secondMuscle, secondDate]) =>
      secondDate.date.localeCompare(firstDate.date) ||
      muscleLabels[firstMuscle].localeCompare(muscleLabels[secondMuscle], "no")
    );

  renderRecoveryMuscleMap(recentGroups);
  list.replaceChildren();
  if (!recentGroups.length) {
    const empty = document.createElement("li");
    empty.className = "recovery-empty";
    empty.textContent = "Ingen styrke- eller kondisjonsøkter med kjente muskelgrupper er registrert den siste tiden. Loggfør øktene dine for å følge restitusjonen her.";
    list.append(empty);
    renderRecoveryWorkoutTip(latestTraining);
    return;
  }

  recentGroups.forEach(([muscle, training]) => {
    const { date, exercises } = training;
    const percent = getRecoveryPercent(date);
    const status = getRecoveryStatus(percent);
    const row = document.createElement("li");
    row.className = "recovery-item";
    row.dataset.recoveryStatus = status;

    const heading = document.createElement("div");
    heading.className = "recovery-item-heading";
    const name = document.createElement("strong");
    name.textContent = muscleLabels[muscle];
    const percentage = document.createElement("span");
    percentage.textContent = `${percent}%`;
    heading.append(name, percentage);

    const track = document.createElement("div");
    track.className = "recovery-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${muscleLabels[muscle]}: ${percent}% restituert, veiledende`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(percent));
    const fill = document.createElement("span");
    fill.style.width = `${percent}%`;
    track.append(fill);

    const details = document.createElement("small");
    const trainedDate = new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short" })
      .format(new Date(`${date}T12:00:00`));
    const remainingHours = Math.max(0, 48 - getDaysSinceRecovery(date) * 24);
    const recoveryText = percent === 100
      ? "Klar etter standardanslaget"
      : remainingHours === 24 ? "Omtrent ett døgn igjen"
        : remainingHours === 48 ? "Trent i dag · omtrent to døgn igjen"
          : "Trent i går · omtrent ett døgn igjen";
    details.textContent = `Sist trent ${trainedDate} · ${recoveryText}`;
    const lastExercise = document.createElement("small");
    const strengthEntries = exercises.filter((exercise) => exercise.type !== "cardio");
    const cardioEntries = exercises.filter((exercise) => exercise.type === "cardio");
    const lastTrainingDetails = [];
    if (strengthEntries.length) {
      const names = [...new Set(strengthEntries.map((exercise) => exercise.name))];
      const equipment = [...new Set(strengthEntries.map((exercise) => exercise.equipment))];
      lastTrainingDetails.push(`Styrke: ${names.join(", ")} · Apparat: ${equipment.join(", ")}`);
    }
    if (cardioEntries.length) {
      const activities = [...new Set(cardioEntries.map((exercise) => exercise.name))];
      lastTrainingDetails.push(`O2: ${activities.join(", ")}`);
    }
    lastExercise.textContent = `Sist trent med: ${lastTrainingDetails.join(" · ")}`;
    lastExercise.className = "recovery-last-exercise";
    row.append(heading, track, details, lastExercise);
    list.append(row);
  });
  renderRecoveryWorkoutTip(latestTraining);
}

function renderRecoveryWorkoutTip(latestTraining) {
  const container = document.querySelector("#recoveryWorkoutTip");
  container.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Treningstips ut fra restitusjonen";
  const workoutOptions = workouts.map((workout) => {
    const exercises = state.workoutPlan[workout.day] || [];
    const muscles = [...new Set(exercises.flatMap((exercise) =>
      muscleGroupsByExercise[exercise.name] || []
    ))];
    const trackedMuscles = muscles.filter((muscle) => latestTraining.has(muscle));
    const recoveredMuscles = trackedMuscles.filter((muscle) =>
      getRecoveryPercent(latestTraining.get(muscle).date) === 100
    );
    const restingMuscles = trackedMuscles.filter((muscle) =>
      getRecoveryPercent(latestTraining.get(muscle).date) < 100
    );
    return { workout, exercises, muscles, trackedMuscles, recoveredMuscles, restingMuscles };
  });
  const fullyReady = workoutOptions
    .filter((option) => option.exercises.length && option.restingMuscles.length === 0)
    .sort((first, second) =>
      second.recoveredMuscles.length - first.recoveredMuscles.length ||
      second.muscles.length - first.muscles.length
    );

  const message = document.createElement("p");
  if (fullyReady.length && fullyReady[0].trackedMuscles.length) {
    const recommendation = fullyReady[0];
    const name = document.createElement("strong");
    name.textContent = `Forslag: ${recommendation.workout.title}. `;
    message.append(name, document.createTextNode(
      `Muskelgruppene som er loggført for denne økten, er beregnet til 100 % restitusjon.`
    ));
    if (recommendation.muscles.length > recommendation.trackedMuscles.length) {
      message.append(document.createTextNode(
        " Noen muskler i økten mangler treningslogg, så vurder dagsformen for dem."
      ));
    }
  } else if (fullyReady.length) {
    message.textContent = "Det finnes ikke nok treningslogg til å beregne restitusjon for styrkeøktene ennå. Loggfør øvelsene, eller velg en lett økt etter dagsform.";
  } else {
    const readyMuscles = [...latestTraining.entries()]
      .filter(([, training]) => getRecoveryPercent(training.date) === 100)
      .map(([muscle]) => muscleLabels[muscle]);
    message.textContent = readyMuscles.length
      ? `Ingen av styrkeøktene i planen er helt restituert ennå. ${readyMuscles.join(", ")} er klare; vurder å vente med økter som belaster de andre muskelgruppene.`
      : "De loggførte muskelgruppene er fortsatt i restitusjon. Vurder hvile eller rolig bevegelighet i dag, og vent med å belaste dem hardt.";
  }

  const note = document.createElement("small");
  note.textContent = "Dette er et enkelt anslag ut fra treningsdato, ikke en måling av kroppen. Avslutt eller tilpass økten hvis du kjenner smerter eller uvanlig slitenhet.";
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.showStrengthPlan = "";
  button.textContent = "Se styrkeøktene i planen";
  container.append(heading, message, note, button);
}

function setTrainingFilter(category) {
  const selected = ["cardio", "strength", "groups"].includes(category) ? category : "cardio";
  document.querySelectorAll("[data-training-category]").forEach((panel) => {
    panel.hidden = panel.dataset.trainingCategory !== selected;
  });
  document.querySelectorAll("[data-training-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.trainingFilter === selected));
  });
}

function render() {
  renderWorkoutDaySelectors();
  renderWorkouts();
  renderWorkoutHistory();
  renderCardioSessions();
  renderExercises();
  renderWeights();
  renderStats();
  document.documentElement.dataset.theme = state.theme;
  document.querySelector("#themeToggle").checked = state.theme === "dark";
  renderMotivationSettings();
}

function renderCardioSessions() {
  const history = document.querySelector("#cardioHistory");
  history.replaceChildren();
  const sessions = [...state.cardioSessions].sort((first, second) =>
    second.date.localeCompare(first.date) ||
    (second.createdAt || "").localeCompare(first.createdAt || "")
  );
  if (sessions.length === 0) {
    const empty = document.createElement("li");
    empty.className = "cardio-empty";
    empty.textContent = "Ingen kondisjonsøkter registrert ennå.";
    history.append(empty);
    return;
  }
  const visibleSessions = expandedHistoryLists.has("cardio")
    ? sessions
    : sessions.slice(0, visibleHistoryLimit);
  visibleSessions.forEach((session) => {
    const item = document.createElement("li");
    item.className = "cardio-entry";
    const details = document.createElement("div");
    details.className = "cardio-entry-details";
    const activity = document.createElement("strong");
    activity.textContent = session.activity;
    const date = document.createElement("time");
    date.dateTime = session.date;
    date.textContent = formatDate(session.date);
    const measurements = document.createElement("span");
    measurements.textContent = `${formatDuration(Math.round(session.duration * 60))}${session.distance === undefined ? "" : ` · ${formatDistance(session.distance)} km`}`;
    const metrics = [];
    if (session.speed !== undefined) metrics.push(`${formatDistance(session.speed)} km/t`);
    if (session.incline !== undefined) metrics.push(`${formatDistance(session.incline)} % stigning`);
    if (session.paceSeconds !== undefined) metrics.push(`${formatPace(session.paceSeconds)} min/km`);
    if (metrics.length) measurements.textContent += ` · ${metrics.join(" · ")}`;
    details.append(activity, date, measurements);
    if (session.comment) {
      const comment = document.createElement("span");
      comment.className = "cardio-entry-comment";
      comment.textContent = session.comment;
      details.append(comment);
    }
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-cardio";
    remove.dataset.removeCardio = session.id;
    remove.setAttribute("aria-label", `Slett ${session.activity} ${formatDate(session.date)}`);
    remove.textContent = "Slett";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "history-edit";
    edit.dataset.editType = "cardio";
    edit.dataset.editId = session.id;
    edit.textContent = "Rediger";
    const actions = document.createElement("div");
    actions.className = "history-actions";
    actions.append(edit, remove);
    item.append(details, actions);
    history.append(item);
  });
  appendHistoryToggle(history, "cardio", sessions.length);
}

function appendEditField(container, labelText, name, value, type, options = {}) {
  const label = document.createElement("label");
  label.className = "edit-field";
  label.textContent = labelText;
  let input;
  if (options.choices) {
    input = document.createElement("select");
    options.choices.forEach((choice) => {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice;
      input.append(option);
    });
  } else if (type === "textarea") {
    input = document.createElement("textarea");
  } else {
    input = document.createElement("input");
    input.type = type;
  }
  input.name = name;
  input.required = options.required !== false;
  input.value = value === undefined || value === null ? "" : String(value);
  if (options.min !== undefined) input.min = String(options.min);
  if (options.max !== undefined) input.max = String(options.max);
  if (options.step !== undefined) input.step = String(options.step);
  if (options.placeholder !== undefined) input.placeholder = options.placeholder;
  if (options.maxLength !== undefined) input.maxLength = options.maxLength;
  if (type === "date") input.max = localDate();
  label.append(input);
  container.append(label);
}

function openEditDialog(type, record) {
  const fields = document.querySelector("#editFields");
  fields.replaceChildren();
  document.querySelector("#editError").textContent = "";
  editingRecord = { type, ...record };
  const title = document.querySelector("#editDialogTitle");
  if (type === "weight") {
    title.textContent = "Rediger kroppsvekt";
    appendEditField(fields, "Vekt (kg)", "value", record.value, "number", { min: 1, max: 500, step: 0.1 });
    appendEditField(fields, "Dato", "date", record.date, "date");
  } else if (type === "cardio") {
    title.textContent = "Rediger kondisjonsøkt";
    appendEditField(fields, "Aktivitet", "activity", record.activity, "select", {
      choices: cardioActivities
    });
    const durationSeconds = Math.round(record.duration * 60);
    appendEditField(fields, "Tid (minutter)", "minutes", Math.floor(durationSeconds / 60), "number", { min: 0, max: 600, step: 1, required: false });
    appendEditField(fields, "Sekunder", "seconds", durationSeconds % 60, "number", { min: 0, max: 59, step: 1, required: false });
    appendEditField(fields, "Distanse (km)", "distance", record.distance, "number", { min: 0, max: 1000, step: 0.01, required: false });
    appendEditField(fields, "Hastighet (km/t)", "speed", record.speed, "number", { min: 0.1, max: 100, step: 0.1, required: false, placeholder: "Valgfritt" });
    appendEditField(fields, "Stigning (%)", "incline", record.incline, "number", { min: 0, max: 100, step: 0.1, required: false, placeholder: "Valgfritt" });
    appendEditField(fields, "Tempo (min/km)", "pace", record.paceSeconds === undefined ? "" : formatPace(record.paceSeconds), "text", { required: false, placeholder: "f.eks. 06:30" });
    appendEditField(fields, "Kommentar", "comment", record.comment, "textarea", { required: false, maxLength: 500, placeholder: "Skriv en kommentar (valgfritt)" });
    appendEditField(fields, "Dato", "date", record.date, "date");
  } else {
    title.textContent = `Rediger ${record.exercise}`;
    appendEditField(fields, "Vekt (kg)", "value", record.value, "number", { min: 0.5, max: 1000, step: 0.5 });
    appendEditField(fields, "Dato", "date", record.date, "date");
  }
  document.querySelector("#editDialog").showModal();
}

function handleHistoryEdit(event) {
  const button = event.target.closest("[data-edit-type]");
  if (!button) return;
  const type = button.dataset.editType;
  if (type === "weight") {
    const entry = state.weights.find((weight) => weight.date === button.dataset.editDate);
    if (entry) openEditDialog(type, entry);
  } else if (type === "cardio") {
    const entry = state.cardioSessions.find((session) => session.id === button.dataset.editId);
    if (entry) openEditDialog(type, entry);
  } else if (type === "lift") {
    const { editDate: date, editDay: day, editExercise: exercise } = button.dataset;
    const value = state.lifts[date]?.[day]?.[exercise];
    if (Number.isFinite(value)) openEditDialog(type, { date, day, exercise, value });
  }
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

async function replacePhotos(photos) {
  const database = await openPhotoDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction("photos", "readwrite");
      const store = transaction.objectStore("photos");
      store.clear();
      photos.forEach((photo) => store.put(photo));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Kunne ikke gjenopprette bildene."));
      transaction.onabort = () => reject(transaction.error || new Error("Bildene kunne ikke gjenopprettes."));
    });
  } finally {
    database.close();
  }
}

function isValidStoredDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isFinite(parsed.getTime()) && localDate(parsed) === date && date <= localDate();
}

function isValidWorkoutSession(session) {
  return Boolean(session && typeof session.id === "string" && session.id.length > 0 &&
    isValidStoredDate(session.date) &&
    (session.createdAt === undefined ||
      (typeof session.createdAt === "string" && Number.isFinite(Date.parse(session.createdAt)))) &&
    (session.groupClass === undefined
      ? workouts.some((item) => item.day === session.workoutDay)
      : typeof session.groupClass === "string" &&
        session.groupClass.length <= 100 &&
        groupClasses.some((item) => item.name === session.groupClass) &&
        session.workoutDay === undefined));
}

function validateWorkoutSchedule(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Sikkerhetskopien inneholder en ugyldig ukesplan.");
  }
  const schedule = {};
  workouts.forEach((workout) => {
    const day = value[workout.day];
    if (!weekdays.includes(day)) {
      throw new Error("Sikkerhetskopien inneholder en ugyldig treningsdag.");
    }
    schedule[workout.day] = day;
  });
  return schedule;
}

function validateBackup(payload) {
  if (!payload || payload.format !== "min-pt-backup" || payload.version !== 1 ||
      !payload.state || typeof payload.state !== "object" || !Array.isArray(payload.photos)) {
    throw new Error("Filen er ikke en gyldig Min PT-sikkerhetskopi.");
  }
  const backup = payload.state;
  const dayNames = workouts.map((workout) => workout.day);
  const workoutPlan = backup.workoutPlan === undefined
    ? defaultWorkoutPlan()
    : validateBackupWorkoutPlan(backup.workoutPlan);
  const workoutSchedule = backup.workoutSchedule === undefined
    ? defaultWorkoutSchedule()
    : validateWorkoutSchedule(backup.workoutSchedule);
  if (!Array.isArray(backup.weights) || !Array.isArray(backup.exercises) ||
      !backup.lifts || typeof backup.lifts !== "object" || Array.isArray(backup.lifts) ||
      !backup.completed || typeof backup.completed !== "object" || Array.isArray(backup.completed) ||
      !Array.isArray(backup.cardioSessions) ||
      !["dark", "light"].includes(backup.theme)) {
    throw new Error("Sikkerhetskopien mangler gyldige treningsdata.");
  }
  if (backup.weights.some((entry) => !entry || !isValidStoredDate(entry.date) ||
      !Number.isFinite(entry.value) || entry.value < 1 || entry.value > 500)) {
    throw new Error("Sikkerhetskopien inneholder en ugyldig kroppsvektmåling.");
  }
  if (backup.exercises.some((exercise) => typeof exercise !== "string" || !exercise.trim() || exercise.length > 60)) {
    throw new Error("Sikkerhetskopien inneholder en ugyldig egen øvelse.");
  }
  Object.entries(backup.lifts).forEach(([date, days]) => {
    if (!isValidStoredDate(date) || !days || typeof days !== "object" || Array.isArray(days)) {
      throw new Error("Sikkerhetskopien inneholder en ugyldig styrkeregistrering.");
    }
    Object.entries(days).forEach(([day, entries]) => {
      const workout = workouts.find((item) => item.day === day);
      if (!workout || !entries || typeof entries !== "object" || Array.isArray(entries)) {
        throw new Error("Sikkerhetskopien inneholder en ukjent treningsdag.");
      }
      Object.entries(entries).forEach(([exercise, value]) => {
        if (typeof exercise !== "string" || !exercise.trim() || exercise.length > 60 ||
            !Number.isFinite(value) || value < 0.5 || value > 1000) {
          throw new Error("Sikkerhetskopien inneholder en ugyldig løftevekt.");
        }
      });
    });
  });
  Object.entries(backup.completed).forEach(([date, entries]) => {
    if (!isValidStoredDate(date) || !Array.isArray(entries) ||
        entries.some((key) => typeof key !== "string" || key.length > 160 ||
          !dayNames.some((day) => key.startsWith(`${day}-`)))) {
      throw new Error("Sikkerhetskopien inneholder en ugyldig øktregistrering.");
    }
  });
  const completed = migrateCompletedEntries(backup.completed);
  const workoutSessions = backup.workoutSessions === undefined
    ? migrateCompletedWorkouts(completed, workoutPlan)
    : backup.workoutSessions;
  if (!Array.isArray(workoutSessions) || workoutSessions.some((session) =>
    !isValidWorkoutSession(session) || session.id.length > 160
  )) {
    throw new Error("Sikkerhetskopien inneholder en ugyldig utført treningsøkt.");
  }
  if (backup.cardioSessions.some((entry) => !entry || typeof entry.id !== "string" ||
      !isValidStoredDate(entry.date) ||
      !cardioActivities.includes(entry.activity) ||
      !Number.isFinite(entry.duration) || entry.duration <= 0 || entry.duration > 600 ||
      !isOptionalNumberInRange(entry.distance, 0, 1000) ||
      !isOptionalNumberInRange(entry.speed, 0.1, 100) ||
      !isOptionalNumberInRange(entry.incline, 0, 100) ||
      !isOptionalIntegerInRange(entry.paceSeconds, 1, 5999) ||
      (entry.comment !== undefined && (typeof entry.comment !== "string" || entry.comment.length > 500)))) {
    throw new Error("Sikkerhetskopien inneholder en ugyldig kondisjonsøkt.");
  }

  const photos = payload.photos.map((photo) => {
    if (!photo || typeof photo.id !== "string" || !isValidStoredDate(photo.date) ||
        !["Egen fremgang", ...dayNames].includes(photo.workout) ||
        typeof photo.createdAt !== "string" || !Number.isFinite(Date.parse(photo.createdAt)) ||
        typeof photo.data !== "string" || photo.data.length > 18 * 1024 * 1024) {
      throw new Error("Sikkerhetskopien inneholder et ugyldig bilde.");
    }
    const match = photo.data.match(/^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/]*={0,2})$/i);
    if (!match) throw new Error("Sikkerhetskopien inneholder et bilde i et ugyldig format.");
    const binary = atob(match[2]);
    if (binary.length > 12 * 1024 * 1024) throw new Error("Et bilde i sikkerhetskopien er større enn 12 MB.");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return {
      id: photo.id,
      date: photo.date,
      workout: photo.workout,
      createdAt: photo.createdAt,
      blob: new Blob([bytes], { type: match[1] })
    };
  });
  const ids = new Set(photos.map((photo) => photo.id));
  if (ids.size !== photos.length) throw new Error("Sikkerhetskopien inneholder dupliserte bilder.");

  return {
    state: {
      weights: backup.weights,
      exercises: backup.exercises,
      workoutPlan,
      workoutSchedule,
      lifts: backup.lifts,
      completed,
      workoutSessions,
      cardioSessions: backup.cardioSessions,
      theme: backup.theme
    },
    photos
  };
}

function validateBackupWorkoutPlan(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Sikkerhetskopien inneholder en ugyldig treningsplan.");
  }
  const defaults = defaultWorkoutPlan();
  const validImages = new Set(workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => exercise.image)
  ));
  return Object.fromEntries(workouts.map((workout) => {
    const exercises = value[workout.day] === undefined ? defaults[workout.day] : value[workout.day];
    if (!Array.isArray(exercises)) throw new Error("Sikkerhetskopien inneholder en ugyldig treningsdag.");
    const ids = new Set();
    const names = new Set();
    const checked = exercises.map((exercise) => {
      if (!exercise || typeof exercise !== "object" || Array.isArray(exercise) ||
          typeof exercise.id !== "string" || !exercise.id.trim() || exercise.id.length > 100 ||
          typeof exercise.name !== "string" || !exercise.name.trim() || exercise.name.length > 60 ||
          typeof exercise.detail !== "string" || !exercise.detail.trim() || exercise.detail.length > 120 ||
          (exercise.guide !== undefined && typeof exercise.guide !== "string") ||
          (exercise.image !== undefined && exercise.image !== "" && !validImages.has(exercise.image)) ||
          (exercise.timed !== undefined && typeof exercise.timed !== "boolean")) {
        throw new Error("Sikkerhetskopien inneholder en ugyldig øvelse i treningsplanen.");
      }
      const name = exercise.name.trim().toLocaleLowerCase("no");
      if (ids.has(exercise.id) || names.has(name)) {
        throw new Error("Sikkerhetskopien inneholder dupliserte øvelser.");
      }
      ids.add(exercise.id);
      names.add(name);
      return {
        id: exercise.id,
        name: exercise.name.trim(),
        detail: exercise.detail.trim(),
        guide: typeof exercise.guide === "string" ? exercise.guide.slice(0, 240) : "",
        image: validImages.has(exercise.image) ? exercise.image : "",
        timed: exercise.timed === true
      };
    });
    return [workout.day, checked];
  }));
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Kunne ikke lese et bilde til sikkerhetskopien."));
    reader.readAsDataURL(blob);
  });
}

async function exportBackup() {
  const photos = await getPhotos();
  const serializedPhotos = await Promise.all(photos.map(async (photo) => ({
    id: photo.id,
    date: photo.date,
    workout: photo.workout,
    createdAt: photo.createdAt,
    data: await blobToDataUrl(photo.blob)
  })));
  const payload = {
    format: "min-pt-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
    photos: serializedPhotos
  };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  if (blob.size > 150 * 1024 * 1024) {
    throw new Error("Sikkerhetskopien er større enn 150 MB. Fjern noen store bilder og prøv igjen.");
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `min-pt-sikkerhetskopi-${localDate()}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importBackup(file) {
  if (file.size > 150 * 1024 * 1024) {
    throw new Error("Sikkerhetskopien er større enn 150 MB.");
  }
  const payload = JSON.parse(await file.text());
  const imported = validateBackup(payload);
  if (!window.confirm(`Erstatte dataene på denne enheten med sikkerhetskopien? Den inneholder ${imported.state.weights.length} vektmålinger, ${imported.state.cardioSessions.length} kondisjonsøkter og ${imported.photos.length} bilder. Eksisterende data blir erstattet.`)) {
    return false;
  }

  const storageKeys = [STORAGE_KEY, "weight", "exercises"];
  const previousStorage = storageKeys.map((key) => localStorage.getItem(key));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(imported.state));
    if (imported.state.weights.length) {
      localStorage.setItem("weight", String(imported.state.weights[imported.state.weights.length - 1].value));
    } else {
      localStorage.removeItem("weight");
    }
    localStorage.setItem("exercises", JSON.stringify(imported.state.exercises));
    await replacePhotos(imported.photos);
  } catch (error) {
    try {
      storageKeys.forEach((key, index) => {
        if (previousStorage[index] === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previousStorage[index]);
      });
    } catch (restoreError) {
      console.error("Kunne ikke gjenopprette lokale data etter avbrutt import.", restoreError);
      throw new Error("Importen ble avbrutt, og lokal lagring kunne ikke gjenopprettes. Kontroller dataene før du lukker appen.");
    }
    throw error;
  }
  state = imported.state;
  render();
  await renderPhotos();
  showToast("Sikkerhetskopien er importert.");
  return true;
}

async function preparePhoto(file) {
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Bildet er større enn 12 MB. Velg et mindre bilde.");
  }
  if (typeof createImageBitmap !== "function") return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (error) {
    console.warn("Nettleseren kunne ikke komprimere bildet. Originalbildet brukes.", error);
    return file;
  }
  try {
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

async function saveProgressPhoto(blob) {
  const photoDate = document.querySelector("#photoDate").value;
  if (!isValidStoredDate(photoDate)) {
    throw new Error("Velg en gyldig dato som ikke er i fremtiden.");
  }
  await storePhoto({
    id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    date: photoDate,
    workout: document.querySelector("#photoWorkout").value,
    createdAt: new Date().toISOString(),
    blob
  });
  await renderPhotos();
  showToast("Bildet er lagret trygt på denne enheten.");
}

let cameraStream = null;
let cameraRequestId = 0;

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  document.querySelector("#cameraPreview").srcObject = null;
  document.querySelector("#capturePhotoButton").disabled = true;
}

async function startCamera() {
  const dialog = document.querySelector("#cameraDialog");
  const status = document.querySelector("#cameraStatus");
  const captureButton = document.querySelector("#capturePhotoButton");
  const choosePhotoButton = document.querySelector("#choosePhotoFromCamera");
  const preview = document.querySelector("#cameraPreview");
  const requestId = ++cameraRequestId;
  if (!dialog.open) dialog.showModal();
  status.textContent = "Be appen om kameratilgang hvis telefonen spør.";
  choosePhotoButton.hidden = true;
  if (!navigator.mediaDevices?.getUserMedia) {
    status.textContent = "Kamera støttes ikke i denne nettleseren. Velg et bilde fra telefonen i stedet.";
    choosePhotoButton.hidden = false;
    return;
  }
  try {
    stopCamera();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: "user" } }
    });
    if (requestId !== cameraRequestId || !dialog.open) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    cameraStream = stream;
    preview.srcObject = cameraStream;
    await preview.play();
    captureButton.disabled = false;
    status.textContent = "Hold telefonen stødig og trykk «Ta bilde».";
  } catch (error) {
    if (requestId !== cameraRequestId) return;
    stopCamera();
    const explanation = error.name === "NotAllowedError"
      ? "Kameratilgang ble avslått. Tillat kamera for Min PT i nettleserens innstillinger, eller velg et bilde fra telefonen."
      : error.name === "NotFoundError"
        ? "Fant ikke et kamera på enheten. Velg et bilde fra telefonen i stedet."
        : "Kameraet kunne ikke åpnes. Kontroller kameratilgangen eller velg et bilde fra telefonen.";
    status.textContent = explanation;
    choosePhotoButton.hidden = false;
    console.error("Kunne ikke åpne kameraet.", error);
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
    const workout = workouts.find((item) => item.day === photo.workout);
    label.textContent = workout ? state.workoutSchedule[workout.day] : photo.workout;
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

function formatDistance(value) {
  return new Intl.NumberFormat("no-NO", { maximumFractionDigits: 2 }).format(value);
}

function formatPace(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function parsePace(value) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const match = trimmed.match(/^(\d{1,2}):([0-5]\d)$/);
  if (!match) return null;
  const seconds = Number(match[1]) * 60 + Number(match[2]);
  return seconds >= 1 && seconds <= 5999 ? seconds : null;
}

function optionalNumber(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed ? Number(trimmed) : undefined;
}

function isOptionalNumberInRange(value, min, max) {
  return value === undefined || (typeof value === "number" && Number.isFinite(value) && value >= min && value <= max);
}

function isOptionalIntegerInRange(value, min, max) {
  return value === undefined || (Number.isInteger(value) && value >= min && value <= max);
}

function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (!minutes) return `${remainder} sek`;
  return remainder ? `${minutes} min ${remainder} sek` : `${minutes} min`;
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

document.querySelector("#weightHistory").addEventListener("click", handleHistoryEdit);

function updateCardioFieldOptions() {
  const select = document.querySelector("#cardioFieldSelect");
  const selected = new Set(Array.from(document.querySelectorAll("#cardioOptionalFields [data-cardio-field]"))
    .map((field) => field.dataset.cardioField));
  Array.from(select.options).forEach((option) => {
    if (option.value) option.disabled = selected.has(option.value);
  });
  if (select.value && selected.has(select.value)) select.value = "";
}

function addCardioOptionalField(fieldName) {
  const definition = cardioOptionalFields[fieldName];
  if (!definition || document.getElementById(definition.id)) return;
  const wrapper = document.createElement("div");
  wrapper.className = "cardio-optional-field";
  wrapper.dataset.cardioField = fieldName;
  const label = document.createElement("label");
  label.className = "cardio-field";
  label.htmlFor = definition.id;
  label.textContent = definition.label;
  const input = definition.type === "textarea"
    ? document.createElement("textarea")
    : document.createElement("input");
  input.id = definition.id;
  input.name = definition.id;
  if (definition.type !== "textarea") input.type = definition.type;
  Object.entries(definition.attributes).forEach(([name, value]) => input.setAttribute(name, value));
  label.append(input);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "cardio-remove-field";
  remove.textContent = "Fjern";
  remove.setAttribute("aria-label", `Fjern feltet ${definition.label}`);
  remove.addEventListener("click", () => {
    wrapper.remove();
    updateCardioFieldOptions();
  });
  wrapper.append(label, remove);
  document.querySelector("#cardioOptionalFields").append(wrapper);
  updateCardioFieldOptions();
}

document.querySelector("#addCardioField").addEventListener("click", () => {
  const select = document.querySelector("#cardioFieldSelect");
  if (!select.value) {
    showToast("Velg en opplysning du vil legge til.");
    return;
  }
  addCardioOptionalField(select.value);
});

const pageNavigation = document.querySelector(".main-nav");
const pageIds = new Set(["oversikt", "trening", "treningshistorikk", "restitusjon", "progresjon", "bilder", "kroppsvekt", "innstillinger"]);

function showPage(pageId, updateHistory = false) {
  const activePage = pageIds.has(pageId) ? pageId : "oversikt";
  document.querySelector("#oversikt").hidden = activePage !== "oversikt";
  document.querySelectorAll(".page-section").forEach((section) => {
    section.hidden = section.id !== activePage;
  });
  pageNavigation.querySelectorAll("a").forEach((link) => {
    if (link.hash === `#${activePage}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (updateHistory && location.hash !== `#${activePage}`) {
    history.pushState(null, "", `#${activePage}`);
  }
  window.scrollTo(0, 0);
}

pageNavigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || !pageIds.has(link.hash.slice(1))) return;
  event.preventDefault();
  showPage(link.hash.slice(1), true);
});

window.addEventListener("popstate", () => showPage(location.hash.slice(1)));
window.addEventListener("hashchange", () => showPage(location.hash.slice(1)));
showPage(location.hash.slice(1));

document.querySelector("#cardioForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const activity = document.querySelector("#cardioActivity").value;
  const minutes = Number(document.querySelector("#cardioMinutes").value);
  const seconds = Number(document.querySelector("#cardioSeconds").value);
  const durationSeconds = minutes * 60 + seconds;
  const distance = Number(document.querySelector("#cardioDistance").value);
  const speed = optionalNumber(document.querySelector("#cardioSpeed")?.value);
  const incline = optionalNumber(document.querySelector("#cardioIncline")?.value);
  const paceSeconds = parsePace(document.querySelector("#cardioPace")?.value || "");
  const comment = document.querySelector("#cardioComment")?.value.trim();
  const date = document.querySelector("#cardioDate").value;
  if (!cardioActivities.includes(activity) ||
      !Number.isInteger(minutes) || minutes < 0 || minutes > 600 ||
      !Number.isInteger(seconds) || seconds < 0 || seconds > 59 ||
      durationSeconds < 1 || durationSeconds > 36000 ||
      !Number.isFinite(distance) || distance < 0 || distance > 1000 ||
      (speed !== undefined && (!Number.isFinite(speed) || speed < 0.1 || speed > 100)) ||
      (incline !== undefined && (!Number.isFinite(incline) || incline < 0 || incline > 100)) ||
      paceSeconds === null ||
      (comment !== undefined && comment.length > 500) ||
      !date || date > localDate()) {
    showToast("Skriv inn gyldige verdier for økten. Tempo må skrives som mm:ss.");
    return;
  }
  state.cardioSessions.push({
    id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    activity,
    duration: durationSeconds / 60,
    ...(distance === undefined ? {} : { distance }),
    ...(speed === undefined ? {} : { speed }),
    ...(incline === undefined ? {} : { incline }),
    ...(paceSeconds === undefined ? {} : { paceSeconds }),
    ...(comment === undefined || !comment ? {} : { comment }),
    date,
    createdAt: new Date().toISOString()
  });
  saveState();
  renderCardioSessions();
  renderCardioProgress();
  renderStats();
  document.querySelector("#cardioMinutes").value = "";
  document.querySelector("#cardioSeconds").value = "";
  document.querySelector("#cardioDistance").value = "";
  document.querySelector("#cardioOptionalFields").replaceChildren();
  document.querySelector("#cardioFieldSelect").value = "";
  updateCardioFieldOptions();
  document.querySelector("#cardioDate").value = localDate();
  showToast("Kondisjonsøkten er lagret.");
});

document.querySelector(".training-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-training-filter]");
  if (button) setTrainingFilter(button.dataset.trainingFilter);
});

document.querySelector("#recoveryWorkoutTip").addEventListener("click", (event) => {
  if (!event.target.closest("[data-show-strength-plan]")) return;
  showPage("trening", true);
  setTrainingFilter("strength");
});

document.querySelector("#cardioHistory").addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-toggle-history]");
  if (toggle) {
    toggleHistoryList(toggle.dataset.toggleHistory);
    return;
  }
  const edit = event.target.closest("[data-edit-type]");
  if (edit) {
    handleHistoryEdit(event);
    return;
  }
  const button = event.target.closest("[data-remove-cardio]");
  if (!button) return;
  state.cardioSessions = state.cardioSessions.filter((session) => session.id !== button.dataset.removeCardio);
  saveState();
  renderCardioSessions();
  renderCardioProgress();
  renderStats();
  showToast("Kondisjonsøkten er slettet.");
});

document.querySelector("#cardioPeriod").addEventListener("change", renderCardioProgress);
document.querySelector("#cardioFilter").addEventListener("change", renderCardioProgress);
document.querySelector("#weightPeriod").addEventListener("change", renderProgressCharts);
document.querySelector("#strengthPeriod").addEventListener("change", renderStrengthProgress);
document.querySelectorAll("#weightCustomDates input").forEach((input) =>
  input.addEventListener("change", renderProgressCharts)
);
document.querySelectorAll("#strengthCustomDates input").forEach((input) =>
  input.addEventListener("change", renderStrengthProgress)
);
document.querySelectorAll("#cardioCustomDates input").forEach((input) =>
  input.addEventListener("change", renderCardioProgress)
);
document.querySelector("#strengthHistory").addEventListener("click", handleHistoryEdit);

document.querySelector("#editForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!editingRecord) return;
  const values = new FormData(event.currentTarget);
  const date = String(values.get("date") || "");
  const error = document.querySelector("#editError");
  if (!isValidStoredDate(date)) {
    error.textContent = "Velg en gyldig dato som ikke er i fremtiden.";
    return;
  }

  if (editingRecord.type === "weight") {
    const value = Number(values.get("value"));
    if (!Number.isFinite(value) || value < 1 || value > 500) {
      error.textContent = "Vekten må være mellom 1 og 500 kg.";
      return;
    }
    const conflict = state.weights.some((entry) => entry.date === date && entry.date !== editingRecord.date);
    if (conflict) {
      error.textContent = "Det finnes allerede en vektmåling på denne datoen.";
      return;
    }
    const entry = state.weights.find((weight) => weight.date === editingRecord.date);
    if (!entry) return;
    entry.date = date;
    entry.value = value;
  } else if (editingRecord.type === "cardio") {
    const activity = String(values.get("activity") || "");
    const minutes = Number(values.get("minutes"));
    const seconds = Number(values.get("seconds"));
    const durationSeconds = minutes * 60 + seconds;
    const distance = optionalNumber(values.get("distance"));
    const speed = optionalNumber(values.get("speed"));
    const incline = optionalNumber(values.get("incline"));
    const paceSeconds = parsePace(String(values.get("pace") || ""));
    const comment = String(values.get("comment") || "").trim();
    if (!cardioActivities.includes(activity) ||
        !Number.isInteger(minutes) || minutes < 0 || minutes > 600 ||
        !Number.isInteger(seconds) || seconds < 0 || seconds > 59 ||
        durationSeconds < 1 || durationSeconds > 36000 ||
        (distance !== undefined && (!Number.isFinite(distance) || distance < 0 || distance > 1000)) ||
        (speed !== undefined && (!Number.isFinite(speed) || speed < 0.1 || speed > 100)) ||
        (incline !== undefined && (!Number.isFinite(incline) || incline < 0 || incline > 100)) ||
        paceSeconds === null || comment.length > 500) {
      error.textContent = "Kontroller tid, distanse, hastighet, stigning, tempo (mm:ss) og kommentar.";
      return;
    }
    const session = state.cardioSessions.find((entry) => entry.id === editingRecord.id);
    if (!session) return;
    Object.assign(session, {
      activity,
      duration: durationSeconds / 60,
      distance,
      speed,
      incline,
      paceSeconds,
      comment: comment || undefined,
      date
    });
  } else {
    const value = Number(values.get("value"));
    if (!Number.isFinite(value) || value < 0.5 || value > 1000) {
      error.textContent = "Vekten må være mellom 0,5 og 1000 kg.";
      return;
    }
    const oldEntries = state.lifts[editingRecord.date]?.[editingRecord.day];
    if (!oldEntries || !Number.isFinite(oldEntries[editingRecord.exercise])) return;
    if (state.lifts[date]?.[editingRecord.day]?.[editingRecord.exercise] !== undefined &&
        date !== editingRecord.date) {
      error.textContent = "Det finnes allerede en vekt for denne øvelsen på valgt dato.";
      return;
    }
    delete oldEntries[editingRecord.exercise];
    if (Object.keys(oldEntries).length === 0) delete state.lifts[editingRecord.date][editingRecord.day];
    if (Object.keys(state.lifts[editingRecord.date]).length === 0) delete state.lifts[editingRecord.date];
    if (!state.lifts[date]) state.lifts[date] = {};
    if (!state.lifts[date][editingRecord.day]) state.lifts[date][editingRecord.day] = {};
    state.lifts[date][editingRecord.day][editingRecord.exercise] = value;
  }
  saveState();
  document.querySelector("#editDialog").close();
  editingRecord = null;
  render();
  showToast("Registreringen er oppdatert.");
});

function closeEditDialog() {
  document.querySelector("#editDialog").close();
  editingRecord = null;
}

document.querySelector("#cancelEdit").addEventListener("click", closeEditDialog);
document.querySelector("#closeEditDialog").addEventListener("click", closeEditDialog);
document.querySelector("#editDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeEditDialog();
});

function updateRestTimer() {
  const remaining = Math.max(0, Math.ceil((restTimerEnd - Date.now()) / 1000));
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  document.querySelector("#restTimerDisplay").textContent = `${minutes}:${seconds}`;
  if (remaining === 0) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
    restTimerEnd = null;
    document.querySelector("#startRestTimer").disabled = false;
    document.querySelector("#stopRestTimer").disabled = true;
    document.querySelector("#restDuration").disabled = false;
    showToast("Hvilepausen er ferdig. Klar for neste sett!");
    if ("vibrate" in navigator) navigator.vibrate(250);
  }
}

document.querySelector("#restTimerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearInterval(restTimerInterval);
  restTimerEnd = Date.now() + Number(document.querySelector("#restDuration").value) * 1000;
  document.querySelector("#startRestTimer").disabled = true;
  document.querySelector("#stopRestTimer").disabled = false;
  document.querySelector("#restDuration").disabled = true;
  updateRestTimer();
  restTimerInterval = window.setInterval(updateRestTimer, 250);
});

document.querySelector("#stopRestTimer").addEventListener("click", () => {
  clearInterval(restTimerInterval);
  restTimerInterval = null;
  restTimerEnd = null;
  document.querySelector("#restTimerDisplay").textContent =
    `${String(Math.floor(Number(document.querySelector("#restDuration").value) / 60)).padStart(2, "0")}:${String(Number(document.querySelector("#restDuration").value) % 60).padStart(2, "0")}`;
  document.querySelector("#startRestTimer").disabled = false;
  document.querySelector("#stopRestTimer").disabled = true;
  document.querySelector("#restDuration").disabled = false;
});

document.querySelector("#restDuration").addEventListener("change", (event) => {
  const duration = Number(event.currentTarget.value);
  document.querySelector("#restTimerDisplay").textContent =
    `${String(Math.floor(duration / 60)).padStart(2, "0")}:${String(duration % 60).padStart(2, "0")}`;
});

document.querySelector("#exportBackup").addEventListener("click", async () => {
  try {
    await exportBackup();
    showToast("Sikkerhetskopien er lastet ned.");
  } catch (error) {
    console.error("Kunne ikke eksportere sikkerhetskopien.", error);
    showToast(error.message || "Sikkerhetskopien kunne ikke opprettes.");
  }
});

document.querySelector("#importBackup").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  try {
    await importBackup(file);
  } catch (error) {
    console.error("Kunne ikke importere sikkerhetskopien.", error);
    showToast(error.message || "Sikkerhetskopien kunne ikke importeres.");
  } finally {
    input.value = "";
  }
});

document.querySelector("#strengthExercise").addEventListener("change", (event) => {
  selectedStrengthExercise = event.currentTarget.value;
  renderStrengthProgress();
});

document.querySelector("#groupClassPeriod").addEventListener("change", renderGroupClassStats);

document.querySelector("#planExerciseCategory").addEventListener("change", () => {
  renderPlanExerciseOptions();
  document.querySelector("#planExerciseName").value = "";
  showPlanExerciseTip();
});

document.querySelector("#planExerciseDay").addEventListener("change", () => {
  renderPlanExerciseOptions();
  document.querySelector("#planExerciseName").value = "";
  showPlanExerciseTip();
});

document.querySelector("#planExerciseName").addEventListener("change", () => {
  const option = document.querySelector("#planExerciseName").selectedOptions[0];
  if (option?.dataset.detail) {
    document.querySelector("#planExerciseDetail").value = option.dataset.detail;
  } else {
    document.querySelector("#planExerciseDetail").value = "";
  }
  showPlanExerciseTip();
});

document.querySelector("#planExerciseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const day = document.querySelector("#planExerciseDay").value;
  const name = document.querySelector("#planExerciseName").value.trim();
  const detail = document.querySelector("#planExerciseDetail").value.trim();
  const workout = workouts.find((item) => item.day === day);
  if (!workout || !name || !detail) {
    showToast("Velg treningsdag og fyll inn øvelsesnavn og sett/repetisjoner.");
    return;
  }
  if (state.workoutPlan[day].some((exercise) =>
    exercise.name.toLocaleLowerCase("no") === name.toLocaleLowerCase("no")
  )) {
    showToast("Denne øvelsen finnes allerede på valgt treningsdag.");
    return;
  }
  const id = typeof crypto.randomUUID === "function"
    ? `custom-${crypto.randomUUID()}`
    : `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const previousPlan = state.workoutPlan[day];
  state.workoutPlan[day].push({ id, name, detail, guide: "", image: "", timed: false });
  if (!saveState()) {
    state.workoutPlan[day] = previousPlan;
    render();
    return;
  }
  render();
  document.querySelector("#planExerciseName").value = "";
  document.querySelector("#planExerciseDetail").value = "";
  showPlanExerciseTip();
  showToast(`${name} er lagt til på ${day}.`);
});

document.querySelector("#workoutPlan").addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-workout]");
  if (saveButton) {
    const workoutCard = saveButton.closest("[data-workout-card]");
    const date = workoutCard?.querySelector("[data-workout-date]")?.value;
    saveWorkoutSession(saveButton.dataset.saveWorkout, date);
    return;
  }
  const button = event.target.closest("[data-remove-plan-id]");
  if (!button) return;
  const { removePlanDay: day, removePlanId: id } = button.dataset;
  const exercise = state.workoutPlan[day]?.find((item) => item.id === id);
  if (!exercise) return;
  const previousPlan = state.workoutPlan[day];
  state.workoutPlan[day] = state.workoutPlan[day].filter((item) => item.id !== id);
  if (!saveState()) {
    state.workoutPlan[day] = previousPlan;
    render();
    return;
  }
  render();
  showToast(`${exercise.name} er fjernet fra ${day}.`);
});

document.querySelector("#workoutPlan").addEventListener("change", (event) => {
  const scheduleSelect = event.target.closest("[data-workout-schedule]");
  if (scheduleSelect) {
    const workoutDay = scheduleSelect.dataset.workoutSchedule;
    const scheduledDay = scheduleSelect.value;
    state.workoutSchedule[workoutDay] = scheduledDay;
    if (!saveState()) return;
    renderWorkoutDaySelectors();
    renderWorkouts();
    renderStats();
    showToast(`${workouts.find((workout) => workout.day === workoutDay).title} er flyttet til ${scheduledDay}.`);
    return;
  }
  const workoutDate = event.target.closest("[data-workout-date]");
  if (workoutDate) {
    selectedWorkoutDates[workoutDate.dataset.workoutDate] = workoutDate.value;
    renderWorkouts();
    return;
  }
  const weightInput = event.target.closest("[data-lift-weight]");
  if (weightInput) {
    const value = weightInput.value === "" ? null : Number(weightInput.value);
    if (value !== null && (!Number.isFinite(value) || value < 0.5 || value > 1000)) {
      showToast("Skriv inn en gyldig treningsvekt mellom 0,5 og 1000 kg.");
      return;
    }
    const workoutCard = weightInput.closest("[data-workout-card]");
    const date = workoutCard?.querySelector("[data-workout-date]")?.value;
    if (!isValidStoredDate(date)) {
      showToast("Velg en gyldig treningsdato som ikke er i fremtiden.");
      return;
    }
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
    renderStrengthProgress();
    showToast(value === null ? "Vektregistreringen er fjernet." : `Lagret: ${formatWeight(value)} kg for ${liftExercise}.`);
    return;
  }
  const checkbox = event.target.closest("[data-workout]");
  if (!checkbox) return;
  const workoutCard = checkbox.closest("[data-workout-card]");
  const date = workoutCard?.querySelector("[data-workout-date]")?.value;
  if (!isValidStoredDate(date)) {
    showToast("Velg en gyldig treningsdato som ikke er i fremtiden.");
    renderWorkouts();
    return;
  }
  if (!Array.isArray(state.completed[date])) state.completed[date] = [];
  state.completed[date] = state.completed[date].filter((key) => key !== checkbox.dataset.workout);
  if (checkbox.checked) state.completed[date].push(checkbox.dataset.workout);
  if (!state.completed[date].length) delete state.completed[date];
  saveState();
  renderStats();
});

document.querySelector("#extraWorkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveWorkoutSession(
    document.querySelector("#extraWorkoutDay").value,
    document.querySelector("#extraWorkoutDate").value
  );
});

document.querySelector("#groupWorkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const groupClass = document.querySelector("#groupClass").value;
  const date = document.querySelector("#groupWorkoutDate").value;
  if (!groupClasses.some((item) => item.name === groupClass) || !isValidStoredDate(date)) {
    showToast("Velg en gruppetime og en gyldig dato som ikke er i fremtiden.");
    return;
  }
  state.workoutSessions.push({
    id: typeof crypto.randomUUID === "function"
      ? `group-${crypto.randomUUID()}`
      : `group-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    groupClass,
    date,
    createdAt: new Date().toISOString()
  });
  if (!saveState()) return;
  renderWorkoutHistory();
  renderStats();
  showToast(`${groupClass} er lagret for ${formatDate(date)}.`);
});

function handleWorkoutHistoryClick(event) {
  const toggle = event.target.closest("[data-toggle-history]");
  if (toggle) {
    toggleHistoryList(toggle.dataset.toggleHistory);
    return;
  }
  const button = event.target.closest("[data-remove-workout-session]");
  if (!button) return;
  state.workoutSessions = state.workoutSessions.filter((session) => session.id !== button.dataset.removeWorkoutSession);
  if (!saveState()) return;
  renderWorkoutHistory();
  renderStats();
  showToast("Treningsøkten er slettet fra historikken.");
}

document.querySelector("#workoutHistory").addEventListener("click", handleWorkoutHistoryClick);
document.querySelector("#groupWorkoutHistory").addEventListener("click", handleWorkoutHistoryClick);

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

document.querySelector("#themeToggle").addEventListener("change", (event) => {
  state.theme = event.target.checked ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  saveState();
});

function getMotivationMessage(date = new Date()) {
  const daySeed = Number(localDate(date).replaceAll("-", ""));
  return motivationMessages[daySeed % motivationMessages.length];
}

async function sendMotivationNotification(test = false) {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    showToast("Varsler støttes ikke i denne nettleseren.");
    return false;
  }
  if (Notification.permission !== "granted") {
    showToast("Tillat varsler i nettleseren for å bruke denne funksjonen.");
    return false;
  }
  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification("Min PT", {
    body: getMotivationMessage(),
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: test ? "min-pt-motivation-test" : "min-pt-motivation",
    renotify: test
  });
  if (!test) {
    state.motivationLastSent = localDate();
    saveState();
  }
  return true;
}

function renderMotivationSettings() {
  const enabled = document.querySelector("#motivationToggle");
  const time = document.querySelector("#motivationTime");
  const status = document.querySelector("#motivationStatus");
  enabled.checked = state.motivationNotifications;
  time.value = state.motivationTime;
  time.disabled = !state.motivationNotifications;
  if (!("Notification" in window)) status.textContent = "Varsler støttes ikke i denne nettleseren.";
  else if (Notification.permission === "denied") status.textContent = "Varsler er blokkert i nettleserens innstillinger.";
  else if (state.motivationNotifications) status.textContent = `Daglig motiverende varsel kl. ${state.motivationTime}.`;
  else status.textContent = "Får et norsk treningsslagord én gang daglig.";
}

document.querySelector("#motivationToggle").addEventListener("change", async (event) => {
  if (!event.target.checked) {
    state.motivationNotifications = false;
    saveState();
    renderMotivationSettings();
    showToast("Motiverende varsler er slått av.");
    return;
  }
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    event.target.checked = false;
    showToast("Varsler støttes ikke i denne nettleseren.");
    return;
  }
  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  if (permission !== "granted") {
    event.target.checked = false;
    showToast("Tillat varsler i nettleseren for å slå på motivasjon.");
    renderMotivationSettings();
    return;
  }
  state.motivationNotifications = true;
  saveState();
  renderMotivationSettings();
  await sendMotivationNotification(true);
  showToast("Daglige motiverende varsler er slått på.");
});

document.querySelector("#motivationTime").addEventListener("change", (event) => {
  state.motivationTime = event.target.value;
  state.motivationLastSent = "";
  saveState();
  renderMotivationSettings();
});

document.querySelector("#testMotivationNotification").addEventListener("click", async () => {
  const sent = await sendMotivationNotification(true);
  if (sent) showToast("Testvarselet ble sendt.");
});

function checkScheduledMotivation() {
  if (!state.motivationNotifications || Notification.permission !== "granted") return;
  const today = localDate();
  if (state.motivationLastSent === today) return;
  const now = new Date();
  const [hour, minute] = state.motivationTime.split(":").map(Number);
  if (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)) {
    sendMotivationNotification(false);
  }
}

document.querySelector("#clearData").addEventListener("click", async () => {
  if (!window.confirm("Slette alle lagrede vektmålinger, kondisjonsøkter, treningsøkter, egne øvelser og bilder?")) return;
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
  state.workoutPlan = defaultWorkoutPlan();
  state.workoutSchedule = defaultWorkoutSchedule();
  state.completed = {};
  state.workoutSessions = [];
  state.motivationNotifications = false;
  state.motivationTime = "18:00";
  state.motivationLastSent = "";
  Object.keys(selectedWorkoutDates).forEach((day) => delete selectedWorkoutDates[day]);
  state.cardioSessions = [];
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
document.querySelector("#cardioDate").value = localDate();
document.querySelector("#cardioDate").max = localDate();
document.querySelector("#extraWorkoutDate").value = localDate();
document.querySelector("#extraWorkoutDate").max = localDate();
document.querySelector("#groupWorkoutDate").value = localDate();
document.querySelector("#groupWorkoutDate").max = localDate();
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
    await saveProgressPhoto(blob);
  } catch (error) {
    console.error("Kunne ikke lagre treningsbildet.", error);
    showToast(error.message || "Bildet kunne ikke lagres. Kontroller lagringsplassen og prøv igjen.");
  } finally {
    input.value = "";
  }
});

document.querySelector("#startCameraButton").addEventListener("click", startCamera);
document.querySelector("#choosePhotoFromCamera").addEventListener("click", () => {
  closeCamera();
  document.querySelector("#photoInput").click();
});
document.querySelector("#capturePhotoButton").addEventListener("click", async () => {
  const preview = document.querySelector("#cameraPreview");
  const status = document.querySelector("#cameraStatus");
  if (!preview.videoWidth || !preview.videoHeight) {
    status.textContent = "Kameraet er ikke klart ennå. Vent litt og prøv igjen.";
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = preview.videoWidth;
  canvas.height = preview.videoHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    status.textContent = "Kunne ikke ta bildet. Prøv å velge et bilde fra telefonen.";
    return;
  }
  context.drawImage(preview, 0, 0);
  status.textContent = "Lagrer bildet …";
  document.querySelector("#capturePhotoButton").disabled = true;
  try {
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((image) => {
        if (image) resolve(image);
        else reject(new Error("Kunne ikke klargjøre bildet. Prøv igjen."));
      }, "image/jpeg", 0.88);
    });
    await saveProgressPhoto(await preparePhoto(blob));
    document.querySelector("#cameraDialog").close();
    stopCamera();
  } catch (error) {
    status.textContent = error.message || "Bildet kunne ikke lagres. Kontroller lagringsplassen og prøv igjen.";
    console.error("Kunne ikke lagre fremgangsbildet fra kameraet.", error);
    document.querySelector("#capturePhotoButton").disabled = false;
  }
});

function closeCamera() {
  cameraRequestId++;
  if (document.querySelector("#cameraDialog").open) document.querySelector("#cameraDialog").close();
  stopCamera();
}

document.querySelector("#cancelCameraButton").addEventListener("click", closeCamera);
document.querySelector("#closeCameraButton").addEventListener("click", closeCamera);
document.querySelector("#cameraDialog").addEventListener("cancel", () => {
  cameraRequestId++;
  stopCamera();
});
document.querySelector("#cameraDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeCamera();
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
    navigator.serviceWorker.register("./service-worker.js?v=69")
      .then(() => {
        checkScheduledMotivation();
        window.setInterval(checkScheduledMotivation, 60000);
      })
      .catch((error) => console.error("Kunne ikke registrere service worker.", error));
  });
}

render();
renderPhotos();
