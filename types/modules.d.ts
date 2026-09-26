declare module 'mux.js' {
  const muxjs: {
    mp4: {
      Transmuxer: any;
      generator: any;
      probe: any;
      tools: any;
    };
    flv: any;
    mp2t: any;
    codecs: any;
  };
  export default muxjs;
}

declare module 'streamsaver' {
  interface CreateWriteStreamOptions {
    size?: number;
    pathname?: string;
    writableStrategy?: any;
    readableStrategy?: any;
  }

  const streamSaver: {
    createWriteStream: (filename: string, options?: CreateWriteStreamOptions) => WritableStream<Uint8Array>;
    mitm?: string;
    supported?: boolean;
    WritableStream?: typeof WritableStream;
  };

  export default streamSaver;
}
