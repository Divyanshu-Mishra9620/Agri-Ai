import { motion } from "framer-motion";

export function SchemeCard({ item, lang, sectorColor }) {
  const title = item.titles?.[lang] || item.titles?.en || "—";

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="relative block rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-lg overflow-hidden group"
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${sectorColor}`}></div>
      
      {/* Floating background gradient */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r ${sectorColor} opacity-5 blur-3xl rounded-full group-hover:opacity-10 transition-opacity duration-500`}></div>

      <div className="relative p-8">
        {/* Header with badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${sectorColor} shadow-md`}>
            {item.badge}
          </div>
          <div className={`text-2xl font-bold bg-gradient-to-r ${sectorColor} bg-clip-text text-transparent`}>
            {item.amount}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {title}
        </h4>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {item.description}
        </p>

        {/* Benefits & Eligibility */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-sm">💰</span>
            <span className="text-xs text-gray-600">
              <strong>Benefits:</strong> {item.benefits}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-sm">👥</span>
            <span className="text-xs text-gray-600">
              <strong>Eligibility:</strong> {item.eligibility}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-100">
          <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 font-medium">
            {item.source}
          </span>
          <span className="text-gray-500">{item.ts}</span>
        </div>

        {/* Hover arrow */}
        <motion.div
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          →
        </motion.div>
      </div>
    </motion.a>
  );
}
