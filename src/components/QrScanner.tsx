import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface QrScannerProps {
  onResult: (text: string) => void;
  onError?: (message: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onResult, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader>();

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      onError?.('このブラウザはカメラ API に対応していません');
      return;
    }
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    codeReader
      .decodeFromVideoDevice(null, videoRef.current!, (result: Result | undefined, _err) => {
        if (result) {
          onResult(result.getText());
          // スキャン成功したらストリーム停止
          codeReader.reset();
        }
      })
      .catch(console.error);

    return () => {
      codeReader.reset();
    };
  }, [onResult, onError]);

  return (
    <div className="relative w-full max-w-md">
      <video ref={videoRef} className="w-full border" />
    </div>
  );
};

export default QrScanner; 