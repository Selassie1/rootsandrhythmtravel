// src/app/admin/loading.tsx
import React from 'react';

export default function AdminLoading() {
  return (
    <div className="w-full h-full p-8 lg:p-12 xl:p-16 flex flex-col gap-10">
      
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3">
         <div className="h-10 w-64 bg-white/5 rounded-md animate-pulse"></div>
         <div className="h-4 w-48 bg-white/5 rounded-md animate-pulse"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[...Array(4)].map((_, i) => (
           <div key={i} className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 h-36 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
           </div>
         ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 h-96 relative overflow-hidden flex flex-col gap-6 mt-4">
         <div className="flex justify-between items-center w-full">
            <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse"></div>
            <div className="h-10 w-40 bg-white/5 rounded-full animate-pulse"></div>
         </div>
         <div className="w-full h-px bg-white/5"></div>
         <div className="flex-1 w-full bg-white/5 rounded-xl animate-pulse"></div>
      </div>

    </div>
  );
}
