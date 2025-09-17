import { motion } from "framer-motion";

export function SchemeCard({ item, lang, sectorColor }) {
  const title = item.titles?.[lang] || item.titles?.en || "—";

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="relative block rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Clean gradient accent - consistent green theme */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      
      {/* Subtle background gradient - matching homepage */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-3xl rounded-full group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"></div>

      <div className="relative p-8 h-full flex flex-col">
        {/* Header with badge - clean design */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            className="px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {item.badge}
          </motion.div>
          <motion.div 
            className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {item.amount}
          </motion.div>
        </div>

        {/* Title - clean typography */}
        <h4 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-green-700 transition-colors duration-300 leading-tight">
          {title}
        </h4>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Benefits & Eligibility - clean icons */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">💰</span>
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-700 leading-relaxed">
                <span className="font-semibold text-green-700">Benefits:</span> {item.benefits}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">👥</span>
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-700 leading-relaxed">
                <span className="font-semibold text-green-700">Eligibility:</span> {item.eligibility}
              </span>
            </div>
          </div>
        </div>

        {/* Footer - clean design */}
        <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-100/80 mt-auto">
          <span className="px-3 py-2 rounded-full bg-green-50 text-green-700 font-semibold">
            {item.source}
          </span>
          <span className="text-gray-500 font-medium">{item.ts}</span>
        </div>

        {/* Hover arrow - green theme */}
        <motion.div
          className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg opacity-0 group-hover:opacity-100"
          initial={{ scale: 0, rotate: -45 }}
          whileHover={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </motion.a>
  );
}
