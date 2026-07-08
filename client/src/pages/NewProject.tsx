import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('TechVista IPO 2026');
  const [companyName, setCompanyName] = useState('TechVista Solutions Pvt Ltd');
  const [cin, setCin] = useState('U74999MH2020PTC123456');
  const [incorporationDate, setIncorporationDate] = useState('2020-04-15');
  const [registeredOffice, setRegisteredOffice] = useState('Bandra-Kurla Complex, Mumbai, Maharashtra');
  const [industry, setIndustry] = useState('Information Technology & Cloud Services');

  // IPO Params
  const [issueSizeCr, setIssueSizeCr] = useState<number>(25.0);
  const [faceValue, setFaceValue] = useState<number>(10);
  const [priceBandLow, setPriceBandLow] = useState<number>(110);
  const [priceBandHigh, setPriceBandHigh] = useState<number>(125);
  const [lotSize, setLotSize] = useState<number>(1600);
  const [postCap, setPostCap] = useState<number>(8.5);
  const [preShares, setPreShares] = useState<number>(6000000);
  const [freshShares, setFreshShares] = useState<number>(2000000);
  const [ofsShares, setOfsShares] = useState<number>(500000);
  const [netWorth, setNetWorth] = useState<number>(12.4);

  // Financial Summary (3 FYs in ₹ Crores)
  const [rev1, setRev1] = useState<number>(18.5);
  const [rev2, setRev2] = useState<number>(14.2);
  const [rev3, setRev3] = useState<number>(10.1);
  
  const [ebitda1, setEbitda1] = useState<number>(4.2);
  const [ebitda2, setEbitda2] = useState<number>(3.1);
  const [ebitda3, setEbitda3] = useState<number>(2.0);
  
  const [pat1, setPat1] = useState<number>(2.8);
  const [pat2, setPat2] = useState<number>(1.9);
  const [pat3, setPat3] = useState<number>(1.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newProj = await apiService.createProject({
        name,
        company_name: companyName,
        cin,
        incorporation_date: incorporationDate,
        registered_office: registeredOffice,
        industry,
        issue_size_cr: issueSizeCr,
        face_value: faceValue,
        price_band_low: priceBandLow,
        price_band_high: priceBandHigh,
        lot_size: lotSize,
        post_issue_paid_up_capital: postCap,
        pre_issue_shares: preShares,
        fresh_issue_shares: freshShares,
        ofs_shares: ofsShares,
        net_worth: netWorth,
        revenue_fy1: rev1,
        revenue_fy2: rev2,
        revenue_fy3: rev3,
        ebitda_fy1: ebitda1,
        ebitda_fy2: ebitda2,
        ebitda_fy3: ebitda3,
        pat_fy1: pat1,
        pat_fy2: pat2,
        pat_fy3: pat3,
      });

      // Navigate to the newly created project workspace
      navigate(`/project/${newProj.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create IPO filing project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-xl bg-card border border-[#D9CFC7] flex items-center justify-center text-[#78716c] hover:text-[#44403c] hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1c1917] tracking-tight">Initialize SME IPO Filing</h1>
            <p className="text-xs text-[#78716c] mt-0.5">
              Enter issuer parameters to auto-generate 18 Schedule VI sections and configure deterministic rule checks
            </p>
          </div>
        </div>
        <Badge variant="primary">Schedule VI Auto-Init</Badge>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Company Profile */}
        <Card glass>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9CFC7]">
            <div className="w-8 h-8 rounded-xl bg-[#EFE9E3] text-[#b39d82] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c1917]">Issuer Company Profile</h3>
              <p className="text-xs text-[#78716c]">Legal identification and registered office details</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Project / Filing Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. TechVista IPO 2026"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Company Legal Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TechVista Solutions Pvt Ltd"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Corporate Identity Number (CIN)
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="U74999MH2020PTC123456"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Date of Incorporation (Track Record Check)
              </label>
              <input
                type="date"
                value={incorporationDate}
                onChange={(e) => setIncorporationDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Industry Sector
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Information Technology"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Registered Office Address
              </label>
              <input
                type="text"
                value={registeredOffice}
                onChange={(e) => setRegisteredOffice(e.target.value)}
                placeholder="City, State"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>
          </div>
        </Card>

        {/* Step 2: IPO Structure & Capital */}
        <Card glass>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9CFC7]">
            <div className="w-8 h-8 rounded-xl bg-[#EFE9E3] text-[#b39d82] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c1917]">IPO Structure & Capital Metrics</h3>
              <p className="text-xs text-[#78716c]">Used for SEBI ICDR Rule Engine validation (OFS cap, ₹1Cr-₹25Cr capital range)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Total Issue Size (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                value={issueSizeCr}
                onChange={(e) => setIssueSizeCr(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Post-Issue Paid-Up Capital (₹Cr)
              </label>
              <input
                type="number"
                step="0.1"
                value={postCap}
                onChange={(e) => setPostCap(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
              <span className="text-[11px] text-[#a8a29e] mt-1 block">SME Exchange limit: ₹1Cr to ₹25Cr</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Net Worth (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                value={netWorth}
                onChange={(e) => setNetWorth(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Price Band Low (₹)
              </label>
              <input
                type="number"
                value={priceBandLow}
                onChange={(e) => setPriceBandLow(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Price Band High (₹)
              </label>
              <input
                type="number"
                value={priceBandHigh}
                onChange={(e) => setPriceBandHigh(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Lot Size (Shares)
              </label>
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
              <span className="text-[11px] text-emerald-400 mt-1 block">Min Application: ₹{(lotSize * priceBandHigh / 100000).toFixed(2)} Lakhs (Req: ≥₹2L)</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Pre-Issue Share Count
              </label>
              <input
                type="number"
                value={preShares}
                onChange={(e) => setPreShares(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Fresh Issue Shares
              </label>
              <input
                type="number"
                value={freshShares}
                onChange={(e) => setFreshShares(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                OFS Shares (Offer for Sale)
              </label>
              <input
                type="number"
                value={ofsShares}
                onChange={(e) => setOfsShares(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition-all"
              />
              <span className="text-[11px] text-[#a8a29e] mt-1 block">OFS Share: {((ofsShares / (freshShares + ofsShares || 1)) * 100).toFixed(1)}% (Max 20%)</span>
            </div>
          </div>
        </Card>

        {/* Step 3: Financial Summary (3 FYs) */}
        <Card glass>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9CFC7]">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c1917]">Financial Summary (Last 3 Financial Years — ₹ Crores)</h3>
              <p className="text-xs text-[#78716c]">Required for Regulation 229 profitability verification (Positive EBITDA in ≥2 of 3 years)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* FY1 */}
            <div className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-[#D9CFC7] pb-2">
                FY 2024-25 (Latest FY)
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Revenue from Operations</label>
                <input
                  type="number" step="0.1" value={rev1} onChange={(e) => setRev1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Operating Profit (EBITDA)</label>
                <input
                  type="number" step="0.1" value={ebitda1} onChange={(e) => setEbitda1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Profit After Tax (PAT)</label>
                <input
                  type="number" step="0.1" value={pat1} onChange={(e) => setPat1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* FY2 */}
            <div className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] space-y-4">
              <div className="text-xs font-bold text-[#b39d82] uppercase tracking-wider border-b border-[#D9CFC7] pb-2">
                FY 2023-24 (Preceding Year 1)
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Revenue from Operations</label>
                <input
                  type="number" step="0.1" value={rev2} onChange={(e) => setRev2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Operating Profit (EBITDA)</label>
                <input
                  type="number" step="0.1" value={ebitda2} onChange={(e) => setEbitda2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Profit After Tax (PAT)</label>
                <input
                  type="number" step="0.1" value={pat2} onChange={(e) => setPat2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* FY3 */}
            <div className="p-4 rounded-2xl bg-[#EFE9E3] border border-[#D9CFC7] space-y-4">
              <div className="text-xs font-bold text-[#b39d82] uppercase tracking-wider border-b border-[#D9CFC7] pb-2">
                FY 2022-23 (Preceding Year 2)
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Revenue from Operations</label>
                <input
                  type="number" step="0.1" value={rev3} onChange={(e) => setRev3(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Operating Profit (EBITDA)</label>
                <input
                  type="number" step="0.1" value={ebitda3} onChange={(e) => setEbitda3(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1">Profit After Tax (PAT)</label>
                <input
                  type="number" step="0.1" value={pat3} onChange={(e) => setPat3(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9CFC7] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-card hover:bg-card-hover border border-[#D9CFC7] text-[#44403c] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#C9B59C] via-[#b39d82] to-[#a69279] text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Initializing Workspace...</span>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Create Filing & Generate Schedule VI Sections</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
