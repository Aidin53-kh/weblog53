

module.exports = {
  important: true,
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: '#65adff',
      },
      screens: {
        "lg": '1055px',
        "md": '845px'
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}
