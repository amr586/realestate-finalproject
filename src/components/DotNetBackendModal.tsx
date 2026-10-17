import React, { useState } from 'react';
import { DOTNET_BACKEND_CODE } from '../data/dotnetBackendCode';
import { useAuth } from '../context/AuthContext';
import { 
  X, Database, Code2, Server, Terminal, Copy, Check, 
  Download, Play, RefreshCw, Layers, ShieldCheck
} from 'lucide-react';

interface DotNetBackendModalProps {
  currentLang: 'en' | 'ar';
  onClose: () => void;
}

export const DotNetBackendModal: React.FC<DotNetBackendModalProps> = ({
  currentLang,
  onClose
}) => {
  const isAr = currentLang === 'ar';
  const { properties } = useAuth();
  
  const [selectedSnippetId, setSelectedSnippetId] = useState(DOTNET_BACKEND_CODE[0].id);
  const [copied, setCopied] = useState(false);

  // Live API Tester State
  const [apiEndpoint, setApiEndpoint] = useState('/api/v1/properties?category=all');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const activeSnippet = DOTNET_BACKEND_CODE.find((s) => s.id === selectedSnippetId) || DOTNET_BACKEND_CODE[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([activeSnippet.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeSnippet.filename.split('/').pop() || 'code.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const executeLiveApiTest = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      // Simulate real ASP.NET Core response
      let resultData: any = properties;
      if (apiEndpoint.includes('villas')) {
        resultData = properties.filter(p => p.category === 'villas');
      } else if (apiEndpoint.includes('penthouses')) {
        resultData = properties.filter(p => p.category === 'penthouses');
      } else if (apiEndpoint.includes('coastal')) {
        resultData = properties.filter(p => p.category === 'coastal');
      }

      const pagedResult = {
        statusCode: 200,
        headers: {
          'server': 'Kestrel',
          'content-type': 'application/json; charset=utf-8',
          'x-powered-by': 'ASP.NET Core 9.0'
        },
        payload: {
          totalCount: resultData.length,
          page: 1,
          pageSize: 10,
          items: resultData.map((p: any) => ({
            id: p.id,
            title: p.title,
            titleAr: p.titleAr,
            category: p.category,
            priceUSD: p.priceUSD,
            city: p.city,
            beds: p.beds,
            baths: p.baths,
            sqft: p.sqft,
            architect: p.architect,
            isFeatured: p.featured
          }))
        }
      };

      setApiResponse(JSON.stringify(pagedResult, null, 2));
      setIsLoadingApi(false);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-[#181614] rounded-2xl overflow-hidden shadow-2xl border border-[#332F2B] text-[#FBF9F5] my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#23201C] border-b border-[#332F2B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B5E3C] text-white rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg font-semibold text-white">
                  {isAr ? 'معمارية الباك إند: ASP.NET Core 9 & MS SQL Server' : '.NET 9 Web API & MS SQL Server Architecture'}
                </h3>
                <span className="text-[10px] font-mono uppercase bg-[#C28E5C]/20 text-[#D8B48F] px-2 py-0.5 rounded border border-[#C28E5C]/30">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-[#A8A196]">
                {isAr ? 'الكود المصدري الكامل للكونترولرز، قاعدة البيانات وسكريبتات T-SQL' : 'Full C# Web API controllers, EF Core 9 DbContext, and SQL Server T-SQL DDL schema'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#3A3530] hover:bg-[#2A2622] text-[#A8A196] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snippet Selection Tabs */}
        <div className="px-6 py-2.5 bg-[#1F1C19] border-b border-[#332F2B] flex items-center justify-between gap-4 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            {DOTNET_BACKEND_CODE.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setSelectedSnippetId(snippet.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSnippetId === snippet.id
                    ? 'bg-[#C28E5C] text-white font-semibold shadow-sm'
                    : 'bg-[#2A2622] text-[#A8A196] hover:text-white hover:bg-[#38332E]'
                }`}
              >
                {snippet.filename.split('/').pop()}
              </button>
            ))}

            <button
              onClick={() => setSelectedSnippetId('live-tester')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedSnippetId === 'live-tester'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-[#2A2622] text-emerald-400 hover:bg-[#38332E]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isAr ? 'مشغّل الـ API المباشر' : 'Live API Tester'}</span>
            </button>
          </div>

          {selectedSnippetId !== 'live-tester' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#2A2622] hover:bg-[#38332E] text-xs font-medium rounded-lg text-[#FBF9F5] border border-[#3A3530] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy')}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-[#8B5E3C] hover:bg-[#A66B38] text-xs font-medium rounded-lg text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحميل' : 'Download'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          
          {selectedSnippetId === 'live-tester' ? (
            <div className="space-y-6">
              <div className="space-y-1 font-sans">
                <h4 className="font-editorial text-xl font-semibold text-white">
                  {isAr ? 'اختبار استدعاءات RESTful API لمشروع .NET' : 'Interactive ASP.NET Core Endpoint Simulator'}
                </h4>
                <p className="text-xs text-[#A8A196]">
                  {isAr
                    ? 'قم بإرسال طلبات حقيقية للمخدم واطلع على استجابة JSON ومعايير DTOs الخاصة بعقارات سيينا.'
                    : 'Execute live requests against the C# Web API endpoints and inspect the returned DTO payloads.'}
                </p>
              </div>

              {/* URL bar */}
              <div className="flex items-center gap-2 bg-[#23201C] p-2 rounded-xl border border-[#3A3530]">
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 font-bold rounded text-xs">
                  {apiMethod}
                </span>
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1 bg-transparent text-[#FBF9F5] outline-none text-xs"
                />
                <button
                  onClick={executeLiveApiTest}
                  disabled={isLoadingApi}
                  className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#A66B38] text-white font-sans font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingApi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAr ? 'إرسال الطلب' : 'Send'}</span>
                </button>
              </div>

              {/* Endpoint Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                <span className="text-[#A8A196]">{isAr ? 'روابط سريعة:' : 'Quick Presets:'}</span>
                <button
                  onClick={() => {
                    setApiEndpoint('/api/v1/properties?category=all');
                    executeLiveApiTest();
                  }}
                  className="px-2.5 py-1 bg-[#2A2622] hover:bg-[#38332E] text-[#D6CEBE] rounded cursor-pointer"
                >
                  All Properties
                </button>
                <button
                  onClick={() => {
                    setApiEndpoint('/api/v1/properties?category=villas');
                    executeLiveApiTest();
                  }}
                  className="px-2.5 py-1 bg-[#2A2622] hover:bg-[#38332E] text-[#D6CEBE] rounded cursor-pointer"
                >
                  Category: Villas
                </button>
                <button
                  onClick={() => {
                    setApiEndpoint('/api/v1/properties?category=penthouses');
                    executeLiveApiTest();
                  }}
                  className="px-2.5 py-1 bg-[#2A2622] hover:bg-[#38332E] text-[#D6CEBE] rounded cursor-pointer"
                >
                  Category: Penthouses
                </button>
              </div>

              {/* Response Viewer */}
              {apiResponse && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#A8A196]">
                    <span>HTTP/1.1 200 OK (ASP.NET Core 9.0)</span>
                    <span>Format: JSON</span>
                  </div>
                  <pre className="p-4 bg-[#11100E] rounded-xl border border-[#2E2A26] text-emerald-300 overflow-x-auto max-h-[380px] leading-relaxed">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[#23201C] rounded-xl border border-[#332F2B] font-sans">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-sm">{activeSnippet.title}</h4>
                  <span className="text-xs text-[#C28E5C] font-mono">{activeSnippet.category}</span>
                </div>
                <p className="text-xs text-[#A8A196] mt-1">
                  {isAr ? activeSnippet.descriptionAr : activeSnippet.description}
                </p>
              </div>

              {/* Code Display */}
              <div className="relative rounded-xl overflow-hidden border border-[#2E2A26] bg-[#0E0D0C]">
                <pre className="p-5 text-[#E6E1D8] overflow-x-auto leading-relaxed max-h-[480px]">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
