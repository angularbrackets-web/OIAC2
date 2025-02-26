/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        warmWhite: "#F2F0EC",
        terracottaRed: {
          darker: "#723A36", // 20% darker
          dark: "#81413C", // 10% darker
          DEFAULT: "#8F4843", // base
          light: "#9A5A56", // 10% lighter
          lighter: "#A56D69", // 20% lighter
        },
        wood: {
          darker: "#A56949", // 20% darker
          dark: "#B0764E", // 10% darker
          DEFAULT: "#BB8452", // base
          light: "#C39365", // 10% lighter
          lighter: "#C89D74", // 20% lighter
        },
        lightWood: {
          darker: "#9F8762", // 20% darker
          dark: "#B3986F", // 10% darker
          DEFAULT: "#C7A97B", // base
          light: "#CDB288", // 10% lighter
          lighter: "#D2BA95", // 20% lighter
        },
        softBeige: {
          darker: "#AEA292", // 20% darker
          dark: "#C3B6A4", // 10% darker
          DEFAULT: "#D9CAB6", // base
          light: "#DDCFBD", // 10% lighter
          lighter: "#E1D5C5", // 20% lighter
          lightest: "#FAF4EC", // 30% lighter
        },
        wood2: {
          darker: "#9F7C61", // 20% darker
          dark: "#B38F6F", // 10% darker
          DEFAULT: "#C7A37C", // base
          light: "#D2AF8B", // 10% lighter
          lighter: "#DDBB9A", // 20% lighter
        },
        sageGreen: {
          darker: "#3f4409", // 20% darker
          dark: "#5b5f32", // 10% darker
          DEFAULT: "#8B8F65", // base
          light: "#bdc19c", // 10% lighter
          lighter: "#eef0e0", // 20% lighter
        },
        deepTeal: "#2E3F44",
      },
    },
  },
  plugins: [],
};
