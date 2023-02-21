import { toNum } from "../..";

export const targetType = `data`;

export const question = `What is the population of Geneseo, NY?`;

export const en = `The capital of France is {answer}.`;

export const context = `The population of the town was 10,483 at the 2010 census.`;

// %TRANSLATION_TARGET_RESPONSE_START%
({ answer: toNum("10483"), analytic: true, computed: false });
// %TRANSLATION_TARGET_RESPONSE_END%
