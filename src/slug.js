/**
 * Turns a title into a URL slug: lowercase ASCII letters and digits, with each run of anything
 * else replaced by one hyphen, and no hyphen at the start or end.
 *
 * @param {string} title
 * @returns {string}
 */
export const slugify = (title) =>
  title
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

/**
 * Returns a slug for `title` that isn't in `taken`, by adding `-2`, `-3`, and so on until one is
 * free. A title with no ASCII letters or digits uses `untitled` as its base. With `maxLength`, the
 * base is shortened before the suffix is added, so the slug, suffix included, is at most
 * `maxLength` characters; throws a `RangeError` if that leaves no room for the base.
 *
 * @param {string} title
 * @param {Set<string>} taken
 * @param {number} [maxLength]
 * @returns {string}
 */
export const uniqueSlug = (title, taken, maxLength = Infinity) => {
  const base = slugify(title) || "untitled";
  const fit = (end) => {
    const head = truncateSlug(base, maxLength - end.length);

    if (!head) {
      throw new RangeError(`maxLength ${maxLength} is too short for a slug ending in "${end}"`);
    }

    return `${head}${end}`;
  };
  let slug = fit("");
  let suffix = 2;

  while (taken.has(slug)) {
    slug = fit(`-${suffix}`);
    suffix += 1;
  }

  return slug;
};

/**
 * Shortens a slug to at most `maxLength` characters, without leaving a hyphen at the end. A
 * `maxLength` below zero counts as zero, and a fractional one is rounded down. Don't use this on a
 * slug from `uniqueSlug`, since cutting its suffix can give back a taken slug; pass `maxLength`
 * to `uniqueSlug` instead.
 *
 * @param {string} slug
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateSlug = (slug, maxLength) =>
  slug.slice(0, Math.max(0, Math.floor(maxLength))).replace(/-+$/, "");
