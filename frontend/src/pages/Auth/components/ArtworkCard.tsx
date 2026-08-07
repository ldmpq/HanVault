interface ArtworkCardProps {
  title: string;
  imageSrc: string;
}

export default function ArtworkCard({ title, imageSrc }: ArtworkCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white flex p-2.5 w-full hover:scale-[1.02] transition-transform duration-300">
      <div className="w-[60%] aspect-[4/3] rounded-[18px] overflow-hidden shrink-0 shadow-inner relative bg-[#F3ECE3]">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
      </div>
      
      <div className="w-[40%] pl-4 pr-2 flex flex-col justify-center">
        <h3 className="text-[13px] font-bold text-gray-800 mb-3 tracking-tight">{title}</h3>
        <div className="h-6 w-full bg-gray-50 rounded-[6px] mb-2 flex items-center px-2.5">
          <span className="text-[8px] text-gray-400 font-medium">Email address</span>
        </div>
        <div className="h-6 w-full bg-gray-50 rounded-[6px] mb-3.5 flex items-center px-2.5">
          <span className="text-[8px] text-gray-400 font-medium">Password</span>
        </div>
        <div className="h-7 w-full bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center">
          <span className="text-[9px] text-gray-500 font-bold">Log In</span>
        </div>
      </div>
    </div>
  );
}