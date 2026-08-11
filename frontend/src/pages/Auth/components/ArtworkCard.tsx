interface ArtworkCardProps {
  title: string;
  imageSrc: string;
}

export default function ArtworkCard({ title, imageSrc }: ArtworkCardProps) {
  return (
    <div className="bg-surface/90 backdrop-blur-sm rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-line p-2.5 w-full hover:scale-[1.02] transition-transform duration-300">
      <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden shadow-inner relative bg-line/30 group">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90">
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white text-[15px] font-bold tracking-wide drop-shadow-md">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}