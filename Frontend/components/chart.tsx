export default function Chart( ){
    return( 
        <div className="relative w-full grid grid-cols-1 gap-6 mb-10 md:mb-12 px-4 gap-4">
            <div className="absolute inset-0 rounded-3xl"></div>
            <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            {/* Animated Background Grid */}
            <defs>
                <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                >
                <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="0.8"
                    opacity="0.3"
                />
                </pattern>
                <linearGradient
                id="nodeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
                >
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" rx="20" />

            {/* Connection Lines with Animation */}
            <g className="opacity-80">
                {/* Top suppliers */}
                <line
                x1="400"
                y1="250"
                x2="300"
                y2="100"
                stroke="#34D399"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
                strokeDasharray="8,8"
                >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;16"
                    dur="2s"
                    repeatCount="indefinite"
                />
                </line>
                <line
                x1="400"
                y1="250"
                x2="500"
                y2="100"
                stroke="#34D399"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
                strokeDasharray="8,8"
                >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;16"
                    dur="2s"
                    repeatCount="indefinite"
                />
                </line>
                {/* Side suppliers */}
                <line
                x1="400"
                y1="250"
                x2="150"
                y2="250"
                stroke="#FF5555"
                strokeWidth="6"
                strokeLinecap="round"
                className="animate-pulse"
                />
                <line
                x1="400"
                y1="250"
                x2="650"
                y2="250"
                stroke="#34D399"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
                strokeDasharray="8,8"
                >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;16"
                    dur="2s"
                    repeatCount="indefinite"
                />
                </line>
                {/* Bottom suppliers */}
                <line
                x1="400"
                y1="250"
                x2="250"
                y2="450"
                stroke="#FBBF24"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="5,5"
                >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;10"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
                </line>
                <line
                x1="400"
                y1="250"
                x2="550"
                y2="450"
                stroke="#FBBF24"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="5,5"
                >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;10"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
                </line>
            </g>

            {/* Central Node with Pulsing Effect */}
            <circle
                cx="400"
                cy="250"
                r="50"
                fill="url(#nodeGradient)"
                stroke="#3B82F6"
                strokeWidth="4"
                filter="url(#glow)"
                className="shadow-xl"
            >
                <animate
                attributeName="r"
                values="50;55;50"
                dur="3s"
                repeatCount="indefinite"
                />
            </circle>
            <text
                x="400"
                y="260"
                textAnchor="middle"
                className="text-xl font-bold fill-white"
            >
                HUB
            </text>

            {/* Supplier Nodes */}
            {/* Top Left - Supplier A */}
            <g className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                <circle
                cx="300"
                cy="100"
                r="30"
                fill="#34D399"
                className="animate-pulse shadow-lg group-hover:shadow-xl group-hover:shadow-green-300/60"
                >
                <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                />
                </circle>
                <text
                x="300"
                y="105"
                textAnchor="middle"
                className="text-sm font-semibold fill-white"
                >
                LOW
                </text>
                <text
                x="300"
                y="60"
                textAnchor="middle"
                className="mb-2 text-base font-medium fill-gray-800 dark:fill-gray-200 group-hover:font-bold"
                >
                Supplier A
                </text>
            </g>

            {/* Top Right - Supplier B */}
            <g className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                <circle
                cx="500"
                cy="100"
                r="30"
                fill="#34D399"
                className="animate-pulse shadow-lg group-hover:shadow-xl group-hover:shadow-green-300/60"
                >
                <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="2.2s"
                    repeatCount="indefinite"
                />
                </circle>
                <text
                x="500"
                y="105"
                textAnchor="middle"
                className="text-sm font-semibold fill-white"
                >
                LOW
                </text>
                <text
                x="500"
                y="60"
                textAnchor="middle"
                className="text-base font-medium fill-gray-800 dark:fill-gray-200 group-hover:font-bold"
                >
                Supplier B
                </text>
            </g>

            {/* Left - High Risk Supplier */}
            <g className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                <circle cx="150" cy="250" r="30" fill="#FF5555" className="shadow-lg group-hover:shadow-xl group-hover:shadow-red-300/60">
                <animate
                    attributeName="r"
                    values="30;35;30"
                    dur="1s"
                    repeatCount="indefinite"
                />
                </circle>
                <text
                x="150"
                y="255"
                textAnchor="middle"
                className="text-sm font-semibold fill-white"
                >
                HIGH
                </text>
                <text
                x="150"
                y="210"
                textAnchor="middle"
                className="text-base font-medium fill-gray-800 dark:fill-gray-200 group-hover:font-bold"
                >
                Supplier F
                </text>
            </g>

            {/* Right - Supplier C */}
            <g className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                <circle
                cx="650"
                cy="250"
                r="30"
                fill="#34D399"
                className="animate-pulse shadow-lg group-hover:shadow-xl group-hover:shadow-green-300/60"
                >
                <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="2.4s"
                    repeatCount="indefinite"
                />
                </circle>
                <text
                x="650"
                y="255"
                textAnchor="middle"
                className="text-sm font-semibold fill-white"
                >
                LOW
                </text>
                <text
                x="650"
                y="210"
                textAnchor="middle"
                className="text-base font-medium fill-gray-800 dark:fill-gray-200 group-hover:font-bold"
                >
                Supplier C
                </text>
            </g>

            {/* Bottom Left - Supplier E */}
            <g className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                <circle cx="250" cy="450" r="30" fill="#FBBF24" className="shadow-lg group-hover:shadow-xl group-hover:shadow-yellow-300/60">
                <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="1.8s"
                    repeatCount="indefinite"
                />
                </circle>
                <text
                x="250"
                y="455"
                textAnchor="middle"
                className="text-sm font-semibold fill-white"
                >
                MED
                </text>
                <text
                x="210"
                y="410"
                textAnchor="middle"
                className="text-base font-medium fill-gray-800 dark:fill-gray-200 group-hover:font-bold"
                >
                Supplier E
                </text>
            </g>

            {/* Bottom Right - Supplier D */}
            <g className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                <circle cx="550" cy="450" r="30" fill="#FBBF24" className="shadow-lg group-hover:shadow-xl group-hover:shadow-yellow-300/60">
                <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="1.6s"
                    repeatCount="indefinite"
                />
                </circle>
                <text
                x="550"
                y="455"
                textAnchor="middle"
                className="text-sm font-semibold fill-white"
                >
                MED
                </text>
                <text
                x="570"
                y="410"
                textAnchor="middle"
                className="text-base font-medium fill-gray-800 dark:fill-gray-200 group-hover:font-bold"
                >
                Supplier D
                </text>
            </g>
            </svg>
        </div>
    )
}