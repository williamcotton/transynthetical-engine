import { toNum } from "../../../../ask";

export const targetType = `data`;

export const prompt = `What is percentage of people who make more than $10,000 a year in Dansville, NY?`;

export const en = `The population of Dansville, NY is {answer}.`;

export const context = `Dansville is a village in Livingston County, New York`;

// %TRANSLATION_TARGET_RESPONSE_START%
({ answer: toNum("34.3"), synthetic: true, computed: false });
// %TRANSLATION_TARGET_RESPONSE_END%
