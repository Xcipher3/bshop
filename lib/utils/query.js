/**
 * Parse query parameters from URL
 * @param {string} search - The search string from URL
 * @returns {Object} Parsed query parameters
 */
export const parseQuery = (search) => {
  if (typeof search !== 'string') return {};
  
  // Handle empty string
  if (search === '') return {};
  
  // Remove leading '?' if present
  const cleanSearch = search.startsWith('?') ? search.substring(1) : search;
  
  const params = new URLSearchParams(cleanSearch);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      // Handle arrays
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Stringify query parameters for URL
 * @param {Object} params - Query parameters to stringify
 * @returns {string} Stringified query parameters
 */
export const stringifyQuery = (params) => {
  const urlParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach(val => urlParams.append(key, val));
    } else if (value !== null && value !== undefined) {
      urlParams.set(key, value);
    }
  }
  
  return urlParams.toString();
};

/**
 * Update query parameters in URL
 * @param {Object} currentParams - Current query parameters
 * @param {Object} newParams - New parameters to add/update
 * @returns {string} Updated query string
 */
export const updateQuery = (currentParams, newParams) => {
  const updatedParams = { ...currentParams, ...newParams };
  
  // Remove empty arrays and null/undefined values
  Object.keys(updatedParams).forEach(key => {
    if (
      updatedParams[key] === null || 
      updatedParams[key] === undefined || 
      (Array.isArray(updatedParams[key]) && updatedParams[key].length === 0)
    ) {
      delete updatedParams[key];
    }
  });
  
  return stringifyQuery(updatedParams);
};

/**
 * Remove a specific filter from query parameters
 * @param {Object} currentParams - Current query parameters
 * @param {string} filterKey - The key of the filter to remove
 * @param {string} filterValue - The value to remove (optional)
 * @returns {string} Updated query string
 */
export const removeFilter = (currentParams, filterKey, filterValue = null) => {
  const updatedParams = { ...currentParams };
  
  if (filterValue === null) {
    // Remove entire filter key
    delete updatedParams[filterKey];
  } else if (Array.isArray(updatedParams[filterKey])) {
    // Remove specific value from array
    updatedParams[filterKey] = updatedParams[filterKey].filter(val => val !== filterValue);
    if (updatedParams[filterKey].length === 0) {
      delete updatedParams[filterKey];
    }
  } else if (updatedParams[filterKey] === filterValue) {
    // Remove single value
    delete updatedParams[filterKey];
  }
  
  return stringifyQuery(updatedParams);
};

/**
 * Toggle a filter value in query parameters
 * @param {Object} currentParams - Current query parameters
 * @param {string} filterKey - The key of the filter to toggle
 * @param {string} filterValue - The value to toggle
 * @returns {string} Updated query string
 */
export const toggleFilter = (currentParams, filterKey, filterValue) => {
  const updatedParams = { ...currentParams };
  
  if (!updatedParams[filterKey]) {
    // If filter key doesn't exist, create it as an array
    updatedParams[filterKey] = [filterValue];
  } else if (Array.isArray(updatedParams[filterKey])) {
    // If it's already an array, toggle the value
    if (updatedParams[filterKey].includes(filterValue)) {
      updatedParams[filterKey] = updatedParams[filterKey].filter(val => val !== filterValue);
    } else {
      updatedParams[filterKey] = [...updatedParams[filterKey], filterValue];
    }
    
    // If array is empty, remove the key
    if (updatedParams[filterKey].length === 0) {
      delete updatedParams[filterKey];
    }
  } else {
    // If it's a single value, convert to array
    if (updatedParams[filterKey] === filterValue) {
      delete updatedParams[filterKey];
    } else {
      updatedParams[filterKey] = [updatedParams[filterKey], filterValue];
    }
  }
  
  return stringifyQuery(updatedParams);
};

/**
 * Clear all filters from query parameters
 * @param {Object} currentParams - Current query parameters
 * @returns {string} Empty query string
 */
export const clearAllFilters = (currentParams) => {
  const filterKeys = ['category', 'price_min', 'price_max', 'sort'];
  const updatedParams = { ...currentParams };
  
  filterKeys.forEach(key => {
    delete updatedParams[key];
  });
  
  return stringifyQuery(updatedParams);
};