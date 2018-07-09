import { EventEmitter } from "events";

export interface ISoundSpriteSheet {
  resources: string[];
  spritemap: {
    [name: string]: {
      start: number;
      end: number;
      loop: boolean;
    };
  };
}

export interface ISoundSprite {
  id: string;
  source: AudioNode;
  volume: GainNode;
  destination: AudioNode;
  definition: ISoundSpriteSheet;

  sound: string;
  playing: boolean;
  paused: boolean;

  play(): void;
  pause(): void;
  stop(): void;
}

export interface ISoundSpriteProps {
  id: string;
  source: AudioBufferSourceNode;
  volume: GainNode;
  destination: AudioNode;
  definition: ISoundSpriteSheet;
  gain?: number;
}

export interface IAudioEventDefinition {
  type: string;
  event: (event: Event) => void;
}

export class SoundSprite extends EventEmitter implements ISoundSprite {
  public id: string = "";
  public source: AudioBufferSourceNode = null;
  public volume: GainNode = null;
  public destination: AudioNode;
  public definition: ISoundSpriteSheet;
  public sound: string = "";
  public playing: boolean = false;
  public paused: boolean = false;

  private started: number = 0;
  private startAt: number = 0;

  private events: IAudioEventDefinition[] = [
    { type: "ended", event: (event: Event) => this.onEnded(event) },
  ];

  public constructor(props: ISoundSpriteProps) {
    super();
    this.id = props.id;
    this.source = props.source;
    this.volume = props.volume;
    this.destination = props.destination;
    this.definition = props.definition;
    this.volume.gain.value = props.hasOwnProperty("gain") ? props.gain : 1;
    this.setup();
  }

  public play(): void {
    const sound = this.definition.spritemap[this.sound];

    if (!this.playing) {
      this.source.loop = sound.loop;
      this.source.start(0, sound.start, sound.end);
      this.started = Date.now();
      this.playing = true;

      if (sound.loop) {
        this.source.loopStart = sound.start;
        this.source.loopEnd = sound.end;
      }

      super.emit("audio-playing", this);
      return;
    }

    if (this.paused) {
      this.source.start(0, sound.start + this.startAt, sound.end);
      this.paused = false;
      super.emit("audio-playing", this);
      return;
    }
  }

  public pause(): void {
    if (this.playing && !this.paused) {
      const sound = this.definition.spritemap[this.sound];
      this.startAt = (Date.now() - this.started) % (sound.end - sound.start);
      this.paused = true;
      this.source.stop(0);

      super.emit("audio-paused", this);
    }
  }

  public stop(): void {
    if (this.playing) {
      this.source.stop(0);
      this.paused = false;
      this.playing = false;
      this.startAt = 0;
      this.source.loop = false;
      this.source.loopStart = 0;
      this.source.loopEnd = 0;

      super.emit("audio-stopped", this);
      return;
    }
  }

  public dispose() {
    this.source.disconnect(this.volume);
    this.volume.disconnect(this.destination);
    this.events.forEach(e => this.source.removeEventListener(e.type, e.event));
  }

  private onEnded(event: Event): void {
    this.stop();
  }

  private setup(): void {
    this.source.connect(this.volume);
    this.volume.connect(this.destination);
    this.events.forEach(e => this.source.addEventListener(e.type, e.event));
  }
}

export interface ILoadSoundSpriteProps {
  id: string;
  buffer: ArrayBuffer;
  context: AudioContext;
  definition: ISoundSpriteSheet;
}

export async function loadSoundSprite(props: ILoadSoundSpriteProps): Promise<ISoundSprite> {
  const buffer = await props.context.decodeAudioData(props.buffer);
  const source = props.context.createBufferSource();
  source.buffer = buffer;
  const sprite = new SoundSprite({
    definition: props.definition,
    destination: props.context.destination,
    id: props.id,
    source,
    volume: props.context.createGain(),
  });
  return sprite;
}
