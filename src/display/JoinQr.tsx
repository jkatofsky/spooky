import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export function JoinQr({ guests }: { guests: number }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/info")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { joinUrl: string | null } | null) => setUrl(d?.joinUrl ?? null))
        .catch(() => setUrl(null));
    void load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!url) return null;

  return (
    <aside className="qr">
      <div className="qr-code">
        <QRCodeSVG value={url} size={512} bgColor="#f4ecd8" fgColor="#12081c" level="M" />
      </div>
      <div className="qr-text">
        <strong>Scan 2 spook</strong>
        {guests > 0 && (
          <span className="qr-guests">
            {guests} {guests === 1 ? "ghoul" : "ghouls"} lurking
          </span>
        )}
      </div>
    </aside>
  );
}
