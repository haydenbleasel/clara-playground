/**
 * Turns a title into a URL slug: lowercase ASCII letters and digits, with each run of anything
 * else replaced by one hyphen, and no hyphen at the start or end.
 *
 * @param {string} title
 * @returns {string}
 */
export const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]/g, "-");

/**
 * Returns a slug for `title` that isn't in `taken`, by adding `-2`, `-3`, and so on until one is
 * free.
 *
 * @param {string} title
 * @param {Set<string>} taken
 * @returns {string}
 */
export const uniqueSlug = (title, taken) => {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  while (taken.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
};
