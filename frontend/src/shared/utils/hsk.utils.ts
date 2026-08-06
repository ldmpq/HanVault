export const getUIConfigForLevel = (level: number | string) => {
  const configs: Record<string, any> = {
    '1': { tag: 'Nhập môn', bgColor: 'bg-red-50', iconColor: 'text-red-500', icon: '1' },
    '2': { tag: 'Cơ bản', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', icon: '2' },
    '3': { tag: 'Sơ cấp', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', icon: '3' },
    '4': { tag: 'Trung cấp', bgColor: 'bg-lime-50', iconColor: 'text-lime-600', icon: '4' },
    '5': { tag: 'Cao cấp', bgColor: 'bg-green-50', iconColor: 'text-green-600', icon: '5' },
    '6': { tag: 'Nâng cao', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', icon: '6' },
    '7': { tag: 'Thành thạo', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', icon: '7' },
    '8': { tag: 'Chuyên gia', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', icon: '8' },
    '9': { tag: 'Học thuật', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', icon: '9' },
  };

  return configs[String(level)] ?? configs['1'];
};