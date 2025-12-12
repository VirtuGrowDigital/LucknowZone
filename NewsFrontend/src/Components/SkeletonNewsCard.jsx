const shimmerStyle = {
  background: `linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.6) 50%, 
      rgba(255,255,255,0) 100%)`,
  animation: "shimmer 1.6s infinite",
  position: "absolute",
  inset: 0,
  transform: "translateX(-100%)"
};

export default function SkeletonNewsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 overflow-hidden">

      {/* IMAGE */}
      <div className="relative h-40 w-full bg-gray-200 rounded-xl overflow-hidden">
        <div style={shimmerStyle}></div>
      </div>

      {/* TITLE */}
      <div className="relative mt-4 h-4 bg-gray-200 rounded w-3/4 overflow-hidden">
        <div style={shimmerStyle}></div>
      </div>

      {/* DESCRIPTION LINE 1 */}
      <div className="relative mt-2 h-4 bg-gray-200 rounded w-full overflow-hidden">
        <div style={shimmerStyle}></div>
      </div>

      {/* DESCRIPTION LINE 2 */}
      <div className="relative mt-2 h-4 bg-gray-200 rounded w-5/6 overflow-hidden">
        <div style={shimmerStyle}></div>
      </div>

      {/* TIME */}
      <div className="relative mt-4 h-3 bg-gray-200 rounded w-1/4 overflow-hidden">
        <div style={shimmerStyle}></div>
      </div>

    </div>
  );
}
