import { useState } from 'react';

export function useProductOptions(initialOptions = []) {
  const [options, setOptions] = useState(initialOptions);

  const addOption = (name, values) => {
    if (!name || !values) return;
    setOptions(prev => [...prev, {
      name,
      values: values.split(',').map(v => v.trim())
    }]);
  };

  const removeOption = (index) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index, newOption) => {
    setOptions(prev => prev.map((option, i) => 
      i === index ? newOption : option
    ));
  };

  return {
    options,
    setOptions,
    addOption,
    removeOption,
    updateOption
  };
}