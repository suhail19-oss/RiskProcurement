import {
  CheckCircle,
  AlertTriangle,
  ShieldAlert
 
} from "lucide-react"

export default function Metrics( ){
    return(
        <div className="w-[60%] mx-auto grid grid-cols-1 gap-6 px-4">
              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-900/20 border border-green-200/80 dark:border-green-700/30 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Low Risk
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">50%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 bg-green-600 dark:bg-green-400 rounded-full relative overflow-hidden"
                    style={{ width: '50%' }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-green-600 dark:text-green-400">+2%</span> from last month
                </p>
              </div>

              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-900/20 border border-yellow-200/80 dark:border-yellow-700/30 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-yellow-500 dark:text-yellow-400" size={20} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Medium Risk
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">33%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full relative overflow-hidden"
                    style={{ width: '33%' }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-yellow-500 dark:text-yellow-400">-1%</span> from last month
                </p>
              </div>

              <div className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-900/20 border border-red-200/80 dark:border-red-700/30 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-red-500 dark:text-red-400" size={20} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      High Risk
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-red-500 dark:text-red-400">17%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 bg-red-500 dark:bg-red-400 rounded-full relative overflow-hidden"
                    style={{ width: '17%' }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-red-500 dark:text-red-400">-1%</span> from last month
                </p>
              </div>
            </div>
    )
}