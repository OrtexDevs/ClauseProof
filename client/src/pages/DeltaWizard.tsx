import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  CheckCircle2, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Wand2,
  Sparkles
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

  if (loading) return <div className="h-96 rounded-2xl bg-white border border-[#E4E2D8] animate-pulse" />;
  if (!project || !sections.length) return <div className="text-center py-20 text-[#8A93A6] font-mono text-xs">Section data not found.</div>;

  const curSec = sections[currentIdx];

  return (
    <div className="space-y-6 text-[#16233D]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E2D8]">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate(`/project/${project.id}`)}
            className="w-10 h-10 rounded-xl bg-white border border-[#E4E2D8] flex items-center justify-center text-[#4A5568] hover:text-[#16233D] hover:border-[#2E7D8C]/50 transition-all shadow-subtle hover:shadow-card"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#2E7D8C] uppercase tracking-wider">Delta Wizard</span>
              <span className="text-[#8A93A6]">· Schedule VI Editor</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#16233D] tracking-tight">{project.name}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="font-mono text-xs font-semibold text-[#2E7D8C] animate-scale-in">{saveMessage}</span>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white hover:border-[#2E7D8C]/50 border border-[#E4E2D8] text-[#16233D] transition-all flex items-center gap-2 shadow-subtle hover:shadow-card btn-press"
          >
            <Save className="w-3.5 h-3.5 text-[#39A0B0]" strokeWidth={2} />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 btn-press ${
              curSec.is_completed
                ? 'bg-[#FAFAF7] text-[#C9762E] border border-[#C9762E]/40 hover:bg-white hover:shadow-card'
                : 'bg-gradient-to-r from-[#16233D] to-[#2E7D8C] text-white hover:shadow-elevated'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{curSec.is_completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Editor Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section List Sidebar (3 cols) */}
        <Card className="lg:col-span-3 p-3 max-h-[800px] overflow-y-auto space-y-1">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8A93A6] px-3 py-2 border-b border-[#E4E2D8] mb-2 flex items-center justify-between">
            <span>Schedule VI Sections</span>
            <span className="font-mono text-[#2E7D8C]">{sections.filter(s => s.is_completed).length}/{sections.length}</span>
          </div>

          {sections.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSelectSection(idx)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                idx === currentIdx
                  ? 'bg-gradient-to-r from-[#2E7D8C]/5 to-transparent border border-[#2E7D8C]/20 text-[#16233D] font-mono font-semibold shadow-subtle'
                  : 'hover:bg-[#FAFAF7]/60 text-[#4A5568] hover:text-[#16233D]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center shrink-0 border transition-colors ${
                  s.is_completed 
                    ? 'bg-[#2E7D8C]/10 text-[#2E7D8C] border-[#2E7D8C]/30' 
                    : idx === currentIdx ? 'bg-gradient-to-r from-[#16233D] to-[#2E7D8C] text-white border-transparent' : 'bg-white text-[#8A93A6] border-[#E4E2D8]'
                }`}>
                  {s.section_order}
                </span>
                <span className="font-sans text-xs font-semibold truncate">{s.section_name}</span>
              </div>
              {s.is_completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D8C] shrink-0 ml-1" strokeWidth={2} />}
            </button>
          ))}
        </Card>

        {/* Center Main Editor (6 cols) */}
        <Card className="lg:col-span-6 p-6 flex flex-col min-h-[700px]">
          {/* Section Header */}
          <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#E4E2D8]">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={curSec.is_completed ? 'pass' : 'draft'} className="text-[10px] uppercase">
                  {curSec.is_completed ? 'Completed' : 'Drafting In Progress'}
                </Badge>
                <span className="text-xs text-[#8A93A6] font-mono">v{curSec.version} · {curSec.section_code}</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-[#16233D] mt-1.5">{curSec.section_name}</h2>
            </div>

            <button
              onClick={handleGenerateAIDraft}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2E7D8C]/10 to-[#39A0B0]/10 border border-[#2E7D8C]/30 text-[#2E7D8C] hover:border-[#2E7D8C] font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 shadow-subtle hover:shadow-card btn-press"
              title="Generate Schedule VI Boilerplate Draft"
            >
              <Wand2 className="w-3.5 h-3.5" strokeWidth={1.8} />
              <span>AI Draft Template</span>
            </button>
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter disclosure text for ${curSec.section_name} as mandated under SEBI ICDR Schedule VI...`}
              className="w-full flex-1 min-h-[480px] p-5 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] text-[#16233D] placeholder-[#8A93A6] font-sans text-sm leading-relaxed focus:outline-none focus:border-[#2E7D8C] focus:ring-2 focus:ring-[#2E7D8C]/10 resize-y transition-all"
            />
          </div>

          {/* Editor Footer / Character Stats */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E4E2D8] font-mono text-xs text-[#8A93A6]">
            <div>
              Character count: <span className="text-[#16233D] font-bold">{content.length}</span> chars
              {content.length < 200 && !curSec.is_completed && (
                <span className="text-[#C9762E] ml-2">⚠️ Needs adequate detail for ICDR validation</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => handleSelectSection(currentIdx - 1)}
                className="hover:text-[#16233D] disabled:opacity-30 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={currentIdx === sections.length - 1}
                onClick={() => handleSelectSection(currentIdx + 1)}
                className="hover:text-[#16233D] disabled:opacity-30 flex items-center gap-1 transition-colors"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Right SEBI Guidance Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2E7D8C] mb-3 pb-2 border-b border-[#E4E2D8] uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#2E7D8C]" strokeWidth={1.8} />
              <span>SEBI Schedule VI Guidance</span>
            </div>
            <p className="font-sans text-xs text-[#4A5568] leading-relaxed">
              {curSec.guidance_notes || 'No specific regulatory guidance notes available for this section.'}
            </p>
            <div className="mt-4 pt-3 border-t border-[#E4E2D8] font-mono text-[11px] text-[#4A5568] space-y-2">
              <div className="flex justify-between">
                <span>Mandatory Section:</span>
                <span className="font-semibold text-[#16233D]">{curSec.is_mandatory ? 'Yes (Schedule VI)' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Trail Status:</span>
                <span className="font-semibold text-[#2E7D8C]">SHA-256 Chained</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8A93A6] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9762E]" strokeWidth={2} />
              ICDR Compliance Tips
            </div>
            <ul className="font-sans text-xs text-[#4A5568] space-y-2.5 list-disc pl-4 leading-normal">
              <li>Ensure all figures match the restated audited financial statements exactly.</li>
              <li>Under <strong className="text-[#16233D]">Objects of the Issue</strong>, verify GCP does not exceed 15% of fresh issue.</li>
              <li>Under <strong className="text-[#16233D]">Risk Factors</strong>, quantify risks wherever numerical data is available per SEBI mandate.</li>
              <li>Any promoter loans cannot be repaid from fresh IPO proceeds.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
