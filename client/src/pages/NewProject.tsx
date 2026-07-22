import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
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

      navigate(`/project/${newProj.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create IPO filing project.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E2D8] text-[#16233D] text-sm placeholder-[#8A93A6] focus:outline-none focus:border-[#2E7D8C] focus:ring-1 focus:ring-[#2E7D8C]/20 transition-all font-sans";

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-[#16233D]">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E4E2D8]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-xl bg-white border border-[#E4E2D8] flex items-center justify-center text-[#4A5568] hover:text-[#16233D] hover:border-[#8A93A6] transition-all shadow-subtle"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#16233D] tracking-tight">Initialize SME IPO Filing</h1>
            <p className="font-sans text-xs text-[#4A5568] mt-1">
              Enter issuer parameters to auto-generate 18 Schedule VI sections and configure deterministic rule checks
            </p>
          </div>
        </div>
        <Badge variant="pass">Schedule VI Auto-Init</Badge>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C9762E]/10 border border-[#C9762E]/30 text-[#C9762E] font-mono text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C9762E]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Company Profile */}
        <Card>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E4E2D8]">
            <div className="w-7 h-7 rounded-lg bg-[#16233D] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#16233D]">Issuer Company Profile</h3>
              <p className="font-sans text-xs text-[#4A5568]">Legal identification and registered office details</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Project / Filing Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. TechVista IPO 2026"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Company Legal Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#8A93A6] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TechVista Solutions Pvt Ltd"
                  className={inputCls + " pl-10"}
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Corporate Identity Number (CIN)
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="U74999MH2020PTC123456"
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Date of Incorporation (Track Record Check)
              </label>
              <input
                type="date"
                value={incorporationDate}
                onChange={(e) => setIncorporationDate(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Industry Sector
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Information Technology"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Registered Office Address
              </label>
              <input
                type="text"
                value={registeredOffice}
                onChange={(e) => setRegisteredOffice(e.target.value)}
                placeholder="City, State"
                className={inputCls}
              />
            </div>
          </div>
        </Card>

        {/* Step 2: IPO Structure & Capital */}
        <Card>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E4E2D8]">
            <div className="w-7 h-7 rounded-lg bg-[#2E7D8C] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#16233D]">IPO Structure & Capital Metrics</h3>
              <p className="font-sans text-xs text-[#4A5568]">Used for SEBI ICDR Rule Engine validation (OFS cap, ₹1Cr-₹25Cr capital range)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Face Value (₹)
              </label>
              <input
                type="number"
                value={faceValue}
                onChange={(e) => setFaceValue(Number(e.target.value))}
                className={inputCls + " font-mono"}
                min="1"
                step="1"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Total Issue Size (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                value={issueSizeCr}
                onChange={(e) => setIssueSizeCr(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Post-Issue Paid-Up Capital (₹Cr)
              </label>
              <input
                type="number"
                step="0.1"
                value={postCap}
                onChange={(e) => setPostCap(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
              <span className="font-mono text-[10px] text-[#2E7D8C] mt-1 block">SME Exchange limit: ₹1Cr to ₹25Cr</span>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Net Worth (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                value={netWorth}
                onChange={(e) => setNetWorth(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Price Band Low (₹)
              </label>
              <input
                type="number"
                value={priceBandLow}
                onChange={(e) => setPriceBandLow(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Price Band High (₹)
              </label>
              <input
                type="number"
                value={priceBandHigh}
                onChange={(e) => setPriceBandHigh(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Lot Size (Shares)
              </label>
              <input
                type="number"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
              <span className="font-mono text-[10px] text-[#39A0B0] mt-1 block">Min Application: ₹{(lotSize * priceBandHigh / 100000).toFixed(2)} Lakhs (Req: ≥₹2L)</span>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Pre-Issue Share Count
              </label>
              <input
                type="number"
                value={preShares}
                onChange={(e) => setPreShares(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                Fresh Issue Shares
              </label>
              <input
                type="number"
                value={freshShares}
                onChange={(e) => setFreshShares(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
                OFS Shares (Offer for Sale)
              </label>
              <input
                type="number"
                value={ofsShares}
                onChange={(e) => setOfsShares(Number(e.target.value))}
                className={inputCls + " font-mono"}
              />
              <span className="font-mono text-[10px] text-[#8A93A6] mt-1 block">OFS Share: {((ofsShares / (freshShares + ofsShares || 1)) * 100).toFixed(1)}% (Max 20%)</span>
            </div>
          </div>
        </Card>

        {/* Step 3: Financial Summary (3 FYs) */}
        <Card>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E4E2D8]">
            <div className="w-7 h-7 rounded-lg bg-[#39A0B0] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#16233D]">Financial Summary (Last 3 Financial Years — ₹ Crores)</h3>
              <p className="font-sans text-xs text-[#4A5568]">Required for Regulation 229 profitability verification (Positive EBITDA in ≥2 of 3 years)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* FY1 */}
            <div className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] space-y-4">
              <div className="font-mono text-xs font-bold text-[#2E7D8C] uppercase tracking-wider border-b border-[#E4E2D8] pb-2.5">
                FY 2024-25 (Latest FY)
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Revenue from Operations</label>
                <input
                  type="number" step="0.1" value={rev1} onChange={(e) => setRev1(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Operating Profit (EBITDA)</label>
                <input
                  type="number" step="0.1" value={ebitda1} onChange={(e) => setEbitda1(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Profit After Tax (PAT)</label>
                <input
                  type="number" step="0.1" value={pat1} onChange={(e) => setPat1(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
            </div>

            {/* FY2 */}
            <div className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] space-y-4">
              <div className="font-mono text-xs font-bold text-[#39A0B0] uppercase tracking-wider border-b border-[#E4E2D8] pb-2.5">
                FY 2023-24 (Preceding Year 1)
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Revenue from Operations</label>
                <input
                  type="number" step="0.1" value={rev2} onChange={(e) => setRev2(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Operating Profit (EBITDA)</label>
                <input
                  type="number" step="0.1" value={ebitda2} onChange={(e) => setEbitda2(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Profit After Tax (PAT)</label>
                <input
                  type="number" step="0.1" value={pat2} onChange={(e) => setPat2(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
            </div>

            {/* FY3 */}
            <div className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E4E2D8] space-y-4">
              <div className="font-mono text-xs font-bold text-[#C9762E] uppercase tracking-wider border-b border-[#E4E2D8] pb-2.5">
                FY 2022-23 (Preceding Year 2)
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Revenue from Operations</label>
                <input
                  type="number" step="0.1" value={rev3} onChange={(e) => setRev3(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Operating Profit (EBITDA)</label>
                <input
                  type="number" step="0.1" value={ebitda3} onChange={(e) => setEbitda3(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#4A5568] mb-1 uppercase">Profit After Tax (PAT)</label>
                <input
                  type="number" step="0.1" value={pat3} onChange={(e) => setPat3(Number(e.target.value))}
                  className={inputCls + " font-mono"}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E4E2D8]">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-white hover:border-[#8A93A6] hover:text-[#16233D] border border-[#E4E2D8] text-[#4A5568] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-xs font-mono font-medium uppercase tracking-wider bg-[#16233D] hover:-translate-y-0.5 hover:shadow-subtle text-white transition-all flex items-center gap-2 disabled:opacity-50"
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
