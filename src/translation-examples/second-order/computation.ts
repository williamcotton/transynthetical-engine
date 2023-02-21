import { Solution } from "../..";

export const targetType = `thunk`;

export const question = `4 days a week, Laura practices martial arts for 1.5 hours. Considering a week is 7 days, what is her average practice time per day each week?`;

export const en = `Laura practices an average of {answer} hours per day.`;

export const context = ``;

// %TRANSLATION_TARGET_RESPONSE_START%
(async function () {
  const daysPracticedInAWeek = 4;
  const hoursPracticedInADay = 1.5;
  const daysInAWeek = 7;
  const totalHoursPracticedInAWeek =
    daysPracticedInAWeek * hoursPracticedInADay;
  const averagePracticeTimePerDay = totalHoursPracticedInAWeek / daysInAWeek;
  return { answer: averagePracticeTimePerDay, computed: true };
});
// %TRANSLATION_TARGET_RESPONSE_END%
