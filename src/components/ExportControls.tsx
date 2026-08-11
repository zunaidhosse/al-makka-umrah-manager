import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MoreVertical, Download, FileImage, FileText, Printer, CheckCircle, Loader2, X, Sparkles, Menu } from 'lucide-react';

interface ExportControlsProps {
  targetElementId: string; // ID of container to capture
  fileName?: string;
}

// Convert oklch(), oklab(), lch(), lab() color functions to rgb()/rgba() for html2canvas compatibility
function oklabToRgbString(L: number, aLab: number, bLab: number, A: number): string {
  const l_ = L + 0.3963377774 * aLab + 0.2158037573 * bLab;
  const m_ = L - 0.1055613458 * aLab - 0.0638541728 * bLab;
  const s_ = L - 0.0894841775 * aLab - 1.291485548 * bLab;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const gamma = (val: number) => {
    val = Math.max(0, Math.min(1, val));
    return val <= 0.0031308
      ? 12.92 * val
      : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  const r = Math.round(gamma(rLin) * 255);
  const g = Math.round(gamma(gLin) * 255);
  const b = Math.round(gamma(bLin) * 255);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return 'rgb(0,0,0)';

  if (!isNaN(A) && A < 1) {
    return `rgba(${r}, ${g}, ${b}, ${A.toFixed(3)})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function replaceModernColorsInString(cssText: string): string {
  if (!cssText) return cssText;

  // 1. Replace oklch(...)
  let result = cssText.replace(/oklch\(([^)]+)\)/gi, (match, p1) => {
    try {
      const parts = p1.trim().split(/[\s,/]+/);
      if (parts.length < 3) return 'rgb(0,0,0)';

      const l = parts[0];
      const c = parts[1];
      const h = parts[2];
      const a = parts[3];

      const L = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
      const C = c.endsWith('%') ? (parseFloat(c) / 100) * 0.4 : parseFloat(c);
      const H = parseFloat(h);
      const A = a ? (a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)) : 1;

      if (isNaN(L) || isNaN(C) || isNaN(H)) return 'rgb(0,0,0)';

      const hRad = (H * Math.PI) / 180;
      const aLab = C * Math.cos(hRad);
      const bLab = C * Math.sin(hRad);

      return oklabToRgbString(L, aLab, bLab, A);
    } catch {
      return 'rgb(0,0,0)';
    }
  });

  // 2. Replace oklab(...)
  result = result.replace(/oklab\(([^)]+)\)/gi, (match, p1) => {
    try {
      const parts = p1.trim().split(/[\s,/]+/);
      if (parts.length < 3) return 'rgb(0,0,0)';

      const l = parts[0];
      const aVal = parts[1];
      const bVal = parts[2];
      const alpha = parts[3];

      const L = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
      const aLab = aVal.endsWith('%') ? (parseFloat(aVal) / 100) * 0.4 : parseFloat(aVal);
      const bLab = bVal.endsWith('%') ? (parseFloat(bVal) / 100) * 0.4 : parseFloat(bVal);
      const A = alpha ? (alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha)) : 1;

      if (isNaN(L) || isNaN(aLab) || isNaN(bLab)) return 'rgb(0,0,0)';

      return oklabToRgbString(L, aLab, bLab, A);
    } catch {
      return 'rgb(0,0,0)';
    }
  });

  // 3. Fallback for any lch(...) or lab(...) if present
  result = result.replace(/(?:lch|lab)\(([^)]+)\)/gi, () => 'rgb(0,0,0)');

  // 4. Fallback for color(srgb ...) or color(display-p3 ...) if present
  result = result.replace(/color\([^)]+\)/gi, () => 'rgb(0,0,0)');

  // 5. Hard safety fallback for any remaining oklab or oklch strings
  result = result.replace(/oklab\b[^\)]*\)/gi, 'rgb(0,0,0)');
  result = result.replace(/oklch\b[^\)]*\)/gi, 'rgb(0,0,0)');

  return result;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  targetElementId,
  fileName = 'যাত্রী_প্যাকেজ_তালিকা'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const captureCanvas = async () => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      throw new Error("Export container element not found");
    }

    return await html2canvas(element, {
      scale: 2, // High resolution crisp image
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      ignoreElements: (element) => element.classList.contains('no-print'),
      onclone: (clonedDoc) => {
        // 1. Collect all CSS text from all style tags and stylesheets
        let combinedCss = '';

        // Collect from style tags in clonedDoc
        const styleElements = Array.from(clonedDoc.querySelectorAll('style'));
        styleElements.forEach((styleEl) => {
          if (styleEl.textContent) {
            combinedCss += styleEl.textContent + '\n';
          }
        });

        // Collect from document.styleSheets and clonedDoc.styleSheets
        const sheets = [
          ...Array.from(document.styleSheets || []),
          ...Array.from(clonedDoc.styleSheets || [])
        ];
        sheets.forEach((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach((rule) => {
              combinedCss += rule.cssText + '\n';
            });
          } catch {
            // ignore cross-origin stylesheets
          }
        });

        // 2. Remove all existing <style> and <link rel="stylesheet"> elements from clonedDoc
        const existingStyles = Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'));
        existingStyles.forEach((node) => node.remove());

        // 3. Create a single new <style> element with sanitized CSS
        const cleanCss = replaceModernColorsInString(combinedCss);
        const newStyleTag = clonedDoc.createElement('style');
        newStyleTag.textContent = cleanCss;
        clonedDoc.head.appendChild(newStyleTag);

        // 4. Transform inline styles and computed styles on all cloned elements
        const clonedElements = Array.from(clonedDoc.querySelectorAll<HTMLElement>('*'));
        clonedElements.forEach((clonedEl) => {
          const styleAttr = clonedEl.getAttribute('style');
          if (styleAttr) {
            clonedEl.setAttribute('style', replaceModernColorsInString(styleAttr));
          }

          try {
            const computed = window.getComputedStyle(clonedEl);
            const propsToCheck = [
              'color', 'background-color', 'border-color',
              'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color',
              'fill', 'stroke', 'outline-color', 'box-shadow', 'text-shadow'
            ];
            propsToCheck.forEach((prop) => {
              const val = computed.getPropertyValue(prop);
              if (val) {
                const cleaned = replaceModernColorsInString(val);
                if (cleaned !== val || val.includes('oklab') || val.includes('oklch')) {
                  clonedEl.style.setProperty(prop, cleaned, 'important');
                }
              }
            });
          } catch {
            // Ignore unattached elements
          }
        });
      }
    });
  };

  const handleDownloadPNG = async () => {
    try {
      setExporting('png');
      const canvas = await captureCanvas();
      const imageUri = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = imageUri;
      link.click();

      setSuccessMsg("PNG ডাউনলোড সফল হয়েছে!");
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsOpen(false);
    } catch (err) {
      console.error("PNG export error:", err);
      alert("PNG ডাউনলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setExporting(null);
    }
  };

  const handleDownloadJPG = async () => {
    try {
      setExporting('jpg');
      const canvas = await captureCanvas();
      const imageUri = canvas.toDataURL('image/jpeg', 0.95);
      
      const link = document.createElement('a');
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = imageUri;
      link.click();

      setSuccessMsg("JPG ডাউনলোড সফল হয়েছে!");
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsOpen(false);
    } catch (err) {
      console.error("JPG export error:", err);
      alert("JPG ডাউনলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setExporting(null);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setExporting('pdf');
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Auto shrink PDF height if content is smaller than full A4 page height (297mm)
      const isSinglePageCustom = imgHeight < 297;
      const pdfFormat = isSinglePageCustom ? [210, Math.max(imgHeight, 40)] : 'a4';

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pdfFormat
      });

      if (isSinglePageCustom) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        const pageHeight = 297;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);

      setSuccessMsg("PDF ডাউনলোড সফল হয়েছে!");
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsOpen(false);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("PDF ডাউনলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setExporting(null);
    }
  };

  const handlePrint = () => {
    setIsOpen(false);
    window.print();
  };

  return (
    <div className="no-print relative inline-block text-left" ref={menuRef}>
      
      {/* 3-Dot / 3-Line Menu Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#0047FF] to-[#8A2BE2] hover:from-[#00FFFF] hover:to-[#8A2BE2] text-white font-extrabold text-xs sm:text-sm border border-[#00FFFF]/50 shadow-[0_0_15px_rgba(0,191,255,0.4)] transition-all active:scale-95"
        title="ডাউনলোড ও প্রিন্ট অপশন (3-Dot Menu)"
      >
        <MoreVertical className="w-5 h-5 text-[#00FFFF] glow-icon-cyan" />
        <span className="hidden sm:inline font-bengali-heading">রিপোর্ট ডাউনলোড</span>
        <Download className="w-4 h-4 text-[#39FF14] glow-icon-green" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0A1035] border-2 border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.4)] z-50 overflow-hidden text-white animate-fadeIn p-3">
          
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#00BFFF]/30">
            <div className="flex items-center gap-2 text-[#00FFFF] font-extrabold text-xs sm:text-sm font-bengali-heading">
              <Sparkles className="w-4 h-4 text-[#FFD700] glow-icon-gold" />
              <span>১-ক্লিকে রিপোর্ট ডাউনলোড করুন (Export Options)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cyan-300 hover:text-white p-1 rounded-lg hover:bg-[#050A30]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            
            {/* PNG Download Button */}
            <button
              onClick={handleDownloadPNG}
              disabled={!!exporting}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#00BFFF] via-[#8A2BE2] to-[#FF4DFF] hover:from-[#00FFFF] hover:to-[#FF4DFF] text-white font-extrabold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,191,255,0.5)] transition-all active:scale-98 disabled:opacity-50 border border-[#00FFFF]/40"
            >
              <div className="flex items-center gap-2.5">
                <FileImage className="w-5 h-5 text-[#00FFFF] glow-icon-cyan" />
                <span>PNG হাই-কোয়ালিটি ছবি ডাউনলোড</span>
              </div>
              {exporting === 'png' ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Download className="w-4 h-4 text-[#39FF14]" />}
            </button>

          </div>

          {successMsg && (
            <div className="mt-2.5 p-2 rounded-xl bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-[#39FF14]/50 shadow-[0_0_10px_rgba(57,255,20,0.3)]">
              <CheckCircle className="w-3.5 h-3.5 text-[#39FF14]" />
              <span>{successMsg}</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
