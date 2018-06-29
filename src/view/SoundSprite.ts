import { EventEmitter } from "events";

export interface ISoundSprite {
  id: string;
  buffer: ArrayBuffer;
  audioBuffer: AudioBuffer;
  gain: GainNode;

  playing: boolean;
  loaded: boolean;
  loop: boolean;
  loopStart: number;
  loopEnd: number;
  load(buffer: ArrayBuffer) : Promise<void>;
}

export interface ISoundSpriteProps {
  id: string;
  buffer: ArrayBuffer;
  loop: boolean;
  start?: number;
  end?: number;
}

const tempContext = new AudioContext;

export class SoundSprite extends EventEmitter implements ISoundSprite {
  id: string = "";

  //data props
  buffer: ArrayBuffer = null;
  audioBuffer: AudioBuffer = null;
  audioBufferSourceNode: AudioBufferSourceNode = tempContext.createBufferSource();
  gain: GainNode = tempContext.createGain();

  playing: boolean = false;
  paused: boolean = false;
  duration: number = 0;
  loaded: boolean = false;
  loop: boolean = false;
  start: number = 0;
  end: number = 0;
  startedAt: number = 0;

  constructor(props: ISoundSpriteProps) {
    super();
    this.id = props.id;
    this.loop = props.loop;
    this.start = props.start;
    this.end = props.end;
    if (props.buffer) {
      this.load(props.buffer);
    }
  }
  async load(buffer: ArrayBuffer): Promise<void> {
    this.buffer = buffer;
    if (this.audioBufferSourceNode)
    {
      this.audioBufferSourceNode.disconnect(this.gain);
    }
    const audioBuffer = await tempContext.decodeAudioData(buffer);
    this.audioBuffer = audioBuffer;
    this.audioBufferSourceNode.buffer = audioBuffer;
    this.end = this.end === 0 ? audioBuffer.duration : this.end;
    this.duration = this.end - this.start;
    this.loaded = true;
    this.audioBufferSourceNode.connect(this.gain);
    if (this.loop) {
      this.audioBufferSourceNode.loopStart = this.start;
      this.audioBufferSourceNode.loopEnd = this.end;
    }
    super.emit("audio-loaded", this);
  }
  play() {
    if (this.loaded) {
      let start: number = 0;

      if (this.paused) {
        this.paused = false;
        this.startedAt = Date.now() - this.duration;
        start  = this.start + this.duration;
      } else {
        this.startedAt = Date.now();
        start = this.start;
      }

      this.playing = true;
      if (this.loop) {
        this.audioBufferSourceNode.start(start);
      } else {
        this.audioBufferSourceNode.start(start, this.end - start);
      }
      super.emit("audio-playing", this);
    } else {
      super.once("audio-loaded", e => this.play());
    }
  }
  pause() {
    if (this.playing) {
      this.paused = true;
      this.playing = false;
      this.duration = Date.now() - this.startedAt;
      this.audioBufferSourceNode.stop();
      super.emit("audio-paused", this);
    }
  }
  stop() {
    if (this.playing) {
      this.paused = false;
      this.playing = false;
      this.duration = 0;
      this.audioBufferSourceNode.stop();
      super.emit("audio-stopped", this);
    }
  }
}