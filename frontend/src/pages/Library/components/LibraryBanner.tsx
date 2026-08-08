export default function LibraryBanner() {
  return (
    <div className="bg-surface rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center mb-10 shadow-sm border border-line overflow-hidden">
      <div className="max-w-md z-10 mb-8 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-main mb-4 tracking-tight">Flashcards</h1>
        <p className="text-sub leading-relaxed text-sm md:text-base">
          Học và ôn tập từ vựng bằng Flashcard với các bộ thẻ theo trình độ HSK, chủ đề hoặc tự tạo theo sở thích.
        </p>
      </div>
      <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm border border-line/50">
        <img 
          src="/images/chinese-flashcards.jpg" 
          alt="Study Desk Illustration" 
          className="w-full h-48 md:h-64 object-cover" 
        />
      </div>
    </div>
  );
}