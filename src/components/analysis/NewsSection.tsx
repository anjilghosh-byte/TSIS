import React from 'react';
import { NewsData } from '../../types/news';
import { Radio, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { formatDateRelative } from '../../utils/formatters';

interface NewsSectionProps {
  newsData: NewsData;
  destinationName: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsData, destinationName }) => {
  if (newsData.status === 'error' && (!newsData.articles || newsData.articles.length === 0)) {
    return (
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <AlertCircle className="w-5 h-5" />
          <span>Recent News Status</span>
        </div>
        <p className="text-sm text-slate-400">Recent news is temporarily unavailable.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Local Incident & Weather Bulletins</div>
          <h3 className="text-xl font-bold text-white mt-0.5">Recent News ({destinationName})</h3>
        </div>
        {newsData.isDemoData && (
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full font-mono font-bold">
            CACHED BULLETINS
          </span>
        )}
      </div>

      {newsData.errorMessage && (
        <div className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{newsData.errorMessage}</span>
        </div>
      )}

      {/* News Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {newsData.articles.slice(0, 3).map((article) => (
          <div
            key={article.id}
            className={`bg-slate-900/80 border rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-sky-500/40 transition-colors ${
              article.isOfficialWarning ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-sky-400 truncate max-w-[150px]">{article.source}</span>
                <span className="flex items-center gap-1 shrink-0 font-mono">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formatDateRelative(article.publishedAt)}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                {article.title}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {article.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              {article.isOfficialWarning ? (
                <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/30">
                  OFFICIAL ADVISORY
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  NEWS REPORT
                </span>
              )}

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                <span>Read Full</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
