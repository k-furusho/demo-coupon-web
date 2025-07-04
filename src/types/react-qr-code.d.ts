declare module 'react-qr-code' {
  import * as React from 'react';

  export interface QRCodeProps extends React.SVGProps<SVGSVGElement> {
    value: string | number;
    size?: number | string;
    level?: 'L' | 'M' | 'Q' | 'H';
    bgColor?: string;
    fgColor?: string;
    viewBox?: string;
  }

  const QRCode: React.FC<QRCodeProps>;
  export default QRCode;
} 