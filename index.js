/**
 * @typedef {"os" | "light" | "dark"} Theme
 */

const COLOR_SCHEME_META_NODE = document.querySelector(
  'meta[name="color-scheme"]'
);
const DEFAULT_OPTION = {
  label: "OS based",
  value: "os",
  default: true,
};
const EXTRA_OPTIONS = COLOR_SCHEME_META_NODE.content
  .split(" ")
  .map((option) => ({
    label: option,
    value: option,
  }));
const THEME_OPTIONS = [DEFAULT_OPTION, ...EXTRA_OPTIONS];
const THEME_CLASS_PREFIX = "theme";
const CURRENT_THEME = getCurrentTheme();

renderTheme(CURRENT_THEME);

document.addEventListener("DOMContentLoaded", () => {
  renderToggle(CURRENT_THEME)
    .querySelectorAll('[name="theme"]')
    .forEach((input) => {
      input.addEventListener("change", onThemeChange);
    });
});

/**
 * @returns {Theme}
 */
function getCurrentTheme() {
  return localStorage.theme || DEFAULT_OPTION.value;
}

/**
 * @param {Event} event
 * @param {HTMLInputElement} event.target
 */
function onThemeChange({ target }) {
  const { value } = target;

  saveTheme(value);
  renderTheme(value);
}

/**
 * @param {Theme} theme
 */
function saveTheme(theme) {
  if (theme === DEFAULT_OPTION.value) {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", theme);
  }
}

/**
 * @param {Theme} theme
 */
function renderTheme(theme) {
  EXTRA_OPTIONS.forEach((option) => {
    document.documentElement.classList.remove(
      `${THEME_CLASS_PREFIX}-${option.value}`
    );
  });

  if (theme !== DEFAULT_OPTION.value) {
    document.documentElement.classList.add(`${THEME_CLASS_PREFIX}-${theme}`);
  }
}

/**
 * @param {Theme} theme
 * @returns {HTMLFormElement}
 */
function renderToggle(theme) {
  const template = document.createElement("template");
  const templateString = getToggleHTML(theme);

  template.innerHTML = templateString;

  const templateNode = template.content.firstElementChild;

  document.body.appendChild(templateNode);

  return templateNode;
}

/**
 * @param {Theme} theme
 * @returns {string}
 */
function getToggleHTML(theme) {
  let templateString = `
    <form>
      <fieldset>
  `;

  THEME_OPTIONS.forEach(({ label, value }) => {
    templateString += `
      <input type="radio" name="theme" value="${value}" id="theme-${value}"${
      theme === value ? "checked" : ""
    } /><label for="theme-${value}">${label}</label>
    `;
  });

  templateString += `
    </fieldset>
  </form>`;

  return templateString;
}
