// Dynamic image index: discovers images under `src/assets/images/works/*` using Vite's
// `import.meta.glob`. This ensures correct URLs (including base) and works for dev/build.
// To add images, drop them into `src/assets/images/works/{featured,row1,row2,capsules}`.

const modules = import.meta.glob('../assets/images/works/**', { eager: true, as: 'url' });

function groupByFolder(mods) {
  const groups = { featured: [], row1: [], row2: [], capsules: [] };
  for (const [p, url] of Object.entries(mods)) {
    // path example: '../assets/images/works/featured/1.svg'
    if (p.includes('/featured/')) groups.featured.push(url);
    else if (p.includes('/row1/')) groups.row1.push(url);
    else if (p.includes('/row2/')) groups.row2.push(url);
    else if (p.includes('/capsules/')) groups.capsules.push(url);
  }

  // Sort by filename (numeric when possible)
  const sortByFilename = (a, b) => {
    const na = a.split('/').pop().toLowerCase();
    const nb = b.split('/').pop().toLowerCase();
    return na.localeCompare(nb, undefined, { numeric: true });
  };

  for (const k of Object.keys(groups)) groups[k].sort(sortByFilename);
  return groups;
}

const { featured, row1, row2, capsules } = groupByFolder(modules);

export { featured, row1, row2, capsules };
