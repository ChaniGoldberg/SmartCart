import L from 'leaflet';

const chainLogoMap: Record<string, string> = {
  'רמי לוי': 'rami-levy.png',
  'אושר עד': 'osherad.png',
  'יוחננוף': 'yochananof.png',
  'נתיב החסד': 'netiv-hachesed.png',
};

const chainColorMap: Record<string, string> = {
  'רמי לוי': '#d32f2f',
  'אושר עד': '#1976d2',
  'יוחננוף': '#f57c00',
  'נתיב החסד': '#388e3c',
};

export const getChainIcon = (chainName: string): L.DivIcon => {
  const iconUrl = `/logo/${chainLogoMap[chainName] || 'default.png'}`;
  const color = chainColorMap[chainName] || '#555';

  return new L.DivIcon({
    html: `
      <div style="
        width: 46px;
        height: 46px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        position: relative;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img src="${iconUrl}" style="
          transform: rotate(45deg);
          width: 95%;
          height: 95%;
          object-fit: contain;
        " />
      </div>
    `,
    className: '',
    iconSize: [46, 46],
    iconAnchor: [23, 46],
    popupAnchor: [0, -46],
  });
};
