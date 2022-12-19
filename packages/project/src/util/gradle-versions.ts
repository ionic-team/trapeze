export function compare(version1: string, version2: string) {
  // Split the version strings into arrays of individual version components
  const version1Components = version1.split('.');
  const version2Components = version2.split('.');

  // Iterate through each component of the version strings
  for (let i = 0; i < version1Components.length || i < version2Components.length; i++) {
    // Convert the current component to a number (or NaN if it can't be converted)
    const version1Component = Number(version1Components[i]);
    const version2Component = Number(version2Components[i]);

    // If one of the components is NaN (not a number), we need to handle it differently
    if (isNaN(version1Component) || isNaN(version2Component)) {
      // Compare the non-numeric components as strings
      const stringCompareResult = compareStringComponents(version1Components[i], version2Components[i]);
      if (stringCompareResult !== 0) {
        return stringCompareResult;
      }
    } else {
      // Compare the numeric components
      if (version1Component > version2Component) {
        return 1;
      } else if (version1Component < version2Component) {
        return -1;
      }
    }
  }

  // If we've made it this far, the versions are either equal or one is a prefix of the other
  // In either case, we consider them equal
  return 0;
}

function compareStringComponents(str1: string, str2: string) {
  if (str1 === str2) {
    return 0;
  } else if (str1 === undefined) {
    return -1;
  } else if (str2 === undefined) {
    return 1;
  } else {
    return str1.localeCompare(str2);
  }
}