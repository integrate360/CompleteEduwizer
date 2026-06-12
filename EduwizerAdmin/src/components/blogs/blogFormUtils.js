export const emptyBlogForm = { title: "", description: "", author: "", image: "", data: "" };

export function getEmptyBlogForm() {
  return { ...emptyBlogForm };
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

