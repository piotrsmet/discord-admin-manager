"use client";

import { useState } from "react";
import { generateServerReport } from "@/app/actions/report";
import { Loader2, Sparkles, X, Download } from "lucide-react";

export default function ReportGenerator({ guildId }: { guildId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateReport = async () => {
    setIsModalOpen(true);
    setIsGenerating(true);
    setError(null);
    setReport(null);

    try {
      const result = await generateServerReport(guildId);
      if (result.error) {
        setError(result.error);
      } else {
        setReport(result.report || null);
      }
    } catch (err) {
      setError("Wystąpił nieoczekiwany błąd podczas generowania raportu.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `discord-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatReportMarkdown = (text: string) => {
    // Simple parser for bold and lists since we don't have a full markdown parser imported
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n- /g, "<br/>• ");
  };

  return (
    <>
      <button 
        onClick={handleGenerateReport}
        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-lg shadow-primary/20"
      >
        <Sparkles className="w-4 h-4" />
        Generuj raport AI
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#313338] rounded-xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col border border-[#1e1f22]">
            <div className="flex items-center justify-between p-4 border-b border-[#1e1f22]/50 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-primary" />
                Raport o stanie serwera
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-gray-400 animate-pulse">Sztuczna inteligencja analizuje dane serwera...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                  {error}
                </div>
              ) : report ? (
                <div 
                  className="text-gray-300 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: formatReportMarkdown(report) }}
                />
              ) : null}
            </div>

            <div className="p-4 bg-[#2b2d31] border-t border-[#1e1f22]/50 shrink-0 flex justify-end gap-3">
              {report && !isGenerating && (
                <button 
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Pobierz (.md)
                </button>
              )}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
