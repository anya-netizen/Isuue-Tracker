import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const colorClasses = {
  blue: {
    bg: "bg-gradient-to-r from-blue-500 to-blue-600",
    icon: "text-blue-600",
    trend: "text-blue-700"
  },
  green: {
    bg: "bg-gradient-to-r from-green-500 to-green-600",
    icon: "text-green-600", 
    trend: "text-green-700"
  },
  orange: {
    bg: "bg-gradient-to-r from-orange-500 to-orange-600",
    icon: "text-orange-600",
    trend: "text-orange-700"
  },
  purple: {
    bg: "bg-gradient-to-r from-purple-500 to-purple-600",
    icon: "text-purple-600",
    trend: "text-purple-700"
  }
};

export default function MetricCard({ title, value, icon: Icon, trend, trendUp, color = "blue" }) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 ${colors.bg} rounded-full opacity-10`} />
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colors.bg} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
            {trend && (
              <Badge variant="outline" className={`${colors.trend} border-current bg-transparent font-medium`}>
                {trendUp !== undefined && (
                  trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {trend}
              </Badge>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}