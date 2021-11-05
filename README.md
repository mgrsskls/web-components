# Theme Toggle

This theme toggle uses a light theme by default or a dark theme if the media query `prefers-color-scheme: dark` applies.
It also uses `<meta name="color-scheme" content="dark light" />` in the `<head />` to control the color of the form elements based on the preferred color scheme.

The values of `<meta name="color-scheme" content="dark light" />`'s `content` attribute are then used to create a toggle component using JavaScript that includes the `OS based`, `dark` and `light` options.

If `OS based` is selected, the color scheme defined in the operating system is used. If `dark` or `light` is selected, the selected value is used to set a CSS class on the `<html />` tag and the value is stored in `localStorage`.

When the page is requested and `dark` or `light` are stored in `localStorage`, the theme is applied without the style changes being noticeable.
