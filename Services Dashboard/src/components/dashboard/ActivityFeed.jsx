import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, User, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const activityData = [
  {
    id: 1,
    type: "validation",
    message: "Patient John Smith validated successfully",
    time: new Date(Date.now() - 5 * 60000),
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "document",
    message: "New referral document processed",
    time: new Date(Date.now() - 15 * 60000),
    icon: FileText,
    color: "text-blue-600"
  },
  {
    id: 3,
    type: "alert",
    message: "Missing F2F document flagged",
    time: new Date(Date.now() - 25 * 60000),
    icon: AlertTriangle,
    color: "text-orange-600"
  },
  {
    id: 4,
    type: "patient",
    message: "New patient admitted to PG-1",
    time: new Date(Date.now() - 35 * 60000),
    icon: User,
    color: "text-purple-600"
  }
];

export default function ActivityFeed() {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Activity className="w-5 h-5 text-green-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activityData.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(activity.time, "h:mm a")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}