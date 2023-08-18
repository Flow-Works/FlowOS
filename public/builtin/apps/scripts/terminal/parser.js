export default (args) => {
  const options = args.map(arg => {
    if (arg.startsWith('--') && arg.includes('=') === false) return arg;
    if (arg.startsWith('-') && arg.includes('=') === false) return arg;
    return null;
  }).filter((element) => element !== undefined);

  const vars = {};

  args.forEach((arg) => {
    if (arg.startsWith('--') && arg.includes('=')) {
      vars[arg.split('=')[0].replace('--', '')] = arg.split('=')[1];
    }
  });

  args.shift();
  const values = args.map(arg => {
    if (!arg.startsWith('-')) return arg;
    return null;
  }).filter((element) => element !== undefined);

  return { options, vars, values };
};
