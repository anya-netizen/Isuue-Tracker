import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ValidationQueue({ documents }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { color: "bg-blue-100 text-blue-700", icon: Clock },
      extracted: { color: "bg-green-100 text-green-700", icon: FileText },
      error: { color: "bg-red-100 text-red-700", icon: AlertCircle }
    };
    
    const config = statusConfig[status] || statusConfig.processing;
    const IconComponent = config.icon;
    
    return (
      <Badge variant="secondary" className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Validation Queue
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{doc.title}</p>
                  <p className="text-sm text-slate-500">
                    Patient: {doc.patient_id} • {doc.document_type}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {format(new Date(doc.date_received), "MMM d, h:mm a")}
                  </p>
                </div>
                <div className="ml-4">
                  {getStatusBadge(doc.processing_status)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}