import { useNavigate } from 'react-router-dom';

interface ProfileActivitiesProps {
  activities: any[];
}

export default function ProfileActivities({ activities }: ProfileActivitiesProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
      
      {activities.length > 0 ? (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {activities.map((act, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-[#A82B2B] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                  <time className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">{act.time}</time>
                  <div className="text-sm font-bold text-gray-900">{act.title}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">{act.description}</div>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-6">
          <p className="text-sm text-gray-400 font-medium">Bạn chưa có hoạt động nào gần đây.</p>
          <button onClick={() => navigate('/library')} className="mt-4 px-5 py-2.5 bg-red-50 text-[#A82B2B] rounded-xl text-sm font-bold transition-colors hover:bg-red-100">Bắt đầu học ngay</button>
        </div>
      )}
    </div>
  );
}