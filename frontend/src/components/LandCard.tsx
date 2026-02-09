import { MapPin, Square, User, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface LandCardProps {
    id: string;
    location: string;
    area: string;
    owner: string;
    isVerified: boolean;
    transferCount: number;
    onClick?: () => void;
    showActions?: boolean;
}

export default function LandCard({
    id,
    location,
    area,
    owner,
    isVerified,
    transferCount,
    onClick,
    showActions = false,
}: LandCardProps) {
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group"
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Land ID
                        </span>
                        {isVerified && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        #{id}
                    </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Square className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{area} sq ft</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-mono truncate max-w-[200px]" title={owner}>
                        {owner.slice(0, 4)}...{owner.slice(-4)}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{transferCount} transfers</span>
                </div>
            </div>

            {/* Action */}
            {showActions && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
