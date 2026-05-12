import type { PushPayload } from "./push";

export function buildMealNotification(meal: {
  id: string;
  name: string;
  summary: string;
  calories: number;
}): PushPayload {
  const body = meal.calories ? `${meal.summary} (${meal.calories} კკალ)` : meal.summary;
  return {
    title: "🍳 " + meal.name,
    body,
    tag: `meal-${meal.id}`,
    url: "/",
  };
}

export function buildWorkoutNotification(workout: {
  id: string;
  title: string;
  timeStart: string | null;
  durationMin: number | null;
  focus: string | null;
}): PushPayload {
  // "💪 18:30-ზე — პილატესი 45 წთ"
  const title = "💪 " + (workout.timeStart ? `${workout.timeStart}-ზე` : workout.title);
  const bodyParts = [
    workout.timeStart ? workout.title : null,
    workout.durationMin ? `${workout.durationMin} წთ` : null,
    workout.focus,
  ].filter(Boolean);
  const body = bodyParts.join(" · ") || workout.title;
  return {
    title,
    body,
    tag: `workout-${workout.id}`,
    url: "/",
  };
}

export function buildWaterNotification(glassesCount: number, targetGlasses: number): PushPayload {
  return {
    title: "💧 წყლის დროა!",
    body: `${glassesCount}/${targetGlasses} ჭიქა.`,
    tag: "water",
    url: "/",
  };
}

export function buildWeightNotification(): PushPayload {
  return {
    title: "⚖️ წონის ჩაწერა",
    body: "დილის წონის ჩაწერა",
    tag: "weight",
    url: "/progress",
  };
}
