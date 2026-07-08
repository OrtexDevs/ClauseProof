import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Save, 
  CheckCircle2, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Scale, 
  AlertCircle,
  Wand2,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api';
import { Project, DRHPSection } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const DeltaWizard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<DRHPSection[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(Number(searchParams.get('section')) || 0);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [projData, secData] = await Promise.all([
          apiService.getProject(id),
          apiService.getSections(id)
        ]);
        setProject(projData);
        setSections(secData);
        const idx = Number(searchParams.get('section')) || 0;
        if (secData[idx]) {
          setContent(secData[idx].human_edited || secData[idx].ai_draft || '');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, searchParams]);

  const handleSelectSection = (index: number) => {
    setCurrentIdx(index);
    setSearchParams({ section: index.toString() });
    if (sections[index]) {
      setContent(sections[index].human_edited || sections[index].ai_draft || '');
    }
  };

  const handleSave = async (markComplete = false) => {
    if (!project || !sections[currentIdx]) return;
    setSaving(true);
    setSaveMessage('');

    try {
      const sec = sections[currentIdx];
      const updated = await apiService.updateSection(project.id, sec.id, {
        human_edited: content,
        is_completed: markComplete ? !sec.is_completed : sec.is_completed,
      });

      const newSecs = [...sections];
      newSecs[currentIdx] = updated;
      setSections(newSecs);
      setSaveMessage(markComplete ? (updated.is_completed ? 'Marked Complete!' : 'Marked InProgress') : 'Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      setSaveMessage('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAIDraft = async () => {
    if (!project || !sections[currentIdx]) return;
    const sec = sections[currentIdx];
    setSaving(true);
    try {
      const res = await apiService.generateDraft(project.id, sec.section_code);
      setContent(res.draft_content);
      setSaveMessage('Generated from Precedent Clause Bank!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      setSaveMessage('Error drafting: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 rounded-3xl bg-[#EFE9E3] animate-pulse border border-[#D9CFC7]" />;
  if (!project || !sections.length) return <div className="text-center py-20 text-[#78716c]">Section data not found.</div>;

  const curSec = sections[currentIdx];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9CFC7]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/project/${project.id}`)}
            className="w-10 h-10 rounded-xl bg-card border border-[#D9CFC7] flex items-center justify-center text-[#78716c] hover:text-[#44403c] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#b39d82] uppercase tracking-wider">Delta Wizard</span>
              <span className="text-xs text-[#a8a29e] font-mono">· Schedule VI Editor</span>
            </div>
            <h1 className="text-xl font-black text-[#1c1917] tracking-tight">{project.name}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs font-semibold text-emerald-400 animate-fade-in">{saveMessage}</span>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-card hover:bg-card-hover border border-[#D9CFC7] text-[#1c1917] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#b39d82]" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              curSec.is_completed
                ? 'bg-amber-500/20 text-[#b39d82] border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow hover:shadow-glow-lg'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{curSec.is_completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Editor Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section List Sidebar (3 cols) */}
        <Card glass className="lg:col-span-3 p-3 max-h-[800px] overflow-y-auto space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716c] px-3 py-2 border-b border-[#D9CFC7] mb-2 flex items-center justify-between">
            <span>Schedule VI Sections</span>
            <span className="font-mono text-[#b39d82]">{sections.filter(s => s.is_completed).length}/{sections.length}</span>
          </div>

          {sections.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSelectSection(idx)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                idx === currentIdx
                  ? 'bg-primary/20 border border-primary/40 text-[#1c1917] shadow-sm'
                  : 'hover:bg-white/5 text-[#78716c] hover:text-[#44403c]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  s.is_completed 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : idx === currentIdx ? 'bg-primary text-white' : 'bg-[#EFE9E3] text-[#a8a29e]'
                }`}>
                  {s.section_order}
                </span>
                <span className="text-xs font-semibold truncate">{s.section_name}</span>
              </div>
              {s.is_completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
            </button>
          ))}
        </Card>

        {/* Center Main Editor (6 cols) */}
        <Card glass className="lg:col-span-6 p-6 flex flex-col min-h-[700px]">
          {/* Section Header */}
          <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#D9CFC7]">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={curSec.is_completed ? 'pass' : 'draft'} className="text-[10px] uppercase">
                  {curSec.is_completed ? 'Completed' : 'Drafting In Progress'}
                </Badge>
                <span className="text-xs text-[#a8a29e] font-mono">v{curSec.version} · {curSec.section_code}</span>
              </div>
              <h2 className="text-xl font-bold text-[#1c1917] mt-1.5">{curSec.section_name}</h2>
            </div>

            <button
              onClick={handleGenerateAIDraft}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-[#b39d82] hover:text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              title="Generate Schedule VI Boilerplate Draft"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Draft Template</span>
            </button>
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter disclosure text for ${curSec.section_name} as mandated under SEBI ICDR Schedule VI...`}
              className="w-full flex-1 min-h-[480px] p-4 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] placeholder-[#a8a29e] font-sans text-sm leading-relaxed focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] resize-y transition-all"
            />
          </div>

          {/* Editor Footer / Character Stats */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#D9CFC7] text-xs text-[#a8a29e]">
            <div>
              Character count: <span className="font-mono text-[#44403c]">{content.length}</span> chars
              {content.length < 200 && !curSec.is_completed && (
                <span className="text-amber-400 ml-2">⚠️ Needs adequate detail for ICDR validation</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => handleSelectSection(currentIdx - 1)}
                className="hover:text-[#44403c] disabled:opacity-30 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Prev Section
              </button>
              <button
                disabled={currentIdx === sections.length - 1}
                onClick={() => handleSelectSection(currentIdx + 1)}
                className="hover:text-[#44403c] disabled:opacity-30 flex items-center gap-1"
              >
                Next Section <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Right SEBI Guidance Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card glass className="p-5 border-[#D9CFC7] bg-gradient-to-b from-indigo-950/20 to-transparent">
            <div className="flex items-center gap-2 text-sm font-bold text-[#8c7a65] mb-3 pb-2 border-b border-[#D9CFC7]">
              <BookOpen className="w-4 h-4 text-[#b39d82]" />
              <span>SEBI Schedule VI Guidance</span>
            </div>
            <p className="text-xs text-[#44403c] leading-relaxed">
              {curSec.guidance_notes || 'No specific regulatory guidance notes available for this section.'}
            </p>
            <div className="mt-4 pt-3 border-t border-[#D9CFC7] text-[11px] text-[#78716c] space-y-1">
              <div className="flex justify-between">
                <span>Mandatory Section:</span>
                <span className="font-semibold text-[#1c1917]">{curSec.is_mandatory ? 'Yes (Schedule VI)' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Trail Status:</span>
                <span className="font-semibold text-emerald-400">SHA-256 Chained</span>
              </div>
            </div>
          </Card>

          <Card glass className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#78716c] mb-3">
              ICDR Compliance Tips
            </div>
            <ul className="text-xs text-[#78716c] space-y-2.5 list-disc pl-4 leading-normal">
              <li>Ensure all figures match the restated audited financial statements exactly.</li>
              <li>Under <strong className="text-[#1c1917]">Objects of the Issue</strong>, verify GCP does not exceed 15% of fresh issue.</li>
              <li>Under <strong className="text-[#1c1917]">Risk Factors</strong>, quantify risks wherever numerical data is available per SEBI mandate.</li>
              <li>Any promoter loans cannot be repaid from fresh IPO proceeds.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
