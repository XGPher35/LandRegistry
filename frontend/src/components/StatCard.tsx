import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    gradient?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    gradient = "from-blue-500 to-blue-600",
}: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                    {trend && trendValue && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={`text-sm font-medium ${trend === "up"
                                        ? "text-green-600"
                                        : trend === "down"
                                            ? "text-red-600"
                                            : "text-gray-500"
                                    }`}
                            >
                                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}
