import { useState } from "react";
import { useRouter } from "next/router";
import { Fingerprint, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { loginWithEmployeeId } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId.trim() || loading) return;

    setError("");
    setLoading(true);
    try {
      await loginWithEmployeeId(employeeId);
      router.replace("/");
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="portal">
        <div className="portal__watermark">M</div>
        <div className="portal__grain" />

        <div className="portal__content">
          <div className="seal">
            <div className="seal__glow" />
            <svg viewBox="0 0 100 100" className="seal__ring">
              <circle cx="50" cy="50" r="46" className="seal__ring-outer" />
              <circle cx="50" cy="50" r="39" className="seal__ring-inner" />
            </svg>
            <span className="seal__mark">M</span>
          </div>

          <div className="heading">
            <span className="heading__eyebrow">Authorized Personnel Only</span>
            <h1 className="heading__title">Mena Payroll</h1>
            <p className="heading__subtitle">ระบบยืนยันตัวตนด้วยรหัสพนักงาน</p>
          </div>

          <div className={`panel ${shake ? "panel--shake" : ""}`}>
            <span className="panel__corner panel__corner--tl" />
            <span className="panel__corner panel__corner--tr" />
            <span className="panel__corner panel__corner--bl" />
            <span className="panel__corner panel__corner--br" />

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="employee_id" className="field-label">
                รหัสพนักงาน
              </label>

              <div className={`field ${error ? "field--error" : ""}`}>
                <Fingerprint className="field__icon" size={18} strokeWidth={1.75} />
                <input
                  id="employee_id"
                  autoFocus
                  autoComplete="off"
                  placeholder="ระบุรหัสพนักงานของคุณ"
                  value={employeeId}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="alert" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="submit" disabled={loading || !employeeId.trim()}>
                <span className="submit__shine" />
                {loading ? (
                  <>
                    <Loader2 className="submit__spin" size={17} strokeWidth={2} />
                    กำลังตรวจสอบสิทธิ์
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ
                    <ArrowRight className="submit__arrow" size={17} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            <div className="divider" />

            <div className="status">
              <span className="status__dot" />
              เชื่อมต่อระบบยืนยันตัวตนอย่างปลอดภัย
            </div>
          </div>

          <p className="footnote">
            <ShieldCheck size={13} strokeWidth={1.75} />
            สำหรับผู้ที่ได้รับสิทธิ์เข้าถึงเท่านั้น
          </p>
        </div>
      </div>

      <style jsx>{`
        .portal {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          overflow: hidden;
          background:
            radial-gradient(60% 50% at 50% 8%, rgba(205, 161, 82, 0.16), transparent 65%),
            repeating-linear-gradient(
              0deg,
              rgba(240, 217, 160, 0.035) 0px,
              rgba(240, 217, 160, 0.035) 1px,
              transparent 1px,
              transparent 29px
            ),
            linear-gradient(160deg, #0a0e18 0%, #0d1526 55%, #0a0e18 100%);
          font-family: "IBM Plex Sans Thai", "IBM Plex Sans", ui-sans-serif,
            system-ui, sans-serif;
        }

        .portal__watermark {
          position: absolute;
          top: -8%;
          right: -4%;
          font-family: "Fraunces", ui-serif, Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: min(46vw, 620px);
          line-height: 1;
          color: rgba(240, 217, 160, 0.045);
          user-select: none;
          pointer-events: none;
          transform: rotate(-4deg);
          animation: driftWatermark 26s ease-in-out infinite;
        }

        .portal__grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .portal__content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Seal */
        .seal {
          position: relative;
          width: 4.5rem;
          height: 4.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          opacity: 0;
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
        }
        .seal__glow {
          position: absolute;
          inset: -30%;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            rgba(227, 192, 120, 0),
            rgba(227, 192, 120, 0.35),
            rgba(227, 192, 120, 0)
          );
          filter: blur(10px);
          animation: spin 9s linear infinite;
        }
        .seal__ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .seal__ring-outer {
          fill: none;
          stroke: rgba(227, 192, 120, 0.55);
          stroke-width: 1.4;
        }
        .seal__ring-inner {
          fill: rgba(18, 26, 46, 0.9);
          stroke: rgba(227, 192, 120, 0.35);
          stroke-width: 1;
        }
        .seal__mark {
          position: relative;
          font-family: "Fraunces", ui-serif, Georgia, serif;
          font-style: italic;
          font-weight: 600;
          font-size: 1.6rem;
          background: linear-gradient(180deg, #f0d9a0, #ad813a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Heading */
        .heading {
          text-align: center;
          margin-bottom: 2rem;
        }
        .heading__eyebrow {
          display: inline-block;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #cda152;
          font-weight: 500;
          opacity: 0;
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .heading__title {
          margin: 0.5rem 0 0.4rem;
          font-family: "Fraunces", ui-serif, Georgia, serif;
          font-weight: 600;
          font-size: 2.15rem;
          letter-spacing: -0.01em;
          color: #f4ecd8;
          opacity: 0;
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
        }
        .heading__subtitle {
          margin: 0;
          font-size: 0.875rem;
          color: #8a94a8;
          font-weight: 400;
          opacity: 0;
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
        }

        /* Panel */
        .panel {
          position: relative;
          width: 100%;
          background: linear-gradient(160deg, rgba(23, 32, 54, 0.92), rgba(15, 21, 37, 0.92));
          border: 1px solid rgba(227, 192, 120, 0.16);
          border-radius: 0.875rem;
          padding: 2.25rem 2rem 1.5rem;
          box-shadow:
            0 30px 60px -20px rgba(0, 0, 0, 0.6),
            0 1px 0 rgba(255, 255, 255, 0.04) inset,
            0 0 0 1px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(6px);
          opacity: 0;
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
        }
        .panel--shake {
          animation: shake 0.5s ease;
        }

        .panel__corner {
          position: absolute;
          width: 1.15rem;
          height: 1.15rem;
          border: 1.4px solid rgba(227, 192, 120, 0.65);
          opacity: 0;
          animation: cornerIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards;
        }
        .panel__corner--tl {
          top: -1px;
          left: -1px;
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 0.5rem;
          transform-origin: top left;
        }
        .panel__corner--tr {
          top: -1px;
          right: -1px;
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 0.5rem;
          transform-origin: top right;
        }
        .panel__corner--bl {
          bottom: -1px;
          left: -1px;
          border-right: none;
          border-top: none;
          border-bottom-left-radius: 0.5rem;
          transform-origin: bottom left;
        }
        .panel__corner--br {
          bottom: -1px;
          right: -1px;
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 0.5rem;
          transform-origin: bottom right;
        }

        .field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #aab2c2;
          margin-bottom: 0.55rem;
        }

        .field {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 0.55rem;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(6, 10, 20, 0.55);
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.25s ease;
        }
        .field:focus-within {
          border-color: rgba(227, 192, 120, 0.6);
          box-shadow: 0 0 0 3px rgba(227, 192, 120, 0.14);
          transform: translateY(-1px);
        }
        .field--error {
          border-color: rgba(182, 71, 63, 0.55);
        }
        .field__icon {
          margin-left: 0.85rem;
          color: #7c8398;
          flex-shrink: 0;
        }
        .field:focus-within .field__icon {
          color: #cda152;
        }
        .field input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.7rem 0.85rem;
          font-size: 0.9rem;
          color: #f4ecd8;
          font-family: inherit;
        }
        .field input::placeholder {
          color: #5b6478;
        }
        .field input:disabled {
          opacity: 0.6;
        }

        .alert {
          margin: 0.65rem 0 0;
          padding: 0.55rem 0.75rem;
          font-size: 0.8rem;
          color: #f0c4be;
          background: rgba(182, 71, 63, 0.14);
          border: 1px solid rgba(182, 71, 63, 0.3);
          border-radius: 0.5rem;
        }

        .submit {
          position: relative;
          overflow: hidden;
          width: 100%;
          margin-top: 1.35rem;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: 0.55rem;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          color: #14100a;
          background: linear-gradient(135deg, #f0d9a0, #cda152 55%, #ad813a);
          box-shadow: 0 10px 24px -10px rgba(205, 161, 82, 0.5);
          cursor: pointer;
          transition: filter 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
        }
        .submit:hover:not(:disabled) {
          filter: brightness(1.08);
        }
        .submit:active:not(:disabled) {
          transform: scale(0.98);
          box-shadow: 0 4px 14px -8px rgba(205, 161, 82, 0.5);
        }
        .submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }
        .submit__shine {
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            115deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.65s ease;
        }
        .submit:hover:not(:disabled) .submit__shine {
          left: 130%;
        }
        .submit__arrow {
          transition: transform 0.25s ease;
        }
        .submit:hover:not(:disabled) .submit__arrow {
          transform: translateX(3px);
        }
        .submit__spin {
          animation: spin 0.85s linear infinite;
        }

        .divider {
          margin: 1.4rem 0 1rem;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(227, 192, 120, 0.5),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 5s ease-in-out infinite;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #7c8398;
        }
        .status__dot {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 999px;
          background: #cda152;
          box-shadow: 0 0 0 0 rgba(205, 161, 82, 0.6);
          animation: pulseDot 2.2s ease-out infinite;
        }

        .footnote {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #5b6478;
          opacity: 0;
          animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.85s forwards;
        }

        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes cornerIn {
          from {
            opacity: 0;
            transform: scale(0.4);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shimmer {
          0%,
          100% {
            background-position: -120% 0;
          }
          50% {
            background-position: 220% 0;
          }
        }
        @keyframes pulseDot {
          0% {
            box-shadow: 0 0 0 0 rgba(205, 161, 82, 0.5);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(205, 161, 82, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(205, 161, 82, 0);
          }
        }
        @keyframes shake {
          10%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }
        @keyframes driftWatermark {
          0%,
          100% {
            transform: rotate(-4deg) translateY(0);
          }
          50% {
            transform: rotate(-4deg) translateY(-14px);
          }
        }

        @media (max-width: 420px) {
          .heading__title {
            font-size: 1.75rem;
          }
          .portal__watermark {
            font-size: 70vw;
          }
        }
      `}</style>
    </>
  );
}
