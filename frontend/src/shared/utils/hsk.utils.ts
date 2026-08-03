export const getUIConfigForLevel = (level: number | string) => {
  const configs: Record<string, any> = {
    '1': { tag: 'Nhập môn', bgColor: 'bg-red-50', iconColor: 'text-red-500', icon: '1' },
    '2': { tag: 'Sơ cấp', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', icon: '2' },
    '3': { tag: 'Trung cấp thấp', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', icon: '3' },
    '4': { tag: 'Trung cấp', bgColor: 'bg-pink-50', iconColor: 'text-pink-500', icon: '4' },
    '5': { tag: 'Cao cấp', bgColor: 'bg-amber-50', iconColor: 'text-amber-500', icon: '5' },
    '6': { tag: 'Thành thạo', bgColor: 'bg-gray-50', iconColor: 'text-gray-500', icon: '6' },
  };
  return configs[String(level)] || configs['1'];
};