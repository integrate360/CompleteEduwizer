export const emptyEventForm = { title: "", description: "", image: "", data: "" };

export function getEmptyEventForm() {
  return { ...emptyEventForm };
}

export function prettyJsonString(input) {
  try {
    const obj = JSON.parse(input);
    return JSON.stringify(obj, null, 2);
  } catch {
    return input;
  }
}

export function isValidJsonString(input) {
  if (!input) return true;
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

