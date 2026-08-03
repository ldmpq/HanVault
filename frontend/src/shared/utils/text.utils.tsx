export const highlightTargetWord = (text: string, target: string) => {
  if (!target || !text.includes(target)) return text;
  const parts = text.split(target);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-[#A82B2B]">{target}</span>}
        </span>
      ))}
    </>
  );
};