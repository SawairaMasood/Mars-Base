import React, { useEffect, useState } from 'react';
import { X, BookOpen, Search, Bookmark, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { GlossaryItem } from '../../types';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && glossary.length === 0) {
      setLoading(true);
      api
        .getGlossary()
        .then((res) => {
          if (res.success) setGlossary(res.glossary);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, glossary.length]);

  if (!isOpen) return null;

  const filtered = glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl hud-panel border border-hud-cyan/40 p-6 shadow-hud-glow">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-hud-cyan/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-hud-cyan/20 border border-hud-cyan text-hud-cyan">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-hud-muted tracking-widest">
                NASA Educational Reference
              </span>
              <h3 className="text-lg font-display font-bold text-hud-text">
                Space Exploration Glossary & Science Archive
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-hud-muted hover:text-hud-cyan hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="py-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-hud-muted" />
            <input
              type="text"
              placeholder="Search scientific terms (e.g. ISRU, MOXIE, ECLSS, Regolith)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-space-900 border border-space-700 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-hud-text placeholder-hud-muted focus:outline-none focus:border-hud-cyan"
            />
          </div>
        </div>

        {/* List of terms */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs font-mono text-hud-muted">
              Loading scientific archive...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-hud-muted">
              No matching scientific terms found.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-space-900/80 border border-space-700 hover:border-hud-cyan/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Bookmark className="w-4 h-4 text-hud-cyan" />
                  <h4 className="font-display font-bold text-sm text-hud-cyan">
                    {item.term}
                  </h4>
                </div>
                <p className="text-xs text-hud-text leading-relaxed font-sans mb-2">
                  {item.definition}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-hud-muted pt-2 border-t border-space-800">
                  <ExternalLink className="w-3 h-3 text-mars" />
                  <span>NASA Source: {item.nasaCitation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-hud-cyan/20 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 transition-all"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
